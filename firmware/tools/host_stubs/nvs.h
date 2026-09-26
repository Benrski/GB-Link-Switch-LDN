#pragma once
/* Just enough of the NVS API for ldn_keys.c to build and run on a host. The test
   (tools/ldn_host_test.c) supplies the behaviour: a fixed synthetic key per name, never
   real console key material. */
#include <stddef.h>
#include <stdint.h>

typedef int esp_err_t;
#ifndef ESP_OK
#define ESP_OK 0
#endif

typedef uint32_t nvs_handle_t;
typedef enum { NVS_READONLY = 0, NVS_READWRITE = 1 } nvs_open_mode_t;

esp_err_t nvs_open(const char *namespace_name, nvs_open_mode_t mode, nvs_handle_t *out_handle);
void nvs_close(nvs_handle_t handle);
esp_err_t nvs_get_blob(nvs_handle_t handle, const char *key, void *out_value, size_t *length);
esp_err_t nvs_set_blob(nvs_handle_t handle, const char *key, const void *value, size_t length);
esp_err_t nvs_commit(nvs_handle_t handle);
esp_err_t nvs_erase_all(nvs_handle_t handle);
