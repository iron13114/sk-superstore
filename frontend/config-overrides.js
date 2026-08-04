module.exports = function override(config, env) {
  const rules = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
  const cssRule = rules.find(
    (rule) =>
      rule.test &&
      rule.test.toString().includes("css") &&
      !rule.test.toString().includes("module")
  );

  if (cssRule) {
    const useLoaders = cssRule.use || [];
    const postcssLoader = useLoaders.find((loader) =>
      loader.loader && loader.loader.includes("postcss-loader")
    );

    if (postcssLoader) {
      postcssLoader.options.postcssOptions = {
        plugins: [
          require("tailwindcss"),
          require("autoprefixer"),
        ],
      };
    }
  }

  return config;
};