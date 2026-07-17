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
import { StatusPagamento, StatusPedido } from '../../../generated/client';

/**
 * ═══════════════════════════════════════════════════════════════
 * Semântica das estatísticas de pedidos (`obterEstatisticas`)
 * ═══════════════════════════════════════════════════════════════
 *
 * O Dashboard e a tela de Pedidos exibem "Receita do Mês" ao lado de "Pedidos
 * do Mês". Para os dois números não se contradizerem, o que entra e o que não
 * entra em cada métrica está explícito aqui.
 *
 * RASCUNHO NÃO É PEDIDO. É um carrinho em edição, ainda não efetivado pelo
 * operador. Fica de fora de TODAS as métricas — receita, contagem, porStatus,
 * porStatusPagamento, porCanal e topProdutos. Consequência intencional: a soma
 * de `porStatus` é sempre igual a `totalPedidos`, ou seja, todo pedido contado
 * em um está contado no outro.
 *
 * CANCELADO e DEVOLVIDO SÃO PEDIDOS DE VERDADE que aconteceram. CONTAM em
 * `totalPedidos`, `porStatus`, `porStatusPagamento` e `porCanal` — é assim que
 * a tela consegue mostrar taxa de cancelamento e o pipeline real. Mas NÃO são
 * dinheiro de venda: ficam fora de `totalVendas`, `ticketMedio` e
 * `topProdutos`. Um produto "mais vendido" cujo pedido foi cancelado não foi
 * vendido.
 *
 * REGIME DA RECEITA: COMPETÊNCIA, NÃO CAIXA. `totalVendas` soma o `valorTotal`
 * de todo pedido efetivado e não desfeito (tudo menos RASCUNHO, CANCELADO e
 * DEVOLVIDO), INDEPENDENTE de o pagamento já ter entrado. Por que não somar só
 * `statusPagamento === 'PAGO'`:
 *
 *   1. Coerência com o KPI vizinho. "Pedidos do Mês" conta pedidos efetivados,
 *      pagos ou não. Se a receita contasse só os pagos, a mesma tela mostraria
 *      10 pedidos e a receita de 8 — dois rótulos que parecem irmãos medindo
 *      coisas diferentes.
 *   2. Venda a prazo é venda. Boleto, marketplace com repasse em D+14 e
 *      crediário nascem com `statusPagamento` PENDENTE e são faturamento
 *      legítimo do mês. Regime de caixa empurraria essa venda para o mês em que
 *      o dinheiro cair — o que some com o faturamento de quem vende a prazo.
 *   3. Separação de responsabilidade. Dinheiro que ENTROU (regime de caixa) é
 *      pergunta do financial-service / Caixa, que tem os lançamentos. Aqui é o
 *      faturamento do período.
 *
 * LIMITAÇÃO CONHECIDA (declarada, não escondida): devolução PARCIAL não abate
 * `totalVendas`. Só o pedido inteiro marcado como DEVOLVIDO sai da receita; um
 * pedido com devolução de parte dos itens continua somando o `valorTotal`
 * original. Abater item a item exige cruzar `devolucoes.itens` e está fora
 * desta correção.
 */

/** Status que não representam pedido efetivado — invisíveis nas estatísticas. */
const STATUS_FORA_DAS_ESTATISTICAS: StatusPedido[] = [StatusPedido.RASCUNHO];

/** Status de pedidos que aconteceram, mas cujo valor não é receita de venda. */
const STATUS_SEM_RECEITA: StatusPedido[] = [StatusPedido.CANCELADO, StatusPedido.DEVOLVIDO];

/** Quantos produtos o ranking `topProdutos` devolve. */
const LIMITE_TOP_PRODUTOS = 10;

