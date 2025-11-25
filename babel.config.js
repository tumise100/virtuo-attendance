module.exports = function (api) {
  api.cache(true);
  return {
    // presets: ["babel-preset-expo", "nativewind/babel",],
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel",],
    plugins: ["react-native-paper/babel"],
    // plugins: ["nativewind/babel", "react-native-paper/babel"],
  };
};
