module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'camelcase': 'off',
    'handle-callback-err': 'off',
    'indent': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-irregular-whitespace': 'off',
    'no-multiple-empty-lines': 'off',
    'no-unneeded-ternary': 'off',
    'object-curly-spacing': 'off',
    'vue/no-unused-vars': 'off',
    'vue/require-v-for-key': 'off',
    'vue/valid-template-root': 'off',
    'vue/valid-v-bind': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
