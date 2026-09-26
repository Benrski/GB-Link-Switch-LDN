#pragma once
#include "FreeRTOS.h"

typedef void *SemaphoreHandle_t;
typedef struct { int unused; } StaticSemaphore_t;
static inline SemaphoreHandle_t xSemaphoreCreateBinaryStatic(StaticSemaphore_t *space) { return space; }
static inline BaseType_t xSemaphoreGive(SemaphoreHandle_t s) { (void)s; return pdTRUE; }
static inline BaseType_t xSemaphoreTake(SemaphoreHandle_t s, TickType_t wait) { (void)s; (void)wait; return pdTRUE; }
