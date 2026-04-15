import { Injectable, Logger } from '@nestjs/common';
import { PedidoMarketplaceRepository } from './pedido-marketplace.repository';
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';

/**
 * Serviço de gerenciamento de pedidos do marketplace
 */
@Injectable()
export class PedidoMarketplaceService {
  private readonly logger = new Logger(PedidoMarketplaceService.name);

  constructor(
    private readonly repository: PedidoMarketplaceRepository,
    private readonly contaRepository: ContaMarketplaceRepository,
    private readonly integracaoFactory: IntegracaoFactory,
    private readonly produtorEventos: ProdutorEventosService,
  ) {}

  /**
   * Importa pedidos do marketplace
   */
  async importarPedidos(tenantId: string, contaId: string) {
    try {
      this.logger.log(`Importando pedidos para conta ${contaId}`);

      const conta = await this.contaRepository.buscarPorId(contaId, tenantId);
      if (!conta) throw new Error('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      const pedidosExternos = await adapter.listarPedidos();

      for (const pedidoExterno of pedidosExternos) {
        // Verificar se pedido já existe
        const pedidoExistente = await this.repository.buscarPorMarketplacePedidoId(
          pedidoExterno.id,
        );

        if (!pedidoExistente) {
          await this.repository.criar({
            tenantId,
            contaMarketplaceId: contaId,
            marketplacePedidoId: pedidoExterno.numeroMarketplace,
            marketplace: conta.marketplace,
            status: 'PENDENTE',
            statusMarketplace: pedidoExterno.statusMarketplace,
            comprador: pedidoExterno.comprador,
            itens: pedidoExterno.itens,
            valorTotal: pedidoExterno.valorTotal,
            valorFrete: pedidoExterno.valorFrete,
            enderecoEntrega: pedidoExterno.enderecoEntrega,
            dataVenda: pedidoExterno.dataVenda,
            dataAprovacao: pedidoExterno.dataAprovacao,
            prazoEnvio: pedidoExterno.prazoEnvio,
          });

          await this.produtorEventos.pedidoRecebido(tenantId, {
            marketplacePedidoId: pedidoExterno.numeroMarketplace,
            marketplace: conta.marketplace,
            comprador: pedidoExterno.comprador,
            valorTotal: pedidoExterno.valorTotal,
          });
        }
      }

      // Atualizar última sincronização
      await this.contaRepository.atualizarUltimaSincronizacao(contaId, tenantId);

      return { importados: pedidosExternos.length };
    } catch (erro) {
      this.logger.error(`Erro ao importar pedidos: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Sincroniza status de pedido
   */
  async sincronizarStatus(tenantId: string, pedidoId: string) {
    try {
      const pedido = await this.repository.buscarPorId(pedidoId, tenantId);
      if (!pedido) throw new Error('Pedido não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        pedido.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      const pedidoAtualizado = await adapter.obterPedido(pedido.marketplacePedidoId);

      await this.repository.atualizar(pedidoId, {
        statusMarketplace: pedidoAtualizado.statusMarketplace,
      });
    } catch (erro) {
      this.logger.error(`Erro ao sincronizar status: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Envia rastreio para marketplace
   */
  async enviarRastreio(
    tenantId: string,
    pedidoId: string,
    codigoRastreio: string,
  ) {
    try {
      const pedido = await this.repository.buscarPorId(pedidoId, tenantId);
      if (!pedido) throw new Error('Pedido não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        pedido.contaMarketplaceId,
        tenantId,
      );

      const adapter = this.integracaoFactory.criar(conta.marketplace);
      await adapter.enviarRastreio(pedido.marketplacePedidoId, codigoRastreio);

      await this.repository.atualizar(pedidoId, {
        codigoRastreio,
        sincronizado: true,
      });
    } catch (erro) {
      this.logger.error(`Erro ao enviar rastreio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista pedidos
   */
  async listar(tenantId: string, filtros?: any) {
    return this.repository.listar(tenantId, filtros);
  }

  /**
   * Busca por ID
   */
  async buscarPorId(tenantId: string, pedidoId: string) {
    return this.repository.buscarPorId(pedidoId, tenantId);
  }
}
