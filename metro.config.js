const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'cpexcel': require.resolve('xlsx/dist/cpexcel.js'),
};

module.exports = config;
