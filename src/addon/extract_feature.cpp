#include "extract_feature.h"
#include "libnyquist/Decoders.h"
#include "fft.h"
#include "fft_internal.h"
#include "window_function_constant.h"
#include <memory>
#include <array>
#include <algorithm>
#include <cctype>

using namespace std;
using namespace nqr;

constexpr int SNLEVEL = 100;

PeekData ExtractFeature::GetPeek4096(std::vector<float> &audio, int start, int end, cfloat *output, mufft_plan_1d *plan)
{
    float *input = (float *)mufft_calloc(4096 * sizeof(float));
    for (auto i = 0; i < end - start; ++i)
    {
        input[i] = audio[start + i] * blackmanNuttallWindow4096[i];
    }
    mufft_execute_plan_1d(plan, output, input);
    mufft_free(input);
    array<float, 2049> power;
    for (auto i = 0; i < 2049; ++i)
    {
        auto v = cfloat_abs(output[i]) * 0.0013429308122f;
        power[i] = v * v;
    }
    double threshold = 0;
    int pIdx = 0;
    int pStart = 0;
    float pMax = 0;
    float pMax2 = 0;
    bool isActive = false;
    int c1 = 0;
    float avg = 0;
    PeekData ret;
    for (auto i = 0; i < 2049; ++i)
    {
        if (i % 128 == 0 && i != 2048)
        {
            array<float, 128> sortedPower;
            for(auto j = 0; j < 128; ++j){
                sortedPower[j] = power[i + j];
            }
            sort(sortedPower.begin(), sortedPower.end());
            threshold = sortedPower[64] * 2;
            avg = 0;
            for (auto j = i; j < i + 128; ++j)
            {
                avg += power[j];
            }
            avg /= 128;
            ret.thresholds.push_back(2 * log10f(avg + threshold));
        }

        isActive = power[i] > avg + threshold;
        if (isActive)
        {
            auto modifiedPower = power[i] - avg - threshold;
            if (modifiedPower > pMax && modifiedPower > pMax2 / SNLEVEL)
            {
                pMax = modifiedPower;
                pIdx = i;
                if (modifiedPower > pMax2)
                {
                    pMax2 = modifiedPower;
                }
            }
        }
        else if (pMax > 0)
        {
            if (pIdx < i - 1)
            {
                ret.peeks.emplace_back(pIdx, 2 * log10f(pMax));
            }
            pMax = 0;
            pIdx = 0;
        }
    }
    if (isActive && pMax > 0)
    {
        ret.peeks.emplace_back(pIdx, 2 * log10f(pMax));
    }
    ret.peekPower = pMax2;

    return ret;
}

PeekData ExtractFeature::GetPeek16384(std::vector<float> &audio, int start, int end, cfloat *output, mufft_plan_1d *plan)
{
    float *input = (float *)mufft_calloc(16384 * sizeof(float));
    for (auto i = 0; i < end - start; ++i)
    {
        input[i] = audio[start + i] * blackmanNuttallWindow16384[i];
    }
    mufft_execute_plan_1d(plan, output, input);
    mufft_free(input);
    array<float, 8193> power;
    for (auto i = 0; i < 8193; ++i)
    {
        auto v = cfloat_abs(output[i]) * 0.00033573270305f;
        power[i] = v * v;
    }
    double threshold = 0;
    int pIdx = 0;
    int pStart = 0;
    float pMax = 0;
    float pMax2 = 0;
    bool isActive = false;
    int c1 = 0;
    float avg = 0;
    PeekData ret;
    for (auto i = 0; i < 8193; ++i)
    {
        if (i % 256 == 0 && i != 8192)
        {
            array<float, 256> sortedPower;
            for (auto j = 0; j < 256; ++j) {
                sortedPower[j] = power[i + j];
            }
            sort(sortedPower.begin(), sortedPower.end());
            threshold = sortedPower[128] * 2;
            avg = 0;
            for (auto j = i; j < i + 256; ++j)
            {
                avg += power[j];
            }
            avg /= 256;
        }

        isActive = power[i] > avg + threshold;
        if (isActive)
        {
            auto modifiedPower = power[i] - avg - threshold;
            if (modifiedPower > pMax && modifiedPower > pMax2 / SNLEVEL)
            {
                pMax = modifiedPower;
                pIdx = i;
                if (modifiedPower > pMax2)
                {
                    pMax2 = modifiedPower;
                }
            }
        }
        else if (pMax > 0)
        {
            if (pIdx < i - 1)
            {
                ret.peeks.emplace_back(pIdx, 2 * log10f(pMax));
            }
            pMax = 0;
            pIdx = 0;
        }
    }
    if (isActive && pMax > 0)
    {
        ret.peeks.emplace_back(pIdx, 2 * log10f(pMax));
    }
    ret.peekPower = pMax2;

    return ret;
}

