#pragma once

#include "extract_feature.h"
#include <napi.h>
#include <filesystem>
#include <regex>

class Register : public Napi::AsyncWorker{
    private:
        Napi::Promise::Deferred deferred;
        std::string saveDir;
        std::string path;
        std::string rule;
        int Id = 0; 
        bool IsTargetFile(std::string& p, std::vector<std::regex>& rules);
        void WriteFeature(std::string& writePath, Feature& f);
    public:
        Register(Napi::Env& env, std::string savePath, std::string path_, std::string rule_) : Napi::AsyncWorker(env), deferred(Napi::Promise::Deferred::New(env)), saveDir(savePath), path(path_), rule(rule_){}
        ~Register(){}
        void Execute() override;
        void OnOK() override{deferred.Resolve(Napi::Object::New(Env()));}
        void OnError(Napi::Error const &error) override{deferred.Reject(error.Value());}
        Napi::Promise GetPromise() { return deferred.Promise(); }
};