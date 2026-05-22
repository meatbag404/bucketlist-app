const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
// 'react-native' must come first so packages like zustand pick up their CJS build
// instead of their ESM .mjs build (which contains import.meta and breaks Metro web)
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require', 'default'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
