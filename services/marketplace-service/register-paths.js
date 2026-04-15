const { register } = require('tsconfig-paths');
const path = require('path');

const baseUrl = path.join(__dirname, 'dist');

register({
  baseUrl,
  paths: {
    '@/*': ['*'],
    '@config/*': ['config/*'],
    '@modules/*': ['modules/*'],
    '@common/*': ['common/*'],
    '@decorators/*': ['decorators/*'],
    '@dtos/*': ['dtos/*'],
    '@filters/*': ['filters/*'],
    '@guards/*': ['guards/*'],
    '@interceptors/*': ['interceptors/*'],
    '@interfaces/*': ['interfaces/*'],
    '@middlewares/*': ['middlewares/*'],
    '@pipes/*': ['pipes/*'],
  },
});
