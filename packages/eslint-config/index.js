// Configuração base do ESLint compartilhada entre todos os pacotes
// Garante consistência de estilo e qualidade de código em todo o monorepo
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier', // Deve ser o último para desativar regras que conflitam com Prettier
  ],
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  rules: {
    // Regras de TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Regras de importação - mantém os imports organizados
    'import/order': [
      'error',
      {
        groups: [
          'builtin',     // Módulos nativos do Node.js
          'external',    // Pacotes npm
          'internal',    // Pacotes internos (@imestredigital/*)
          'parent',      // Imports relativos pai (../)
          'sibling',     // Imports relativos irmão (./)
          'index',       // Imports de index
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',

    // Regras gerais de qualidade
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