vector<vector<pair<double, double>>> ExtractFeature::Correct(vector<PeekData> &peeksS, vector<PeekData>& peeksL)
{
    double peekPower = 0;
    vector<bool> isRemoved(peeksS.size(), false);
    for (auto &peek : peeksS)
    {
        if (peekPower < peek.peekPower)
        {
            peekPower = peek.peekPower;
        }
    }
    
    for (int i = peeksS.size() - 1; i >= 0; --i)
    {
        if (peeksS[i].peekPower < peekPower / SNLEVEL)
        {
            peeksS.erase(peeksS.begin() + i);
            isRemoved[i] = true;
        }
    }

    for (auto i = 0; i < peeksS.size() - 1; ++i)
    {
        auto j = 0;
        auto k = 0;
        auto diffPower = 2 * (log10(peeksS[i].peekPower) - log10(peeksS[i + 1].peekPower));
        while (peeksS[i].peeks.size() > j && peeksS[i + 1].peeks.size() > k)
        {
            auto af = peeksS[i].peeks[j].first;
            auto ap = peeksS[i].peeks[j].second;
            auto bf = peeksS[i + 1].peeks[k].first;
            auto bp = peeksS[i + 1].peeks[k].second;
            if (af - 2 > bf)
            {
                auto th = bf == 2048 ? 15 : bf / 128;
                if (diffPower < 0 && bp + diffPower < peeksS[i].thresholds[th])
                {
                    peeksS[i].peeks.insert(peeksS[i].peeks.begin() + j, make_pair(bf, bp + diffPower));
                    ++j;
                }
                ++k;
            }
            else if (af < bf - 2)
            {
                auto th = af == 2048 ? 15 : af / 128; 
                if (diffPower > 0 && ap - diffPower < peeksS[i + 1].thresholds[th])
                {
                    peeksS[i + 1].peeks.insert(peeksS[i + 1].peeks.begin() + k, make_pair(af, ap - diffPower));
                    ++k;
                }
                ++j;
            }
            else
            {
                ++j;
                ++k;
            }
        }

        if(diffPower > 0){
            while (peeksS[i].peeks.size() > j)
            {
                auto af = peeksS[i].peeks[j].first;
                auto ap = peeksS[i].peeks[j].second;
                auto th = af == 2048 ? 15 : af / 128;
                if (ap - diffPower < peeksS[i + 1].thresholds[th])
                {
                    peeksS[i + 1].peeks.emplace_back(af, ap - diffPower);
                }
                ++j;
            }
        }

        if(diffPower < 0){
            while (peeksS[i + 1].peeks.size() > k)
            {
                auto bf = peeksS[i + 1].peeks[k].first;
                auto bp = peeksS[i + 1].peeks[k].second;
                auto th = bf == 2048 ? 15 : bf / 128;
                if (bp + diffPower < peeksS[i].thresholds[th])
                {
                    peeksS[i].peeks.emplace_back(bf, bp + diffPower);
                }
                ++k;
            }
        }
    }

    vector<vector<pair<double, double>>> ret;
    ret.resize(peeksS.size());
    auto idx = 0;
    for(auto i = 0; i < peeksS.size(); ++i){
        
        while (isRemoved[idx])
        {
            ++idx;
        }
        int idxL = 0;
        if(idx > 5){
            idxL = (idx - 2) / 4;
        }
        for(auto j = 0; j < peeksS[i].peeks.size(); ++j){
            auto idxS = peeksS[i].peeks[j].first;
            auto itr = find_if(peeksL[idxL].peeks.begin(), peeksL[idxL].peeks.end(), [idxS](const pair<int, float>& input){ return (idxS * 4 - 2 <= input.first && idxS * 4 + 2 > input.first);});
            if(itr != peeksL[idxL].peeks.end()){
                ret[i].emplace_back(itr->first, peeksS[i].peeks[j].second);
            }else{
                ret[i].emplace_back(4 * idxS, peeksS[i].peeks[j].second);
            }
        } 

        vector<int> modificated;
        for(auto j = 0; j < ret[i].size(); ++j){
            if(ret[i][j].first < 10){
                modificated.push_back(j);
            }else{
                break;
            }
        }

        while (modificated.size() != ret[i].size())
        {
            int baseIndex = 0;
            sort(modificated.begin(), modificated.end());
            int l = 0;
            for(; l < modificated.size(); ++l){
                if(l != modificated[l]){
                    baseIndex = l;
                    break;
                }
            }
            if(l == modificated.size()){
                baseIndex = l;
            }

            int sumMod = ret[i][baseIndex].first;
            vector<int> modIndex;
            vector<int> sumMagnification;
            modificated.push_back(baseIndex);
            sumMagnification.push_back(1);
            modIndex.push_back(baseIndex);
            int itrVal = ret[i][baseIndex].first;
            int magnification = 1;
            while (itrVal < ret[i].back().first)
            {
                itrVal += ret[i][baseIndex].first;
                ++magnification;
                auto itr = find_if(ret[i].begin(), ret[i].end(), [itrVal](const pair<double, double>& input){return (itrVal - 3 < input.first && itrVal + 3 > input.first);});
                auto idx = distance(ret[i].begin(), itr);
                auto isContaion = find(modificated.begin(), modificated.end(), idx);
                if(itr != ret[i].end() && isContaion != modificated.end()){
                    modificated.push_back(idx);
                    modIndex.push_back(idx);
                    sumMod += itr->first;
                    sumMagnification.push_back(magnification);
                    itrVal = itr->first;
                }
            }
            auto sum = 0;
            for(auto& s : sumMagnification)
            {
                sum += s;
            }            
            auto baseFreq = (double)sumMod / sum;
            for(auto j = 0; j < modIndex.size(); ++j){
                ret[i][modIndex[j]].first = baseFreq * sumMagnification[j];
            }
        }        
    }

    return ret;
}

