/**
 * Repositório do Caixa (multi-tenancy).
 *
 * Todas as queries filtram por tenantId — isolamento total entre empresas.
 * Nenhum método devolve dado serializado: a conversão Decimal → number é
 * responsabilidade do service (fronteira da API).
 */

import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import { PrismaService, ClientePrisma } from '../prisma/prisma.service';
import {
  StatusSessaoCaixa,
  TipoMovimentacaoCaixa,
  CategoriaMovimentacaoCaixa,
  TipoPagamento,
} from '../../../generated/client';
import { ListarSessoesCaixaDto } from '../../dtos/caixa.dto';

export interface DadosNovaSessao {
  numero: string;
  caixa: string;
  operador: string;
  operadorId?: string;
  valorAbertura: Decimal;
  observacoesAbertura?: string;
}

export interface DadosFechamento {
  valorContado: Decimal;
  valorEsperado: Decimal;
  diferenca: Decimal;
  observacoesFechamento?: string;
}

export interface DadosNovaMovimentacao {
  sessaoId: string;
  tipo: TipoMovimentacaoCaixa;
  categoria: CategoriaMovimentacaoCaixa;
  descricao: string;
  valor: Decimal;
  formaPagamento?: TipoPagamento;
  pedidoId?: string;
  pedidoNumero?: string;
  pagamentoId?: string;
  operador: string;
}

/**
 * Linha do groupBy usado para derivar os totais da sessão.
 *
 * `categoria` entra na chave porque a conferência de gaveta depende dela: o que
 * é dinheiro físico não se decide só pela forma de pagamento (SUPRIMENTO e
 * SANGRIA são operações de gaveta por definição). Ver `ehDinheiroNaGaveta`.
 */
export type AgregadoMovimentacao = {
  sessaoId: string;
  tipo: TipoMovimentacaoCaixa;
  categoria: CategoriaMovimentacaoCaixa;
  formaPagamento: TipoPagamento | null;
  _sum: { valor: Decimal | null };
  _count: { _all: number };
};

/** Projeção mínima devolvida pelo SELECT ... FOR UPDATE da sessão. */
export type SessaoTravada = {
  id: string;
  numero: string;
  status: StatusSessaoCaixa;
  operador: string;
};

