/**
 * Controlador de Health Check.
 * Retorna status da aplicação para liveness e readiness probes.
 *
 * Path completo porque o serviço não usa setGlobalPrefix + enableVersioning
 * (controllers expõem diretamente 'api/v1/...').
 */

import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../modules/prisma/prisma.service';

@Controller('api/v1/health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaIndicator: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  /** Liveness: apenas confirma que o processo está respondendo */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  /** Readiness: verifica se o banco está acessível */
  @Get('ready')
  @HealthCheck()
  checkReady() {
    return this.health.check([
      () => this.prismaIndicator.pingCheck('database', this.prismaService),
    ]);
  }

  /** Probe alternativo simples (não passa pelo Terminus) */
  @Get('live')
  live() {
    return { status: 'ok', service: 'financial-service' };
  }
}
