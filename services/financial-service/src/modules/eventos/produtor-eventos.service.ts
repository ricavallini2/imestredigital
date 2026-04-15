/**
 * Serviço Produtor de Eventos Kafka.
 * Publicação de eventos financeiros para outros serviços.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { TOPICOS_KAFKA } from '../../config/kafka.config';

interface EventoFinanceiro {
  tenantId: string;
  id: string;
  timestamp: Date;
  dados: any;
}

@Injectable()
export class ProdutorEventosService {
  private readonly logger = new Logger('ProdutorEventosService');

  constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {}

  /**
   * Publica evento de lançamento criado.
   */
  async publicarLancamentoCriado(evento: EventoFinanceiro) {
    try {
      await this.kafkaClient.emit(TOPICOS_KAFKA.LANCAMENTO_CRIADO, evento).toPromise();
      this.logger.debug(
        `Evento publicado: ${TOPICOS_KAFKA.LANCAMENTO_CRIADO} (${evento.id})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar ${TOPICOS_KAFKA.LANCAMENTO_CRIADO}: ${erro.message}`,
      );
      throw erro;
    }
  }

  /**
   * Publica evento de lançamento pago.
   */
  async publicarLancamentoPago(evento: EventoFinanceiro) {
    try {
      await this.kafkaClient.emit(TOPICOS_KAFKA.LANCAMENTO_PAGO, evento).toPromise();
      this.logger.debug(
        `Evento publicado: ${TOPICOS_KAFKA.LANCAMENTO_PAGO} (${evento.id})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar ${TOPICOS_KAFKA.LANCAMENTO_PAGO}: ${erro.message}`,
      );
      throw erro;
    }
  }

  /**
   * Publica evento de lançamento atrasado.
   */
  async publicarLancamentoAtrasado(evento: EventoFinanceiro) {
    try {
      await this.kafkaClient.emit(TOPICOS_KAFKA.LANCAMENTO_ATRASADO, evento).toPromise();
      this.logger.debug(
        `Evento publicado: ${TOPICOS_KAFKA.LANCAMENTO_ATRASADO} (${evento.id})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar ${TOPICOS_KAFKA.LANCAMENTO_ATRASADO}: ${erro.message}`,
      );
      throw erro;
    }
  }

  /**
   * Publica evento de fluxo de caixa atualizado.
   */
  async publicarFluxoCaixaAtualizado(evento: EventoFinanceiro) {
    try {
      await this.kafkaClient.emit(TOPICOS_KAFKA.FLUXO_CAIXA_ATUALIZADO, evento).toPromise();
      this.logger.debug(
        `Evento publicado: ${TOPICOS_KAFKA.FLUXO_CAIXA_ATUALIZADO} (${evento.tenantId})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar ${TOPICOS_KAFKA.FLUXO_CAIXA_ATUALIZADO}: ${erro.message}`,
      );
      throw erro;
    }
  }

  /**
   * Publica evento de DRE gerado.
   */
  async publicarDreGerado(evento: EventoFinanceiro) {
    try {
      await this.kafkaClient.emit(TOPICOS_KAFKA.DRE_GERADO, evento).toPromise();
      this.logger.debug(
        `Evento publicado: ${TOPICOS_KAFKA.DRE_GERADO} (${evento.id})`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar ${TOPICOS_KAFKA.DRE_GERADO}: ${erro.message}`,
      );
      throw erro;
    }
  }
}
