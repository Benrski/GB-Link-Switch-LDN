#pragma once
/* Host stand-in for the ESP random API. tools/ldn_host_test.c supplies a deterministic
   pseudo-random source; the firmware uses the hardware RNG. */
#include <stddef.h>
#include <stdint.h>

uint32_t esp_random(void);
void esp_fill_random(void *buf, size_t len);
