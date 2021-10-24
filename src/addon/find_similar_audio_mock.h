#include <chrono>
#include <thread>
#include <napi.h>
#include <random>
#include <vector>

class FindSimilarAudioMock:  public Napi::AsyncWorker{
    private:
        Napi::Promise::Deferred deferred;
        std::vector<std::pair<std::string, std::vector<std::pair<int, double>>>> data;
    public:
        FindSimilarAudioMock(Napi::Env& env) : Napi::AsyncWorker(env),deferred(Napi::Promise::Deferred::New(env)){}
        ~FindSimilarAudioMock(){}
        void Execute() override{
            std::this_thread::sleep_for(std::chrono::seconds(3));
            double distance = 0;
            std::random_device r;
            std::uniform_real_distribution<> dist(0.5, 1.0);
            std::string prefix = "C:/dummy/";
            for(auto i = 1; i < 101; ++i){
                std::vector<std::pair<int, double>> d;
                distance += dist(r);
                d.emplace_back(i, distance);
                data.emplace_back(prefix + std::to_string(i) + ".wav", d);
            }
        }
        void OnOK() override{
            auto ret = Napi::Array::New(Env(), data.size());
            for(auto i = 0; i < data.size(); ++i){
                auto obj = Napi::Object::New(Env());
                obj.Set("path", data[i].first);
                auto vec = Napi::Array::New(Env(), data[i].second.size());
                for(auto  j = 0; j < data[i].second.size(); ++j){
                    auto element = Napi::Object::New(Env());
                    element.Set(uint32_t(data[i].second[j].first), Napi::Number::New(Env(), data[i].second[j].second));
                    vec[j] = element;
                }
                obj.Set("feature", vec);
                ret[i] = obj;
            }
            deferred.Resolve(ret);
            }
        void OnError(Napi::Error const &error){deferred.Reject(error.Value());}
        Napi::Promise GetPromise() { return deferred.Promise(); }
};