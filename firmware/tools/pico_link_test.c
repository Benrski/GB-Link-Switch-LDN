/* Host test of the GB-Link link task against a scripted adapter. Checks when SetMode
   (wireless mode) is sent, and that a working link is never re-requested. Build and run
   from the firmware directory:

       cc -std=c11 -Wall -Wextra -I tools/host_stubs -I common tools/pico_link_test.c -o /tmp/pico_link_test && /tmp/pico_link_test

   Adapter model, per the GB-Link firmware: silent until a mode is requested. Status and
   data go to the side that spoke last. Entering the mode answers DeviceReady and
   AwaitMode. In the mode it reports every 500 ms (tag 0x0E, byte 1 = GBA clocking it).
   Timeline: adapter powers after the board, restarts, a USB host takes it over, then it
   restarts with a GBA attached. Entering the mode resets the adapter, so a SetMode that
   reaches an adapter already in the mode and reporting to this board is a failure. */

#include "../common/pico_link.c"

#include <stdio.h>
#include <stdlib.h>

/* ---- adapter model */

static struct
{
    bool powered, in_mode, to_uart, gba;
    TickType_t next_report;
    unsigned entries;     /* times the mode was entered */
    unsigned disrupted;   /* of those, while in the mode and reporting to this board */
} g_adapter;

static TickType_t g_now, g_until;
static unsigned g_requests;   /* SetMode frames the board put on the UART */
static uint8_t g_wire[4096];  /* adapter -> board */
static size_t g_wire_head, g_wire_tail;

static void adapter_emit(uint8_t channel, const uint8_t *payload, size_t length)
{
    const uint8_t header[HEADER_LENGTH] = {SYNC0, SYNC1, channel, (uint8_t)length, 0};
    for (size_t i = 0; i < sizeof(header); ++i) g_wire[g_wire_head++ % sizeof(g_wire)] = header[i];
    for (size_t i = 0; i < length; ++i) g_wire[g_wire_head++ % sizeof(g_wire)] = payload[i];
}

static void adapter_status(uint16_t code)
{
    const uint8_t payload[2] = {(uint8_t)code, (uint8_t)(code >> 8)};
    adapter_emit(PICO_LINK_CHANNEL_STATUS, payload, sizeof(payload));
}

static void adapter_hears(const uint8_t *frame, size_t length)
{
    if (!g_adapter.powered) return;
    const bool healthy = g_adapter.in_mode && g_adapter.to_uart;
    g_adapter.to_uart = true;
    const bool set_mode = length == HEADER_LENGTH + 3 && frame[2] == PICO_LINK_CHANNEL_COMMAND &&
                          frame[HEADER_LENGTH] == 0x00 && frame[HEADER_LENGTH + 1] == 0x07;
    if (!set_mode) return;
    if (healthy) ++g_adapter.disrupted;
    ++g_adapter.entries;
    g_adapter.in_mode = true;
    adapter_status(0xFF08);
    adapter_status(0xFF02);
    g_adapter.next_report = g_now + 500;
}

static void adapter_runs(void)
{
    if (!g_adapter.powered || !g_adapter.in_mode || (int32_t)(g_now - g_adapter.next_report) < 0) return;
    g_adapter.next_report += 500;
    if (!g_adapter.to_uart) return;
    uint8_t report[16] = {0x0E, g_adapter.gba ? 1 : 0};
    adapter_emit(PICO_LINK_CHANNEL_DATA, report, sizeof(report));
}

static void adapter_power(bool on)
{
    g_adapter.powered = on;
    g_adapter.in_mode = false;
    g_adapter.to_uart = false;
}

/* ---- timeline */

typedef enum { POWER_ON, POWER_OFF, USB_HOST_SPEAKS, GBA_ON, CHECK_LINKED, CHECK_QUIET_SINCE } action_t;
typedef struct { TickType_t at; action_t action; TickType_t since; const char *what; } event_t;

