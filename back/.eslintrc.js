'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  'extends': [
    'plugin:flowtype/recommended',
    'airbnb'
  ],
  env: {
    es6: true,
    jest: true,
    node: true
  },
  parserOptions: {
    ecmaFeatures: {
      // toggle to `false` to use `@decaorator` between `export default` and `class` keywords
      legacyDecorators: false
    }
  },
  plugins: [
    'flowtype',
    'flowtype-errors'
  ],
  rules: {
    'flowtype-errors/show-errors': 2,
    'flowtype-errors/show-warnings': 1,
    'max-len': [2, 150, 4],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    'import/resolver': {
      alias: [
        ['test', './test'],
        ['@', './src'],
      ]
    }
  }
};
