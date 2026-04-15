/**
 * Módulo de Tenants (Empresas).
 *
 * Gerencia o ciclo de vida das empresas cadastradas:
 * - CRUD de tenant
 * - Configurações por tenant
 * - Planos e limites
 */

import { Module } from '@nestjs/common';

import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
