/* Seeed XIAO ESP32C6 board setup.
 *
 * The antenna RF switch is off until GPIO3 is driven low. GPIO14 selects the
 * antenna: low = onboard ceramic, high = U.FL external. With both pins floating
 * the radio only reaches strong nearby APs. Must run before esp_wifi_init.
 */
#include "driver/gpio.h"
#include "ldn_session.h"

#define RF_SWITCH_ENABLE_PIN 3   /* active low */
#define ANTENNA_SELECT_PIN   14  /* low: onboard, high: external U.FL */

bool bridge_board_antenna(bool external)
{
    gpio_set_level(ANTENNA_SELECT_PIN, external ? 1 : 0);
    return true;
}

void bridge_board_init(void)
{
    gpio_config_t pins = {
        .pin_bit_mask = (1ULL << RF_SWITCH_ENABLE_PIN) | (1ULL << ANTENNA_SELECT_PIN),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE,
    };
    gpio_config(&pins);
    gpio_set_level(RF_SWITCH_ENABLE_PIN, 0);
    gpio_set_level(ANTENNA_SELECT_PIN, 0);
}
