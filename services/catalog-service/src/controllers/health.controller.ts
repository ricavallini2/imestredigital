/**
 * Controller de Health Check.
 *
 * Expõe endpoints para verificação de saúde do serviço:
 * - /health: Status geral (usado pelo Kubernetes liveness probe)
 * - /health/ready: Verifica se todas as dependências estão OK (readiness probe)
 */

import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { PrismaService } from '../modules/prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  /** Verificação básica de que o serviço está respondendo */
  @Get()
  @ApiOperation({ summary: 'Verificação de saúde básica (liveness)' })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  /** Verificação completa incluindo banco de dados */
  @Get('ready')
  @ApiOperation({ summary: 'Verificação de prontidão (readiness)' })
  @HealthCheck()
  checkReady() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
