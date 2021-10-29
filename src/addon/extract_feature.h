#pragma once

#include <vector>
#include <string>
#include <utility>
#include <fstream>
#include "fft_internal.h"

struct Feature{
    bool isSuccess;
    float baseFrequency;
    std::string path;
    std::vector<std::pair<double, double>> feature;
};

struct PeekData{
    std::vector<std::pair<int, float>> peeks;
    std::vector<float> thresholds;
    float peekPower;
};

class ExtractFeature{
    private:
        std::string path;
        PeekData GetPeek4096(std::vector<float>& audio, int start, int end, cfloat* output, mufft_plan_1d* plan);
        PeekData GetPeek16384(std::vector<float>& audio, int start, int end, cfloat* output, mufft_plan_1d* plan);
        bool IsSameGroup(std::vector<std::pair<double, double>>& a, std::vector<std::pair<double, double>>& b, int size);
    public:
        ExtractFeature(std::string sourcePath): path(sourcePath){}
        std::vector<std::vector<std::pair<double, double>>> Correct(std::vector<PeekData>& peeksS, std::vector<PeekData>& peeksL);
        std::vector<std::pair<double, double>> Select(std::vector<std::vector<std::pair<double, double>>>& peeks, double& baseFrequency);
        Feature Extract(int& groupCount);
        Feature Extract();
};