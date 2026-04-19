/**
 * Health Check Controller
 * Verifica o status de saúde do serviço e dependências.
 */

import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

import { PrismaService } from '../modules/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly saude: HealthCheckService,
    private readonly prismaIndicador: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Verifica se o serviço está operacional.
   */
  @Get()
  @HealthCheck()
  verificarSaude() {
    return this.saude.check([
      () => (this.prismaIndicador as any).pingDb(this.prisma),
    ]);
  }
}
