/**
 * Produtor de Eventos (Kafka)
 * Publica eventos fiscais para outros serviços consumirem.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
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
   *
   * `pedidoId` (quando a nota está vinculada a um pedido) permite ao
   * order-service marcar o pedido como FATURADO — payload plano canônico
   * { tenantId, pedidoId, notaId, protocolo }.
   */
  async publicarNotaAutorizada(
    tenantId: string,
    notaId: string,
    protocolo: string,
    pedidoId?: string | null,
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_AUTORIZADA, {
        tenantId,
        pedidoId: pedidoId ?? undefined,
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
    pedidoId?: string | null,
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_REJEITADA, {
        tenantId,
        pedidoId: pedidoId ?? undefined,
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
   *
   * `pedidoId` (quando a nota está vinculada a um pedido) segue no payload
   * plano canônico { tenantId, pedidoId, notaId, justificativa } para o
   * order-service reagir ao cancelamento fiscal (ex.: estornar o faturamento).
   */
  async publicarNotaCancelada(
    tenantId: string,
    notaId: string,
    justificativa: string,
    pedidoId?: string | null,
  ): Promise<void> {
    try {
      this.kafka.emit(TOPICOS_KAFKA.NOTA_CANCELADA, {
        tenantId,
        pedidoId: pedidoId ?? undefined,
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
