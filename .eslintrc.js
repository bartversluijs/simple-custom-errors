module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    // Add space before function
    'space-before-function-paren': ['error', 'always'],

    // Disable underscore from no-unused-vars
    'no-unused-vars': ['error', {
      'args': 'all',
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],

    // Disable import/no-named-as-default-member
    'import/no-named-as-default-member': ['off'],

    // Disable import/no-cycle
    'import/no-cycle': ['off'],

    // Extend max-len
    'max-len': ['error', {
      'code': 200
    }],

    // Allow bitwise
    'no-bitwise': ['off'],

    // Disable class-methods-use-this
    'class-methods-use-this': ['off'],

    // Only warn for no-param-reassign
    'no-param-reassign': ['warn']
  },
};