@Injectable()
export class CaixaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Sessões ────────────────────────────────────────────────

  /**
   * Último número emitido no ano para o tenant. Ordena por `criadoEm` (e não
   * por `numero`): a partir da 1000ª sessão do ano o sufixo ganha um dígito e
   * a ordenação lexicográfica de string colocaria "999" acima de "1000".
   */
  async buscarUltimoNumero(cliente: ClientePrisma, tenantId: string, prefixo: string) {
    const ultima = await cliente.sessaoCaixa.findFirst({
      where: { tenantId, numero: { startsWith: prefixo } },
      orderBy: { criadoEm: 'desc' },
      select: { numero: true },
    });
    return ultima?.numero ?? null;
  }

  criarSessao(cliente: ClientePrisma, tenantId: string, dados: DadosNovaSessao) {
    return cliente.sessaoCaixa.create({
      data: {
        tenantId,
        numero: dados.numero,
        status: StatusSessaoCaixa.ABERTO,
        caixa: dados.caixa,
        operador: dados.operador,
        operadorId: dados.operadorId,
        valorAbertura: dados.valorAbertura,
        observacoesAbertura: dados.observacoesAbertura,
        // Enquanto ABERTO a trava carrega o tenantId (unique → 1 aberto/tenant).
        travaCaixaAberto: tenantId,
      },
    });
  }

  buscarSessaoAberta(cliente: ClientePrisma, tenantId: string) {
    return cliente.sessaoCaixa.findFirst({
      where: { tenantId, status: StatusSessaoCaixa.ABERTO },
      orderBy: { aberturaEm: 'desc' },
    });
  }

  buscarSessaoPorId(cliente: ClientePrisma, tenantId: string, id: string) {
    return cliente.sessaoCaixa.findFirst({ where: { id, tenantId } });
  }

  /**
   * Trava a linha da sessão (SELECT ... FOR UPDATE) até o fim da transação.
   *
   * É a serialização entre FECHAR e LANÇAR VENDA. Sem ela, uma venda que entra
   * entre a leitura das movimentações e o UPDATE do fechamento fica órfã numa
   * sessão FECHADO e some da conferência — dinheiro real sumindo sem erro.
   *
   * Precisa ser $queryRaw: o Prisma não expõe FOR UPDATE na API tipada. Só é
   * útil DENTRO de um $transaction — fora dele o lock morre no fim do statement.
   */
  async travarSessao(
    cliente: ClientePrisma,
    tenantId: string,
    id: string,
  ): Promise<SessaoTravada | null> {
    const linhas = await cliente.$queryRaw<SessaoTravada[]>`
      SELECT id, numero, status, operador
        FROM sessoes_caixa
       WHERE id = ${id}::uuid
         AND tenant_id = ${tenantId}::uuid
       FOR UPDATE
    `;
    return linhas[0] ?? null;
  }

  /**
   * Trava a sessão ABERTA do tenant, se houver.
   *
   * O predicado `status = 'ABERTO'` é reavaliado DEPOIS da aquisição do lock
   * (EvalPlanQual do Postgres): se um fechamento concorrente commitou nesse
   * meio-tempo, a linha deixa de casar e o retorno é vazio — o chamador cai no
   * caminho "sem caixa aberto" em vez de lançar numa sessão já fechada.
   */
  async travarSessaoAberta(cliente: ClientePrisma, tenantId: string): Promise<SessaoTravada | null> {
    const linhas = await cliente.$queryRaw<SessaoTravada[]>`
      SELECT id, numero, status, operador
        FROM sessoes_caixa
       WHERE tenant_id = ${tenantId}::uuid
         AND status = 'ABERTO'::"StatusSessaoCaixa"
       ORDER BY abertura_em DESC
       FOR UPDATE
    `;
    return linhas[0] ?? null;
  }

  async listarSessoes(tenantId: string, filtros: ListarSessoesCaixaDto) {
    const pagina = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 30;

    const [sessoes, total] = await Promise.all([
      this.prisma.sessaoCaixa.findMany({
        where: { tenantId },
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { aberturaEm: 'desc' },
      }),
      this.prisma.sessaoCaixa.count({ where: { tenantId } }),
    ]);

    return { sessoes, total, pagina, limite };
  }

  /**
   * Fecha a sessão. Filtra por { id, tenantId, status: ABERTO } — o filtro de
   * status torna a operação atômica: um segundo fechamento concorrente casa
   * zero linhas (count === 0) em vez de sobrescrever o fechamento anterior.
   * `travaCaixaAberto: null` libera o slot para a próxima abertura.
   */
  async fecharSessao(cliente: ClientePrisma, tenantId: string, id: string, dados: DadosFechamento) {
    const { count } = await cliente.sessaoCaixa.updateMany({
      where: { id, tenantId, status: StatusSessaoCaixa.ABERTO },
      data: {
        status: StatusSessaoCaixa.FECHADO,
        fechamentoEm: new Date(),
        valorContado: dados.valorContado,
        valorEsperado: dados.valorEsperado,
        diferenca: dados.diferenca,
        observacoesFechamento: dados.observacoesFechamento,
        travaCaixaAberto: null,
      },
    });
    return count;
  }

  // ─── Movimentações ──────────────────────────────────────────

  criarMovimentacao(cliente: ClientePrisma, tenantId: string, dados: DadosNovaMovimentacao) {
    return cliente.movimentacaoCaixa.create({
      data: {
        tenantId,
        sessaoId: dados.sessaoId,
        tipo: dados.tipo,
        categoria: dados.categoria,
        descricao: dados.descricao,
        valor: dados.valor,
        formaPagamento: dados.formaPagamento,
        pedidoId: dados.pedidoId,
        pedidoNumero: dados.pedidoNumero,
        pagamentoId: dados.pagamentoId,
        operador: dados.operador,
      },
    });
  }

  /**
   * Movimentações da sessão, mais recentes primeiro.
   *
   * `limite` existe porque a tela do caixa faz polling: uma loja com 800 vendas
   * no turno devolveria 800 objetos a cada 30s por aba aberta. Os totais NUNCA
   * saem desta lista — vêm de `agregarMovimentacoes` — então cortar aqui não
   * falseia número nenhum.
   */
  listarMovimentacoes(
    cliente: ClientePrisma,
    tenantId: string,
    sessaoId: string,
    limite?: number,
  ) {
    return cliente.movimentacaoCaixa.findMany({
      where: { tenantId, sessaoId },
      orderBy: { criadoEm: 'desc' },
      ...(limite != null ? { take: limite } : {}),
    });
  }

  /**
   * Movimentação de um pagamento numa dada categoria — a chave do unique
   * composto [pagamentoId, categoria].
   *
   * Serve tanto para achar a VENDA que o estorno vai devolver quanto para
   * detectar um REEMBOLSO já lançado. A checagem prévia (e não um catch de
   * P2002) é obrigatória aqui: dentro de um $transaction interativo, uma
   * violação de unique aborta a transação inteira no Postgres — engolir o erro
   * faria o COMMIT virar ROLLBACK silencioso e desfazer o estorno junto.
   */
  buscarMovimentacaoPorPagamento(
    cliente: ClientePrisma,
    tenantId: string,
    pagamentoId: string,
    categoria: CategoriaMovimentacaoCaixa,
  ) {
    return cliente.movimentacaoCaixa.findFirst({
      where: { tenantId, pagamentoId, categoria },
    });
  }

  /**
   * Agrega, numa única query, tudo que os totais derivados precisam para as N
   * sessões da página: soma e contagem por (sessão, tipo, categoria, forma).
   * Totais NÃO são persistidos — sempre recalculados a partir das movimentações.
   *
   * Recebe `cliente` para poder rodar DENTRO da transação de fechamento, sob o
   * lock da sessão (senão leria movimentações que o lock deveria ter barrado).
   */
  async agregarMovimentacoes(
    cliente: ClientePrisma,
    tenantId: string,
    sessaoIds: string[],
  ): Promise<AgregadoMovimentacao[]> {
    if (sessaoIds.length === 0) return [];

    const linhas = await cliente.movimentacaoCaixa.groupBy({
      by: ['sessaoId', 'tipo', 'categoria', 'formaPagamento'],
      where: { tenantId, sessaoId: { in: sessaoIds } },
      _sum: { valor: true },
      _count: { _all: true },
    });

    return linhas as unknown as AgregadoMovimentacao[];
  }
}
