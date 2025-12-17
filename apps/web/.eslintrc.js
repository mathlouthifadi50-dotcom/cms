module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Custom rules specific to this project
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: [
    '.next/**',
    'node_modules/**',
    'build/**',
    'dist/**',
    '.turbo/**',
    'coverage/**',
    'pnpm-lock.yaml',
    '.next/static/**',
    '.next/standalone/**',
  ],
};