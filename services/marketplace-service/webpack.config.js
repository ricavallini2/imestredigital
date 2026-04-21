'use strict';

/**
 * Webpack customizado para o marketplace-service em monorepo.
 *
 * Problema: em um monorepo com dependências hoisted para a raiz (/app/node_modules),
 * o nodeExternals padrão do @nestjs/cli só olha para o node_modules local do serviço,
 * que está vazio. Isso faz o webpack tentar empacotar @nestjs/microservices e
 * falhar ao tentar resolver suas dependências opcionais (mqtt, nats, amqplib).
 *
 * Solução: configurar nodeExternals para também considerar o node_modules raiz.
 */

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function(options) {
  return {
    ...options,
    externals: [
      // node_modules local do serviço (pode estar vazio no monorepo)
      nodeExternals(),
      // node_modules raiz do monorepo (onde as deps estão de fato instaladas)
      nodeExternals({
        additionalModuleDirs: [
          path.resolve(__dirname, '../../node_modules'),
        ],
      }),
    ],
  };
};
