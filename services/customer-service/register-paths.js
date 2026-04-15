/**
 * Registra resolução de path aliases em runtime.
 * O TypeScript não transforma '@/' em paths relativos na compilação.
 * Este script usa tsconfig-paths para resolver '@/...' → 'dist/...' em runtime.
 */
const { register } = require('tsconfig-paths');
const path = require('path');

register({
  baseUrl: path.join(__dirname, 'dist'),
  paths: {
    '@/*': ['*'],
  },
});
