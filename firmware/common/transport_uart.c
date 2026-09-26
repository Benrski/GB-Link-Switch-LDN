#include "transport.h"
#include "sdkconfig.h"
#include "driver/uart.h"
#include "driver/uart_vfs.h"
#include "freertos/FreeRTOS.h"
#include "esp_err.h"

static uint32_t dropped;

void bridge_transport_init(void)
{
    /* Console traffic is a few KB/s, read every 1 ms. 4 KiB rings keep RAM free for
       the GB-Link UART on the original ESP32, the smallest of the four chips. */
    ESP_ERROR_CHECK(uart_driver_install(CONFIG_ESP_CONSOLE_UART_NUM, 4096, 4096, 0, NULL, 0));
    uart_vfs_dev_use_driver(CONFIG_ESP_CONSOLE_UART_NUM);
}

int bridge_transport_read(void *buffer, size_t length)
{
    return uart_read_bytes(CONFIG_ESP_CONSOLE_UART_NUM, buffer, length, 0);
}

void bridge_transport_write(const void *buffer, size_t length)
{
    /* Blocks only while the 4 KiB TX ring is full. */
    int written = uart_write_bytes(CONFIG_ESP_CONSOLE_UART_NUM, buffer, length);
    if (written != (int)length) ++dropped;
}

uint32_t bridge_transport_dropped(void) { return dropped; }
const char *bridge_transport_name(void) { return "UART"; }

void bridge_transport_set_baud(int baud)
{
    uart_wait_tx_done(CONFIG_ESP_CONSOLE_UART_NUM, pdMS_TO_TICKS(1000));
    uart_set_baudrate(CONFIG_ESP_CONSOLE_UART_NUM, baud);
}
void bridge_transport_flush(void) { uart_wait_tx_done(CONFIG_ESP_CONSOLE_UART_NUM, pdMS_TO_TICKS(200)); }
