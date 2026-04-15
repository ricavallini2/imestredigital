/**
 * Controlador de Health Check.
 * Retorna status da aplicação para liveness e readiness probes.
 */

import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../modules/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaIndicator: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prismaIndicator.pingCheck('database', this.prismaService)]);
  }

  @Get('live')
  live() {
    return { status: 'ok', service: 'financial-service' };
  }

  @Get('ready')
  ready() {
    return { status: 'ready', service: 'financial-service' };
  }
}
