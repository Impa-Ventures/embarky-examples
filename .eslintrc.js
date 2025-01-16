module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['next/core-web-vitals'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}
