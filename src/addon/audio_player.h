#pragma once
#include <napi.h>
#include "RtAudio.h"

class AudioPlayer : public Napi::ObjectWrap<AudioPlayer> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);
  static std::vector<float> data;
  static int count;
  static unsigned int bufferFrames;
  static float volume;
  static RtAudio audio;
  AudioPlayer(const Napi::CallbackInfo& info);
  ~AudioPlayer();

 private:
  Napi::Value Play(const Napi::CallbackInfo& info);
  Napi::Value SetVolume(const Napi::CallbackInfo& info);
  Napi::Value Stop(const Napi::CallbackInfo& info);
  RtAudio::StreamParameters parameters;
};