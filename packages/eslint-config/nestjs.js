// Configuração ESLint específica para serviços NestJS
// Estende a configuração base com regras para decorators e injeção de dependência
module.exports = {
  extends: [require.resolve('./index')],
  rules: {
    // Permite classes vazias (comum em DTOs e módulos NestJS)
    '@typescript-eslint/no-empty-function': 'off',
    // Permite any em decorators de injeção de dependência
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
