const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin(),
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    public: 'localhost:8080',
    disableHostCheck: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3500/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
