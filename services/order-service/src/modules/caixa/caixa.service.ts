/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Caixa (sessão de PDV / balcão)
 * ═══════════════════════════════════════════════════════════════
 *
 * Regras:
 * - No máximo UMA sessão ABERTO por tenant (check + trava unique no banco).
 * - saldoEsperado = valorAbertura + entradas - saídas (tudo em Decimal, sem float).
 *   É o MOVIMENTO TOTAL DO TURNO (todas as formas) e serve só para exibição —
 *   NÃO participa da conferência.
 * - saldoEsperadoDinheiro = o que se espera FISICAMENTE NA GAVETA. É contra ele
 *   que o valor contado é conferido: diferenca = valorContado - saldoEsperadoDinheiro
 *   (e valorEsperado guarda o mesmo saldoEsperadoDinheiro como snapshot).
 *   Conferir contra o saldo de todas as formas faria uma loja com R$ 3.000 em
 *   cartão fechar acusando falta de R$ 3.000 todo dia.
 * - Sessão FECHADO não aceita movimentação.
 * - Totais (entradas/saídas/saldo/por forma) são DERIVADOS, nunca persistidos.
 *
 * Fronteira da API: todo Decimal vira `number` antes de sair. O Prisma
 * serializa Decimal como STRING no JSON e as telas chamam `.toLocaleString()`
 * direto no valor — string quebraria o front.
 */

import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import { CaixaRepository, AgregadoMovimentacao } from './caixa.repository';
import { PrismaService, ClientePrisma } from '../prisma/prisma.service';
import {
  SessaoCaixa,
  MovimentacaoCaixa,
  StatusSessaoCaixa,
  TipoMovimentacaoCaixa,
  CategoriaMovimentacaoCaixa,
  TipoPagamento,
} from '../../../generated/client';
import {
  AbrirCaixaDto,
  FecharCaixaDto,
  RegistrarMovimentacaoCaixaDto,
  ListarSessoesCaixaDto,
} from '../../dtos/caixa.dto';

/**
 * A categoria determina o sinal da movimentação. `OUTROS` é a única sem sinal
 * fixo (a UI a oferece como "Outra Movimentação" sem pedir o sinal) — para ela
 * respeitamos o `tipo` enviado e, na ausência, assumimos ENTRADA.
 *
 * DIVERGÊNCIA PROPOSITAL do mock (`api/v1/caixa/[id]/movimentacoes/route.ts`),
 * que classificava REEMBOLSO como ENTRADA: reembolso é dinheiro devolvido ao
 * cliente, portanto SAI da gaveta. Como ENTRADA, inflaria o saldo esperado e
 * geraria falta no fechamento. Nenhum dado real foi produzido pelo mock com
 * essa categoria (nada a migrar).
 */
const MAPA_TIPO_POR_CATEGORIA: Record<string, TipoMovimentacaoCaixa | null> = {
  VENDA: TipoMovimentacaoCaixa.ENTRADA,
  SUPRIMENTO: TipoMovimentacaoCaixa.ENTRADA,
  REEMBOLSO: TipoMovimentacaoCaixa.SAIDA,
  SANGRIA: TipoMovimentacaoCaixa.SAIDA,
  DESPESA: TipoMovimentacaoCaixa.SAIDA,
  OUTROS: null,
};

/**
 * O QUE CONTA COMO DINHEIRO NA GAVETA (base da conferência de fechamento):
 *
 *   saldoEsperadoDinheiro = valorAbertura
 *                         + VENDA (formaPagamento = DINHEIRO)
 *                         + SUPRIMENTO
 *                         - SANGRIA
 *                         - DESPESA (dinheiro)
 *                         - REEMBOLSO (dinheiro)
 *                         ± OUTROS (dinheiro, sinal pelo `tipo`)
 *
 * Duas classes de categoria:
 *
 * - SUPRIMENTO e SANGRIA são operações de GAVETA por definição (aporte de troco
 *   / retirada física). Contam como dinheiro qualquer que seja a forma enviada —
 *   "sangria via PIX" não existe: isso seria uma transferência, não uma sangria.
 *
 * - VENDA, DESPESA, REEMBOLSO e OUTROS dependem da FORMA: só entram na gaveta
 *   quando `formaPagamento = DINHEIRO`. Venda no cartão/PIX é liquidada pelo
 *   adquirente e nunca passa pela gaveta; reembolso de venda no cartão volta
 *   pelo cartão. Sem forma explícita, ficam FORA — o conservador aqui é não
 *   inflar nem deflar o esperado com um lançamento de origem ambígua (o front
 *   sempre envia a forma, com DINHEIRO como padrão).
 */
