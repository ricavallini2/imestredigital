import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { TOPICOS_PRODUZIDOS, MensagemKafka } from '../../config/kafka.config';
import { KAFKA_SERVICE } from './eventos.constants';

/**
 * Payload PLANO de marketplace.pedido.recebido — casa EXATAMENTE com o contrato
 * consumido pelo order-service (EventoMarketplacePedido em
 * consumidor-eventos.controller.ts). Sem envelope `.dados`.
 */
export interface PayloadPedidoRecebidoPlano {
  tenantId: string;
  pedidoExternoId: string;
  canalOrigem?: string;
  clienteNome: string;
  clienteEmail?: string;
  itens: Array<{
    produtoId: string;
    variacaoId?: string;
    sku: string;
    titulo: string;
    quantidade: number;
    valorUnitario: number;
    peso?: number;
    largura?: number;
    altura?: number;
    comprimento?: number;
  }>;
  valorTotal?: number;
  enderecoEntrega?: Record<string, unknown>;
}

/**
 * Serviço para produzir eventos no Kafka.
 * Centraliza a publicação de eventos do Marketplace Service.
 *
 * O cliente Kafka é injetado (ClientsModule token KAFKA_SERVICE) e conectado
 * no OnModuleInit. Kafka é opcional em dev: se a conexão falhar, o serviço segue
 * e as publicações viram no-op com aviso (sem derrubar o fluxo principal).
 */
@Injectable()
export class ProdutorEventosService implements OnModuleInit {
  private readonly logger = new Logger(ProdutorEventosService.name);
  private conectado = false;

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  /**
   * Conecta o produtor ao broker ao inicializar o módulo.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.kafkaClient.connect();
      this.conectado = true;
      this.logger.log('Produtor Kafka conectado');
    } catch (erro) {
      this.conectado = false;
      this.logger.warn(
        `Kafka indisponível — publicação de eventos desabilitada: ${(erro as Error).message}`,
      );
    }
  }

  /**
   * Publica um evento no Kafka
   */
  private async publicarEvento(
    topico: string,
    mensagem: MensagemKafka,
  ): Promise<void> {
    try {
      if (!this.conectado) {
        this.logger.warn(
          `Evento não publicado (Kafka desconectado): ${topico}`,
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
      // Não lançar erro para não interromper o fluxo principal.
      // Em produção, implementar DLQ (Dead Letter Queue).
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

  /**
   * Publica marketplace.pedido.recebido no formato PLANO canônico consumido
   * pelo order-service. Diferente de `pedidoRecebido` (envelope legado), este
   * emite o payload sem o wrapper `.dados` — o order-service lê os campos na
   * raiz (tenantId, pedidoExternoId, itens, ...).
   *
   * Usado pelo webhook do Mercado Livre para disparar a criação do pedido
   * interno a partir de uma venda recebida.
   */
  async pedidoRecebidoPlano(
    payload: PayloadPedidoRecebidoPlano,
  ): Promise<void> {
    await this.publicarPlano(
      TOPICOS_PRODUZIDOS.MARKETPLACE_PEDIDO_RECEBIDO_CANONICO,
      payload,
      payload.tenantId,
    );
  }

  /**
   * Publica um payload PLANO (sem envelope) num tópico. Usado pelos contratos
   * de saga que casam campos na raiz do evento.
   */
  private async publicarPlano<T extends object>(
    topico: string,
    payload: T,
    tenantId: string,
  ): Promise<void> {
    try {
      if (!this.conectado) {
        this.logger.warn(`Evento não publicado (Kafka desconectado): ${topico}`);
        return;
      }

      this.logger.debug(`Publicando evento plano: ${topico} | Tenant: ${tenantId}`);

      await this.kafkaClient.emit(topico, payload).toPromise();

      this.logger.log(`Evento plano publicado com sucesso: ${topico}`);
    } catch (erro) {
      this.logger.error(
        `Erro ao publicar evento plano ${topico}: ${(erro as Error).message}`,
        (erro as Error).stack,
      );
      // Não relança para não interromper o fluxo (resposta 200 ao webhook).
    }
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
