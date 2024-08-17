const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const config = {
        ...webpackConfig,
        entry: {
          main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
          content: ['./src/scripts/content.js', './src/content.css'],
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
      };

      // Modify the rule for CSS files
      const cssRule = config.module.rules.find(rule => rule.test && rule.test.toString().includes('.css'));
      if (cssRule) {
        cssRule.use = ['style-loader', 'css-loader'];
      }

      // Add rule for SVG files
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      });

      return config;
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