const CATEGORIAS_SEMPRE_DINHEIRO: ReadonlySet<CategoriaMovimentacaoCaixa> = new Set([
  CategoriaMovimentacaoCaixa.SUPRIMENTO,
  CategoriaMovimentacaoCaixa.SANGRIA,
]);

function ehDinheiroNaGaveta(
  categoria: CategoriaMovimentacaoCaixa,
  formaPagamento: TipoPagamento | null,
): boolean {
  if (CATEGORIAS_SEMPRE_DINHEIRO.has(categoria)) return true;
  return formaPagamento === TipoPagamento.DINHEIRO;
}

const CAIXA_PADRAO = 'Caixa 01';
const ZERO = new Decimal(0);

/**
 * Teto de movimentações devolvidas pelo GET /caixa/atual, que a tela consulta em
 * polling. Os totais vêm do agregado (todas as linhas), então este corte afeta
 * só a lista exibida — nunca um número.
 */
const LIMITE_MOVIMENTACOES_ATUAL = 50;

/** Totais derivados de uma sessão. */
interface TotaisSessao {
  totalEntradas: Decimal;
  totalSaidas: Decimal;
  entradasDinheiro: Decimal;
  saidasDinheiro: Decimal;
  qtdMovimentacoes: number;
  porForma: Map<string, { entradas: Decimal; saidas: Decimal; quantidade: number }>;
}

export interface DadosVendaCaixa {
  pagamentoId: string;
  pedidoId: string;
  pedidoNumero?: number | null;
  valor: Decimal;
  formaPagamento?: TipoPagamento | null;
  descricaoComplementar?: string | null;
  operador?: string | null;
}

