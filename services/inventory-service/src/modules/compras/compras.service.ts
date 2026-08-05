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
import { CatalogClient, ProdutoBusca } from '../estoque/catalog.client';
import { CustomerClient, normalizarCnpj } from './customer.client';
import {
  CriarCompraDto,
  ReceberCompraDto,
  ListarComprasDto,
  ImportarNfeDto,
} from '../../dtos/compras/compras.dto';
import {
  AnalisarNfeDto,
  ConfirmarImportacaoNfeDto,
  DecisaoItemDto,
} from '../../dtos/compras/importacao-nfe.dto';
import { parseNFe, NFeParseada } from './nfe-parser.util';

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
    private readonly customer: CustomerClient,
  ) {}

  // ─── Consulta ───────────────────────────────────────────────────────────────

  async listar(tenantId: string, filtros: ListarComprasDto) {
    const { pagina = 1, limite = 20, status, busca, fornecedorId } = filtros;
    const where: Prisma.PedidoCompraWhereInput = { tenantId };
    if (status) where.status = status as StatusCompra;
    if (fornecedorId) where.fornecedorId = fornecedorId;
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
  // ─── Importação de NF-e (2 etapas: analisar → confirmar) ───────────────────

  /**
   * ETAPA 1 — ANALISAR. Lê o XML e devolve o que foi reconhecido para o usuário
   * conferir. NÃO grava NADA (nem pedido, nem fornecedor, nem produto, nem
   * vínculo): é seguro chamar quantas vezes quiser.
   *
   * Resolução do fornecedor: por CNPJ no customer-service. Achou → compara os
   * campos e lista as DIFERENÇAS (para o usuário decidir se atualiza o cadastro).
   *
   * Resolução de cada item, nesta ordem de prioridade:
   *   1. DE_PARA — vínculo salvo numa importação anterior (CNPJ + código do
   *      fornecedor). É decisão explícita do usuário, então vence tudo.
   *   2. SKU     — o código do fornecedor bate com o SKU do nosso catálogo.
   *   3. EAN     — o GTIN da nota bate com o GTIN do produto.
   * Sem match exato, devolve `candidatos` (busca por descrição) para a tela
   * sugerir opções em vez de obrigar o usuário a procurar do zero.
   */
  async analisarNfe(tenantId: string, dto: AnalisarNfeDto, authorization?: string) {
    const nfe = this.parsearOuFalhar(dto.xml);
    const cnpj = normalizarCnpj(nfe.fornecedor.cnpj);

    const [jaImportada, cadastroFornecedor, vinculos] = await Promise.all([
      this.prisma.pedidoCompra.findFirst({
        where: { tenantId, nfeChave: nfe.chave },
        select: { id: true, numero: true },
      }),
      this.customer.buscarPorCnpj(authorization, cnpj),
      cnpj
        ? this.prisma.vinculoProdutoFornecedor.findMany({
            where: {
              tenantId,
              fornecedorCnpj: cnpj,
              codigoFornecedor: { in: nfe.itens.map((i) => i.codigo).filter(Boolean) },
            },
          })
        : Promise.resolve([]),
    ]);

    const porCodigo = new Map(vinculos.map((v) => [v.codigoFornecedor, v]));

    // Busca no catálogo item a item, em lotes (a nota tem poucos itens; puxar o
    // catálogo inteiro não escala para tenants grandes).
    const itens = await this.emLotes(nfe.itens, 5, async (item) => {
      const vinculo = porCodigo.get(item.codigo);
      if (vinculo) {
        return {
          ...this.itemBase(item),
          status: 'VINCULADO' as const,
          origemVinculo: 'DE_PARA' as const,
          produto: {
            id: vinculo.produtoId,
            nome: vinculo.produtoNome ?? item.descricao,
            sku: vinculo.produtoSku ?? item.codigo,
          },
          candidatos: [],
        };
      }

      // Busca por CÓDIGO e por EAN separadamente: a busca do catálogo é
      // "contains" e limitada, então procurar só pelo cProd deixaria o match por
      // EAN inalcançável (o produto certo pode nem aparecer naquela página).
      const ean = this.eanValido(item.ean);
      const [achadosPorCodigo, achadosPorEan] = await Promise.all([
        item.codigo ? this.catalog.buscarProdutos(authorization, item.codigo) : Promise.resolve([]),
        ean ? this.catalog.buscarProdutos(authorization, ean) : Promise.resolve([]),
      ]);
      const achados = [
        ...achadosPorCodigo,
        ...achadosPorEan.filter((p) => !achadosPorCodigo.some((c) => c.id === p.id)),
      ];

      const porSku = achados.find(
        (p) => p.sku && p.sku.trim().toUpperCase() === item.codigo.trim().toUpperCase(),
      );
      const porEan =
        !porSku && ean
          ? achados.find((p) => this.eanValido(p.gtin) === ean)
          : undefined;
      const exato = porSku ?? porEan;

      if (exato) {
        return {
          ...this.itemBase(item),
          status: 'SUGERIDO' as const,
          origemVinculo: (porSku ? 'SKU' : 'EAN') as 'SKU' | 'EAN',
          produto: { id: exato.id, nome: exato.nome, sku: exato.sku },
          candidatos: [],
        };
      }

      // Sem match exato: oferece candidatos por descrição para a tela sugerir.
      const porDescricao =
        achados.length > 0
          ? achados
          : await this.catalog.buscarProdutos(authorization, item.descricao.slice(0, 40));
      return {
        ...this.itemBase(item),
        status: 'NAO_ENCONTRADO' as const,
        origemVinculo: null,
        produto: null,
        candidatos: porDescricao.slice(0, 5).map((p) => ({
          id: p.id,
          nome: p.nome,
          sku: p.sku,
        })),
      };
    });

    return {
      nfe: {
        chave: nfe.chave,
        numero: nfe.numero,
        serie: nfe.serie,
        dataEmissao: nfe.dataEmissao,
        naturezaOperacao: nfe.naturezaOperacao,
        formaPagamento: nfe.formaPagamento,
        totais: nfe.totais,
      },
      // Nota já importada não bloqueia a ANÁLISE (o usuário pode só querer
      // conferir), mas a confirmação recusa — a checagem é refeita lá.
      jaImportada: jaImportada
        ? { id: jaImportada.id, numero: this.formatarNumero(jaImportada.numero) }
        : null,
      fornecedor: {
        daNfe: nfe.fornecedor,
        status: cadastroFornecedor ? ('ENCONTRADO' as const) : ('NAO_ENCONTRADO' as const),
        cadastro: cadastroFornecedor,
        diferencas: cadastroFornecedor
          ? this.compararFornecedor(
              cadastroFornecedor as unknown as Record<string, unknown>,
              nfe.fornecedor,
            )
          : [],
      },
      itens,
      resumo: {
        totalItens: itens.length,
        vinculados: itens.filter((i) => i.status === 'VINCULADO').length,
        sugeridos: itens.filter((i) => i.status === 'SUGERIDO').length,
        semVinculo: itens.filter((i) => i.status === 'NAO_ENCONTRADO').length,
      },
    };
  }

  /**
   * ETAPA 2 — CONFIRMAR. Aplica as decisões do usuário e efetiva a importação.
   *
   * Ordem: (1) fornecedor, (2) produtos novos, (3) pedido + vínculos numa
   * transação local. Os passos 1 e 2 tocam OUTROS serviços e não participam da
   * transação do inventory: se o passo 3 falhar, o fornecedor/produto criados
   * permanecem (inofensivos e reaproveitáveis numa nova tentativa) — preferimos
   * isso a um rollback distribuído frágil.
   */
  async confirmarImportacaoNfe(
    tenantId: string,
    dto: ConfirmarImportacaoNfeDto,
    authorization?: string,
  ) {
    const nfe = this.parsearOuFalhar(dto.xml);
    const cnpj = normalizarCnpj(nfe.fornecedor.cnpj);

    // Revalida a dedup AGORA (a análise pode ter sido feita minutos atrás).
    const existente = await this.prisma.pedidoCompra.findFirst({
      where: { tenantId, nfeChave: nfe.chave },
      select: { numero: true },
    });
    if (existente) {
      throw new ConflictException(
        `NF-e já importada no pedido ${this.formatarNumero(existente.numero)}`,
      );
    }

    // ── 1) Fornecedor ────────────────────────────────────────────────────────
    const { fornecedorId, fornecedorNome, fornecedorAtualizado, fornecedorCriado } =
      await this.resolverFornecedor(dto.fornecedor, nfe, authorization);

    // ── 2) Itens: vincular / criar produto / ignorar ──────────────────────────
    const decisaoPorCodigo = new Map(dto.itens.map((d) => [d.codigo, d]));

    // VALIDA O LOTE INTEIRO ANTES de qualquer escrita: erro de contrato do
    // catálogo no 5º item deixaria os 4 primeiros criados e a nota sem pedido.
    this.validarDecisoesAntesDeGravar(nfe, decisaoPorCodigo);

    const itensParaPedido: CriarCompraDto['itens'] = [];
    const vinculosParaSalvar: Array<{
      codigo: string;
      produtoId: string;
      produtoSku: string;
      produtoNome: string;
      descricaoNfe: string;
    }> = [];
    const produtosCriados: Array<{ id: string; sku: string; nome: string }> = [];
    // Mesmo SKU pedido duas vezes na MESMA nota (cProd repetido em linhas `det`
    // distintas, comum quando muda lote/CFOP) cria UM produto e vincula as duas.
    const criadosNestaImportacao = new Map<string, ProdutoBusca>();

    for (const item of nfe.itens) {
      const decisao = decisaoPorCodigo.get(item.codigo);
      // Item sem decisão explícita entra sem produto (mesmo efeito de IGNORAR):
      // é conservador — não inventa vínculo que o usuário não confirmou.
      let produtoId: string | undefined;
      let produtoSku: string | undefined;
      let produtoNome: string | undefined;

      if (decisao?.acao === 'VINCULAR') {
        if (!decisao.produtoId) {
          throw new BadRequestException(
            `Item ${item.codigo}: ação VINCULAR exige produtoId.`,
          );
        }
        produtoId = decisao.produtoId;
        // O De-Para precisa do SKU/nome do NOSSO catálogo (não os do fornecedor,
        // senão a próxima conferência exibe o código do fornecedor como se fosse
        // o nosso produto). Busca best-effort: falhou, grava só o id.
        const doCatalogo = await this.catalog.buscarProdutoPorId(
          authorization,
          decisao.produtoId,
        );
        produtoSku = doCatalogo?.sku;
        produtoNome = doCatalogo?.nome;
      } else if (decisao?.acao === 'CRIAR') {
        const skuDesejado = (decisao.novoProduto?.sku ?? item.codigo).trim().toUpperCase();
        const jaCriado = criadosNestaImportacao.get(skuDesejado);
        const novo = jaCriado ?? (await this.criarProdutoDoItem(decisao, item, authorization));
        if (!jaCriado) {
          criadosNestaImportacao.set(skuDesejado, novo);
          produtosCriados.push({ id: novo.id, sku: novo.sku, nome: novo.nome });
        }
        produtoId = novo.id;
        produtoSku = novo.sku;
        produtoNome = novo.nome;
      }

      if (produtoId && decisao && decisao.salvarVinculo !== false && cnpj && item.codigo) {
        vinculosParaSalvar.push({
          codigo: item.codigo,
          produtoId,
          produtoSku: produtoSku ?? '',
          produtoNome: produtoNome ?? item.descricao,
          descricaoNfe: item.descricao,
        });
      }

      itensParaPedido.push({
        produtoId,
        produtoNome: item.descricao,
        sku: item.codigo,
        ncm: item.ncm || undefined,
        cfop: item.cfop || undefined,
        unidade: item.unidade,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorIcms: item.impostos.vICMS,
        valorIpi: item.impostos.vIPI,
        valorPis: item.impostos.vPIS,
        valorCofins: item.impostos.vCOFINS,
      });
    }

    // ── 3) Pedido de compra + De-Para ────────────────────────────────────────
    const compra = await this.criar(tenantId, {
      fornecedorId,
      fornecedorNome,
      status: 'AGUARDANDO_RECEBIMENTO',
      valorFrete: nfe.totais.valorFrete,
      formaPagamento: nfe.formaPagamento ?? undefined,
      observacoes: `Importado da NF-e ${nfe.numero}/${nfe.serie} — ${nfe.naturezaOperacao}`,
      itens: itensParaPedido,
    });

    // A chave é gravada logo após criar. O @@unique([tenantId, nfeChave]) é a
    // garantia real contra duplicidade (a checagem lá em cima é só para dar erro
    // amigável): se duas confirmações correrem juntas, a segunda bate P2002 aqui
    // e vira 409 em vez de gravar a mesma nota duas vezes.
    let comNfe;
    try {
      comNfe = await this.prisma.pedidoCompra.update({
        where: { id: compra.id },
        data: {
          nfeChave: nfe.chave,
          nfeNumero: nfe.numero,
          nfeSerie: nfe.serie,
          dataEmissao: nfe.dataEmissao ? new Date(nfe.dataEmissao) : undefined,
        },
        include: { itens: true },
      });
    } catch (erro) {
      if ((erro as { code?: string })?.code === 'P2002') {
        // Remove o pedido recém-criado que ficaria órfão (sem chave da NF-e).
        await this.prisma.pedidoCompra
          .delete({ where: { id: compra.id } })
          .catch(() => undefined);
        throw new ConflictException('NF-e já importada (importação simultânea detectada).');
      }
      throw erro;
    }

    // Vínculos por último: a falha aqui não pode derrubar uma importação que já
    // deu certo — o De-Para é conveniência para a PRÓXIMA nota.
    let vinculosSalvos = 0;
    for (const v of vinculosParaSalvar) {
      try {
        await this.prisma.vinculoProdutoFornecedor.upsert({
          where: {
            tenantId_fornecedorCnpj_codigoFornecedor: {
              tenantId,
              fornecedorCnpj: cnpj,
              codigoFornecedor: v.codigo,
            },
          },
          create: {
            tenantId,
            fornecedorCnpj: cnpj,
            codigoFornecedor: v.codigo,
            produtoId: v.produtoId,
            produtoSku: v.produtoSku,
            produtoNome: v.produtoNome,
            descricaoNfe: v.descricaoNfe,
          },
          update: {
            produtoId: v.produtoId,
            produtoSku: v.produtoSku,
            produtoNome: v.produtoNome,
            descricaoNfe: v.descricaoNfe,
          },
        });
        vinculosSalvos += 1;
      } catch (erro) {
        this.logger.warn(
          `Falha ao salvar vínculo ${cnpj}/${v.codigo}: ${
            erro instanceof Error ? erro.message : String(erro)
          }`,
        );
      }
    }

    const semProduto = comNfe.itens.filter((i) => !i.produtoId).length;
    this.logger.log(
      `NF-e ${nfe.numero}/${nfe.serie} importada no pedido ${this.formatarNumero(comNfe.numero)} ` +
        `(${tenantId}): ${produtosCriados.length} produto(s) criado(s), ${vinculosSalvos} vínculo(s), ` +
        `${semProduto} item(ns) sem produto`,
    );

    return {
      compra: this.serializar(comNfe),
      nfe: {
        chave: nfe.chave,
        numero: nfe.numero,
        serie: nfe.serie,
        dataEmissao: nfe.dataEmissao,
        naturezaOperacao: nfe.naturezaOperacao,
        fornecedor: nfe.fornecedor,
        totais: nfe.totais,
      },
      fornecedor: {
        id: fornecedorId ?? null,
        nome: fornecedorNome,
        criado: fornecedorCriado,
        atualizado: fornecedorAtualizado,
      },
      produtosCriados,
      vinculosSalvos,
      itensTotal: comNfe.itens.length,
      itensSemProduto: semProduto,
      aviso:
        semProduto > 0
          ? `${semProduto} item(ns) ficaram sem produto no catálogo: o recebimento deles não movimentará o estoque.`
          : null,
    };
  }

  // ─── Helpers da importação ──────────────────────────────────────────────────

  private parsearOuFalhar(xml: string): NFeParseada {
    const nfe = parseNFe(xml);
    if (!nfe || !nfe.itens.length) {
      throw new BadRequestException(
        'XML inválido ou sem itens — envie o XML completo da NF-e (layout 4.00)',
      );
    }
    return nfe;
  }

  /** Campos do item que a tela exibe na conferência (fatos do XML). */
  private itemBase(item: NFeParseada['itens'][number]) {
    return {
      codigo: item.codigo,
      ean: item.ean,
      descricao: item.descricao,
      ncm: item.ncm,
      cfop: item.cfop,
      unidade: item.unidade,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotal: item.valorTotal,
    };
  }

  /** Executa `fn` sobre a lista em lotes de `tamanho` (limita concorrência). */
  private async emLotes<T, R>(
    itens: T[],
    tamanho: number,
    fn: (item: T) => Promise<R>,
  ): Promise<R[]> {
    const saida: R[] = [];
    for (let i = 0; i < itens.length; i += tamanho) {
      const lote = itens.slice(i, i + tamanho);
      saida.push(...(await Promise.all(lote.map(fn))));
    }
    return saida;
  }

  /**
   * Diferenças entre o cadastro e a NF-e. Só reporta campo em que a NOTA tem
   * valor e ele difere do cadastro — "atualizar para vazio" nunca é sugerido.
   * Endereço fica de fora: mora em tabela própria no customer-service e a v1
   * não o compara (só o envia ao CRIAR um fornecedor novo).
   */
  private compararFornecedor(
    cadastro: Record<string, unknown>,
    daNfe: NFeParseada['fornecedor'],
  ) {
    const soDigitos = (v: unknown) => String(v ?? '').replace(/\D/g, '');
    const texto = (v: unknown) => String(v ?? '').trim();

    const campos: Array<{
      campo: string;
      label: string;
      valorCadastro: string;
      valorNfe: string;
      igual: boolean;
    }> = [
      {
        campo: 'razaoSocial',
        label: 'Razão social',
        valorCadastro: texto(cadastro.razaoSocial),
        valorNfe: texto(daNfe.razaoSocial),
        igual:
          texto(cadastro.razaoSocial).toUpperCase() === texto(daNfe.razaoSocial).toUpperCase(),
      },
      {
        campo: 'nomeFantasia',
        label: 'Nome fantasia',
        valorCadastro: texto(cadastro.nomeFantasia),
        valorNfe: texto(daNfe.nomeFantasia),
        igual:
          texto(cadastro.nomeFantasia).toUpperCase() === texto(daNfe.nomeFantasia).toUpperCase(),
      },
      {
        campo: 'inscricaoEstadual',
        label: 'Inscrição estadual',
        valorCadastro: texto(cadastro.inscricaoEstadual),
        valorNfe: texto(daNfe.inscricaoEstadual),
        igual:
          soDigitos(cadastro.inscricaoEstadual) === soDigitos(daNfe.inscricaoEstadual),
      },
      {
        campo: 'telefone',
        label: 'Telefone',
        valorCadastro: texto(cadastro.telefone),
        valorNfe: texto(daNfe.telefone),
        igual: soDigitos(cadastro.telefone) === soDigitos(daNfe.telefone),
      },
      {
        campo: 'email',
        label: 'E-mail',
        valorCadastro: texto(cadastro.email),
        valorNfe: texto(daNfe.email),
        igual: texto(cadastro.email).toLowerCase() === texto(daNfe.email).toLowerCase(),
      },
    ];

    return campos
      .filter((c) => c.valorNfe !== '' && !c.igual)
      .map(({ campo, label, valorCadastro, valorNfe }) => ({
        campo,
        label,
        valorCadastro,
        valorNfe,
      }));
  }

  /** Aplica a decisão de fornecedor (usar / criar / atualizar). */
  private async resolverFornecedor(
    decisao: ConfirmarImportacaoNfeDto['fornecedor'],
    nfe: NFeParseada,
    authorization?: string,
  ): Promise<{
    fornecedorId?: string;
    fornecedorNome: string;
    fornecedorCriado: boolean;
    fornecedorAtualizado: boolean;
  }> {
    const nomeDaNfe =
      nfe.fornecedor.razaoSocial || nfe.fornecedor.nomeFantasia || 'Fornecedor NF-e';

    if (decisao.acao === 'CRIAR') {
      const cnpj = normalizarCnpj(nfe.fornecedor.cnpj);
      const criado = await this.customer.criarFornecedor(authorization, {
        tipo: 'PESSOA_JURIDICA',
        papeis: ['FORNECEDOR'],
        nome: nfe.fornecedor.nomeFantasia || nomeDaNfe,
        razaoSocial: nfe.fornecedor.razaoSocial || undefined,
        nomeFantasia: nfe.fornecedor.nomeFantasia || undefined,
        cnpj: cnpj || undefined,
        inscricaoEstadual: nfe.fornecedor.inscricaoEstadual || undefined,
        telefone: nfe.fornecedor.telefone || undefined,
        // O customer-service exige e-mail (único por tenant) e a NF-e quase nunca
        // traz o do emitente: sem ele, gera um marcador rastreável pelo CNPJ em
        // vez de barrar a importação. A tela permite informar o real.
        email:
          nfe.fornecedor.email ||
          `nfe.${cnpj || 'sem-cnpj'}@fornecedor.naoinformado`,
        origem: 'IMPORTACAO',
        status: 'ATIVO',
        endereco: nfe.fornecedor.endereco?.logradouro
          ? {
              logradouro: nfe.fornecedor.endereco.logradouro,
              numero: nfe.fornecedor.endereco.numero || undefined,
              complemento: nfe.fornecedor.endereco.complemento || undefined,
              bairro: nfe.fornecedor.endereco.bairro || undefined,
              cidade: nfe.fornecedor.endereco.cidade || undefined,
              estado: nfe.fornecedor.endereco.uf || undefined,
              cep: nfe.fornecedor.endereco.cep || undefined,
            }
          : undefined,
      });
      return {
        fornecedorId: criado?.id,
        fornecedorNome: criado?.nome || nomeDaNfe,
        fornecedorCriado: true,
        fornecedorAtualizado: false,
      };
    }

    if (!decisao.clienteId) {
      throw new BadRequestException(
        'Informe o fornecedor do cadastro (clienteId) ou escolha criar um novo.',
      );
    }

    if (decisao.acao === 'ATUALIZAR') {
      const permitidos = new Set([
        'razaoSocial',
        'nomeFantasia',
        'inscricaoEstadual',
        'telefone',
        'email',
      ]);
      const valores: Record<string, string> = {
        razaoSocial: nfe.fornecedor.razaoSocial,
        nomeFantasia: nfe.fornecedor.nomeFantasia,
        inscricaoEstadual: nfe.fornecedor.inscricaoEstadual,
        telefone: nfe.fornecedor.telefone,
        email: nfe.fornecedor.email,
      };
      const patch: Record<string, string> = {};
      for (const campo of decisao.camposAtualizar ?? []) {
        // `cnpj`/`tipo` são imutáveis no customer-service (nem constam do DTO de
        // update): mandá-los daria 400 por forbidNonWhitelisted.
        if (permitidos.has(campo) && valores[campo]) patch[campo] = valores[campo];
      }
      if (Object.keys(patch).length > 0) {
        const atualizado = await this.customer.atualizarFornecedor(
          authorization,
          decisao.clienteId,
          patch,
        );
        return {
          fornecedorId: decisao.clienteId,
          fornecedorNome: atualizado?.nome || nomeDaNfe,
          fornecedorCriado: false,
          fornecedorAtualizado: true,
        };
      }
    }

    // USAR_EXISTENTE (ou ATUALIZAR sem campo válido a gravar).
    // Busca pelo ID ESCOLHIDO — não pelo CNPJ da nota: o usuário pode ter
    // vinculado deliberadamente a outro parceiro (representante, matriz), e
    // buscar por CNPJ gravaria o nome de um cadastro diferente do escolhido.
    const escolhido = await this.customer.buscarPorId(authorization, decisao.clienteId);
    return {
      fornecedorId: decisao.clienteId,
      fornecedorNome: escolhido?.nome || nomeDaNfe,
      fornecedorCriado: false,
      fornecedorAtualizado: false,
    };
  }

  /**
   * Cria no catálogo o produto de um item da nota.
   *
   * O CriarProdutoDto do catalog-service exige campos que a NF-e não traz
   * (descrição com 10+ caracteres, peso e dimensões com mínimo, categoria).
   * Preenchemos defaults explícitos e conservadores; o usuário ajusta depois na
   * ficha do produto. Preços vão em REAIS (ver nota em CatalogClient.criarProduto).
   */
  private async criarProdutoDoItem(
    decisao: DecisaoItemDto,
    item: NFeParseada['itens'][number],
    authorization?: string,
  ): Promise<ProdutoBusca> {
    const novo = decisao.novoProduto;
    if (!novo?.nome || !novo?.sku) {
      throw new BadRequestException(
        `Item ${item.codigo}: para CRIAR o produto informe ao menos nome e sku.`,
      );
    }
    if (!novo.categoriaId) {
      throw new BadRequestException(
        `Item ${item.codigo}: escolha a categoria do produto novo.`,
      );
    }

    const sku = novo.sku.trim().slice(0, 50);

    // IDEMPOTÊNCIA: se o SKU já existe no catálogo, REUSA em vez de criar. Sem
    // isso, uma confirmação que falhou no meio (deixando produtos criados) nunca
    // mais concluía: a retentativa batia em "SKU já cadastrado" no primeiro item.
    const existentes = await this.catalog.buscarProdutos(authorization, sku);
    const mesmoSku = existentes.find((p) => p.sku?.trim().toUpperCase() === sku.toUpperCase());
    if (mesmoSku) return mesmoSku;

    const descricao =
      novo.nome.length >= 10
        ? novo.nome
        : `${novo.nome} — importado da NF-e ${item.codigo}`.slice(0, 300);

    return this.catalog.criarProduto(authorization, {
      sku,
      nome: novo.nome,
      descricao,
      categoriaId: novo.categoriaId,
      marcaId: novo.marcaId || undefined,
      // `cEAN` costuma vir "SEM GTIN" quando não há código de barras: gravar
      // isso como gtin faria a PRÓXIMA nota casar produtos aleatórios por EAN.
      gtin: this.eanValido(novo.ean) ?? this.eanValido(item.ean) ?? undefined,
      ncm: (novo.ncm || item.ncm || '00000000').replace(/\D/g, '').slice(0, 8) || '00000000',
      origem: 0,
      precoCusto: this.dinheiro(novo.precoCusto ?? item.valorUnitario, 4),
      // O catálogo exige precoVenda >= 1. Espelhar o custo quebraria em item
      // barato (parafuso a R$ 0,35) ou bonificação (R$ 0) e derrubaria a nota
      // inteira; o piso de R$ 1,00 mantém a importação viável e é visível na tela.
      precoVenda: Math.max(
        1,
        this.dinheiro(
          novo.precoVenda && novo.precoVenda > 0 ? novo.precoVenda : item.valorUnitario,
          2,
        ),
      ),
      unidadeMedida: (novo.unidade || item.unidade || 'UN').slice(0, 10),
      // Defaults mínimos aceitos pelo catálogo (a NF-e não traz logística).
      peso: 1,
      altura: 1,
      largura: 1,
      comprimento: 1,
      status: 'ATIVO',
    });
  }

  /** GTIN só é válido se for numérico com 8/12/13/14 dígitos (senão "SEM GTIN"). */
  private eanValido(valor: string | null | undefined): string | undefined {
    const so = String(valor ?? '').replace(/\D/g, '');
    return [8, 12, 13, 14].includes(so.length) ? so : undefined;
  }

  /** Arredonda para N casas — o vUnCom da NF-e tem até 10 e reprovaria no DTO. */
  private dinheiro(valor: number, casas: number): number {
    const n = Number(valor);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.round(n * 10 ** casas) / 10 ** casas;
  }

  /**
   * Valida TODAS as decisões antes de escrever qualquer coisa. Erros de contrato
   * do catálogo (SKU longo, sem categoria, nome vazio) viram um único 400 com a
   * lista completa — em vez de meia nota criada e um 502 no meio do caminho.
   */
  private validarDecisoesAntesDeGravar(
    nfe: NFeParseada,
    decisoes: Map<string, DecisaoItemDto>,
  ): void {
    const erros: string[] = [];
    for (const item of nfe.itens) {
      const d = decisoes.get(item.codigo);
      if (d?.acao === 'VINCULAR' && !d.produtoId) {
        erros.push(`Item ${item.codigo}: escolha o produto do catálogo.`);
      }
      if (d?.acao === 'CRIAR') {
        const novo = d.novoProduto;
        if (!novo?.nome?.trim()) erros.push(`Item ${item.codigo}: informe o nome do produto.`);
        if (!novo?.sku?.trim()) erros.push(`Item ${item.codigo}: informe o SKU do produto.`);
        if (novo?.sku && novo.sku.trim().length > 50) {
          erros.push(
            `Item ${item.codigo}: SKU tem ${novo.sku.trim().length} caracteres (máximo 50).`,
          );
        }
        if (!novo?.categoriaId) {
          erros.push(`Item ${item.codigo}: escolha a categoria do produto novo.`);
        }
      }
    }
    if (erros.length > 0) {
      throw new BadRequestException(erros);
    }
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
