/**
 * Health Check do Auth Service.
 * Usado pelo Kubernetes para liveness e readiness probes.
 */

import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Verificação de saúde (liveness)' })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
