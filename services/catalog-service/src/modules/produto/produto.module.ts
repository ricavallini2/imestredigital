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
import { ProducerService } from '../../events/producer.service';
import { CacheConfigModule } from '../cache/cache.module';

@Module({
  imports: [CacheConfigModule],
  controllers: [ProdutoController],
  providers: [ProdutoService, ProdutoRepository, ProducerService],
  exports: [ProdutoService],
})
export class ProdutoModule {}
