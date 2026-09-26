#pragma once
/* Host stand-in for the ESP timer API; a test supplies its own clock in microseconds. */
#include <stdint.h>

int64_t esp_timer_get_time(void);
