#include <chrono>
#include <thread>
#include <napi.h>
#include <random>

class FindSimilarAudioMock{
    private:
        Napi::Promise::Deferred deferred;
        void Run(Napi::Env& env){
            std::this_thread::sleep_for(std::chrono::seconds(3));
            auto ret  = Napi::Array::New(env, 100);
            double distance = 0;
            std::random_device r;
            std::uniform_real_distribution<> dist(0.5, 1.0);
            std::string prefix = "C:/dummy/";
            for(auto i = 1; i < 101; ++i){
                auto val = Napi::Object::New(env);
                distance += dist(r);
                auto vec = Napi::Array::New(env, 1);
                auto element = Napi::Object::New(env);
                element.Set(uint32_t(i), Napi::Number::New(env, distance));
                vec.Set(uint32_t(0), element);
                val.Set("features", vec);
                val.Set("path", prefix + std::to_string(i) + ".wav");
                ret[i - 1] = val;
            }
            deferred.Resolve(ret);
        }
    public:
        FindSimilarAudioMock(Napi::Env& env) : deferred(Napi::Promise::Deferred::New(env)){
           thread t([&env, this](){this->Run(env);});
        }
        Napi::Promise GetPromise() { return deferred.Promise(); }
};