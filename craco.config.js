const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
          content: './src/scripts/content.js',
          background: './src/scripts/background.js',
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        resolve: {
          ...webpackConfig.resolve,
          extensions: [...webpackConfig.resolve.extensions, '.jsx'],
        },
      }
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const miniCssExtractPlugin = webpackConfig.plugins.find(
            (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
          );
          if (miniCssExtractPlugin) {
            miniCssExtractPlugin.options.filename = 'static/css/[name].css';
          }
          return webpackConfig;
        },
      },
    },
  ],
};