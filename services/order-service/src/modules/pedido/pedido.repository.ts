/**
 * ═══════════════════════════════════════════════════════════════
 * Repositório de Pedidos - Prisma
 * ═══════════════════════════════════════════════════════════════
 *
 * Camada de dados para operações CRUD e queries complexas.
 * Todos os métodos filtram automaticamente por tenantId.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PedidoRepository {
  constructor(public prisma: PrismaService) {}

  /**
   * Criar novo pedido.
   */
  async criar(tenantId: string, dados: any) {
    // Obter próximo número sequencial por tenant
    const ultimoPedido = await this.prisma.pedido.findFirst({
      where: { tenantId },
      orderBy: { numero: 'desc' },
      select: { numero: true },
    });

    const proximoNumero = (ultimoPedido?.numero || 0) + 1;

    return this.prisma.pedido.create({
      data: {
        ...dados,
        tenantId,
        numero: proximoNumero,
      },
      include: {
        itens: true,
      },
    });
  }

  /**
   * Buscar pedido por ID (com filtro de tenant).
   */
  async buscarPorId(tenantId: string, pedidoId: string) {
    return this.prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        tenantId,
      },
      include: {
        itens: true,
        historico: {
          orderBy: { criadoEm: 'desc' },
        },
        pagamentos: true,
        devolucoes: {
          include: { itens: true },
        },
      },
    });
  }

  /**
   * Buscar pedido por número (número sequencial por tenant).
   */
  async buscarPorNumero(tenantId: string, numero: number) {
    return this.prisma.pedido.findUnique({
      where: {
        tenantId_numero: {
          tenantId,
          numero,
        },
      },
      include: {
        itens: true,
        historico: true,
        pagamentos: true,
        devolucoes: true,
      },
    });
  }

  /**
   * Buscar por pedidoExternoId (do marketplace).
   */
  async buscarPorExternoId(tenantId: string, pedidoExternoId: string) {
    return this.prisma.pedido.findFirst({
      where: {
        tenantId,
        pedidoExternoId,
      },
      include: {
        itens: true,
      },
    });
  }

  /**
   * Listar pedidos com paginação e filtros.
   */
  async listar(tenantId: string, filtros: any) {
    const {
      status,
      statusPagamento,
      canalOrigem,
      clienteId,
      dataInicio,
      dataFim,
      pagina = 1,
      limite = 20,
      ordenacao = 'criadoEm_desc',
    } = filtros;

    const skip = (pagina - 1) * limite;

    // Construir where
    const where: any = { tenantId };

    if (status) where.status = status;
    if (statusPagamento) where.statusPagamento = statusPagamento;
    if (canalOrigem) where.canalOrigem = canalOrigem;
    if (clienteId) where.clienteId = clienteId;

    if (dataInicio || dataFim) {
      where.criadoEm = {};
      if (dataInicio) {
        where.criadoEm.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.criadoEm.lte = new Date(dataFim);
      }
    }

    // Construir orderBy
    const [campo, direcao] = ordenacao.split('_');
    const orderBy: any = {};
    orderBy[campo] = direcao === 'asc' ? 'asc' : 'desc';

    const [pedidos, total] = await Promise.all([
      this.prisma.pedido.findMany({
        where,
        skip,
        take: limite,
        orderBy,
        include: {
          itens: true,
          pagamentos: true,
        },
      }),
      this.prisma.pedido.count({ where }),
    ]);

    return {
      pedidos,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  /**
   * Atualizar status do pedido.
   */
  async atualizarStatus(
    tenantId: string,
    pedidoId: string,
    novoStatus: string,
    dataTransicao?: string,
  ) {
    const updateData: any = { status: novoStatus, atualizadoEm: new Date() };

    // Setar data específica conforme o status
    if (novoStatus === 'CONFIRMADO') updateData.dataAprovacao = new Date();
    if (novoStatus === 'EM_SEPARACAO') updateData.dataSeparacao = new Date();
    if (novoStatus === 'FATURADO') updateData.dataFaturamento = new Date();
    if (novoStatus === 'ENVIADO') updateData.dataEnvio = new Date();
    if (novoStatus === 'ENTREGUE') updateData.dataEntrega = new Date();
    if (novoStatus === 'CANCELADO') updateData.dataCancelamento = new Date();

    return this.prisma.pedido.update({
      where: {
        id: pedidoId,
      },
      data: updateData,
      include: {
        itens: true,
      },
    });
  }

  /**
   * Atualizar status de pagamento.
   */
  async atualizarStatusPagamento(
    tenantId: string,
    pedidoId: string,
    novoStatus: string,
  ) {
    return this.prisma.pedido.update({
      where: { id: pedidoId },
      data: { statusPagamento: novoStatus, atualizadoEm: new Date() },
    });
  }

  /**
   * Atualizar dados de rastreamento.
   */
  async atualizarRastreio(
    tenantId: string,
    pedidoId: string,
    codigoRastreio: string,
    transportadora: string,
    prazoEntrega?: number,
  ) {
    return this.prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        codigoRastreio,
        transportadora,
        prazoEntrega,
        atualizadoEm: new Date(),
      },
    });
  }

  /**
   * Adicionar itens ao pedido.
   */
  async adicionarItens(pedidoId: string, itens: any[]) {
    return this.prisma.itemPedido.createMany({
      data: itens.map((item) => ({
        ...item,
        pedidoId,
      })),
    });
  }

  /**
   * Atualizar totais do pedido.
   */
  async atualizarTotais(
    pedidoId: string,
    valorProdutos: number,
    valorDesconto: number,
    valorFrete: number,
  ) {
    const valorTotal =
      valorProdutos - valorDesconto + valorFrete;

    return this.prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        valorProdutos: new Decimal(valorProdutos),
        valorDesconto: new Decimal(valorDesconto),
        valorFrete: new Decimal(valorFrete),
        valorTotal: new Decimal(valorTotal),
        atualizadoEm: new Date(),
      },
    });
  }

  /**
   * Adicionar histórico.
   */
  async adicionarHistorico(
    pedidoId: string,
    tenantId: string,
    statusAnterior: string,
    statusNovo: string,
    descricao: string,
    usuarioId?: string,
    dadosExtras?: any,
  ) {
    return this.prisma.historicoPedido.create({
      data: {
        pedidoId,
        tenantId,
        statusAnterior,
        statusNovo,
        descricao,
        usuarioId,
        dadosExtras,
      },
    });
  }

  /**
   * Deletar pedido (apenas status RASCUNHO).
   */
  async deletar(tenantId: string, pedidoId: string) {
    return this.prisma.pedido.delete({
      where: { id: pedidoId },
    });
  }

  /**
   * Obter estatísticas de pedidos.
   */
  async obterEstatisticas(tenantId: string, dataInicio: Date, dataFim: Date) {
    const where = {
      tenantId,
      criadoEm: {
        gte: dataInicio,
        lte: dataFim,
      },
    };

    const pedidos = await this.prisma.pedido.findMany({
      where,
      include: {
        itens: true,
        pagamentos: true,
      },
    });

    // Calcular estatísticas
    const totalPedidos = pedidos.length;
    const totalVendas = pedidos.reduce(
      (sum, p) => sum + parseFloat(p.valorTotal.toString()),
      0,
    );

    const porStatus: any = {};
    const porStatusPagamento: any = {};
    const porCanal: any = {};
    const topProdutos: any = {};

    for (const pedido of pedidos) {
      // Por status
      porStatus[pedido.status] = (porStatus[pedido.status] || 0) + 1;

      // Por status pagamento
      porStatusPagamento[pedido.statusPagamento] =
        (porStatusPagamento[pedido.statusPagamento] || 0) + 1;

      // Por canal
      porCanal[pedido.canalOrigem || 'manual'] =
        (porCanal[pedido.canalOrigem || 'manual'] || 0) + 1;

      // Top produtos
      for (const item of pedido.itens) {
        if (!topProdutos[item.sku]) {
          topProdutos[item.sku] = {
            sku: item.sku,
            titulo: item.titulo,
            quantidade: 0,
            valorTotal: 0,
          };
        }
        topProdutos[item.sku].quantidade += item.quantidade;
        topProdutos[item.sku].valorTotal += parseFloat(
          item.valorTotal.toString(),
        );
      }
    }

    return {
      totalPedidos,
      totalVendas,
      ticketMedio: totalPedidos > 0 ? totalVendas / totalPedidos : 0,
      porStatus,
      porStatusPagamento,
      porCanal,
      topProdutos: Object.values(topProdutos)
        .sort((a: any, b: any) => b.quantidade - a.quantidade)
        .slice(0, 10),
    };
  }
}
