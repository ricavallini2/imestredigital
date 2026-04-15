/**
 * Produtor de Eventos (Kafka)
 * Publica eventos fiscais para outros serviços consumirem.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ClientKafka, Inject } from '@nestjs/microservices';
import { TOPICOS_KAFKA } from '../config/kafka.config';

@Injectable()
export class ProdutorEventosService {
  private readonly logger = new Logger('ProdutorEventosService');

  constructor(@Inject('KAFKA_CLIENT') private kafka: ClientKafka) {}

  /**
   * Publica evento de nota emitida.
   */
  async publicarNotaEmitida(tenantId: string, notaId: string, dados: any): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_EMITIDA, {
        tenantId,
        notaId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar notaEmitida:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de nota autorizada pela SEFAZ.
   */
  async publicarNotaAutorizada(
    tenantId: string,
    notaId: string,
    protocolo: string,
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_AUTORIZADA, {
        tenantId,
        notaId,
        protocolo,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar notaAutorizada:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de nota rejeitada pela SEFAZ.
   */
  async publicarNotaRejeitada(
    tenantId: string,
    notaId: string,
    motivo: string,
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_REJEITADA, {
        tenantId,
        notaId,
        motivo,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar notaRejeitada:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de nota cancelada.
   */
  async publicarNotaCancelada(
    tenantId: string,
    notaId: string,
    justificativa: string,
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_CANCELADA, {
        tenantId,
        notaId,
        justificativa,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar notaCancelada:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de SPED gerado.
   */
  async publicarSpedGerado(
    tenantId: string,
    tipo: 'FISCAL' | 'CONTRIBUICOES',
    periodo: { mes: number; ano: number },
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.SPED_GERADO, {
        tenantId,
        tipo,
        periodo,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar spedGerado:', erro);
      throw erro;
    }
  }
}
