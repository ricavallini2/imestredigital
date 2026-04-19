/**
 * ═══════════════════════════════════════════════════════════════
 * Controller Consumidor de Eventos - Kafka
 * ═══════════════════════════════════════════════════════════════
 *
 * Consome eventos de outros serviços e atualiza estado do order-service:
 * - NOTA_AUTORIZADA (fiscal-service): marca pedido como FATURADO
 * - ESTOQUE_RESERVADO (inventory-service): inicia separação
 * - ESTOQUE_INSUFICIENTE (inventory-service): notifica problema
 * - MARKETPLACE_PEDIDO_RECEBIDO (marketplace-service): cria pedido novo
 * - PAGAMENTO_AUTORIZADO (payment-service): atualiza pagamento
 */

import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PedidoService } from '../pedido/pedido.service';
import { PagamentoService } from '../pagamento/pagamento.service';
import { TOPICOS_CONSUMIDOS } from '../../config/kafka.config';

@Controller()
export class ConsumidorEventosController {
  constructor(
    private pedidoService: PedidoService,
    private pagamentoService: PagamentoService,
  ) {}

  /**
   * Consome evento de Nota Fiscal Autorizada do fiscal-service.
   * Marca o pedido como FATURADO quando NF-e é autorizada.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.NOTA_AUTORIZADA)
  async aoNotaAutorizada(dados: any) {
    try {
      const { tenantId, pedidoId, notaFiscalId, numero, serieNota } = dados;

      // Atualiza pedido para FATURADO
      await this.pedidoService.atualizarStatusPedido(
        tenantId,
        pedidoId,
        'FATURADO',
        `Nota Fiscal ${serieNota}/${numero} autorizada. ID: ${notaFiscalId}`,
      );

      console.log(`✅ Pedido ${pedidoId} marcado como FATURADO (NF-e ${numero})`);
    } catch (erro) {
      console.error('Erro ao processar NOTA_AUTORIZADA:', erro);
    }
  }

  /**
   * Consome evento de Estoque Reservado do inventory-service.
   * Inicia a separação dos itens do pedido.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_RESERVADO)
  async aoEstoqueReservado(dados: any) {
    try {
      const { tenantId, pedidoId, itensReservados } = dados;

      // Atualiza pedido para EM_SEPARACAO
      await this.pedidoService.atualizarStatusPedido(
        tenantId,
        pedidoId,
        'EM_SEPARACAO',
        `Estoque reservado para ${itensReservados.length} itens`,
      );

      console.log(
        `📦 Pedido ${pedidoId} iniciando separação (${itensReservados.length} itens)`,
      );
    } catch (erro) {
      console.error('Erro ao processar ESTOQUE_RESERVADO:', erro);
    }
  }

  /**
   * Consome evento de Estoque Insuficiente do inventory-service.
   * Notifica sobre problema de estoque.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.ESTOQUE_INSUFICIENTE)
  async aoEstoqueInsuficiente(dados: any) {
    try {
      const { tenantId, pedidoId, itensFaltantes } = dados;

      // Atualiza status para PENDENTE com observação
      const descricao = `Estoque insuficiente: ${itensFaltantes
        .map((i: any) => `${i.sku} (${i.quantidadeFaltante} un)`)
        .join(', ')}`;

      await this.pedidoService.atualizarStatusPedido(
        tenantId,
        pedidoId,
        'PENDENTE',
        descricao,
      );

      console.log(`⚠️  Pedido ${pedidoId} com problema de estoque`);
    } catch (erro) {
      console.error('Erro ao processar ESTOQUE_INSUFICIENTE:', erro);
    }
  }

  /**
   * Consome evento de Pedido Recebido do marketplace-service.
   * Cria novo pedido automaticamente.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.MARKETPLACE_PEDIDO_RECEBIDO)
  async aoMarketplacePedidoRecebido(dados: any) {
    try {
      const {
        tenantId,
        pedidoExternoId,
        canalOrigem,
        clienteNome,
        clienteEmail,
        itens,
        valorTotal,
        enderecoEntrega,
      } = dados;

      // Cria novo pedido a partir do marketplace
      const novoPedido = await this.pedidoService.criarPedido(tenantId, {
        origem: 'MARKETPLACE',
        canalOrigem,
        pedidoExternoId,
        clienteNome,
        clienteEmail,
        itens: itens.map((i: any) => ({
          produtoId: i.produtoId,
          variacaoId: i.variacaoId,
          sku: i.sku,
          titulo: i.titulo,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario,
          peso: i.peso,
          largura: i.largura,
          altura: i.altura,
          comprimento: i.comprimento,
        })),
        enderecoEntrega,
      } as any);

      console.log(
        `🛒 Pedido criado do marketplace: ${novoPedido.id} (${canalOrigem}/${pedidoExternoId})`,
      );
    } catch (erro) {
      console.error('Erro ao processar MARKETPLACE_PEDIDO_RECEBIDO:', erro);
    }
  }

  /**
   * Consome evento de Pagamento Autorizado do payment-service.
   * Atualiza status de pagamento.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PAGAMENTO_AUTORIZADO)
  async aoPagamentoAutorizado(dados: any) {
    try {
      const { tenantId, pedidoId, pagamentoId, valor, transacaoExternaId } = dados;

      // Registra pagamento autorizado
      await this.pagamentoService.registrarPagamento(tenantId, pedidoId, {
        tipo: dados.tipo,
        status: 'AUTORIZADO',
        valor,
        gateway: dados.gateway,
        transacaoExternaId,
        dadosGateway: dados.dadosGateway,
      } as any);

      // Atualiza status do pedido para CONFIRMADO se ainda está PENDENTE
      await this.pedidoService.confirmarPedidoAposAutorizacao(tenantId, pedidoId);

      console.log(`💳 Pagamento autorizado para pedido ${pedidoId}`);
    } catch (erro) {
      console.error('Erro ao processar PAGAMENTO_AUTORIZADO:', erro);
    }
  }

  /**
   * Consome evento de Pagamento Capturado do payment-service.
   * Marca pedido como PAGO.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PAGAMENTO_CAPTURADO)
  async aoPagamentoCapturado(dados: any) {
    try {
      const { tenantId, pedidoId } = dados;

      // Atualiza pedido para PAGO
      await this.pedidoService.atualizarStatusPagamento(
        tenantId,
        pedidoId,
        'PAGO',
      );

      console.log(`✅ Pedido ${pedidoId} marcado como PAGO`);
    } catch (erro) {
      console.error('Erro ao processar PAGAMENTO_CAPTURADO:', erro);
    }
  }

  /**
   * Consome evento de Pagamento Recusado do payment-service.
   */
  @EventPattern(TOPICOS_CONSUMIDOS.PAGAMENTO_RECUSADO)
  async aoPagamentoRecusado(dados: any) {
    try {
      const { tenantId, pedidoId, motivo } = dados;

      // Atualiza status de pagamento
      await this.pedidoService.atualizarStatusPagamento(
        tenantId,
        pedidoId,
        'RECUSADO',
      );

      console.log(
        `❌ Pagamento recusado para pedido ${pedidoId}: ${motivo}`,
      );
    } catch (erro) {
      console.error('Erro ao processar PAGAMENTO_RECUSADO:', erro);
    }
  }
}
