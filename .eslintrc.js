module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier', '@tanstack/query'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@tanstack/query/exhaustive-deps': 'error',
  },
};
