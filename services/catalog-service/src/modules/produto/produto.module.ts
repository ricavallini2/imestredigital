/**
 * Módulo de Produtos (COMPLETO).
 *
 * Inclui:
 * - Controller REST com autenticação
 * - Service com lógica de negócio, Kafka e cache
 * - Repository com queries isoladas por tenant
 */

import { Module } from '@nestjs/common';

import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { ProdutoRepository } from './produto.repository';
import { VariacaoController } from './variacao.controller';
import { VariacaoService } from './variacao.service';
import { VariacaoRepository } from './variacao.repository';
import { ProducerService } from '../../events/producer.service';
import { CacheConfigModule } from '../cache/cache.module';
import { GradeModule } from '../grade/grade.module';

@Module({
  // GradeModule fornece o GradeRepository usado na geração da matriz de variações.
  imports: [CacheConfigModule, GradeModule],
  controllers: [ProdutoController, VariacaoController],
  providers: [
    ProdutoService,
    ProdutoRepository,
    VariacaoService,
    VariacaoRepository,
    ProducerService,
  ],
  exports: [ProdutoService, VariacaoService],
})
export class ProdutoModule {}
