#include <filesystem>
#include "find_similar_audio.h"
#include "rapidjson/filereadstream.h"
#include "rapidjson/document.h"

using namespace std;
using namespace std::filesystem;
using namespace rapidjson;

Feature FindSimilarAudio::LoadFeature(string& path){
    FILE* fp;
#ifdef _MSC_VER
  fopen_s(&fp,  path.c_str(), "wb");
#else
  fopen_s(&fp,  path.c_str(), "w");
#endif
    char readBuffer[256];
    FileReadStream is(fp, readBuffer, sizeof(readBuffer));
    Document d;
    d.ParseStream(is);
    fclose(fp);
    Feature ret;
    ret.baseFrequency = d["base_frequency"].GetDouble();
    ret.path = d["source"].GetString();
    for(auto& d_ : d["feature"].GetArray()){
        ret.feature.emplace_back(d_["f"].GetDouble(), d_["p"].GetDouble());
    }
    ret.isSuccess = true;
    return ret;
}

void FindSimilarAudio::Execute(){
    for(const auto& p : directory_iterator(saveDir)){
        auto path = p.path().string();
        if(path.find("index.vsc") == string::npos && path.find(".vsc") != string::npos){
            auto f = LoadFeature(path);
            int i = 1;
            int j = 1;
            Feature diff;
            diff.path = f.path;
            diff.isSuccess = true;
            diff.baseFrequency = f.baseFrequency;
            double distance = 0;
            while (i < f.feature.size() && j < feature.feature.size())
            {
                if(f.feature[i].first + 0.025 < feature.feature[j].first){
                    diff.feature.emplace_back(f.feature[i].first, f.feature[i].second);
                    distance += f.feature[i].second * f.feature[i].second;
                    ++i;
                }else if(f.feature[i].first > feature.feature[j].first + 0.025){
                    diff.feature.emplace_back(feature.feature[j].first, -feature.feature[j].second);
                    distance += feature.feature[j].second * feature.feature[j].second;
                    ++j;
                }else{
                    auto v = abs(f.feature[i].second - feature.feature[j].second);
                    if(v > 3){
                        diff.feature.emplace_back(feature.feature[j].first, f.feature[i].second - feature.feature[j].second);
                        distance += v * v;
                    }
                    ++i;
                    ++j;
                }
            }
            if(i != f.feature.size()){
                while (i < f.feature.size())
                {
                    diff.feature.emplace_back(f.feature[i].first, f.feature[i].second);
                    distance += f.feature[i].second * f.feature[i].second;
                    ++i;
                }
            }
            if(j != feature.feature.size()){
                while (j < feature.feature.size())
                {
                    diff.feature.emplace_back(feature.feature[j].first, -feature.feature[j].second);
                    distance += feature.feature[j].second * feature.feature[j].second;
                    ++j;
                }
            }    

            auto itr = find_if(result.begin(), result.end(), [distance](const pair<double, pair<Feature, string>>& r){
                return r.first > distance;
            });
            result.insert(itr, make_pair(distance, make_pair(diff, path)));
            if(result.size() > 100){
                result.pop_back();
            }
        }
    }
}

void FindSimilarAudio::OnOK(){
    auto size = result.size();
    auto ret = Napi::Array::New(Env(), size);
    for(auto i = 0; i < size; ++i){
        auto obj = Napi::Object::New(Env());
        obj.Set("path", result[i].second.first.path);
        obj.Set("dbPath", result[i].second.second);
        obj.Set("distance", Napi::Number::New(Env(), result[i].first));
        auto fSize = result[i].second.first.feature.size();
        auto coordinates = Napi::Array::New(Env(), fSize);
        for(auto j = 0; j < fSize; ++j){
            auto element = Napi::Object::New(Env());
            element.Set("f", Napi::Number::New(Env(), result[i].second.first.feature[j].first));
            element.Set("p", Napi::Number::New(Env(), result[i].second.first.feature[j].second));
            coordinates[j] = element;
        }
        obj.Set("coordinates", coordinates);
        ret[i] = obj;
    }
    deferred.Resolve(ret);
}