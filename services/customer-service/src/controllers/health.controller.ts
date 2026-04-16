/**
 * Health Check do Customer Service (CRM).
 *
 * Usado pelo Docker/Kubernetes para liveness e readiness probes.
 * Path completo porque o serviço não usa setGlobalPrefix + enableVersioning.
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
@Controller('api/v1/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  /** Liveness: apenas confirma que o processo está respondendo */
  @Get()
  @ApiOperation({ summary: 'Verificação de saúde básica (liveness)' })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  /** Readiness: verifica também se o banco está acessível */
  @Get('ready')
  @ApiOperation({ summary: 'Verificação de prontidão (readiness)' })
  @HealthCheck()
  checkReady() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
