// eslint-disable-next-line unicorn/prefer-module
const { resolve } = require;
const OFF = 0;
const ERROR = 2;

// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    webextensions: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:eslint-comments/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'unicorn', 'promise'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
      },
      typescript: {
        project: [resolve('./src/tsconfig.json'), resolve('./server/tsconfig.json')],
      },
    },
  },
  rules: {
    'consistent-return': OFF,
    'func-names': OFF,
    'lines-between-class-members': OFF,
    'max-classes-per-file': OFF,
    'no-alert': OFF,
    'no-console': OFF,
    'no-empty': OFF,
    'no-restricted-globals': OFF,
    'no-shadow': OFF,
    'no-underscore-dangle': OFF,
    'no-unused-expressions': OFF,
    'no-use-before-define': OFF,
    'no-useless-constructor': OFF,
    'no-param-reassign': OFF,
    'prefer-destructuring': OFF,
    'react/require-default-props': OFF,
    'no-restricted-syntax': OFF,
    camelcase: OFF,
    radix: OFF,

    'import/extensions': OFF,
    'import/prefer-default-export': OFF,

    'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],

    'promise/always-return': OFF,
    'promise/catch-or-return': OFF,

    'react/jsx-uses-react': OFF,
    'react/react-in-jsx-scope': OFF,
    'react/jsx-indent': [ERROR, 2],
    'react/jsx-filename-extension': [ERROR, { extensions: ['.ts', '.tsx', '.json', '.js'] }],
    'react/destructuring-assignment': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react-hooks/rules-of-hooks': OFF,
    'react/sort-comp': OFF,
      
    'jsx-a11y/alt-text': OFF,
    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
    'jsx-a11y/anchor-is-valid': OFF,
    'jsx-a11y/label-has-associated-control': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,

    '@typescript-eslint/ban-ts-comment': OFF,
    '@typescript-eslint/ban-types': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-empty-function': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-unused-vars': OFF,
    '@typescript-eslint/no-useless-constructor': ERROR,
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/no-duplicates': OFF,
      },
    },
    {
      files: ['server/**/*.ts'],
      rules: {
        'global-require': OFF,

        '@typescript-eslint/no-var-requires': OFF,

        'import/no-dynamic-require': OFF,
        'import/no-extraneous-dependencies': OFF,
      },
    },
  ],
};
