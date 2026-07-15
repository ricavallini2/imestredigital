import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PedidoMarketplaceRepository } from './pedido-marketplace.repository';
import { ContaMarketplaceRepository } from '../conta-marketplace/conta-marketplace.repository';
import { IntegracaoFactory } from '../integracao/integracao.factory';
import { ProdutorEventosService } from '../eventos/produtor-eventos.service';
import { StatusPedidoMarketplace, Prisma } from '../../../generated/client';
import { FiltroPedidoMarketplaceDto } from '../../dtos/filtro-pedido-marketplace.dto';
import { RespostaPaginada, montarRespostaPaginada } from '../../common/resposta-paginada';

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
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.plataforma);
      const pedidosExternos = await adapter.listarPedidos();

      let importados = 0;
      for (const pedidoExterno of pedidosExternos) {
        // Verificar se pedido já existe (dentro do tenant)
        const pedidoExistente = await this.repository.buscarPorIdExterno(
          tenantId,
          pedidoExterno.numeroMarketplace,
        );

        if (!pedidoExistente) {
          await this.repository.criar({
            tenantId,
            contaMarketplaceId: contaId,
            idExterno: pedidoExterno.numeroMarketplace,
            plataforma: conta.plataforma,
            status: StatusPedidoMarketplace.PENDENTE,
            statusExterno: pedidoExterno.statusMarketplace,
            comprador: pedidoExterno.comprador as unknown as Prisma.InputJsonValue,
            itens: pedidoExterno.itens as unknown as Prisma.InputJsonValue,
            valorTotal: pedidoExterno.valorTotal,
            valorFrete: pedidoExterno.valorFrete,
            enderecoEntrega: pedidoExterno.enderecoEntrega as unknown as Prisma.InputJsonValue,
            dataVenda: pedidoExterno.dataVenda,
            dataAprovacao: pedidoExterno.dataAprovacao,
            prazoEnvio: pedidoExterno.prazoEnvio,
          });

          await this.produtorEventos.pedidoRecebido(tenantId, {
            marketplacePedidoId: pedidoExterno.numeroMarketplace,
            marketplace: conta.plataforma,
            comprador: pedidoExterno.comprador,
            valorTotal: pedidoExterno.valorTotal,
          });

          importados++;
        }
      }

      // Atualizar última sincronização
      await this.contaRepository.atualizarUltimaSincronizacao(contaId, tenantId);

      return { importados };
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
      if (!pedido) throw new NotFoundException('Pedido não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        pedido.contaMarketplaceId,
        tenantId,
      );
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.plataforma);
      const pedidoAtualizado = await adapter.obterPedido(pedido.idExterno);

      return this.repository.atualizar(pedidoId, tenantId, {
        statusExterno: pedidoAtualizado.statusMarketplace,
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
      if (!pedido) throw new NotFoundException('Pedido não encontrado');

      const conta = await this.contaRepository.buscarPorId(
        pedido.contaMarketplaceId,
        tenantId,
      );
      if (!conta) throw new NotFoundException('Conta não encontrada');

      const adapter = this.integracaoFactory.criar(conta.plataforma);
      await adapter.enviarRastreio(pedido.idExterno, codigoRastreio);

      return this.repository.atualizar(pedidoId, tenantId, {
        codigoRastreio,
        sincronizado: true,
      });
    } catch (erro) {
      this.logger.error(`Erro ao enviar rastreio: ${erro.message}`);
      throw erro;
    }
  }

  /**
   * Lista pedidos do tenant no envelope paginado canônico.
   */
  async listar(
    tenantId: string,
    filtros?: FiltroPedidoMarketplaceDto,
  ): Promise<RespostaPaginada<any>> {
    const pagina = filtros?.pagina ?? 1;
    const limite = filtros?.limite ?? 20;

    const where: Prisma.PedidoMarketplaceWhereInput = {};
    if (filtros?.marketplace) where.plataforma = filtros.marketplace;
    if (filtros?.status) where.status = filtros.status;
    if (filtros?.dataInicio || filtros?.dataFim) {
      where.dataVenda = {
        ...(filtros.dataInicio && { gte: new Date(filtros.dataInicio) }),
        ...(filtros.dataFim && { lte: new Date(filtros.dataFim) }),
      };
    }

    const { itens, total } = await this.repository.listarPaginado(
      tenantId,
      where,
      pagina,
      limite,
    );

    return montarRespostaPaginada(itens, total, pagina, limite);
  }

  /**
   * Busca por ID
   */
  async buscarPorId(tenantId: string, pedidoId: string) {
    const pedido = await this.repository.buscarPorId(pedidoId, tenantId);
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    return pedido;
  }
}
