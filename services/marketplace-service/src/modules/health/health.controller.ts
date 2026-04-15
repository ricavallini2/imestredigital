import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

/**
 * Controller de health check
 * Monitora saúde da aplicação e suas dependências
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Health check básico
   */
  @Get()
  @ApiOperation({ summary: 'Verificar saúde da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está operacional',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async health() {
    return this.healthService.getHealthStatus();
  }

  /**
   * Health check detalhado
   */
  @Get('detailed')
  @ApiOperation({ summary: 'Verificar saúde detalhada da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Status detalhado de todas as dependências',
  })
  async healthDetailed() {
    return this.healthService.getDetailedHealthStatus();
  }

  /**
   * Verifica conexão com banco de dados
   */
  @Get('db')
  @ApiOperation({ summary: 'Verificar conexão com banco de dados' })
  async healthDatabase() {
    return this.healthService.checkDatabase();
  }

  /**
   * Verifica conexão com Redis
   */
  @Get('redis')
  @ApiOperation({ summary: 'Verificar conexão com Redis' })
  async healthRedis() {
    return this.healthService.checkRedis();
  }

  /**
   * Verifica conexão com Kafka
   */
  @Get('kafka')
  @ApiOperation({ summary: 'Verificar conexão com Kafka' })
  async healthKafka() {
    return this.healthService.checkKafka();
  }
}
