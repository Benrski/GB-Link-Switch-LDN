include("${CMAKE_CURRENT_LIST_DIR}/../../common/SOURCES.cmake")

idf_component_register(
    SRCS ${BRIDGE_SOURCES} ${BRIDGE_TRANSPORT_USB}
    INCLUDE_DIRS "." "${BRIDGE_COMMON}"
    REQUIRES ${BRIDGE_REQUIRES} esp_driver_usb_serial_jtag
)
bridge_pin_wifi_driver(esp32c5 "4c86fc1d2f40a933af7f672972978eb7c82651d838fd10584e006438d585793b")
