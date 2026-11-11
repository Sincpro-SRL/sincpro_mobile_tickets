const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// A use case's name is its class's, taken when it registers: a release build keeps class names,
// or its spans and logs would say `tickets/t` instead of `tickets/PrepareSession`.
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_classnames: true,
};

module.exports = withNativeWind(config, { input: "./global.css" });
