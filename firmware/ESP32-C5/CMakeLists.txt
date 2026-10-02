cmake_minimum_required(VERSION 3.16)
set(IDF_TARGET esp32c5 CACHE STRING "this project's only target")
# The LDN join drives a private Wi-Fi interface, so the SDK revision is pinned.
find_package(Git REQUIRED)
execute_process(COMMAND "${GIT_EXECUTABLE}" -C "$ENV{IDF_PATH}" rev-parse HEAD
    OUTPUT_VARIABLE sdk_revision OUTPUT_STRIP_TRAILING_WHITESPACE RESULT_VARIABLE sdk_result)
if(NOT sdk_result EQUAL 0 OR NOT sdk_revision STREQUAL "fff9895c82d744c7237be8847347bdd1b07c6643")
    message(FATAL_ERROR "This firmware requires ESP-IDF v6.1 at fff9895c82d744c7237be8847347bdd1b07c6643")
endif()
set(EXTRA_COMPONENT_DIRS "${CMAKE_CURRENT_LIST_DIR}/../common/components")
include($ENV{IDF_PATH}/tools/cmake/project.cmake)
project(ldn_bridge_esp32c5)
