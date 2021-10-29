#include "audio_player.h"
#include "libnyquist/Decoders.h"
#include <memory>

using namespace std;
using namespace Napi;
using namespace nqr;

int AudioPlayer::count = 0;
unsigned int AudioPlayer::bufferFrames = 256;
float AudioPlayer::volume = 1;
vector<float> AudioPlayer::data;
RtAudio AudioPlayer::audio;


static int RtCallback(void * outputBuffer, void * inputBuffer, uint32_t numBufferframes, double streamTime, RtAudioStreamStatus status, void * userData)
{
    if(status){
        return 2;
    }
    float *buffer = (float *)outputBuffer;
    for(auto i = 0; i < numBufferframes * 2; ++i){
        buffer[i] = AudioPlayer::data[AudioPlayer::count] * AudioPlayer::volume;
        ++AudioPlayer::count;
        if(AudioPlayer::count == AudioPlayer::data.size()){
            return 1;
        }
    }
    return 0;
}


Object AudioPlayer::Init(Napi::Env env, Object exports) {
  Function func =
      DefineClass(env,
                  "AudioPlayer",
                  {InstanceMethod<&AudioPlayer::Play>("Play"),
                   InstanceMethod<&AudioPlayer::Stop>("Stop"),
                   InstanceMethod<&AudioPlayer::SetVolume>("SetVolume")});

  FunctionReference* constructor = new FunctionReference();
  *constructor = Persistent(func);
  env.SetInstanceData<FunctionReference>(constructor);

  exports.Set("AudioPlayer", func);
  return exports;
}

AudioPlayer::AudioPlayer(const Napi::CallbackInfo& info) : ObjectWrap<AudioPlayer>(info) {
    count = 0;
    volume = 1;
    bufferFrames = 256;
    parameters.deviceId = audio.getDefaultOutputDevice();
    parameters.nChannels = 2;
    parameters.firstChannel = 0;
}

AudioPlayer::~AudioPlayer(){
    data.clear();
    try {
    audio.stopStream();
    }
    catch (...) { }
    if (audio.isStreamOpen()){
        audio.closeStream();
    }
}

Value AudioPlayer::Play(const Napi::CallbackInfo& info) {
    if (audio.isStreamOpen()){
        audio.closeStream();
    }
    data.clear();
    count = 0;
    string path = info[0].As<String>().ToString();
    auto fileData = ReadFile(path);
    NyquistIO loader;
    std::shared_ptr<AudioData> audioData = std::make_shared<AudioData>();
    loader.Load(audioData.get(), fileData.buffer);
    if(audioData->channelCount == 1){
        for(auto a : audioData->samples){
            data.push_back(a);
            data.push_back(a);
        }
    }else if(audioData->channelCount == 2){
        data = audioData->samples;
    }else{
        auto frame = audioData->samples.size() / audioData->channelCount;
        auto channelHarlSize = audioData->channelCount / 2;
        for(auto i = 0; i < frame; ++i){
            float a0 = 0;
            float a1 = 0;
            for(auto j = 0; j < channelHarlSize; ++j){
                a0 += audioData->samples[audioData->channelCount * i + j];
                a1 += audioData->samples[audioData->channelCount * (i + 1) - j - 1];
            }
            data.push_back(a0);
            data.push_back(a1);
        }
    }

    audio.openStream(&parameters, nullptr, RTAUDIO_FLOAT32, audioData->sampleRate, &bufferFrames, &RtCallback);
    audio.startStream();
    return Number::New(info.Env(), 0);
}

Value AudioPlayer::SetVolume(const Napi::CallbackInfo& info){
    volume = info[0].As<Number>().FloatValue();
    return Number::New(info.Env(), 0);
}

Value AudioPlayer::Stop(const Napi::CallbackInfo& info) {
    try {
    audio.stopStream();
    }
    catch (...) { }
    if (audio.isStreamOpen()){
        audio.closeStream();
    }
    return Number::New(info.Env(), 0);
}
