const js = require('@eslint/js')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        // Node.js globals
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      // Custom rules specific to this project
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'warn',
      // Relaxed rules for CommonJS
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      '.tmp/**',
      '.strapi/**',
      'public/**',
    ],
  }
)