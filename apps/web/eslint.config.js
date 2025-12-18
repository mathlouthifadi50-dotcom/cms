const js = require('@eslint/js')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Custom rules specific to this project
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'build/**',
      'dist/**',
      '.turbo/**',
      'coverage/**',
      'pnpm-lock.yaml',
      '.next/static/**',
      '.next/standalone/**',
      'public/**',
    ],
  }
)