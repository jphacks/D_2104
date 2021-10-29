cmake_minimum_required(VERSION 3.14)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 11)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

project (Visualize_Sounds_Core_addon)
include(GoogleTest)
include(FetchContent)

find_package(OpenMP REQUIRED)
if(OpenMP_FOUND)
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${OpenMP_C_FLAGS}")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
endif()

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        release-1.11.0
)
FetchContent_Declare(
  muFFT
  GIT_REPOSITORY https://github.com/Themaister/muFFT.git
)
FetchContent_Declare(
  libnyquist
  GIT_REPOSITORY https://github.com/ddiakopoulos/libnyquist.git
)
FetchContent_Declare(
  rtaudio
  GIT_REPOSITORY https://github.com/thestk/rtaudio.git
)
FetchContent_MakeAvailable(muFFT libnyquist rtaudio googletest)
set (CMAKE_CXX_STANDARD 20)
include_directories(${CMAKE_JS_INC} PRIVATE "third-party/RapidJson/include")
file(GLOB SOURCE_FILES "src/addon/entrypoint.cpp" "src/addon/extract_feature.cpp" "src/addon/extract_feature.h" "src/addon/find_similar_audio_mock.h" "src/addon/find_similar_audio.cpp" "src/addon/find_similar_audio.h" "src/addon/register_mock.h" "src/addon/register.cpp" "src/addon/register.h" "src/addon/audio_player.cpp" "src/addon/audio_player.h" "src/addon/window_function_constant.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} muFFT libnyquist rtaudio)

# Include Node-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

# define NPI_VERSION
add_definitions(-DNAPI_VERSION=7)