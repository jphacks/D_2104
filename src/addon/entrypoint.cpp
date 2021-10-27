#include "extract_feature.h"
#include "find_similar_audio_mock.h"
#include "find_similar_audio.h"
#include "register_mock.h"
#include "register.h"

using namespace std;
using namespace Napi;

static Promise RegisterSource(const CallbackInfo& info){
    auto env = info.Env();
    string sourcePath = info[0].As<Napi::String>().ToString();
    string rule = info[1].As<Napi::String>().ToString();
    string savePath = info[2].As<Napi::String>().ToString();
    Register* reg = new Register(env, savePath, sourcePath, rule);
    auto promise = reg->GetPromise();
    reg->Queue();
    return promise;
}

static Promise RegisterSourceMock(const CallbackInfo& info){
    auto env = info.Env();
    RegisterMock* reg = new RegisterMock(env);
    auto promise = reg->GetPromise();
    reg->Queue();
    return promise;
}

static Promise FindSimilarAudioFromFile(const CallbackInfo& info){
    auto env = info.Env();
    string sourcePath = info[0].As<Napi::String>().ToString();
    string savePath = info[1].As<Napi::String>().ToString();
    ExtractFeature extractor(sourcePath);
    int gc;
    auto feature = extractor.Extract(gc);
    FindSimilarAudio* findAudio = new FindSimilarAudio(env, savePath, feature);
    auto promise = findAudio->GetPromise();
    findAudio->Queue();
    return promise;
}

static Promise FindSimilarAudioFromFileMock(const CallbackInfo& info){
    auto env = info.Env();
    FindSimilarAudioMock* findAudio = new FindSimilarAudioMock(env);
    auto promise = findAudio->GetPromise();
    findAudio->Queue();
    return promise;
}

static Promise FindSimilarAudioFromNode(const CallbackInfo& info){
    auto env = info.Env();
    auto node = info[0].As<Napi::Object>().Get("dbPath").ToString();
    auto savePath = info[1].As<Napi::String>().ToString();
    FindSimilarAudio* findAudio = new FindSimilarAudio(env, savePath, node);
    auto promise = findAudio->GetPromise();
    findAudio->Queue();
    return promise;
}

static Promise FindSimilarAudioFromNodeMock(const CallbackInfo& info){
    auto env = info.Env();
    FindSimilarAudioMock* findAudio = new FindSimilarAudioMock(env);
    auto promise = findAudio->GetPromise();
    findAudio->Queue();
    return promise;
}

static Object Init(Env env, Object exports)
{
    exports.Set("RegisterSource", Napi::Function::New(env, RegisterSource));
    exports.Set("RegisterSourceMock", Napi::Function::New(env, RegisterSourceMock));
    exports.Set("FindSimilarAudioFromFile", Napi::Function::New(env, FindSimilarAudioFromFile));
    exports.Set("FindSimilarAudioFromFileMock", Napi::Function::New(env, FindSimilarAudioFromFileMock));
    exports.Set("FindSimilarAudioFromNode", Napi::Function::New(env, FindSimilarAudioFromNode));
    exports.Set("FindSimilarAudioFromNodeMock", Napi::Function::New(env, FindSimilarAudioFromNodeMock));
    return exports;
}

NODE_API_MODULE(Visualize_Sounds_Core_addon, Init)