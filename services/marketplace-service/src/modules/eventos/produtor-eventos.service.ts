import { Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { TOPICOS_PRODUZIDOS, MensagemKafka } from '@config/kafka.config';

/**
 * Serviço para produzir eventos no Kafka
 * Centraliza a publicação de eventos do Marketplace Service
 */
@Injectable()
export class ProdutorEventosService {
  private readonly logger = new Logger(ProdutorEventosService.name);
  private kafkaClient: ClientKafka;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Define o cliente Kafka (injetado pelo módulo)
   */
  setKafkaClient(client: ClientKafka) {
    this.kafkaClient = client;
  }

  /**
   * Publica um evento no Kafka
   */
  private async publicarEvento(
    topico: string,
    mensagem: MensagemKafka,
  ): Promise<void> {
    try {
      if (!this.kafkaClient) {
        this.logger.warn(
          `Tentativa de publicar evento sem cliente Kafka: ${topico}`,
        );
        return;
      }

      // Garantir que a mensagem tem um ID único
      if (!mensagem.id) {
        mensagem.id = uuidv4();
      }

      this.logger.debug(
        `Publicando evento: ${topico} | ID: ${mensagem.id} | Tenant: ${mensagem.tenantId}`,
      );

      await this.kafkaClient.emit(topico, mensagem).toPromise();

      this.logger.log(`Evento publicado com sucesso: ${topico}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar evento ${topico}: ${erro.message}`,
        erro.stack,
      );
      // Não lançar erro para não interromper o fluxo principal
      // Em produção, implementar DLQ (Dead Letter Queue)
    }
  }

  // ========================================================================
  // EVENTOS DE PEDIDOS
  // ========================================================================

  /**
   * Publica evento quando um pedido é recebido do marketplace
   */
  async pedidoRecebido(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_PEDIDO_RECEBIDO',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_PEDIDO_RECEBIDO,
      mensagem,
    );
  }

  // ========================================================================
  // EVENTOS DE ANÚNCIOS
  // ========================================================================

  /**
   * Publica evento quando um anúncio é criado no marketplace
   */
  async anuncioCriado(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_ANUNCIO_CRIADO',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_ANUNCIO_CRIADO,
      mensagem,
    );
  }

  /**
   * Publica evento quando um anúncio é atualizado no marketplace
   */
  async anuncioAtualizado(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_ANUNCIO_ATUALIZADO',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_ANUNCIO_ATUALIZADO,
      mensagem,
    );
  }

  // ========================================================================
  // EVENTOS DE ESTOQUE
  // ========================================================================

  /**
   * Publica evento quando estoque é sincronizado
   */
  async estoqueSincronizado(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_ESTOQUE_SINCRONIZADO',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_ESTOQUE_SINCRONIZADO,
      mensagem,
    );
  }

  // ========================================================================
  // EVENTOS DE PREÇO
  // ========================================================================

  /**
   * Publica evento quando preço é sincronizado
   */
  async precoSincronizado(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_PRECO_SINCRONIZADO',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_PRECO_SINCRONIZADO,
      mensagem,
    );
  }

  // ========================================================================
  // EVENTOS DE PERGUNTAS
  // ========================================================================

  /**
   * Publica evento quando pergunta é recebida do marketplace
   */
  async perguntaRecebida(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_PERGUNTA_RECEBIDA',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_PERGUNTA_RECEBIDA,
      mensagem,
    );
  }

  // ========================================================================
  // EVENTOS DE ERROS
  // ========================================================================

  /**
   * Publica evento quando ocorre erro na sincronização
   */
  async erroSincronizacao(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_ERRO_SINCRONIZACAO',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_ERRO_SINCRONIZACAO,
      mensagem,
    );
  }

  // ========================================================================
  // EVENTOS DE CONTA
  // ========================================================================

  /**
   * Publica evento quando conta é conectada ao marketplace
   */
  async contaConectada(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_CONTA_CONECTADA',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_CONTA_CONECTADA,
      mensagem,
    );
  }

  /**
   * Publica evento quando conta é desconectada do marketplace
   */
  async contaDesconectada(
    tenantId: string,
    dados: Record<string, any>,
  ): Promise<void> {
    const mensagem: MensagemKafka = {
      id: uuidv4(),
      tenantId,
      tipo: 'MARKETPLACE_CONTA_DESCONECTADA',
      timestamp: Date.now(),
      dados,
      origem: 'marketplace-service',
    };

    await this.publicarEvento(
      TOPICOS_PRODUZIDOS.MARKETPLACE_CONTA_DESCONECTADA,
      mensagem,
    );
  }
}
