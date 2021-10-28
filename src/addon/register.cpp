#include <fstream>
#include <exception>
#include <stdexcept>
#include "register.h"
#include "rapidjson/filewritestream.h"
#include "rapidjson/prettywriter.h"

using namespace std;
using namespace std::filesystem;
using namespace rapidjson;

void Register::WriteFeature(string& writePath, Feature& f){
     FILE* fp;
#ifdef _MSC_VER
  fopen_s(&fp,  writePath.c_str(), "wb");
#else
  fopen_s(&fp,  writePath.c_str(), "w");
#endif
    char writeBuffer[256];
    FileWriteStream os(fp, writeBuffer, sizeof(writeBuffer));
    PrettyWriter<FileWriteStream> writer(os);
    writer.SetIndent(' ', 2);
    writer.StartObject();
    {
        writer.Key("version");
        writer.Int(1);
        writer.Key("source");
        writer.String(f.path.c_str());
        writer.Key("base_frequency");
        writer.Double(f.baseFrequency);
        writer.Key("feature");
        writer.StartArray();
        {
            for(auto& ft : f.feature){
                writer.StartObject();
                {
                    writer.Key("f");
                    writer.Double(ft.first);
                    writer.Key("p");
                    writer.Double(ft.second);
                }
                writer.EndObject();
            }
        }
        writer.EndArray();
    }
    writer.EndObject();
    writer.Flush();
    fclose(fp);
}

bool Register::IsTargetFile(string& p, vector<regex>& rules){
    if(!is_regular_file(p)){
        return false;
    }

    for(auto& r : rules){
        if(regex_match(p, r)){
            return false;
        }
    }

    return  true;
}

void Register::Execute(){
    vector<regex> rules;
    size_t pos = 0;
    string token;
    while ((pos = rule.find(":")) != string::npos) {
        token = rule.substr(0, pos);
        rules.emplace_back(token);
        rule.erase(0, pos + 1);
    }
    filesystem::path indexPath = saveDir;
    indexPath.concat("/index.vsc");
    ofstream fout;
    if(exists(indexPath)){
        // TODO: 差分とって必要な分だけ更新．
        for(const auto& p : directory_iterator(saveDir)){
            remove(p);
        }
        fout.open(indexPath.string());
    }else{
        fout.open(indexPath.string());
    }
    vector<ExtractFeature> exectractor;
    for (const auto& p : recursive_directory_iterator(path)) {
        auto pStr = p.path().string();
        if(IsTargetFile(pStr, rules)){
            exectractor.emplace_back(pStr);
        }
    }

#pragma omp parallel for schedule(dynamic, 1)
    for(auto i = 0; i < exectractor.size(); ++i){
        int c = 0;
        auto feature = exectractor[i].Extract();
        if(feature.isSuccess){
            filesystem::path writePath = saveDir;
            #pragma omp critical(output)
            {
                writePath.concat("/" + to_string(Id) + ".vsc");
                fout << feature.path << ":" << writePath.string() << endl;
                ++Id;
            }
            auto writePathStr = writePath.string();
            WriteFeature(writePathStr, feature);
        }
    }
}