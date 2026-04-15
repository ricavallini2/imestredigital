/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço Produtor de Eventos Kafka - Order Service
 * ═══════════════════════════════════════════════════════════════
 *
 * Responsável por publicar eventos de pedidos, pagamentos e devoluções
 * aos tópicos Kafka para consumo por outros serviços:
 * - fiscal-service (para gerar NF-e)
 * - inventory-service (para reservar/liberar estoque)
 * - payment-service (para processar pagamentos)
 * - notification-service (para enviar notificações)
 *
 * Utiliza @nestjs/microservices ClientKafka em vez de raw kafkajs.
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TOPICOS_PEDIDO } from '../../config/kafka.config';

@Injectable()
export class KafkaProducerService {
  private readonly logger = new Logger('KafkaProducerService');

  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  /**
   * Publica evento de pedido criado.
   * Disparado logo após criação, antes de confirmar.
   */
  async publicarPedidoCriado(
    tenantId: string,
    pedidoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_CRIADO, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoCriado:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido confirmado.
   * Disparado quando cliente confirma o pedido.
   */
  async publicarPedidoConfirmado(
    tenantId: string,
    pedidoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_CONFIRMADO, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoConfirmado:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido em separação.
   * Disparado quando estoque foi reservado e começou a separação.
   */
  async publicarPedidoSeparando(
    tenantId: string,
    pedidoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_SEPARANDO, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoSeparando:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido separado.
   * Disparado quando todos os itens foram separados.
   */
  async publicarPedidoSeparado(
    tenantId: string,
    pedidoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_SEPARADO, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoSeparado:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento solicitando faturamento ao fiscal-service.
   * Fiscal service retorna NOTA_AUTORIZADA quando NF-e estiver autorizada.
   */
  async publicarPedidoFaturar(
    tenantId: string,
    pedidoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_FATURAR, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoFaturar:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido faturado (após NF-e autorizada).
   */
  async publicarPedidoFaturado(
    tenantId: string,
    pedidoId: string,
    notaFiscalId: string,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_FATURADO, {
        tenantId,
        pedidoId,
        notaFiscalId,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoFaturado:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido enviado.
   * Disparado quando transportadora faz coleta.
   */
  async publicarPedidoEnviado(
    tenantId: string,
    pedidoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_ENVIADO, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoEnviado:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido entregue.
   */
  async publicarPedidoEntregue(
    tenantId: string,
    pedidoId: string,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_ENTREGUE, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoEntregue:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido cancelado.
   * Disparado quando pedido é cancelado (libera estoque, reembolsa pagamento).
   */
  async publicarPedidoCancelado(
    tenantId: string,
    pedidoId: string,
    motivo: string,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_CANCELADO, {
        tenantId,
        pedidoId,
        motivo,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoCancelado:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de pedido pago.
   */
  async publicarPedidoPago(
    tenantId: string,
    pedidoId: string,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.PEDIDO_PAGO, {
        tenantId,
        pedidoId,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar pedidoPago:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de devolução solicitada.
   */
  async publicarDevolucaoSolicitada(
    tenantId: string,
    pedidoId: string,
    devolucaoId: string,
    dados: any,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.DEVOLUCAO_SOLICITADA, {
        tenantId,
        pedidoId,
        devolucaoId,
        timestamp: new Date().toISOString(),
        ...dados,
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar devolucaoSolicitada:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de devolução aprovada.
   */
  async publicarDevolucaoAprovada(
    tenantId: string,
    pedidoId: string,
    devolucaoId: string,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.DEVOLUCAO_APROVADA, {
        tenantId,
        pedidoId,
        devolucaoId,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar devolucaoAprovada:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de devolução recebida.
   */
  async publicarDevolucaoRecebida(
    tenantId: string,
    pedidoId: string,
    devolucaoId: string,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.DEVOLUCAO_RECEBIDA, {
        tenantId,
        pedidoId,
        devolucaoId,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar devolucaoRecebida:', erro);
      throw erro;
    }
  }

  /**
   * Publica evento de devolução reembolsada.
   */
  async publicarDevolucaoReembolsada(
    tenantId: string,
    pedidoId: string,
    devolucaoId: string,
    valorReembolso: number,
  ): Promise<void> {
    try {
      this.kafkaClient.emit(TOPICOS_PEDIDO.DEVOLUCAO_REEMBOLSADA, {
        tenantId,
        pedidoId,
        devolucaoId,
        valorReembolso,
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      this.logger.error('Erro ao publicar devolucaoReembolsada:', erro);
      throw erro;
    }
  }
}
