module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: [
      [
        "module-resolver",
        {
          alias: { "@sincpro/mobile-tickets": "./sincpro_mobile_tickets" },
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
};