static int g_failures;
static unsigned g_requests_at[8];
static TickType_t g_marks[8];
static unsigned g_mark_count;

static void check(bool ok, const char *what)
{
    if (ok) return;
    ++g_failures;
    fprintf(stderr, "FAIL at %u ms: %s\n", (unsigned)g_now, what);
}

static unsigned requests_since(TickType_t since)
{
    for (unsigned i = 0; i < g_mark_count; ++i) if (g_marks[i] == since) return g_requests - g_requests_at[i];
    return g_requests;
}

static const event_t g_events[] = {
    {5000, POWER_ON, 0, NULL},                       /* board powered first */
    {6000, CHECK_LINKED, 0, "an adapter powered after the board is put in the mode"},
    {30000, CHECK_QUIET_SINCE, 6000, "a working link is left alone"},
    {30000, POWER_OFF, 0, NULL},                     /* adapter restarts */
    {30800, POWER_ON, 0, NULL},
    {37000, CHECK_LINKED, 0, "an adapter that restarted is put back in the mode"},
    {50000, CHECK_QUIET_SINCE, 37000, "and then left alone again"},
    {50000, USB_HOST_SPEAKS, 0, NULL},               /* still in the mode, reporting to USB */
    {56000, CHECK_LINKED, 0, "an adapter that a USB host spoke to is taken back"},
    {60000, GBA_ON, 0, NULL},
    {70000, CHECK_QUIET_SINCE, 56000, "a link with a GBA on it is left alone"},
    {70000, POWER_OFF, 0, NULL},
    {70500, POWER_ON, 0, NULL},
    {77000, CHECK_LINKED, 0, "an adapter that restarted under a GBA is put back in the mode"},
};
static size_t g_next_event;

static void mark(void)
{
    if (g_mark_count >= 8) return;
    g_marks[g_mark_count] = g_now;
    g_requests_at[g_mark_count++] = g_requests;
}

static void time_passes(TickType_t ticks)
{
    g_now += ticks ? ticks : 1;
    while (g_next_event < sizeof(g_events) / sizeof(g_events[0]) && g_events[g_next_event].at <= g_now)
    {
        const event_t *event = &g_events[g_next_event++];
        switch (event->action)
        {
        case POWER_ON: adapter_power(true); break;
        case POWER_OFF: adapter_power(false); break;
        case USB_HOST_SPEAKS: g_adapter.to_uart = false; break;
        case GBA_ON: g_adapter.gba = true; break;
        case CHECK_LINKED:
            check(g_adapter.in_mode && g_adapter.to_uart && s_awaitMode, event->what);
            mark();
            break;
        case CHECK_QUIET_SINCE: check(requests_since(event->since) == 0, event->what); break;
        }
    }
    adapter_runs();
    if ((int32_t)(g_now - g_until) >= 0) s_running = false;
}

/* ---- FreeRTOS / ESP-IDF stubs */

struct host_queue { uint32_t length, item_size, count, head; uint8_t *items; };

QueueHandle_t xQueueCreate(uint32_t length, uint32_t item_size)
{
    QueueHandle_t queue = calloc(1, sizeof(*queue));
    queue->length = length;
    queue->item_size = item_size;
    queue->items = calloc(length, item_size);
    return queue;
}

BaseType_t xQueueSend(QueueHandle_t queue, const void *item, TickType_t wait)
{
    (void)wait;
    if (queue->count == queue->length) return pdFALSE;
    memcpy(queue->items + ((queue->head + queue->count++) % queue->length) * queue->item_size, item, queue->item_size);
    return pdTRUE;
}

BaseType_t xQueueReceive(QueueHandle_t queue, void *item, TickType_t wait)
{
    (void)wait;
    if (!queue->count) return pdFALSE;
    memcpy(item, queue->items + queue->head * queue->item_size, queue->item_size);
    queue->head = (queue->head + 1) % queue->length;
    --queue->count;
    return pdTRUE;
}

