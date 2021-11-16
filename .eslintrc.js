module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    webextensions: true,
  },
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    ecmaVersion: 2020,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
  },
};