/** Acumulador do ranking de produtos — valor em Decimal, nunca float. */
interface AcumuladorTopProduto {
  sku: string;
  titulo: string;
  quantidade: number;
  valorTotal: Decimal;
}

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
      busca,
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

    // Busca livre (usada pela busca global): nº do pedido (se numérico),
    // nome ou e-mail do cliente. OR entre os campos; ANDa com os demais filtros.
    if (busca) {
      const termo = String(busca).trim();
      const or: any[] = [
        { clienteNome: { contains: termo, mode: 'insensitive' } },
        { clienteEmail: { contains: termo, mode: 'insensitive' } },
      ];
      const numero = Number(termo);
      if (Number.isInteger(numero) && numero > 0 && String(numero) === termo) {
        or.push({ numero });
      }
      where.OR = or;
    }

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

    const [dados, total] = await Promise.all([
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

    // Envelope paginado canônico (Fase 0): { dados, total, pagina, limite, totalPaginas }
    return {
      dados,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Atualizar status do pedido.
   *
   * Write multi-tenant seguro: filtra por { id, tenantId } via updateMany
   * (a chave { id, tenantId } não é única, então update simples não serve).
   * Retorna o pedido atualizado, buscado com o mesmo filtro de tenant.
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

    await this.prisma.pedido.updateMany({
      where: { id: pedidoId, tenantId },
      data: updateData,
    });

    return this.prisma.pedido.findFirst({
      where: { id: pedidoId, tenantId },
      include: { itens: true },
    });
  }

  /**
   * Atualizar status de pagamento.
   */
  async atualizarStatusPagamento(tenantId: string, pedidoId: string, novoStatus: string) {
    return this.prisma.pedido.updateMany({
      where: { id: pedidoId, tenantId },
      data: {
        statusPagamento: novoStatus as StatusPagamento,
        atualizadoEm: new Date(),
      },
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
    return this.prisma.pedido.updateMany({
      where: { id: pedidoId, tenantId },
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
   * Atualizar totais do pedido (write multi-tenant seguro).
   */
  async atualizarTotais(
    tenantId: string,
    pedidoId: string,
    valorProdutos: number,
    valorDesconto: number,
    valorFrete: number,
  ) {
    const valorTotal = valorProdutos - valorDesconto + valorFrete;

    return this.prisma.pedido.updateMany({
      where: { id: pedidoId, tenantId },
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
   *
   * Write multi-tenant seguro: filtra por { id, tenantId } via deleteMany.
   */
  async deletar(tenantId: string, pedidoId: string) {
    return this.prisma.pedido.deleteMany({
      where: { id: pedidoId, tenantId },
    });
  }

  /**
   * Definir a nota fiscal vinculada ao pedido (write multi-tenant seguro).
   */
  async definirNotaFiscal(tenantId: string, pedidoId: string, notaFiscalId: string) {
    return this.prisma.pedido.updateMany({
      where: { id: pedidoId, tenantId },
      data: { notaFiscalId, atualizadoEm: new Date() },
    });
  }

  /**
   * Registrar o motivo de cancelamento (write multi-tenant seguro).
   */
  async definirMotivoCancelamento(tenantId: string, pedidoId: string, motivoCancelamento: string) {
    return this.prisma.pedido.updateMany({
      where: { id: pedidoId, tenantId },
      data: { motivoCancelamento, atualizadoEm: new Date() },
    });
  }

  /**
   * Obter estatísticas de pedidos do período (KPIs do Dashboard e da tela de
   * Pedidos).
   *
   * A regra de o que entra e o que não entra em cada métrica está documentada
   * em detalhe no topo deste arquivo. Resumo:
   *
   *   - `totalPedidos`      → pedidos efetivados no período. Exclui RASCUNHO.
   *                           Inclui CANCELADO e DEVOLVIDO (aconteceram).
   *   - `totalVendas`       → receita por COMPETÊNCIA. Exclui RASCUNHO,
   *                           CANCELADO e DEVOLVIDO. Inclui pedido ainda não
   *                           pago (venda a prazo é venda).
   *   - `ticketMedio`       → `totalVendas` ÷ nº de pedidos DA MESMA BASE da
   *                           receita (nunca ÷ `totalPedidos`).
   *   - `porStatus`,
   *     `porStatusPagamento`,
   *     `porCanal`          → censo dos pedidos efetivados. Cada chave é
   *                           auto-explicativa, então cancelado aparecer ali é
   *                           informação, não distorção. Somam `totalPedidos`.
   *   - `topProdutos`       → mesma base da receita: só o que foi vendido de
   *                           fato.
   *
   * Não muda o SHAPE da resposta — só a semântica dos números.
   */
  async obterEstatisticas(tenantId: string, dataInicio: Date, dataFim: Date) {
    const where = {
      tenantId,
      criadoEm: {
        gte: dataInicio,
        lte: dataFim,
      },
      // RASCUNHO é carrinho em edição, não pedido: nem chega a ser carregado.
      status: { notIn: STATUS_FORA_DAS_ESTATISTICAS },
    };

    const pedidos = await this.prisma.pedido.findMany({
      where,
      include: {
        itens: true,
        pagamentos: true,
      },
    });

    // Base da receita: pedidos efetivados e não desfeitos. É a MESMA base do
    // ticket médio e do topProdutos — se divergirem, um KPI divide por 10 e o
    // vizinho por 8, e a tela passa a mentir.
    const pedidosComReceita = pedidos.filter(
      (pedido) => !STATUS_SEM_RECEITA.includes(pedido.status),
    );

    // Dinheiro sempre em Decimal: somar float acumula erro de arredondamento a
    // cada pedido e a receita do mês fecha com centavos que não existem.
    const totalVendas = pedidosComReceita.reduce(
      (soma, pedido) => soma.plus(pedido.valorTotal),
      new Decimal(0),
    );

    const ticketMedio =
      pedidosComReceita.length > 0
        ? totalVendas.dividedBy(pedidosComReceita.length).toDecimalPlaces(2)
        : new Decimal(0);

    const porStatus: Record<string, number> = {};
    const porStatusPagamento: Record<string, number> = {};
    const porCanal: Record<string, number> = {};

    // Censo: percorre TODOS os pedidos efetivados, cancelados inclusive.
    for (const pedido of pedidos) {
      porStatus[pedido.status] = (porStatus[pedido.status] || 0) + 1;

      porStatusPagamento[pedido.statusPagamento] =
        (porStatusPagamento[pedido.statusPagamento] || 0) + 1;

      const canal = pedido.canalOrigem || 'manual';
      porCanal[canal] = (porCanal[canal] || 0) + 1;
    }

    // Ranking: só a base da receita. Produto "mais vendido" cujo pedido foi
    // cancelado não foi vendido — deixá-lo no topo é inventar venda.
    const acumuladoPorSku = new Map<string, AcumuladorTopProduto>();

    for (const pedido of pedidosComReceita) {
      for (const item of pedido.itens) {
        const acumulado = acumuladoPorSku.get(item.sku) ?? {
          sku: item.sku,
          titulo: item.titulo,
          quantidade: 0,
          valorTotal: new Decimal(0),
        };

        acumulado.quantidade += item.quantidade;
        acumulado.valorTotal = acumulado.valorTotal.plus(item.valorTotal);

        acumuladoPorSku.set(item.sku, acumulado);
      }
    }

    const topProdutos = Array.from(acumuladoPorSku.values())
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, LIMITE_TOP_PRODUTOS)
      .map((produto) => ({
        sku: produto.sku,
        titulo: produto.titulo,
        quantidade: produto.quantidade,
        valorTotal: produto.valorTotal.toDecimalPlaces(2).toNumber(),
      }));

    return {
      totalPedidos: pedidos.length,
      totalVendas: totalVendas.toDecimalPlaces(2).toNumber(),
      ticketMedio: ticketMedio.toNumber(),
      porStatus,
      porStatusPagamento,
      porCanal,
      topProdutos,
    };
  }

  /**
   * Marca um evento como processado (idempotência do consumo Kafka).
   *
   * Usa o índice único (evento, referenciaId): se o evento já foi processado,
   * a criação falha com P2002 e devolvemos `false` (deve ignorar o
   * reprocessamento). Se registrou agora, devolve `true` (deve aplicar o
   * efeito colateral). Mesmo contrato do inventory-service.
   */
  async registrarEventoProcessado(
    tenantId: string,
    evento: string,
    referenciaId: string,
  ): Promise<boolean> {
    try {
      await this.prisma.eventoProcessado.create({
        data: { tenantId, evento, referenciaId },
      });
      return true;
    } catch (erro: unknown) {
      // P2002 = violação de unique → evento já processado.
      if (
        typeof erro === 'object' &&
        erro !== null &&
        'code' in erro &&
        (erro as { code?: string }).code === 'P2002'
      ) {
        return false;
      }
      throw erro;
    }
  }
}
