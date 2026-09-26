#pragma once
/* Just enough FreeRTOS for pico_link.c to build on a host; tools/pico_link_test.c
   supplies the behaviour. One tick is one millisecond, as on the boards. */
#include <stdint.h>

typedef uint32_t TickType_t;
typedef int BaseType_t;
#define pdTRUE 1
#define pdFALSE 0
#define pdMS_TO_TICKS(ms) ((TickType_t)(ms))
#define portMAX_DELAY 0xffffffffu