bool ExtractFeature::IsSameGroup(vector<pair<double, double>>& a, vector<pair<double, double>>& b, int size){
    auto smallSize = a.size() < b.size() ? a.size() : b.size();
    int count = 0;
    int i = 0;
    int j = 0;
    while (i < a.size() && j < b.size())
    {
        auto fDiff = (a[i].first - b[j].first) / a[i].first;
        if(fDiff > 0.025){
            ++j;
        }else if(fDiff < -0.025){
            ++i;
        }else{
            if(abs(a[i].second - b[j].second) < 3){
                ++count;
            }
            ++i;
            ++j;
        }
    }
        
    if((double)count / smallSize < 0.75){
        return false;
    }
    return true;
}

vector<pair<double, double>> ExtractFeature::Select(vector<vector<pair<double, double>>>& peeks, double& baseFrequency){
    vector<vector<pair<double, double>>> normalizedPeeks;
    vector<pair<double, double>> factor;
    for(auto& ps : peeks){
        if(ps.size() == 0){
            continue;
        }
        if(ps[0].first < 0.1){
            ps.erase(ps.begin());
        }
        if(ps.size() == 0){
            continue;
        }
        vector<pair<double, double>> normalized;
        auto baseFreq = ps[0].first;
        auto f = ps[0].second;
        for(auto& p : ps){
            normalized.emplace_back(p.first / baseFreq, p.second - f);
        }
        factor.emplace_back(baseFreq, f);
        normalizedPeeks.push_back(normalized);
    }
    if (peeks.size() == 0) {
      vector<pair<double, double>> ret;
      return ret;
    }

    vector<vector<pair<double, double>>> groups;
    vector<double> power;
    vector<double> freq;

    for(auto i = 0; i < normalizedPeeks.size(); ++i){
        auto j = 0;
        for(; j < groups.size(); ++j){
            auto size = freq[j] > factor[i].first ? 16384.0 / freq[j]  : 16384.0 / factor[i].first;
            if(IsSameGroup(groups[j], normalizedPeeks[i], size)){
                auto p = pow(10, power[j]);
                auto fa = pow(10, factor[i].second);
                auto weight = p / (p + fa);
                int k = 0;
                int l = 0;
                vector<pair<double, double>> combine;
                while (k < groups[j].size() && l < normalizedPeeks[j].size())
                {
                    auto fDiff = (groups[j][k].first - normalizedPeeks[j][l].first) / groups[j][k].first;
                    if(fDiff > 0.025){
                        combine.push_back(normalizedPeeks[j][l]);
                        ++l;
                    }else if(fDiff < -0.025){
                        combine.push_back(groups[j][k]);
                        ++k;
                    }else{
                        auto f = groups[j][k].first * weight + normalizedPeeks[j][l].first * (1 - weight);
                        auto s = groups[j][k].second * weight + normalizedPeeks[j][l].second * (1 - weight);
                        combine.emplace_back(f, s);
                        ++l;
                        ++k;
                    }
                }

                while (k < groups[j].size())
                {
                    combine.push_back(groups[j][k]);
                    ++k;
                }

                while (l < normalizedPeeks[j].size())
                {
                    combine.push_back(normalizedPeeks[j][l]);
                    ++l;
                }
                power[j] = log10(p + fa);
                if(groups[j].size() < normalizedPeeks[i].size()){
                    for(auto k = groups[j].size(); k < normalizedPeeks[i].size(); ++k){
                        groups[j].push_back(normalizedPeeks[i][k]);
                    }
                    freq[j] = factor[i].first;
                }
                break;
            }
        }
        if(j == groups.size()){
            groups.push_back(normalizedPeeks[i]);
            freq.push_back(factor[i].first);
            power.push_back(factor[i].second);
        }
    }

    if (groups.size() == 0) {
      vector<pair<double, double>> ret;
      return ret;
    }

    double max = -1000;
    int maxIndex = 0;
    for(auto i = 0; i < groups.size(); ++i){
        if(max < power[i]){
            max = power[i];
            maxIndex = i;
        }
    }
    baseFrequency = freq[maxIndex];
    return groups[maxIndex];
}
Feature ExtractFeature::Extract(int& groupCount){
    Feature ret;
    ret.isSuccess = false;
    return ret;
}

