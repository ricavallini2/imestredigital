/**
 * Serviço de Compras (pedidos de compra, recebimento e importação de NF-e).
 *
 * O módulo mora no inventory porque o efeito físico do RECEBIMENTO é a entrada
 * no estoque: pedido, item e movimentação vivem no mesmo banco. A conta a pagar
 * correspondente é assunto do financial-service (fora do escopo desta v1 — o
 * financeiro tem lançamentos manuais e futuramente consumirá o evento).
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Prisma, StatusCompra } from '../../../generated/client';
import { PrismaService } from '../prisma/prisma.service';
import { EstoqueService } from '../estoque/estoque.service';
import { CatalogClient } from '../estoque/catalog.client';
import {
  CriarCompraDto,
  ReceberCompraDto,
  ListarComprasDto,
  ImportarNfeDto,
} from '../../dtos/compras/compras.dto';
import { parseNFe } from './nfe-parser.util';

/** Status em que o pedido ainda aceita recebimento. */
const STATUS_RECEBIVEIS: StatusCompra[] = [
  StatusCompra.ENVIADO,
  StatusCompra.AGUARDANDO_RECEBIMENTO,
  StatusCompra.RECEBIDO_PARCIAL,
];

@Injectable()
export class ComprasService {
  private readonly logger = new Logger(ComprasService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly estoque: EstoqueService,
    private readonly catalog: CatalogClient,
  ) {}

  // ─── Consulta ───────────────────────────────────────────────────────────────

