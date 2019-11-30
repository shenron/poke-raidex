module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'plugin:flowtype/recommended',
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'flowtype-errors/show-errors': 2,
    'flowtype-errors/show-warnings': 1,
    'class-methods-use-this': 'off',
    'one-var': 1,
    'eol-last': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'no-extra-boolean-cast': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
    camelcase: 0,
    'import/no-extraneous-dependencies': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      // toggle to `false` to use `@decorator` between `export default` and `class` keywords
      legacyDecorators: false,
    },
  },
  plugins: [
    'flowtype',
    'flowtype-errors',
  ],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  globals: {
  },
};
