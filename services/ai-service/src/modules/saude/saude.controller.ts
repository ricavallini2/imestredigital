/**
 * Controller de Saúde - Health Check
 *
 * Verifica status do serviço:
 * - Conexão com banco de dados
 * - Conexão com Kafka
 * - Disponibilidade de LLM
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SaudeService } from './saude.service';

@ApiTags('Saúde')
@Controller('saude')
export class SaudeController {
  constructor(private service: SaudeService) {}

  /**
   * Health check simples
   */
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifica se o serviço está ativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Serviço está saudável',
    schema: {
      example: {
        status: 'OK',
        timestamp: '2024-03-23T10:00:00Z',
        uptime: 3600,
      },
    },
  })
  async health() {
    return this.service.healthCheck();
  }

  /**
   * Health check detalhado
   */
  @Get('detalhado')
  @ApiOperation({
    summary: 'Health check detalhado',
    description: 'Retorna status detalhado de todos os componentes',
  })
  @ApiResponse({
    status: 200,
    description: 'Status detalhado',
  })
  async healthDetalhado() {
    return this.service.healthCheckDetalhado();
  }

  /**
   * Status da IA
   */
  @Get('llm')
  @ApiOperation({
    summary: 'Status do LLM',
    description: 'Verifica disponibilidade do provider de IA',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do LLM',
  })
  async statusLLM() {
    return this.service.statusLLM();
  }

  /**
   * Status do banco de dados
   */
  @Get('db')
  @ApiOperation({
    summary: 'Status do banco',
    description: 'Verifica conexão com PostgreSQL',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do banco',
  })
  async statusBanco() {
    return this.service.statusBanco();
  }

  /**
   * Status do Kafka
   */
  @Get('kafka')
  @ApiOperation({
    summary: 'Status do Kafka',
    description: 'Verifica conexão com Kafka/Redpanda',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do Kafka',
  })
  async statusKafka() {
    return this.service.statusKafka();
  }
}
