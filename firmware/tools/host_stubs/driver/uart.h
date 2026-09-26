#pragma once
#include <stddef.h>
#include <stdint.h>
#include "freertos/FreeRTOS.h"

#define ESP_OK 0
#define ESP_ERR_NO_MEM 0x101
#define ESP_ERROR_CHECK(x) do { (void)(x); } while (0)

#define UART_NUM_1 1
#define UART_PIN_NO_CHANGE (-1)
enum { UART_DATA_8_BITS = 3, UART_PARITY_DISABLE = 0, UART_STOP_BITS_1 = 1, UART_HW_FLOWCTRL_DISABLE = 0,
       UART_SCLK_DEFAULT = 0 };

typedef struct
{
    int baud_rate, data_bits, parity, stop_bits, flow_ctrl, source_clk;
} uart_config_t;

int uart_driver_install(int uart, int rx_buffer, int tx_buffer, int queue_size, void *queue, int flags);
int uart_driver_delete(int uart);
int uart_param_config(int uart, const uart_config_t *config);
int uart_set_pin(int uart, int tx, int rx, int rts, int cts);
int uart_read_bytes(int uart, void *buffer, uint32_t length, TickType_t wait);
int uart_write_bytes(int uart, const void *bytes, size_t length);
int uart_wait_tx_done(int uart, TickType_t wait);
typedef struct { uint32_t intr_enable_mask; uint8_t rx_timeout_thresh, txfifo_empty_intr_thresh, rxfifo_full_thresh; } uart_intr_config_t;
int uart_intr_config(int uart, const uart_intr_config_t *config);