  async listar(tenantId: string, filtros: ListarComprasDto) {
    const { pagina = 1, limite = 20, status, busca } = filtros;
    const where: Prisma.PedidoCompraWhereInput = { tenantId };
    if (status) where.status = status as StatusCompra;
    if (busca) {
      const numero = parseInt(busca, 10);
      where.OR = [
        { fornecedorNome: { contains: busca, mode: 'insensitive' } },
        { nfeChave: { contains: busca } },
        ...(Number.isFinite(numero) ? [{ numero }] : []),
      ];
    }

    const [dados, total] = await Promise.all([
      this.prisma.pedidoCompra.findMany({
        where,
        include: { itens: true },
        orderBy: { criadoEm: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.pedidoCompra.count({ where }),
    ]);

    return {
      dados: dados.map((c) => this.serializar(c)),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async buscarPorId(tenantId: string, id: string) {
    const compra = await this.prisma.pedidoCompra.findFirst({
      where: { id, tenantId },
      include: { itens: true },
    });
    if (!compra) throw new NotFoundException('Pedido de compra não encontrado');
    return this.serializar(compra);
  }

  /**
   * KPIs de compras. Semântica (espelha a decisão da receita de vendas):
   * gastos = pedidos RECEBIDOS (dinheiro de compra que virou estoque);
   * CANCELADO e RASCUNHO nunca contam.
   */
  async estatisticas(tenantId: string) {
    const agora = new Date();
    const d30 = new Date(agora.getTime() - 30 * 86400000);
    const d7 = new Date(agora.getTime() - 7 * 86400000);
    const d60 = new Date(agora.getTime() - 60 * 86400000);

    const [
      recebidos30,
      recebidos7,
      recebidos60a30,
      pendentes,
      nfes,
      porFornecedor,
      recebidosTodos,
    ] = await Promise.all([
      this.prisma.pedidoCompra.aggregate({
        where: { tenantId, status: StatusCompra.RECEBIDO, dataRecebimento: { gte: d30 } },
        _sum: { valorTotal: true },
        _count: { _all: true },
      }),
      this.prisma.pedidoCompra.aggregate({
        where: { tenantId, status: StatusCompra.RECEBIDO, dataRecebimento: { gte: d7 } },
        _sum: { valorTotal: true },
      }),
      this.prisma.pedidoCompra.aggregate({
        where: {
          tenantId,
          status: StatusCompra.RECEBIDO,
          dataRecebimento: { gte: d60, lt: d30 },
        },
        _sum: { valorTotal: true },
      }),
      this.prisma.pedidoCompra.count({
        where: {
          tenantId,
          status: { in: [StatusCompra.ENVIADO, StatusCompra.AGUARDANDO_RECEBIMENTO] },
        },
      }),
      this.prisma.pedidoCompra.count({ where: { tenantId, nfeChave: { not: null } } }),
      this.prisma.pedidoCompra.groupBy({
        by: ['fornecedorId', 'fornecedorNome'],
        where: { tenantId, status: StatusCompra.RECEBIDO },
        _sum: { valorTotal: true },
        _count: { _all: true },
        orderBy: { _sum: { valorTotal: 'desc' } },
        take: 3,
      }),
      this.prisma.pedidoCompra.aggregate({
        where: { tenantId, status: StatusCompra.RECEBIDO },
        _sum: { valorTotal: true },
        _count: { _all: true },
      }),
    ]);

    const gastos30 = this.paraNumero(recebidos30._sum.valorTotal);
    const gastosAnterior = this.paraNumero(recebidos60a30._sum.valorTotal);
    const totalRecebidos = recebidosTodos._count._all;

    return {
      gastosTotal30d: gastos30,
      gastosTotal7d: this.paraNumero(recebidos7._sum.valorTotal),
      pedidosPendentes: pendentes,
      pedidosRecebidos30d: recebidos30._count._all,
      nfesImportadas: nfes,
      ticketMedioCompra:
        totalRecebidos > 0
          ? this.arredondar(this.paraNumero(recebidosTodos._sum.valorTotal) / totalRecebidos)
          : 0,
      // Crescimento REAL: 30d atuais vs 30d anteriores. null quando não há base
      // de comparação (o mock devolvia -8.5 fixo — número inventado).
      crescimentoGastos:
        gastosAnterior > 0
          ? this.arredondar(((gastos30 - gastosAnterior) / gastosAnterior) * 100)
          : null,
      topFornecedores: porFornecedor.map((f) => ({
        id: f.fornecedorId,
        nome: f.fornecedorNome,
        total: this.paraNumero(f._sum.valorTotal),
        qtd: f._count._all,
      })),
    };
  }

  // ─── Escrita ────────────────────────────────────────────────────────────────

  async criar(tenantId: string, dto: CriarCompraDto) {
    if (!dto.itens?.length) throw new BadRequestException('Informe ao menos um item');

    const { itens, valorProdutos, valorImpostos } = this.montarItens(dto.itens);
    const valorFrete = new Prisma.Decimal(dto.valorFrete ?? 0);
    const valorTotal = valorProdutos.plus(valorFrete);

    // Numeração sequencial por tenant com retry em P2002 (mesmo padrão do order).
    for (let tentativa = 0; tentativa < 5; tentativa++) {
      const ultimo = await this.prisma.pedidoCompra.findFirst({
        where: { tenantId },
        orderBy: { numero: 'desc' },
        select: { numero: true },
      });
      try {
        const compra = await this.prisma.pedidoCompra.create({
          data: {
            tenantId,
            numero: (ultimo?.numero ?? 0) + 1,
            fornecedorId: dto.fornecedorId,
            fornecedorNome: dto.fornecedorNome,
            status: (dto.status as StatusCompra) ?? StatusCompra.RASCUNHO,
            valorProdutos,
            valorFrete,
            valorImpostos,
            valorTotal,
            dataPrevistaEntrega: dto.dataPrevistaEntrega ? new Date(dto.dataPrevistaEntrega) : null,
            condicaoPagamento: dto.condicaoPagamento,
            formaPagamento: dto.formaPagamento,
            observacoes: dto.observacoes,
            itens: { create: itens },
          },
          include: { itens: true },
        });
        return this.serializar(compra);
      } catch (e: any) {
        if (e?.code === 'P2002' && tentativa < 4) continue;
        throw e;
      }
    }
    throw new ConflictException('Não foi possível gerar o número do pedido');
  }

  /**
   * Recebimento (total ou parcial).
   *
   * `quantidadeRecebida` do DTO é INCREMENTAL (o que chegou agora). Cada item
   * com produto vinculado gera entrada de estoque via EstoqueService.entrada
   * (movimentação + saldo + evento). Itens sem produtoId (NF-e de produto que
   * não existe no catálogo) atualizam o pedido mas NÃO movimentam estoque — o
   * retorno lista esses itens para o operador cadastrar o produto.
   *
   * Idempotência: a soma recebida nunca passa da pedida; reexecutar com o
   * restante após uma falha parcial não duplica entradas já feitas.
   */
  async receber(tenantId: string, id: string, dto: ReceberCompraDto, usuarioId?: string) {
    const compra = await this.prisma.pedidoCompra.findFirst({
      where: { id, tenantId },
      include: { itens: true },
    });
    if (!compra) throw new NotFoundException('Pedido de compra não encontrado');
    if (!STATUS_RECEBIVEIS.includes(compra.status)) {
      throw new BadRequestException(`Pedido está ${compra.status} e não aceita recebimento`);
    }

    const depositoId = await this.resolverDeposito(tenantId, dto.depositoId);
    const semProduto: string[] = [];

    for (const ir of dto.itensRecebidos) {
      if (ir.quantidadeRecebida <= 0) continue;
      const item = compra.itens.find((i) => i.id === ir.itemId);
      if (!item) throw new BadRequestException(`Item ${ir.itemId} não pertence a este pedido`);

      const pendente = item.quantidade.minus(item.quantidadeRecebida);
      const recebendo = Prisma.Decimal.min(new Prisma.Decimal(ir.quantidadeRecebida), pendente);
      if (recebendo.lessThanOrEqualTo(0)) continue;

      // 1. Persiste a quantidade recebida ANTES da entrada: se a entrada
      // falhar, o operador reexecuta apenas com o restante (sem duplicar).
      await this.prisma.itemPedidoCompra.update({
        where: { id: item.id },
        data: { quantidadeRecebida: item.quantidadeRecebida.plus(recebendo) },
      });

      // 2. Entrada física (movimentação + saldo + evento) — só com produto vinculado.
      if (item.produtoId) {
        await this.estoque.entrada(
          tenantId,
          {
            produtoId: item.produtoId,
            depositoId,
            quantidade: recebendo.toNumber(),
            // EntradaEstoqueDto documenta custo em CENTAVOS.
            custoUnitario: Math.round(item.valorUnitario.toNumber() * 100),
            motivo: 'COMPRA',
            observacao:
              dto.observacao ??
              `Recebimento do pedido de compra ${this.formatarNumero(compra.numero)}`,
          } as any,
          usuarioId,
        );
      } else {
        semProduto.push(`${item.sku} — ${item.produtoNome}`);
      }
    }

    // Recalcula o status a partir do estado persistido.
    const itensAtuais = await this.prisma.itemPedidoCompra.findMany({
      where: { pedidoCompraId: id },
    });
    const tudoRecebido = itensAtuais.every((i) =>
      i.quantidadeRecebida.greaterThanOrEqualTo(i.quantidade),
    );
    const algoRecebido = itensAtuais.some((i) => i.quantidadeRecebida.greaterThan(0));

    const atualizado = await this.prisma.pedidoCompra.update({
      where: { id },
      data: {
        status: tudoRecebido
          ? StatusCompra.RECEBIDO
          : algoRecebido
            ? StatusCompra.RECEBIDO_PARCIAL
            : compra.status,
        dataRecebimento: tudoRecebido ? new Date() : compra.dataRecebimento,
      },
      include: { itens: true },
    });

    this.logger.log(
      `Recebimento do pedido ${this.formatarNumero(compra.numero)} (${tenantId}): ` +
        `${tudoRecebido ? 'TOTAL' : 'parcial'}${semProduto.length ? `; ${semProduto.length} item(ns) sem produto no catálogo` : ''}`,
    );

    return {
      ...this.serializar(atualizado),
      // Itens de NF-e sem produto no catálogo: recebidos no pedido, SEM entrada
      // de estoque. A tela avisa o operador para cadastrar e ajustar.
      itensSemEntradaEstoque: semProduto,
    };
  }

  async cancelar(tenantId: string, id: string) {
    const compra = await this.prisma.pedidoCompra.findFirst({ where: { id, tenantId } });
    if (!compra) throw new NotFoundException('Pedido de compra não encontrado');
    if (compra.status === StatusCompra.RECEBIDO) {
      throw new BadRequestException(
        'Pedido já recebido não pode ser cancelado — faça um ajuste de estoque',
      );
    }
    const atualizado = await this.prisma.pedidoCompra.update({
      where: { id },
      data: { status: StatusCompra.CANCELADO },
      include: { itens: true },
    });
    return this.serializar(atualizado);
  }

  /**
   * Importa uma NF-e (XML) como pedido de compra AGUARDANDO_RECEBIMENTO.
   *
   * v1: NÃO cria produto no catálogo (exigiria chamada cross-service ao
   * catalog). Os itens casam por SKU com os saldos existentes do tenant;
   * o que não casar entra sem produtoId e não movimenta estoque no
   * recebimento (o retorno explicita isso — nada acontece em silêncio).
   */
  async importarNfe(tenantId: string, dto: ImportarNfeDto, authorization?: string) {
    const nfe = parseNFe(dto.xml);
    if (!nfe || !nfe.itens.length) {
      throw new BadRequestException(
        'XML inválido ou sem itens — envie o XML completo da NF-e (layout 4.00)',
      );
    }

    // Dedup por chave (unique [tenantId, nfeChave] é a garantia de fundo).
    const existente = await this.prisma.pedidoCompra.findFirst({
      where: { tenantId, nfeChave: nfe.chave },
      select: { id: true, numero: true },
    });
    if (existente) {
      throw new ConflictException(
        `NF-e já importada no pedido ${this.formatarNumero(existente.numero)}`,
      );
    }

    // Casa itens por SKU consultando o catálogo (o SKU vive no catalog-service;
    // o SaldoEstoque local só tem produtoId). Catálogo fora do ar → mapa vazio:
    // a importação segue, apenas sem vínculo (comportamento já documentado).
    const mapaProdutos = await this.catalog.mapaProdutos(authorization);
    const produtoPorSku = new Map<string, string>();
    for (const [produtoId, p] of mapaProdutos) {
      if (p?.sku) produtoPorSku.set(String(p.sku).toUpperCase(), produtoId);
    }

    const compra = await this.criar(tenantId, {
      fornecedorNome:
        nfe.fornecedor.razaoSocial || nfe.fornecedor.nomeFantasia || 'Fornecedor NF-e',
      status: 'AGUARDANDO_RECEBIMENTO',
      valorFrete: nfe.totais.valorFrete,
      formaPagamento: nfe.formaPagamento ?? undefined,
      observacoes: `Importado da NF-e ${nfe.numero}/${nfe.serie} — ${nfe.naturezaOperacao}`,
      itens: nfe.itens.map((i) => ({
        produtoId: produtoPorSku.get(i.codigo.toUpperCase()),
        produtoNome: i.descricao,
        sku: i.codigo,
        ncm: i.ncm || undefined,
        cfop: i.cfop || undefined,
        unidade: i.unidade,
        quantidade: i.quantidade,
        valorUnitario: i.valorUnitario,
        valorIcms: i.impostos.vICMS,
        valorIpi: i.impostos.vIPI,
        valorPis: i.impostos.vPIS,
        valorCofins: i.impostos.vCOFINS,
      })),
    });

    // Completa os dados fiscais que o criar() genérico não recebe.
    const comNfe = await this.prisma.pedidoCompra.update({
      where: { id: compra.id },
      data: {
        nfeChave: nfe.chave,
        nfeNumero: nfe.numero,
        nfeSerie: nfe.serie,
        dataEmissao: nfe.dataEmissao ? new Date(nfe.dataEmissao) : undefined,
      },
      include: { itens: true },
    });

    const semProduto = comNfe.itens.filter((i) => !i.produtoId).length;
    return {
      compra: this.serializar(comNfe),
      // Dados PARSEADOS da NF-e (fatos do XML) — a tela usa no resumo da importação.
      nfe: {
        chave: nfe.chave,
        numero: nfe.numero,
        serie: nfe.serie,
        dataEmissao: nfe.dataEmissao,
        naturezaOperacao: nfe.naturezaOperacao,
        fornecedor: nfe.fornecedor,
        totais: nfe.totais,
      },
      itensTotal: comNfe.itens.length,
      itensSemProduto: semProduto,
      aviso:
        semProduto > 0
          ? `${semProduto} item(ns) não existem no catálogo: o recebimento deles não movimentará o estoque até o produto ser cadastrado.`
          : null,
    };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private montarItens(itens: CriarCompraDto['itens']) {
    let valorProdutos = new Prisma.Decimal(0);
    let valorImpostos = new Prisma.Decimal(0);
    const criar = itens.map((i) => {
      const quantidade = new Prisma.Decimal(i.quantidade);
      const valorUnitario = new Prisma.Decimal(i.valorUnitario);
      const valorTotal = quantidade.mul(valorUnitario).toDecimalPlaces(2);
      valorProdutos = valorProdutos.plus(valorTotal);
      valorImpostos = valorImpostos
        .plus(i.valorIcms ?? 0)
        .plus(i.valorIpi ?? 0)
        .plus(i.valorPis ?? 0)
        .plus(i.valorCofins ?? 0);
      return {
        produtoId: i.produtoId,
        produtoNome: i.produtoNome,
        sku: i.sku,
        ncm: i.ncm,
        cfop: i.cfop,
        unidade: i.unidade ?? 'UN',
        quantidade,
        valorUnitario,
        valorTotal,
        valorIcms: new Prisma.Decimal(i.valorIcms ?? 0),
        valorIpi: new Prisma.Decimal(i.valorIpi ?? 0),
        valorPis: new Prisma.Decimal(i.valorPis ?? 0),
        valorCofins: new Prisma.Decimal(i.valorCofins ?? 0),
      };
    });
    return { itens: criar, valorProdutos, valorImpostos };
  }

  private async resolverDeposito(tenantId: string, depositoId?: string): Promise<string> {
    if (depositoId) {
      const dep = await this.prisma.deposito.findFirst({ where: { id: depositoId, tenantId } });
      if (!dep) throw new BadRequestException('Depósito não encontrado');
      return dep.id;
    }
    const principal = await this.prisma.deposito.findFirst({
      where: { tenantId, ativo: true },
      orderBy: { criadoEm: 'asc' },
    });
    if (!principal) {
      throw new BadRequestException(
        'Nenhum depósito ativo — cadastre um depósito antes de receber',
      );
    }
    return principal.id;
  }

  private formatarNumero(n: number) {
    return String(n).padStart(6, '0');
  }

  private paraNumero(v: Prisma.Decimal | null | undefined): number {
    return v ? Number(v.toFixed(2)) : 0;
  }

  private arredondar(v: number) {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }

  /** Decimal → number na fronteira (Decimal serializa como string no JSON). */
  private serializar(c: any) {
    return {
      id: c.id,
      numero: this.formatarNumero(c.numero),
      fornecedorId: c.fornecedorId,
      fornecedor: c.fornecedorNome,
      status: c.status,
      valorProdutos: this.paraNumero(c.valorProdutos),
      valorFrete: this.paraNumero(c.valorFrete),
      valorImpostos: this.paraNumero(c.valorImpostos),
      valorTotal: this.paraNumero(c.valorTotal),
      dataEmissao: c.dataEmissao,
      dataPrevistaEntrega: c.dataPrevistaEntrega,
      dataRecebimento: c.dataRecebimento,
      nfeNumero: c.nfeNumero,
      nfeSerie: c.nfeSerie,
      nfeChave: c.nfeChave,
      condicaoPagamento: c.condicaoPagamento,
      formaPagamento: c.formaPagamento,
      observacoes: c.observacoes,
      criadoEm: c.criadoEm,
      atualizadoEm: c.atualizadoEm,
      itens: (c.itens ?? []).map((i: any) => ({
        id: i.id,
        produtoId: i.produtoId,
        produto: i.produtoNome,
        sku: i.sku,
        ncm: i.ncm,
        cfop: i.cfop,
        unidade: i.unidade,
        quantidade: Number(i.quantidade),
        quantidadeRecebida: Number(i.quantidadeRecebida),
        valorUnitario: Number(i.valorUnitario),
        valorTotal: this.paraNumero(i.valorTotal),
        valorICMS: this.paraNumero(i.valorIcms),
        valorIPI: this.paraNumero(i.valorIpi),
        valorPIS: this.paraNumero(i.valorPis),
        valorCOFINS: this.paraNumero(i.valorCofins),
      })),
    };
  }
}
