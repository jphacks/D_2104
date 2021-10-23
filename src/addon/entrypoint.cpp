#include "extract_feature.h"
#include "find_similar_audio_mock.h"
#include "find_similar_audio.h"
#include "register_mock.h"
#include "register.h"

using namespace std;
using namespace Napi;

static Promise RegisterSource(const CallbackInfo& info){
    auto env = info.Env();
    RegisterMock reg(env);
    return reg.GetPromise();
}

static Promise FindSimilarAudioFromFile(const CallbackInfo& info){
    auto env = info.Env();
    FindSimilarAudioMock findAudio(env);
    return findAudio.GetPromise();
}

static Promise FindSimilarAudioFromNode(const CallbackInfo& info){
    auto env = info.Env();
    FindSimilarAudioMock findAudio(env);
    return findAudio.GetPromise();
}

static Object Init(Env env, Object exports)
{
    exports.Set("RegisterSource", Napi::Function::New(env, RegisterSource));
    exports.Set("FindSimilarAudioFromFile", Napi::Function::New(env, FindSimilarAudioFromFile));
    exports.Set("FindSimilarAudioFromNode", Napi::Function::New(env, FindSimilarAudioFromNode));
    return exports;
}

NODE_API_MODULE(Visualize_Sounds_Core_addon, Init)