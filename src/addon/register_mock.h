#pragma once

#include <chrono>
#include <thread>
#include <napi.h>

class RegisterMock :  public Napi::AsyncWorker{
    private:
        Napi::Promise::Deferred deferred;
    public:
        RegisterMock(Napi::Env& env) : Napi::AsyncWorker(env), deferred(Napi::Promise::Deferred::New(env)){}
        ~RegisterMock(){}
        void Execute() override{std::this_thread::sleep_for(std::chrono::seconds(3));}
        void OnOK() override{deferred.Resolve(Napi::Object::New(Env()));}
        void OnError(Napi::Error const &error) override{deferred.Reject(error.Value());}
        Napi::Promise GetPromise() { return deferred.Promise(); }
};