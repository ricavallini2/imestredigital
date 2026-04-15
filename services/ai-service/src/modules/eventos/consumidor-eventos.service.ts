/**
 * Consumidor de Eventos Kafka
 *
 * Consome eventos de outros serviços e dispara análises/insights
 *
 * Tópicos consumidos:
 * - PEDIDO_CRIADO: Análise de padrão de vendas
 * - PEDIDO_PAGO: Confirma venda e atualiza insights
 * - PRODUTO_CRIADO: Classifica novo produto
 * - ESTOQUE_ATUALIZADO: Verifica alertas de estoque
 * - LANCAMENTO_CRIADO: Gera insights financeiros
 * - NOTA_AUTORIZADA: Registra operação fiscal
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { kafkaConfig, TOPICOS_CONSUMIDOS, consumerGroupId } from '../../config/kafka.config';
import { InsightsService } from '../insights/insights.service';
import { PrevisaoService } from '../previsao/previsao.service';
import { ProdutorEventosService } from './produtor-eventos.service';

@Injectable()
export class ConsumidorEventosService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger('ConsumidorEventosService');
  private kafka: Kafka;
  private consumidor: any;

  constructor(
    private insightsService: InsightsService,
    private previsaoService: PrevisaoService,
    private produtorService: ProdutorEventosService,
  ) {
    this.kafka = new Kafka(kafkaConfig);
  }

  /**
   * Inicializa consumidor ao carregar módulo
   */
  async onModuleInit() {
    await this.inicializar();
  }

  /**
   * Desconecta ao descarregar módulo
   */
  async onModuleDestroy() {
    await this.desconectar();
  }

  /**
   * Inicializa o consumidor Kafka
   */
  private async inicializar() {
    try {
      this.consumidor = this.kafka.consumer({ groupId: consumerGroupId });

      await this.consumidor.connect();
      this.logger.log('✓ Consumidor Kafka conectado');

      // Se inscrever em tópicos
      await this.consumidor.subscribe({
        topics: Object.values(TOPICOS_CONSUMIDOS),
        fromBeginning: false,
      });

      this.logger.log(
        `✓ Inscrito em ${Object.keys(TOPICOS_CONSUMIDOS).length} tópicos`,
      );

      // Começar a consumir
      await this.consumidor.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.procesarMensagem(topic, message);
        },
      });
    } catch (erro) {
      this.logger.error(`Erro ao inicializar consumidor: ${erro.message}`);
    }
  }

  /**
   * Processa uma mensagem Kafka
   */
  private async procesarMensagem(
    topico: string,
    mensagem: { key: string; value: string; timestamp: string },
  ) {
    const tenantId = mensagem.key || 'tenant-default';

    try {
      const dados = JSON.parse(mensagem.value);

      this.logger.debug(
        `Evento recebido: ${topico} para tenant ${tenantId}`,
      );

      switch (topico) {
        case TOPICOS_CONSUMIDOS.PEDIDO_CRIADO:
          await this.handlePedidoCriado(tenantId, dados);
          break;

        case TOPICOS_CONSUMIDOS.PEDIDO_PAGO:
          await this.handlePedidoPago(tenantId, dados);
          break;

        case TOPICOS_CONSUMIDOS.PRODUTO_CRIADO:
          await this.handleProdutoCriado(tenantId, dados);
          break;

        case TOPICOS_CONSUMIDOS.ESTOQUE_ATUALIZADO:
          await this.handleEstoqueAtualizado(tenantId, dados);
          break;

        case TOPICOS_CONSUMIDOS.LANCAMENTO_CRIADO:
          await this.handleLancamentoCriado(tenantId, dados);
          break;

        case TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA:
          await this.handleNotaAutorizada(tenantId, dados);
          break;

        default:
          this.logger.warn(`Tópico desconhecido: ${topico}`);
      }
    } catch (erro) {
      this.logger.error(
        `Erro ao processar mensagem de ${topico}: ${erro.message}`,
      );
    }
  }

  /**
   * Novo pedido criado - Analisar padrão de vendas
   */
  private async handlePedidoCriado(tenantId: string, dados: any) {
    this.logger.debug(`Pedido criado: ${dados.pedidoId}`);

    try {
      // Aqui dispararia análise de padrão de vendas
      // Por enquanto, apenas registrar
      this.logger.log(`Novo pedido para análise: ${dados.pedidoId}`);
    } catch (erro) {
      this.logger.error(`Erro ao processar PEDIDO_CRIADO: ${erro.message}`);
    }
  }

  /**
   * Pedido pago - Confirma venda
   */
  private async handlePedidoPago(tenantId: string, dados: any) {
    this.logger.debug(`Pedido pago: ${dados.pedidoId}`);

    try {
      // Atualizar análises de venda
      // Recalcular previsões se houver produtos no pedido
      if (dados.itens && dados.itens.length > 0) {
        for (const item of dados.itens) {
          // Recalcular previsão do produto
          await this.previsaoService.preverDemanda(
            tenantId,
            item.produtoId,
            30,
          );
        }
      }

      this.logger.log(`Pedido confirmado, previsões atualizadas`);
    } catch (erro) {
      this.logger.error(`Erro ao processar PEDIDO_PAGO: ${erro.message}`);
    }
  }

  /**
   * Novo produto criado - Classificar
   */
  private async handleProdutoCriado(tenantId: string, dados: any) {
    this.logger.debug(`Produto criado: ${dados.produtoId}`);

    try {
      this.logger.log(
        `Novo produto criado - será classificado automaticamente`,
      );

      // Em produção, chamaria ClassificacaoService
      // await this.classificacaoService.classificarProduto(...)
    } catch (erro) {
      this.logger.error(`Erro ao processar PRODUTO_CRIADO: ${erro.message}`);
    }
  }

  /**
   * Estoque atualizado - Verificar alertas
   */
  private async handleEstoqueAtualizado(tenantId: string, dados: any) {
    this.logger.debug(`Estoque atualizado: ${dados.produtoId}`);

    try {
      // Verificar se produto tem estoque crítico
      if (dados.quantidade < dados.quantidadeMinima) {
        // Criar insight de alerta
        const insight = await this.insightsService.criarInsight({
          tenantId,
          tipo: 'ESTOQUE',
          titulo: `Estoque crítico: ${dados.produtoNome}`,
          descricao: `Produto com apenas ${dados.quantidade} unidades (mínimo: ${dados.quantidadeMinima})`,
          prioridade: 'ALTA',
          dados: dados,
          acaoSugerida: `Reabastecer ${dados.produtoNome} imediatamente`,
        });

        this.logger.log(`Insight de alerta criado: ${insight.id}`);
      }
    } catch (erro) {
      this.logger.error(`Erro ao processar ESTOQUE_ATUALIZADO: ${erro.message}`);
    }
  }

  /**
   * Novo lançamento financeiro - Gerar insight
   */
  private async handleLancamentoCriado(tenantId: string, dados: any) {
    this.logger.debug(`Lançamento criado: ${dados.lancamentoId}`);

    try {
      // Análise financeira será feita periodicamente
      this.logger.log(`Lançamento registrado para análise financeira`);
    } catch (erro) {
      this.logger.error(`Erro ao processar LANCAMENTO_CRIADO: ${erro.message}`);
    }
  }

  /**
   * Nota fiscal autorizada - Registrar operação
   */
  private async handleNotaAutorizada(tenantId: string, dados: any) {
    this.logger.debug(`Nota autorizada: ${dados.notaId}`);

    try {
      this.logger.log(`Nota fiscal registrada: ${dados.notaId}`);

      // Poderia gerar insight fiscal se houvesse anomalias
    } catch (erro) {
      this.logger.error(`Erro ao processar NOTA_AUTORIZADA: ${erro.message}`);
    }
  }

  /**
   * Desconecta o consumidor
   */
  private async desconectar() {
    try {
      if (this.consumidor) {
        await this.consumidor.disconnect();
        this.logger.log('✓ Consumidor Kafka desconectado');
      }
    } catch (erro) {
      this.logger.error(`Erro ao desconectar: ${erro.message}`);
    }
  }
}
