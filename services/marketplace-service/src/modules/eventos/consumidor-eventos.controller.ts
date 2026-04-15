import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AnuncioService } from '../anuncio/anuncio.service';
import { SincronizacaoService } from '../sincronizacao/sincronizacao.service';
import {
  TOPICOS_CONSUMIDOS,
  EventoProdutoCriado,
  EventoProdutoAtualizado,
  EventoEstoqueAtualizado,
  EventoPrecoAlterado,
  EventoPedidoEnviado,
  EventoPedidoCancelado,
} from '@config/kafka.config';

/**
 * Controller para consumir eventos de outros serviços
 * Integra eventos do catálogo, estoque e pedidos com o marketplace
 */
@Controller()
export class ConsumidorEventosController {
  private readonly logger = new Logger(ConsumidorEventosController.name);

  constructor(
    private readonly anuncioService: AnuncioService,
    private readonly sincronizacaoService: SincronizacaoService,
  ) {}

  /**
   * Consome evento: PRODUTO_CRIADO do Catalog Service
   * Sincroniza novo produto com marketplaces ativos
   */
  @MessagePattern(TOPICOS_CONSUMIDOS.PRODUTO_CRIADO)
  async handleProdutoCriado(@Payload() mensagem: EventoProdutoCriado) {
    try {
      this.logger.log(
        `Produto criado recebido: ${mensagem.dados.produtoId} - Tenant: ${mensagem.tenantId}`,
      );

      const { tenantId, dados } = mensagem;

      // Buscar contas ativas do tenant
      const contasAtivas = await this.anuncioService.buscarContasAtivas(
        tenantId,
      );

      // Para cada conta ativa, criar anúncio no marketplace
      for (const conta of contasAtivas) {
        try {
          await this.anuncioService.criarAnuncioAutomatico(
            tenantId,
            conta.id,
            {
              produtoId: dados.produtoId,
              titulo: dados.nome,
              descricao: dados.descricao,
              preco: dados.preco,
              estoque: dados.estoque,
              categoria: dados.categoriaId,
              fotos: dados.imagens,
              atributos: dados.atributos,
            },
          );

          this.logger.log(
            `Anúncio criado automaticamente para produto ${dados.produtoId} na conta ${conta.id}`,
          );
        } catch (erro) {
          this.logger.error(
            `Erro ao criar anúncio para conta ${conta.id}: ${erro.message}`,
          );
        }
      }
    } catch (erro) {
      this.logger.error(
        `Erro ao processar PRODUTO_CRIADO: ${erro.message}`,
        erro.stack,
      );
    }
  }

  /**
   * Consome evento: PRODUTO_ATUALIZADO do Catalog Service
   * Atualiza anúncios nos marketplaces
   */
  @MessagePattern(TOPICOS_CONSUMIDOS.PRODUTO_ATUALIZADO)
  async handleProdutoAtualizado(@Payload() mensagem: EventoProdutoAtualizado) {
    try {
      this.logger.log(
        `Produto atualizado recebido: ${mensagem.dados.produtoId} - Tenant: ${mensagem.tenantId}`,
      );

      const { tenantId, dados } = mensagem;

      // Buscar todos os anúncios deste produto
      const anuncios = await this.anuncioService.buscarPorProdutoId(
        tenantId,
        dados.produtoId,
      );

      // Atualizar cada anúncio
      for (const anuncio of anuncios) {
        try {
          await this.anuncioService.atualizarAnuncio(
            tenantId,
            anuncio.id,
            {
              titulo: dados.nome || anuncio.titulo,
              descricao: dados.descricao || anuncio.descricao,
              preco: dados.preco || anuncio.preco,
              fotos: dados.imagens || anuncio.fotos,
              atributos: dados.atributos || anuncio.atributos,
            },
          );

          this.logger.log(
            `Anúncio ${anuncio.id} atualizado no marketplace`,
          );
        } catch (erro) {
          this.logger.error(
            `Erro ao atualizar anúncio ${anuncio.id}: ${erro.message}`,
          );
        }
      }
    } catch (erro) {
      this.logger.error(
        `Erro ao processar PRODUTO_ATUALIZADO: ${erro.message}`,
        erro.stack,
      );
    }
  }