TickType_t xTaskGetTickCount(void) { return g_now; }
void vTaskDelay(TickType_t ticks) { time_passes(ticks); }
void vTaskDelete(TaskHandle_t task) { (void)task; }

static void (*g_task)(void *);
BaseType_t xTaskCreate(void (*task)(void *), const char *name, uint32_t stack, void *arg, int priority,
                       TaskHandle_t *handle)
{
    (void)name; (void)stack; (void)arg; (void)priority;
    g_task = task;
    *handle = (TaskHandle_t)&g_task;
    return pdTRUE;
}

int uart_intr_config(int uart, const uart_intr_config_t *config) { (void)uart; (void)config; return ESP_OK; }

int uart_driver_install(int uart, int rx, int tx, int size, void *queue, int flags)
{
    (void)uart; (void)rx; (void)tx; (void)size; (void)queue; (void)flags;
    return ESP_OK;
}
int uart_driver_delete(int uart) { (void)uart; return ESP_OK; }
int uart_param_config(int uart, const uart_config_t *config) { (void)uart; (void)config; return ESP_OK; }
int uart_set_pin(int uart, int tx, int rx, int rts, int cts) { (void)uart; (void)tx; (void)rx; (void)rts; (void)cts; return ESP_OK; }
int uart_wait_tx_done(int uart, TickType_t wait) { (void)uart; (void)wait; return ESP_OK; }
int gpio_config(const gpio_config_t *config) { (void)config; return ESP_OK; }
int gpio_get_level(gpio_num_t pin) { (void)pin; return 1; }

int uart_read_bytes(int uart, void *buffer, uint32_t length, TickType_t wait)
{
    (void)uart;
    time_passes(wait);
    uint32_t count = 0;
    while (count < length && g_wire_tail != g_wire_head) ((uint8_t *)buffer)[count++] = g_wire[g_wire_tail++ % sizeof(g_wire)];
    return (int)count;
}

int uart_write_bytes(int uart, const void *bytes, size_t length)
{
    (void)uart;
    const uint8_t *frame = bytes;
    if (length == HEADER_LENGTH + 3 && frame[2] == PICO_LINK_CHANNEL_COMMAND && frame[HEADER_LENGTH + 1] == 0x07) ++g_requests;
    adapter_hears(frame, length);
    return (int)length;
}

/* ---- */

int main(void)
{
    /* UART port: 80 s of board uptime. */
    g_until = 80000;
    pico_link_start();
    g_task(NULL);
    check(g_next_event == sizeof(g_events) / sizeof(g_events[0]), "the whole timeline ran");
    check(g_adapter.disrupted == 0, "no request ever reached an adapter that was in the mode and reporting here");
    printf("on the wires: %u requests, %u mode entries, %u disruptive\n", g_requests, g_adapter.entries, g_adapter.disrupted);

    /* Host port: the host manages the adapter. The board does not re-request the mode
       when the host side is quiet. */
    check(pico_link_set_port(PICO_PORT_HOST), "the host port opens");
    const uint8_t await_mode[] = {SYNC0, SYNC1, PICO_LINK_CHANNEL_STATUS, 2, 0, 0x02, 0xFF};
    pico_link_feed_host(await_mode, sizeof(await_mode));
    uint8_t frame[HEADER_LENGTH + PICO_LINK_MAX_PAYLOAD];
    size_t length;
    while (pico_link_poll_host_out(frame, sizeof(frame), &length)) { }
    g_until = g_now + 20000;
    s_running = true;
    g_task(NULL);
    unsigned asked = 0;
    while (pico_link_poll_host_out(frame, sizeof(frame), &length)) ++asked;
    check(asked == 0, "a quiet host port is not asked again");

    printf(g_failures ? "%d FAILED\n" : "all checks pass\n", g_failures);
    return g_failures ? 1 : 0;
}