Feature ExtractFeature::Extract()
{
    auto fileData = make_shared<AudioData>();
    NyquistIO loader;
    auto lowerPath = path;
    transform(lowerPath.begin(), lowerPath.end(), lowerPath.begin(), [](unsigned char c){ return tolower(c); });
    if (!loader.IsFileSupported(lowerPath))
    {
        Feature ret;
        ret.isSuccess = false;
        return ret;
    }

    try{
        auto buffer = ReadFile(path);
        loader.Load(fileData.get(), buffer.buffer);
    } catch (...) {
      Feature ret;
      ret.isSuccess = false;
      return ret;
    }

    vector<float> audio;
    if (fileData->channelCount == 1)
    {
        audio = move(fileData->samples);
    }
    else
    {
        auto timeSize = fileData->samples.size() / fileData->channelCount;
        audio.resize(timeSize);
        for (auto i = 0; i < timeSize; ++i)
        {
            float tmp = 0;
            for (auto j = 0; j < fileData->channelCount; ++j)
            {
                tmp += fileData->samples[i * fileData->channelCount + j];
            }
            audio[i] = tmp / fileData->channelCount;
        }
    }

    cfloat *output = (cfloat *)mufft_alloc(4096 * sizeof(cfloat));
    mufft_plan_1d *muplan = mufft_create_plan_1d_r2c(4096, 0);
    vector<PeekData> features;
    auto slideCount = (int)ceil(audio.size() / 2048.0) - 1;
    if (slideCount == 0)
    {
        ++slideCount;
    }
    for (auto i = 0; i < slideCount; ++i)
    {
        auto end = (i + 1) * 2048;
        if (end > audio.size())
        {
            end = audio.size();
        }
        features.push_back(GetPeek4096(audio, i * 2048, end, output, muplan));
    }
    mufft_free(output);
    mufft_free_plan_1d(muplan);

    cfloat *output2 = (cfloat *)mufft_alloc(16384 * sizeof(cfloat));
    mufft_plan_1d *muplan2 = mufft_create_plan_1d_r2c(16384, 0);
    vector<PeekData> features2;
    auto slideCount2 = (int)ceil(audio.size() / 8192.0) - 1;
    if (slideCount2 == 0)
    {
        ++slideCount2;
    }
    for (auto i = 0; i < slideCount2; ++i)
    {
        auto end = (i + 1) * 8192;
        if (end > audio.size())
        {
            end = audio.size();
        }
        features2.push_back(GetPeek16384(audio, i * 8192, end, output2, muplan2));
    }
    mufft_free(output2);
    mufft_free_plan_1d(muplan2);

    auto modifiedFeatures = Correct(features, features2);
    if (modifiedFeatures.size() == 0) {
      Feature ret;
      ret.isSuccess = false;
      return ret;
    }

    double baseFreqIndex = 0;
    auto feature = Select(modifiedFeatures, baseFreqIndex);
    if (feature.size() == 0) {
      Feature ret;
      ret.isSuccess = false;
      return ret;
    }

    Feature ret;
    ret.isSuccess = true;
    ret.feature = feature;
    ret.baseFrequency = baseFreqIndex * fileData->sampleRate / 16384.0;
    ret.path = path;
    return ret;
}