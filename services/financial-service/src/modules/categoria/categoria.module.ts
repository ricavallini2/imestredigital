/**
 * Módulo de Categorias Financeiras.
 * Gerencia categorias hierárquicas.
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoriaService } from './categoria.service';
import { CategoriaRepository } from './categoria.repository';
import { CategoriaController } from './categoria.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [CategoriaService, CategoriaRepository],
  controllers: [CategoriaController],
  exports: [CategoriaService, CategoriaRepository],
})
export class CategoriaModule {}
