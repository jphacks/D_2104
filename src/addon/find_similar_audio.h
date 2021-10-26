#pragma once

#include "extract_feature.h"
#include <napi.h>
#include <filesystem>

class FindSimilarAudio : public Napi::AsyncWorker{
    private:
        Napi::Promise::Deferred deferred;
        std::string saveDir;
        Feature feature;
        std::vector<std::pair<double, std::pair<Feature, std::string>>> result;
        Feature LoadFeature(std::string& path);
    public:
        FindSimilarAudio(Napi::Env& env, std::string savePath, Feature feature_) : Napi::AsyncWorker(env), deferred(Napi::Promise::Deferred::New(env)), saveDir(savePath), feature(feature_){}
        FindSimilarAudio(Napi::Env& env, std::string savePath, std::string dbPath) : Napi::AsyncWorker(env), deferred(Napi::Promise::Deferred::New(env)), saveDir(savePath){
            feature = LoadFeature(dbPath);
        }
        ~FindSimilarAudio(){}
        void Execute() override;
        void OnOK() override;
        void OnError(Napi::Error const &error) override{deferred.Reject(error.Value());}
        Napi::Promise GetPromise() { return deferred.Promise(); }
};