  /**
   * Consome evento: ESTOQUE_ATUALIZADO do Inventory Service
   * Sincroniza estoque para os marketplaces
   */
  @MessagePattern(TOPICOS_CONSUMIDOS.ESTOQUE_ATUALIZADO)
  async handleEstoqueAtualizado(@Payload() mensagem: EventoEstoqueAtualizado) {
    try {
      this.logger.log(
        `Estoque atualizado recebido: ${mensagem.dados.produtoId} - Qty: ${mensagem.dados.quantidadeNova} - Tenant: ${mensagem.tenantId}`,
      );

      const { tenantId, dados } = mensagem;

      // Sincronizar estoque para os marketplaces
      await this.sincronizacaoService.sincronizarEstoque(
        tenantId,
        dados.produtoId,
        dados.quantidadeNova,
      );

      this.logger.log(
        `Estoque sincronizado para produto ${dados.produtoId}`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar ESTOQUE_ATUALIZADO: ${erro.message}`,
        erro.stack,
      );
    }
  }

  /**
   * Consome evento: PRECO_ALTERADO do Pricing Service
   * Sincroniza preços para os marketplaces
   */
  @MessagePattern(TOPICOS_CONSUMIDOS.PRECO_ALTERADO)
  async handlePrecoAlterado(@Payload() mensagem: EventoPrecoAlterado) {
    try {
      this.logger.log(
        `Preço alterado recebido: ${mensagem.dados.produtoId} - Novo preço: ${mensagem.dados.precoNovo} - Tenant: ${mensagem.tenantId}`,
      );

      const { tenantId, dados } = mensagem;

      // Sincronizar preço para os marketplaces
      await this.sincronizacaoService.sincronizarPreco(
        tenantId,
        dados.produtoId,
        dados.precoNovo,
        dados.precoPromocional,
        dados.dataPromocao,
      );

      this.logger.log(
        `Preço sincronizado para produto ${dados.produtoId}`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar PRECO_ALTERADO: ${erro.message}`,
        erro.stack,
      );
    }
  }

  /**
   * Consome evento: PEDIDO_ENVIADO do Order Service
   * Envia rastreio para o marketplace
   */
  @MessagePattern(TOPICOS_CONSUMIDOS.PEDIDO_ENVIADO)
  async handlePedidoEnviado(@Payload() mensagem: EventoPedidoEnviado) {
    try {
      this.logger.log(
        `Pedido enviado recebido: ${mensagem.dados.pedidoId} - Código: ${mensagem.dados.codigoRastreio} - Tenant: ${mensagem.tenantId}`,
      );

      const { tenantId, dados } = mensagem;

      // Enviar rastreio para o marketplace
      await this.sincronizacaoService.enviarRastreioMarketplace(
        tenantId,
        dados.marketplacePedidoId,
        dados.marketplace,
        dados.codigoRastreio,
      );

      this.logger.log(
        `Rastreio enviado para pedido ${dados.marketplacePedidoId}`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar PEDIDO_ENVIADO: ${erro.message}`,
        erro.stack,
      );
    }
  }

  /**
   * Consome evento: PEDIDO_CANCELADO do Order Service
   * Notifica o marketplace sobre cancelamento
   */
  @MessagePattern(TOPICOS_CONSUMIDOS.PEDIDO_CANCELADO)
  async handlePedidoCancelado(@Payload() mensagem: EventoPedidoCancelado) {
    try {
      this.logger.log(
        `Pedido cancelado recebido: ${mensagem.dados.pedidoId} - Marketplace: ${mensagem.dados.marketplace} - Tenant: ${mensagem.tenantId}`,
      );

      const { tenantId, dados } = mensagem;

      // Notificar marketplace sobre cancelamento
      await this.sincronizacaoService.notificarCancelamentoMarketplace(
        tenantId,
        dados.marketplacePedidoId,
        dados.marketplace,
        dados.motivo,
      );

      this.logger.log(
        `Cancelamento notificado ao marketplace para pedido ${dados.marketplacePedidoId}`,
      );
    } catch (erro) {
      this.logger.error(
        `Erro ao processar PEDIDO_CANCELADO: ${erro.message}`,
        erro.stack,
      );
    }
  }
}