@Injectable()
export class CaixaService {
  constructor(
    private readonly repo: CaixaRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ─── Consultas ──────────────────────────────────────────────

  /**
   * Sessão aberta do tenant + movimentações.
   *
   * SEMPRE 200 — quando não há caixa aberto devolve `{ aberto: false, sessao: null }`.
   * Um 404 aqui quebraria o guard do PDV, que checa `caixaAtual?.aberto`.
   *
   * A sessão é do TENANT, não do usuário logado (o contrato não recebe operador).
   */
  async obterAtual(tenantId: string) {
    const sessao = await this.repo.buscarSessaoAberta(this.prisma, tenantId);
    if (!sessao) {
      return { aberto: false, sessao: null, movimentacoes: [] };
    }

    // Totais do AGREGADO (todas as movimentações) + lista cortada nas mais
    // recentes. Os dois juntos, sempre: derivar os totais da lista cortada
    // devolveria totais falsos — o saldo esperado é dinheiro de verdade.
    const [movimentacoes, agregados] = await Promise.all([
      this.repo.listarMovimentacoes(
        this.prisma,
        tenantId,
        sessao.id,
        LIMITE_MOVIMENTACOES_ATUAL,
      ),
      this.repo.agregarMovimentacoes(this.prisma, tenantId, [sessao.id]),
    ]);
    const totais = this.calcularTotais(agregados);

    return {
      aberto: true,
      sessao: this.serializarSessao(sessao, totais),
      movimentacoes: movimentacoes.map((m) => this.serializarMovimentacao(m)),
    };
  }

  /** Histórico paginado, mais recente primeiro. */
  async listar(tenantId: string, filtros: ListarSessoesCaixaDto) {
    const { sessoes, total, pagina, limite } = await this.repo.listarSessoes(tenantId, filtros);

    const agregados = await this.repo.agregarMovimentacoes(
      this.prisma,
      tenantId,
      sessoes.map((s) => s.id),
    );
    const porSessao = this.agruparAgregados(agregados);

    return {
      sessoes: sessoes.map((s) =>
        this.serializarSessao(s, this.calcularTotais(porSessao.get(s.id))),
      ),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Detalhe da sessão: totais do agregado (mesma fonte do fechamento, portanto
   * `saldoEsperadoDinheiro` e `totaisPorForma` batem com a conferência) e a
   * lista completa de movimentações — esta é a tela de auditoria do turno, não
   * faz polling.
   */
  async buscarPorId(tenantId: string, id: string) {
    const sessao = await this.exigirSessao(tenantId, id);
    const [movimentacoes, agregados] = await Promise.all([
      this.repo.listarMovimentacoes(this.prisma, tenantId, id),
      this.repo.agregarMovimentacoes(this.prisma, tenantId, [id]),
    ]);
    const totais = this.calcularTotais(agregados);

    return {
      sessao: this.serializarSessao(sessao, totais),
      movimentacoes: movimentacoes.map((m) => this.serializarMovimentacao(m)),
    };
  }

  // ─── Abertura ───────────────────────────────────────────────

  /**
   * Abre um turno. 409 se já houver caixa aberto no tenant.
   *
   * O check da aplicação evita o caso comum; a garantia dura é a coluna
   * `travaCaixaAberto` (unique), que também cobre duas aberturas simultâneas.
   */
  async abrir(tenantId: string, dto: AbrirCaixaDto, operadorId?: string) {
    const aberta = await this.repo.buscarSessaoAberta(this.prisma, tenantId);
    if (aberta) {
      throw new ConflictException(
        `Já existe um caixa aberto (${aberta.numero}, ${aberta.caixa}). Feche-o antes de abrir outro.`,
      );
    }

    const sessao = await this.criarSessaoComNumero(tenantId, dto, operadorId);

    // Sessão recém-aberta não tem movimentação — totais zerados.
    return this.serializarSessao(sessao, this.calcularTotais(undefined));
  }

  /**
   * Emite o número (CAIXA-AAAA-NNN, sequencial por tenant/ano) e cria a sessão.
   * A leitura do último número e o insert correm na mesma transação; ainda assim
   * duas transações concorrentes podem ler o mesmo "último" e colidir no unique
   * [tenantId, numero] — daí o retry. Colisão da trava (dois ABERTO) NÃO é
   * retentável: vira 409.
   */
  private async criarSessaoComNumero(
    tenantId: string,
    dto: AbrirCaixaDto,
    operadorId?: string,
  ): Promise<SessaoCaixa> {
    const maxTentativas = 5;

    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const numero = await this.gerarNumero(tx, tenantId);
          return this.repo.criarSessao(tx, tenantId, {
            numero,
            caixa: dto.caixa?.trim() || CAIXA_PADRAO,
            operador: dto.operador.trim(),
            operadorId,
            valorAbertura: new Decimal(dto.valorAbertura),
            observacoesAbertura: dto.observacoes,
          });
        });
      } catch (erro: any) {
        if (erro?.code !== 'P2002') throw erro;

        const alvo = String(erro?.meta?.target ?? '');
        if (alvo.includes('trava_caixa_aberto')) {
          throw new ConflictException(
            'Já existe um caixa aberto para esta empresa. Feche-o antes de abrir outro.',
          );
        }
        if (tentativa === maxTentativas) throw erro;
        // Colisão de numeração: recalcula o próximo número e tenta de novo.
      }
    }

