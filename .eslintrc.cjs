module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@stylistic/ts',
    '@stylistic/js',
    'import-newlines',
    'simple-import-sort',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {

    // Style
    '@stylistic/js/arrow-parens': ["error", "always"],
    '@stylistic/js/arrow-spacing': ["error", { "before": true, "after": true }],
    '@stylistic/js/brace-style': "error",
    '@stylistic/js/comma-dangle': ["error", "always-multiline"],
    '@stylistic/js/eol-last': ["error", "always"],
    '@stylistic/js/jsx-quotes': ["error", "prefer-double"],
    '@stylistic/js/no-multi-spaces': "error",
    '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/ts/indent': ['error', 2],
    '@stylistic/ts/object-curly-spacing': ['error', 'always'],
    '@stylistic/ts/quotes': ['error', 'single'],
    '@stylistic/ts/semi': 'error',
    '@stylistic/ts/type-annotation-spacing': 'error',

    // Replace JS rules with TS rules:
    'quotes': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],

    // Misc.
    "curly": ["error"],
    "arrow-body-style": ["error", "as-needed"],
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "@typescript-eslint//explicit-function-return-type": "off",

    // Plugin configurations
    'import-newlines/enforce': ['error', 2],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', {
      'groups': [
        ['^react', '^@?\\w'], // External Packages (React related first)
        ['^src', '^~(/.*|$)', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Internal packages
        ['^.+\\.?(css|scss)$'] // Style
      ]
    }],
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      "files": ["convex/**/*.ts"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "error",
      },
    },
  ],
}
