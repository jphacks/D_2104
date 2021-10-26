import PCA from 'pca-js';

export const parseFeature = (feature, dimension) => {
  let array = new Array(dimension).fill(0);
  feature.forEach((feat) => {
    Object.keys(feat).forEach((key) => {
      array[key] = feat[key];
    })
  })
  return array
}

export const reduceDimensions = (feature, to) => {
  const vectors = PCA.getEigenVectors(feature);
  console.log(vectors.slice(0, to))
  const adData = PCA.computeAdjustedData(feature, ...vectors.slice(0, to));
  return adData.adjustedData;
}
