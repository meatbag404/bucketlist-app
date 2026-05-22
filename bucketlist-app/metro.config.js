const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for Supabase import.meta issue with Metro bundler
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'default',
];

// Exclude problematic modules from bundling
config.resolver.resolverMainFields = [
  'react-native',
  'browser',
  'main',
];

module.exports = config;