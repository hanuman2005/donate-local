module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source-map-loader for node_modules to suppress warnings
      const sourceMapLoader = webpackConfig.module.rules.find(
        (rule) =>
          rule.enforce === "pre" &&
          rule.use &&
          rule.use.some &&
          rule.use.some(
            (use) => use.loader && use.loader.includes("source-map-loader")
          )
      );

      if (sourceMapLoader) {
        sourceMapLoader.exclude = [
          /node_modules\/@tensorflow-models/,
          /node_modules\/@yudiel\/react-qr-scanner/,
        ];
      }

      return webpackConfig;
    },
  },
};
