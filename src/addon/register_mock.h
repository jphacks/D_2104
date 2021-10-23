#include <chrono>
#include <thread>
#include <napi.h>

class RegisterMock{
    private:
        Napi::Promise::Deferred deferred;
    public:
        RegisterMock(Napi::Env& env) : deferred(Napi::Promise::Deferred::New(env)){
            std::thread t([&env, this](){
                std::this_thread::sleep_for(std::chrono::seconds(3));
                this->deferred.Resolve(Napi::Object::New(env));
            });  
        }
        Napi::Promise GetPromise() { return deferred.Promise(); }
};