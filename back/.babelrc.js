'use strict';

module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
    [require.resolve('@babel/preset-flow')],
  ],
  plugins: [
    [require.resolve('babel-plugin-module-resolver'), {
      root: ['./src'],
      alias: {
        tests: './tests',
        '@': './src',
      },
    }],
  ],
};