    // Inalcançável: o loop ou retorna ou relança na última tentativa.
    throw new ConflictException('Não foi possível gerar o número do caixa. Tente novamente.');
  }

  private async gerarNumero(cliente: ClientePrisma, tenantId: string) {
    const prefixo = `CAIXA-${new Date().getFullYear()}-`;
    const ultimo = await this.repo.buscarUltimoNumero(cliente, tenantId, prefixo);

    const sequenciaAtual = ultimo ? Number.parseInt(ultimo.slice(prefixo.length), 10) : 0;
    const proxima = (Number.isFinite(sequenciaAtual) ? sequenciaAtual : 0) + 1;

    return `${prefixo}${String(proxima).padStart(3, '0')}`;
  }

  // ─── Fechamento ─────────────────────────────────────────────

  /**
   * Fecha o turno conferindo o valor contado contra o DINHEIRO esperado na
   * gaveta (`saldoEsperadoDinheiro`) — nunca contra o movimento total do turno,
   * que inclui cartão e PIX. 404 se a sessão não existe no tenant; 422 se já
   * está fechada.
   *
   * TUDO numa transação, com a linha da sessão travada (FOR UPDATE) ANTES de ler
   * as movimentações: a leitura dos lançamentos, o cálculo da diferença e o
   * UPDATE do fechamento precisam enxergar o mesmo conjunto de movimentações.
   * Sem o lock, uma venda concorrente que entrasse entre a leitura e a gravação
   * ficaria órfã numa sessão FECHADO — fora da conferência e sem erro nenhum.
   * Com o lock, ela entra antes (e é contada) ou encontra a sessão já FECHADO e
   * cai no caminho "não lançada" de `registrarVenda`, que o design tolera.
   */
  async fechar(tenantId: string, id: string, dto: FecharCaixaDto) {
    return this.prisma.$transaction(async (tx) => {
      const travada = await this.repo.travarSessao(tx, tenantId, id);
      if (!travada) throw new NotFoundException('Sessão de caixa não encontrada');
      if (travada.status === StatusSessaoCaixa.FECHADO) {
        throw new UnprocessableEntityException(`O caixa ${travada.numero} já está fechado`);
      }

      const sessao = await this.repo.buscarSessaoPorId(tx, tenantId, id);
      if (!sessao) throw new NotFoundException('Sessão de caixa não encontrada');

      // Sob o lock: nenhuma movimentação nova entra nesta sessão até o commit.
      const agregados = await this.repo.agregarMovimentacoes(tx, tenantId, [id]);
      const totais = this.calcularTotais(agregados);

      // A conferência é da GAVETA. `saldoEsperado` (todas as formas) continua no
      // contrato, para exibição, mas não entra nesta conta.
      const saldoEsperadoDinheiro = this.saldoEsperadoDinheiro(sessao, totais);
      const valorContado = new Decimal(dto.valorContado);
      const diferenca = valorContado.minus(saldoEsperadoDinheiro);

      const linhas = await this.repo.fecharSessao(tx, tenantId, id, {
        valorContado,
        // Snapshot de auditoria: o que se esperava NA GAVETA.
        valorEsperado: saldoEsperadoDinheiro,
        diferenca,
        observacoesFechamento: dto.observacoes,
      });

      // Redundante sob o lock (o FOR UPDATE já serializou os fechamentos), mas
      // mantido: é a proteção de fundo contra duplo fechamento.
      if (linhas === 0) {
        throw new UnprocessableEntityException(`O caixa ${sessao.numero} já está fechado`);
      }

      const atualizada = await this.repo.buscarSessaoPorId(tx, tenantId, id);
      if (!atualizada) throw new NotFoundException('Sessão de caixa não encontrada');

      return this.serializarSessao(atualizada, totais);
    });
  }

  // ─── Movimentações manuais ──────────────────────────────────

  /**
   * Suprimento / sangria / despesa / outros. 422 se a sessão estiver fechada.
   *
   * Mesma trava do `registrarVenda` e pelo mesmo motivo: uma sangria que caísse
   * entre a leitura do fechamento e a gravação sumiria da conferência. O check
   * de status só é confiável sob o lock — sem ele, a sessão pode fechar entre o
   * `if` e o `create`.
   */
  async registrarMovimentacao(
    tenantId: string,
    sessaoId: string,
    dto: RegistrarMovimentacaoCaixaDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const sessao = await this.repo.travarSessao(tx, tenantId, sessaoId);
      if (!sessao) throw new NotFoundException('Sessão de caixa não encontrada');
      if (sessao.status === StatusSessaoCaixa.FECHADO) {
        throw new UnprocessableEntityException(
          `O caixa ${sessao.numero} está fechado e não aceita movimentações`,
        );
      }

      const categoria = dto.categoria as CategoriaMovimentacaoCaixa;
      const tipoFixo = MAPA_TIPO_POR_CATEGORIA[dto.categoria];
      const tipo = tipoFixo ?? (dto.tipo as TipoMovimentacaoCaixa) ?? TipoMovimentacaoCaixa.ENTRADA;

      const movimentacao = await this.repo.criarMovimentacao(tx, tenantId, {
        sessaoId,
        tipo,
        categoria,
        descricao: dto.descricao.trim(),
        valor: new Decimal(dto.valor),
        formaPagamento: (dto.formaPagamento as TipoPagamento) ?? undefined,
        pedidoNumero: dto.pedidoNumero,
        // Sem operador no corpo, assume o dono do turno.
        operador: dto.operador?.trim() || sessao.operador,
      });

      return this.serializarMovimentacao(movimentacao);
    });
  }

  // ─── Integração com a venda ─────────────────────────────────

  /**
   * Lança a VENDA no caixa a partir de um pagamento aprovado.
   *
   * Chamado pelo PagamentoService DENTRO da transação que grava o Pagamento —
   * caixa e venda nunca divergem.
   *
   * SEM CAIXA ABERTO: devolve `null` e NÃO lança exceção. O Pagamento é a fonte
   * da verdade e já foi gravado; a movimentação é apenas a projeção no caixa
   * físico. Derrubar a venda por causa de um detalhe de turno seria pior do que
   * ficar com o pagamento não conciliado — ele continua rastreável pelo pedido.
   *
   * O PDV já bloqueia venda sem caixa aberto, então na prática este caminho só
   * ocorre em recebimento fora do turno.
   *
   * TRAVA a linha da sessão (a MESMA que `fechar` trava) antes de inserir: ou
   * esta venda entra antes do fechamento e é conferida, ou o fechamento commita
   * primeiro, a sessão deixa de estar ABERTO e caímos no `null` acima. O que não
   * pode acontecer é a venda cair numa sessão FECHADO e sumir da conferência.
   */
  async registrarVenda(
    cliente: ClientePrisma,
    tenantId: string,
    dados: DadosVendaCaixa,
  ): Promise<MovimentacaoCaixa | null> {
    const sessao = await this.repo.travarSessaoAberta(cliente, tenantId);
    if (!sessao) return null;

    const descricao = [
      dados.pedidoNumero ? `Venda balcão #${dados.pedidoNumero}` : 'Venda balcão',
      dados.descricaoComplementar?.trim(),
    ]
      .filter(Boolean)
      .join(' — ');

    // [pagamentoId, categoria] é unique: retry/reprocessamento não duplica o
    // lançamento. O PDV chama o endpoint uma vez POR FORMA de pagamento, e cada
    // Pagamento vira exatamente uma VENDA — que é o comportamento correto.
    return this.repo.criarMovimentacao(cliente, tenantId, {
      sessaoId: sessao.id,
      tipo: TipoMovimentacaoCaixa.ENTRADA,
      categoria: CategoriaMovimentacaoCaixa.VENDA,
      descricao,
      valor: dados.valor,
      formaPagamento: dados.formaPagamento ?? undefined,
      pedidoId: dados.pedidoId,
      pedidoNumero: dados.pedidoNumero != null ? String(dados.pedidoNumero) : undefined,
      pagamentoId: dados.pagamentoId,
      operador: dados.operador?.trim() || sessao.operador,
    });
  }

  /**
   * Lança o REEMBOLSO no caixa a partir do estorno de um pagamento.
   *
   * Estorno de venda em dinheiro TIRA dinheiro da gaveta. Sem este lançamento o
   * fechamento acusaria falta do valor devolvido.
   *
   * A SAÍDA vai para a sessão ABERTA no momento do estorno — que pode não ser a
   * sessão da venda original (estorno de ontem sai da gaveta de hoje). Herda a
   * `formaPagamento` da VENDA original: estorno de cartão vira REEMBOLSO/CARTÃO
   * e, por não ser dinheiro, não mexe no esperado da gaveta — mas fica no
   * extrato e nos totais por forma.
   *
   * Devolve `null` (sem exceção, mesma tolerância do `registrarVenda`) quando:
   * - o pagamento nunca virou VENDA no caixa (marketplace, ou venda sem turno);
   * - não há caixa aberto agora — o estorno é soberano e não pode falhar por
   *   causa de um detalhe de turno;
   * - o REEMBOLSO desse pagamento já existe (idempotência).
   */
  async registrarEstorno(
    cliente: ClientePrisma,
    tenantId: string,
    pagamentoId: string,
    motivo?: string | null,
  ): Promise<MovimentacaoCaixa | null> {
    const venda = await this.repo.buscarMovimentacaoPorPagamento(
      cliente,
      tenantId,
      pagamentoId,
      CategoriaMovimentacaoCaixa.VENDA,
    );
    if (!venda) return null;

    // Mesma trava do fechamento: o reembolso entra antes do fechar ou não entra.
    // Ela também serializa dois estornos simultâneos do mesmo pagamento (só há
    // UMA sessão ABERTO por tenant), o que torna a checagem abaixo confiável.
    const sessao = await this.repo.travarSessaoAberta(cliente, tenantId);
    if (!sessao) return null;

    // Idempotência: reestornar devolveria dinheiro duas vezes. Checagem prévia
    // em vez de catch de P2002 — dentro do $transaction a violação de unique
    // abortaria a transação e levaria o estorno junto. O unique composto
    // [pagamentoId, categoria] no banco fica como garantia de fundo.
    const reembolsoExistente = await this.repo.buscarMovimentacaoPorPagamento(
      cliente,
      tenantId,
      pagamentoId,
      CategoriaMovimentacaoCaixa.REEMBOLSO,
    );
    if (reembolsoExistente) return null;

    const descricao = [
      venda.pedidoNumero ? `Estorno venda balcão #${venda.pedidoNumero}` : 'Estorno de venda',
      motivo?.trim(),
    ]
      .filter(Boolean)
      .join(' — ');

    return this.repo.criarMovimentacao(cliente, tenantId, {
      sessaoId: sessao.id,
      tipo: TipoMovimentacaoCaixa.SAIDA,
      categoria: CategoriaMovimentacaoCaixa.REEMBOLSO,
      descricao,
      // Devolve exatamente o que a VENDA lançou (estorno total).
      valor: venda.valor,
      // Herda a forma da venda: estorno de cartão não sai da gaveta.
      formaPagamento: venda.formaPagamento ?? undefined,
      pedidoId: venda.pedidoId ?? undefined,
      pedidoNumero: venda.pedidoNumero ?? undefined,
      pagamentoId,
      operador: sessao.operador,
    });
  }

  // ─── Auxiliares ─────────────────────────────────────────────

  private async exigirSessao(tenantId: string, id: string): Promise<SessaoCaixa> {
    const sessao = await this.repo.buscarSessaoPorId(this.prisma, tenantId, id);
    if (!sessao) throw new NotFoundException('Sessão de caixa não encontrada');
    return sessao;
  }

  private agruparAgregados(linhas: AgregadoMovimentacao[]) {
    const mapa = new Map<string, AgregadoMovimentacao[]>();
    for (const linha of linhas) {
      const atual = mapa.get(linha.sessaoId);
      if (atual) atual.push(linha);
      else mapa.set(linha.sessaoId, [linha]);
    }
    return mapa;
  }

  private calcularTotais(linhas: AgregadoMovimentacao[] | undefined): TotaisSessao {
    const totais: TotaisSessao = {
      totalEntradas: ZERO,
      totalSaidas: ZERO,
      entradasDinheiro: ZERO,
      saidasDinheiro: ZERO,
      qtdMovimentacoes: 0,
      porForma: new Map(),
    };

    for (const linha of linhas ?? []) {
      const valor = linha._sum.valor ?? ZERO;
      const quantidade = linha._count._all;
      const ehEntrada = linha.tipo === TipoMovimentacaoCaixa.ENTRADA;
      const chaveForma = linha.formaPagamento ?? 'NAO_INFORMADO';

      totais.qtdMovimentacoes += quantidade;

      if (ehEntrada) totais.totalEntradas = totais.totalEntradas.plus(valor);
      else totais.totalSaidas = totais.totalSaidas.plus(valor);

      // Gaveta: a categoria decide junto com a forma (ver ehDinheiroNaGaveta).
      // SUPRIMENTO/SANGRIA contam sempre; as demais só em DINHEIRO.
      if (ehDinheiroNaGaveta(linha.categoria, linha.formaPagamento)) {
        if (ehEntrada) totais.entradasDinheiro = totais.entradasDinheiro.plus(valor);
        else totais.saidasDinheiro = totais.saidasDinheiro.plus(valor);
      }

      const forma = totais.porForma.get(chaveForma) ?? {
        entradas: ZERO,
        saidas: ZERO,
        quantidade: 0,
      };
      if (ehEntrada) forma.entradas = forma.entradas.plus(valor);
      else forma.saidas = forma.saidas.plus(valor);
      forma.quantidade += quantidade;
      totais.porForma.set(chaveForma, forma);
    }

    return totais;
  }

  /**
   * Movimento total do turno = valorAbertura + entradas - saídas, TODAS as
   * formas (Decimal puro). Exibição apenas: cartão e PIX estão aqui e não estão
   * na gaveta, então isto NÃO é conferível contra o valor contado.
   */
  private saldoEsperado(sessao: SessaoCaixa, totais: TotaisSessao): Decimal {
    return new Decimal(sessao.valorAbertura).plus(totais.totalEntradas).minus(totais.totalSaidas);
  }

  /**
   * O que se espera FISICAMENTE na gaveta = valorAbertura + entradas em dinheiro
   * - saídas em dinheiro. É a base da conferência do fechamento (ver
   * `ehDinheiroNaGaveta` para o critério de "dinheiro").
   */
  private saldoEsperadoDinheiro(sessao: SessaoCaixa, totais: TotaisSessao): Decimal {
    return new Decimal(sessao.valorAbertura)
      .plus(totais.entradasDinheiro)
      .minus(totais.saidasDinheiro);
  }

  /**
   * Serializa a sessão no shape que as telas consomem, com TODO valor monetário
   * já convertido para `number`.
   *
   * `saldoEsperado` é o movimento total do turno (todas as formas) — a tela o
   * exibe como "Movimento Total do Turno". Para a conferência de gaveta o que
   * vale é `saldoEsperadoDinheiro`; `totaisPorForma` abre a quebra por forma.
   * Os três saem de TODA sessão serializada — /caixa/atual, /caixa/:id e a
   * listagem — porque a tela precisa do dinheiro e da quebra juntos.
   *
   * `valorEsperado` é o SNAPSHOT da conferência: o `saldoEsperadoDinheiro`
   * congelado no instante do fechamento. É o par correto de `valorContado` e
   * `diferenca` (diferenca = valorContado - valorEsperado) e o que a tela de
   * auditoria deve exibir ao lado deles — usar `saldoEsperado` ali colocaria
   * cartão e PIX na conta e os três números não fechariam entre si.
   * Sessão ABERTO devolve `null`: ainda não houve conferência, e é só no
   * fechamento que o snapshot é gravado. Enquanto isso, quem quer o esperado
   * "de agora" lê `saldoEsperadoDinheiro`, que é recalculado a cada leitura.
   *
   * Não expõe `observacoesAbertura` (nenhuma tela o lê).
   */
  private serializarSessao(sessao: SessaoCaixa, totais: TotaisSessao) {
    const saldoEsperado = this.saldoEsperado(sessao, totais);
    const saldoEsperadoDinheiro = this.saldoEsperadoDinheiro(sessao, totais);

    return {
      id: sessao.id,
      numero: sessao.numero,
      status: sessao.status,
      caixa: sessao.caixa,
      operador: sessao.operador,
      aberturaEm: sessao.aberturaEm,
      valorAbertura: sessao.valorAbertura.toNumber(),
      totalEntradas: totais.totalEntradas.toNumber(),
      totalSaidas: totais.totalSaidas.toNumber(),
      saldoEsperado: saldoEsperado.toNumber(),
      saldoEsperadoDinheiro: saldoEsperadoDinheiro.toNumber(),
      qtdMovimentacoes: totais.qtdMovimentacoes,
      totaisPorForma: [...totais.porForma.entries()].map(([formaPagamento, valores]) => ({
        formaPagamento,
        entradas: valores.entradas.toNumber(),
        saidas: valores.saidas.toNumber(),
        liquido: valores.entradas.minus(valores.saidas).toNumber(),
        quantidade: valores.quantidade,
      })),
      fechamentoEm: sessao.fechamentoEm,
      valorContado: sessao.valorContado?.toNumber() ?? null,
      // `null` enquanto ABERTO: o snapshot só existe a partir do fechamento.
      valorEsperado: sessao.valorEsperado?.toNumber() ?? null,
      diferenca: sessao.diferenca?.toNumber() ?? null,
      observacoesFechamento: sessao.observacoesFechamento,
    };
  }

  private serializarMovimentacao(movimentacao: MovimentacaoCaixa) {
    return {
      id: movimentacao.id,
      sessaoId: movimentacao.sessaoId,
      tipo: movimentacao.tipo,
      categoria: movimentacao.categoria,
      descricao: movimentacao.descricao,
      valor: Number(movimentacao.valor),
      formaPagamento: movimentacao.formaPagamento,
      pedidoId: movimentacao.pedidoId,
      pedidoNumero: movimentacao.pedidoNumero,
      operador: movimentacao.operador,
      criadoEm: movimentacao.criadoEm,
    };
  }
}
