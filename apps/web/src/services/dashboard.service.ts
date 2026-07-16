/**
 * Composição do resumo do Dashboard a partir dos endpoints REAIS de cada módulo.
 *
 * Não existe serviço agregador no backend — e não vamos criar um. O resumo é
 * COMPOSTO AQUI, na fronteira da API, com `Promise.allSettled`:
 *
 *  - sem acoplamento entre microserviços (o dashboard não vira dono do fiscal);
 *  - cada widget degrada sozinho — fiscal fora do ar não derruba a tela;
 *  - reusa endpoints já validados em produção pelas telas de cada módulo, então
 *    os números do dashboard BATEM com os da tela correspondente.
 *
 * Mesmo padrão de `pedidos.service.ts → obterCatalogo`.
 *
 * Regras de honestidade (não negociáveis):
 *  - `fontes[x] = 'erro'` diz à tela que aquele bloco NÃO tem dado. Zero é um
 *    fato ("não houve venda"); erro é outra coisa e a tela precisa distinguir.
 *  - `Decimal` do Prisma serializa como STRING no JSON — tudo passa por `num()`,
 *    que trata `null`/`undefined` ANTES do `Number()` (`Number(null) === 0`
 *    transformaria campo ausente em zero).
 *  - Campo sem fonte real não é inventado: ou é derivado honestamente de um
 *    endpoint real, ou não existe neste contrato.
 *
 * NUNCA troque o `allSettled` por `Promise.all`: um 500 do fiscal apagaria o
 * dashboard inteiro.
 */

import api from '@/lib/api';
import { rotularCanal } from '@/lib/canais';
import { caixaService } from './caixa.service';
import { clientesService } from './clientes.service';
import { estoqueService } from './estoque.service';
import { fiscalService } from './fiscal.service';
import { pedidosService } from './pedidos.service';
import type { Pedido } from '@/types';

// ─── Tipos de apresentação ────────────────────────────────────────────────────

/** Um bloco só tem dois estados: a fonte respondeu, ou não respondeu. */
export type StatusFonte = 'ok' | 'erro';

/** Cada fonte é uma chamada HTTP independente — e um raio de falha isolado. */
export type FonteDashboard =
  | 'vendas'
  | 'serie7d'
  | 'recentes'
  | 'urgentes'
  | 'estoque'
  | 'fiscal'
  | 'caixa'
  | 'clientes';

export interface VendaDia {
  data: string;
  label: string;
  receita: number;
  pedidos: number;
}

export interface CanalResumo {
  canal: string;
  label: string;
  qtd: number;
  valor: number;
}

export interface TopProduto {
  id: string;
  nome: string;
  sku: string;
  qtd: number;
  receita: number;
}

export interface PedidoRecente {
  id: string;
  numero: string;
  cliente: string;
  valor: number;
  status: string;
  canal: string;
  criadoEm: string;
}

export interface PedidoUrgente extends PedidoRecente {
  horasAtraso: number;
}

export interface AlertaEstoque {
  /** Id da linha de saldo (produto × depósito) — o mesmo produto pode ter duas. */
  id: string;
  produtoId: string;
  produto: string;
  sku: string;
  disponivel: number;
  minimo: number;
  status: string;
  deposito: string;
}

export interface ResumoEstoqueDashboard {
  valorEmEstoque: number;
  estoqueBaixo: number;
  semEstoque: number;
  totalProdutos: number;
}

export interface ResumoFiscalDashboard {
  faturado30d: number;
  impostos30d: number;
  emitidas30d: number;
  taxaEmissao: number;
  nfsPendentes: number;
}

export interface ResumoCaixaDashboard {
  aberto: boolean;
  operador?: string;
  caixa?: string;
  abertoDesde?: string;
  totalEntradas: number;
  totalSaidas: number;
  /**
   * Dinheiro NA GAVETA (`saldoEsperadoDinheiro`) — a mesma base do card
   * "Saldo em Caixa" da tela de Caixa. Nunca `saldoEsperado`, que inclui cartão
   * e PIX: os dois números não bateriam entre as telas.
   */
  saldoEmCaixa: number;
}

export interface ResumoClientesDashboard {
  total: number;
  ativos: number;
  novosEsteMes: number;
  ticketMedioCliente: number;
}

/**
 * Resumo agregado do dashboard.
 *
 * Os campos numéricos têm SEMPRE um valor (zero/vazio) para a tela não precisar
 * de `?.` em cascata — quem decide se aquilo pode ser exibido é `fontes`.
 *
 * Não existem aqui `receitaAnt` nem `crescimentoReceita`: nenhum endpoint real
 * expõe o período anterior (`/pedidos/estatisticas/dashboard` só aceita
 * `periodo`, e o service ignora `dataInicio`/`dataFim`). Um `0%` ali afirmaria
 * "receita estável", que é uma alegação sobre o negócio — não um dado ausente.
 */
export interface DashboardResumo {
  fontes: Record<FonteDashboard, StatusFonte>;
  /** Janela = mês corrente (`periodo=mes`, o que o backend de fato calcula). */
  receitaMes: number;
  pedidosMes: number;
  ticketMedio: number;
  pedidosPendentes: number;
  porStatus: Record<string, number>;
  topProdutos5: TopProduto[];
  /** Derivados da série diária (últimos 7 dias). */
  receita7d: number;
  vendas7d: VendaDia[];
  porCanal: CanalResumo[];
  pedidosRecentes: PedidoRecente[];
  pedidosUrgentes: PedidoUrgente[];
  estoque: ResumoEstoqueDashboard;
  alertasEstoque: AlertaEstoque[];
  fiscal: ResumoFiscalDashboard;
  caixa: ResumoCaixaDashboard;
  clientes: ResumoClientesDashboard;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const DIA_MS = 86_400_000;

/**
 * `periodo=mes` = mês-calendário (`pedido.service.ts → obterEstatisticas`).
 * Os "30 dias corridos" só sairiam mandando um `periodo` FORA do enum aceito,
 * para cair no `default:` do switch — depender disso é frágil. Por isso a tela
 * rotula "do mês": é o que o backend realmente calcula.
 */
const PERIODO_ESTATISTICAS = 'mes';

const DIAS_SERIE = 7;

/**
 * ═══════════════════════════════════════════════════════════════
 * REGRA DE RECEITA — espelho do backend. NÃO divirja daqui.
 * ═══════════════════════════════════════════════════════════════
 *
 * FONTE DA VERDADE: `services/order-service/src/modules/pedido/pedido.repository.ts`
 * — constantes `STATUS_FORA_DAS_ESTATISTICAS` (RASCUNHO) e `STATUS_SEM_RECEITA`
 * (CANCELADO, DEVOLVIDO), e o bloco de doc no topo daquele arquivo.
 *
 * Receita é por COMPETÊNCIA: todo pedido EFETIVADO e NÃO DESFEITO soma, pago ou
 * não (venda a prazo é venda — PENDENTE conta). Ficam de fora exatamente três
 * status: RASCUNHO (carrinho em edição, não é pedido), CANCELADO e DEVOLVIDO
 * (aconteceram, mas não são dinheiro de venda).
 *
 * Este espelho existe porque a série de 7 dias e o donut por canal são agregados
 * AQUI, a partir de `GET /v1/pedidos` — e essa listagem NÃO filtra status: ela
 * devolve rascunho, cancelado e devolvido junto. Sem aplicar a mesma regra, a
 * tela mostrava "Receita do Mês: R$ 100,00" (backend, que exclui os três) e
 * logo abaixo "Receita Últimos 7 Dias: R$ 1.000,00" (um cancelado de R$ 900
 * somando) — sete dias maiores que o mês inteiro, na mesma tela.
 *
 * Por que o filtro é no cliente e não na query: `FiltroPedidoDto.status` é um
 * `string` único (`where.status = status`, igualdade exata). Não existe param de
 * exclusão nem lista de status — e param não declarado no DTO dá 400. Mandar
 * um status só resolveria o inverso do que precisamos (queremos TODOS menos
 * três). O filtro no cliente é completo e não frágil porque a janela inteira é
 * varrida: `listarPedidosDoPeriodo` pagina até o fim e LANÇA se estourar o teto,
 * então nunca filtramos sobre uma amostra parcial. Quando o backend expuser a
 * agregação diária, esta duplicação morre junto com `montarSerie7d`.
 *
 * O nome é `STATUS_FORA_DA_RECEITA` e não `STATUS_SEM_RECEITA` de propósito:
 * este conjunto é a UNIÃO das duas constantes do backend (RASCUNHO + CANCELADO
 * + DEVOLVIDO). Lá elas são separadas porque cancelado e devolvido ainda contam
 * no pipeline; aqui só existe a pergunta "isto é receita?".
 */
const STATUS_FORA_DA_RECEITA = new Set(['RASCUNHO', 'CANCELADO', 'DEVOLVIDO']);

/** `true` quando o pedido entra na receita — a MESMA base do `totalVendas`. */
function contaComoReceita(pedido: Pedido): boolean {
  return !STATUS_FORA_DA_RECEITA.has(pedido.status);
}

/** Máximo por página aceito pela listagem de pedidos. */
const LIMITE_PAGINA_PEDIDOS = 100;

/**
 * Teto de páginas varridas para montar a série diária no cliente. Acima disso a
 * agregação precisa vir do backend — e a fonte é marcada como indisponível em
 * vez de exibir uma série truncada (que seria um número errado, não ausente).
 */
const MAX_PAGINAS_SERIE = 5;

const QTD_PEDIDOS_RECENTES = 6;

/**
 * Pedidos varridos para achar os 6 recentes. Maior que `QTD_PEDIDOS_RECENTES`
 * porque os RASCUNHOS são descartados no cliente (o backend não tem filtro de
 * exclusão) e sem folga a lista viria curta.
 */
const LIMITE_BUSCA_RECENTES = 20;

/** Pedidos varridos para achar os urgentes (filtro/ordenação são no cliente). */
const LIMITE_BUSCA_URGENTES = 20;

const QTD_PEDIDOS_URGENTES = 5;

/** A partir de quantas horas em PENDENTE um pedido é "urgente". */
const HORAS_ATRASO_MINIMO = 4;

const QTD_ALERTAS_ESTOQUE = 6;

const QTD_TOP_PRODUTOS = 5;

/** Ordem de gravidade dos alertas de estoque (menor = mais grave). */
const ORDEM_STATUS_ESTOQUE: Record<string, number> = {
  SEM_ESTOQUE: 0,
  CRITICO: 1,
  BAIXO: 2,
  NORMAL: 3,
};

// ─── Helpers de normalização ──────────────────────────────────────────────────

/**
 * Decimal (string) / number / null → number seguro.
 * `null` e `undefined` saem ANTES do `Number()`: `Number(null)` é 0 e faria um
 * campo ausente virar zero em vez de cair no `padrao`.
 */
function num(valor: unknown, padrao = 0): number {
  if (valor === null || valor === undefined || valor === '') return padrao;
  const n = Number(valor);
  return Number.isFinite(n) ? n : padrao;
}

/** Meia-noite local do dia informado. */
function inicioDoDia(base: Date): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate());
}

function paraData(valor: unknown): Date | undefined {
  if (typeof valor !== 'string' || valor === '') return undefined;
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function registrarFalha(fonte: FonteDashboard, erro: unknown): void {
  // Falha silenciosa é exatamente o que este módulo existe para evitar: a tela
  // mostra "fonte indisponível", e o console diz qual e por quê.
  console.error(`[dashboard] fonte "${fonte}" indisponível:`, erro);
}

// ─── Shapes crus das APIs ─────────────────────────────────────────────────────

/**
 * `GET /v1/pedidos/estatisticas/dashboard`.
 *
 * Dois shapes convivem: o real do order-service (`totalVendas`/`totalPedidos`/
 * `topProdutos[{sku,titulo,quantidade,valorTotal}]`) e o mock do Next
 * (`receita30d`/`pedidos30d`). A normalização aceita os dois — é o mesmo
 * cuidado que `pedidosService.obterEstatisticas` já tem.
 */
interface EstatisticasPedidosApi {
  totalVendas?: string | number | null;
  totalPedidos?: number | null;
  receita30d?: string | number | null;
  pedidos30d?: number | null;
  ticketMedio?: string | number | null;
  porStatus?: Record<string, number> | null;
  topProdutos?: TopProdutoApi[] | null;
}

interface TopProdutoApi {
  produtoId?: string | null;
  sku?: string | null;
  titulo?: string | null;
  nome?: string | null;
  quantidade?: number | null;
  qtd?: number | null;
  valorTotal?: string | number | null;
  receita?: string | number | null;
}

// ─── Blocos (uma fonte real cada) ─────────────────────────────────────────────

interface BlocoVendas {
  receitaMes: number;
  pedidosMes: number;
  ticketMedio: number;
  pedidosPendentes: number;
  porStatus: Record<string, number>;
  topProdutos5: TopProduto[];
}

/**
 * KPIs de venda, pipeline e top produtos — `GET /v1/pedidos/estatisticas/dashboard`.
 *
 * `totalVendas` (→ `receitaMes`) e `ticketMedio` seguem o REGIME DE COMPETÊNCIA
 * do order-service: somam todo pedido efetivado e não desfeito — pago ou não —,
 * excluindo exatamente RASCUNHO, CANCELADO e DEVOLVIDO. Ver
 * `STATUS_FORA_DA_RECEITA` acima, que espelha a regra para a série de 7 dias e o donut por canal: os três
 * números medem a MESMA coisa, mudando só a janela (mês-calendário × 7 dias).
 *
 * `totalPedidos`/`porStatus` NÃO seguem a regra da receita — e é de propósito:
 * contam CANCELADO e DEVOLVIDO (só RASCUNHO fica fora), porque é assim que o
 * pipeline mostra a taxa de cancelamento real. Por isso "Pedidos do Mês" pode
 * ser maior que a contagem que sustenta a receita; os rótulos da tela dizem
 * coisas diferentes de propósito.
 */
async function carregarVendas(): Promise<BlocoVendas> {
  const { data } = await api.get<EstatisticasPedidosApi>('/v1/pedidos/estatisticas/dashboard', {
    params: { periodo: PERIODO_ESTATISTICAS },
  });

  const porStatus = data?.porStatus ?? {};
  const topProdutos5 = (data?.topProdutos ?? [])
    .slice(0, QTD_TOP_PRODUTOS)
    .map((t, i) => normalizarTopProduto(t, i));

  return {
    receitaMes: num(data?.totalVendas ?? data?.receita30d),
    pedidosMes: num(data?.totalPedidos ?? data?.pedidos30d),
    ticketMedio: num(data?.ticketMedio),
    pedidosPendentes: num(porStatus['PENDENTE']),
    porStatus,
    topProdutos5,
  };
}

/** Real agrupa por `sku` e devolve `titulo`/`quantidade`/`valorTotal`. */
function normalizarTopProduto(bruto: TopProdutoApi, indice: number): TopProduto {
  const sku = bruto.sku ?? '';
  const nome = bruto.titulo ?? bruto.nome ?? '';
  return {
    // O repo agrupa por SKU, então ele é único na lista; o índice cobre o SKU
    // vazio e evita `key` duplicada no React.
    id: sku || bruto.produtoId || `top-${indice}`,
    nome: nome || sku || 'Produto sem descrição',
    sku,
    qtd: num(bruto.quantidade ?? bruto.qtd),
    receita: num(bruto.valorTotal ?? bruto.receita),
  };
}

interface BlocoSerie7d {
  receita7d: number;
  vendas7d: VendaDia[];
  porCanal: CanalResumo[];
}

/**
 * Série diária dos últimos 7 dias + vendas por canal, derivadas de
 * `GET /v1/pedidos?dataInicio&dataFim`.
 *
 * Não existe endpoint de agregação diária (`/v1/financeiro/fluxo-caixa` é série
 * MENSAL) nem de valor por canal (`estatisticas.porCanal` só conta pedidos, sem
 * somar), então as duas são derivadas dos pedidos da janela — mesma fonte, um
 * fetch só. O certo, a médio prazo, é o backend expor a agregação.
 */
async function carregarSerie7d(): Promise<BlocoSerie7d> {
  const inicio = inicioDoDia(new Date(Date.now() - (DIAS_SERIE - 1) * DIA_MS));
  const fim = new Date(inicio.getTime() + DIAS_SERIE * DIA_MS - 1);
  const pedidos = await listarPedidosDoPeriodo(inicio, fim);
  return montarSerie7d(pedidos, inicio);
}

/**
 * Varre os pedidos da janela, paginando até `MAX_PAGINAS_SERIE`.
 * Se o período não couber no teto, LANÇA: uma série truncada seria um número
 * errado passando por certo, o que é pior do que assumir a indisponibilidade.
 */
async function listarPedidosDoPeriodo(inicio: Date, fim: Date): Promise<Pedido[]> {
  const base = {
    dataInicio: inicio.toISOString(),
    dataFim: fim.toISOString(),
    limite: LIMITE_PAGINA_PEDIDOS,
    ordenacao: 'criadoEm_desc',
  };

  const primeira = await pedidosService.listar({ ...base, pagina: 1 });
  const pedidos = [...(primeira.dados ?? [])];
  const total = num(primeira.total, pedidos.length);
  const paginas = Math.max(1, Math.ceil(total / LIMITE_PAGINA_PEDIDOS));

  if (paginas > MAX_PAGINAS_SERIE) {
    throw new Error(
      `Série de ${DIAS_SERIE} dias tem ${total} pedidos — acima do teto de ` +
        `${MAX_PAGINAS_SERIE * LIMITE_PAGINA_PEDIDOS} que a agregação no cliente cobre.`,
    );
  }

  if (paginas > 1) {
    const restantes = await Promise.all(
      Array.from({ length: paginas - 1 }, (_, i) =>
        pedidosService.listar({ ...base, pagina: i + 2 }),
      ),
    );
    for (const resposta of restantes) pedidos.push(...(resposta.dados ?? []));
  }

  return pedidos;
}

/**
 * Bucketiza os pedidos por dia local e por canal — sempre na base da RECEITA.
 *
 * Os dois widgets desta função ("Receita Últimos 7 Dias" e "Vendas por Canal")
 * afirmam RECEITA, então aplicam `contaComoReceita`: a mesma regra do
 * `totalVendas` do order-service (ver `STATUS_FORA_DA_RECEITA`). Sem isso a série
 * somaria cancelados que o KPI "Receita do Mês" já tinha excluído, e o donut
 * creditaria a um canal uma venda que não existiu.
 *
 * `vendas7d[].pedidos` conta pedidos DESTA base (os que geraram receita) — é o
 * número que sustenta a barra ao lado, não o pipeline. O pipeline, que conta
 * cancelados, vive no widget "Pipeline de Pedidos" e vem do backend.
 *
 * O filtro por data é refeito aqui: o mock do Next ignora `dataInicio`/`dataFim`
 * e a bucketização precisa valer para as duas fontes.
 */
function montarSerie7d(pedidos: Pedido[], inicio: Date): BlocoSerie7d {
  const vendas7d: VendaDia[] = Array.from({ length: DIAS_SERIE }, (_, i) => {
    const dia = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
    return {
      data: `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, '0')}-${String(
        dia.getDate(),
      ).padStart(2, '0')}`,
      label: dia.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
      receita: 0,
      pedidos: 0,
    };
  });

  const porCanal = new Map<string, { qtd: number; valor: number }>();

  for (const pedido of pedidos) {
    if (!contaComoReceita(pedido)) continue;

    const criadoEm = paraData(pedido.criadoEm);
    if (!criadoEm) continue;

    // `Math.round` absorve o salto de horário de verão entre duas meia-noites.
    const indice = Math.round((inicioDoDia(criadoEm).getTime() - inicio.getTime()) / DIA_MS);
    if (indice < 0 || indice >= DIAS_SERIE) continue;

    const valor = num(pedido.valor);
    vendas7d[indice].receita += valor;
    vendas7d[indice].pedidos += 1;

    // `canalOrigem` é nullable no order-service; `pedidosService` já degrada
    // para 'OUTROS', e o fallback aqui cobre o pedido vindo de outra fonte.
    const canal = pedido.canal || 'OUTROS';
    const acumulado = porCanal.get(canal) ?? { qtd: 0, valor: 0 };
    acumulado.qtd += 1;
    acumulado.valor += valor;
    porCanal.set(canal, acumulado);
  }

  for (const dia of vendas7d) dia.receita = +dia.receita.toFixed(2);

  return {
    receita7d: +vendas7d.reduce((soma, dia) => soma + dia.receita, 0).toFixed(2),
    vendas7d,
    porCanal: [...porCanal.entries()]
      .map(([canal, { qtd, valor }]) => ({
        canal,
        label: rotularCanal(canal),
        qtd,
        valor: +valor.toFixed(2),
      }))
      .sort((a, b) => b.valor - a.valor),
  };
}

/**
 * Últimos pedidos criados — `GET /v1/pedidos?limite=20&ordenacao=criadoEm_desc`.
 *
 * SEM RASCUNHO: "rascunho não é pedido" é decisão do order-service (ver o doc no
 * topo de `pedido.repository.ts`), e ele já os exclui de `totalPedidos` e do
 * pipeline. Exibir um carrinho em edição, com valor formatado, ao lado de
 * pedidos reais faria as duas metades da tela discordarem do que é um pedido.
 * CANCELADO e DEVOLVIDO FICAM: são pedidos que aconteceram e cuja aparição no
 * feed é informação legítima — a lista não afirma receita, o status vai no chip.
 *
 * A listagem não tem filtro de exclusão, então varre `LIMITE_BUSCA_RECENTES` e
 * corta no cliente. Limitação declarada: se os 20 últimos forem todos rascunho,
 * o feed fica vazio e a tela diz "nenhum pedido registrado" — que continua
 * verdade sob esta definição de pedido.
 */
async function carregarRecentes(): Promise<PedidoRecente[]> {
  const resposta = await pedidosService.listar({
    limite: LIMITE_BUSCA_RECENTES,
    ordenacao: 'criadoEm_desc',
  });
  return (resposta.dados ?? [])
    .filter((pedido) => pedido.status !== 'RASCUNHO')
    .slice(0, QTD_PEDIDOS_RECENTES)
    .map(normalizarPedidoRecente);
}

/**
 * Pedidos parados em PENDENTE — `GET /v1/pedidos?status=PENDENTE&ordenacao=criadoEm_asc`.
 *
 * `criadoEm_asc` traz os MAIS ANTIGOS primeiro, que são justamente os mais
 * urgentes: com `criadoEm_desc` o corte de página devolveria os mais recentes e
 * os atrasados de verdade ficariam de fora. O filtro de `${HORAS_ATRASO_MINIMO}h`
 * roda no cliente porque o backend não tem esse filtro — e é o mesmo critério
 * que o texto das ações recomendadas promete.
 *
 * Só PENDENTE: `FiltroPedidoDto.status` aceita um único valor, e uma 2ª chamada
 * só para CONFIRMADO (já aceito, apenas não separado) não paga o custo.
 *
 * Rascunho não entra aqui por construção — o filtro é igualdade exata em
 * PENDENTE, e o backend já não deixaria: nada a corrigir do lado dos urgentes.
 */
async function carregarUrgentes(): Promise<PedidoUrgente[]> {
  const resposta = await pedidosService.listar({
    status: 'PENDENTE',
    limite: LIMITE_BUSCA_URGENTES,
    ordenacao: 'criadoEm_asc',
  });
  const agora = Date.now();

  return (resposta.dados ?? [])
    .map((pedido) => {
      const criadoEm = paraData(pedido.criadoEm);
      return {
        ...normalizarPedidoRecente(pedido),
        horasAtraso: criadoEm ? Math.floor((agora - criadoEm.getTime()) / 3_600_000) : 0,
      };
    })
    .filter((pedido) => pedido.horasAtraso >= HORAS_ATRASO_MINIMO)
    .sort((a, b) => b.horasAtraso - a.horasAtraso)
    .slice(0, QTD_PEDIDOS_URGENTES);
}

/**
 * `pedidosService.listar` já traduz o shape real (`cliente ← clienteNome`,
 * `valor ← Number(valorTotal)`, `canal ← canalOrigem`). Resta o `numero`, que é
 * Int no banco — `String()` para casar com o tipo da tela e com a lista de
 * pedidos, que o renderiza cru.
 */
function normalizarPedidoRecente(pedido: Pedido): PedidoRecente {
  return {
    id: pedido.id,
    numero: String(pedido.numero ?? ''),
    cliente: pedido.cliente || 'Consumidor',
    valor: num(pedido.valor),
    status: pedido.status ?? '',
    canal: pedido.canal || 'OUTROS',
    criadoEm: pedido.criadoEm ?? '',
  };
}

interface BlocoEstoque {
  estoque: ResumoEstoqueDashboard;
  alertasEstoque: AlertaEstoque[];
}

/**
 * KPI de estoque + alertas — `GET /v1/estoque/resumo`. Uma chamada, dois widgets,
 * e a MESMA base da tela de Estoque (que consome o mesmo endpoint).
 *
 * `/v1/estoque/alertas` NÃO serve: devolve `$queryRaw` cru, em snake_case e sem
 * `status`/`disponivel` — o shape que a tela lê simplesmente não existe lá.
 */
async function carregarEstoque(): Promise<BlocoEstoque> {
  const resumo = await estoqueService.obterResumo();
  const itens = Array.isArray(resumo?.itens) ? resumo.itens : [];

  const alertasEstoque = itens
    .filter((item) => item.status !== 'NORMAL')
    .sort(
      (a, b) => (ORDEM_STATUS_ESTOQUE[a.status] ?? 3) - (ORDEM_STATUS_ESTOQUE[b.status] ?? 3),
    )
    .slice(0, QTD_ALERTAS_ESTOQUE)
    .map((item) => ({
      // O saldo é por produto × depósito: o mesmo `produtoId` pode aparecer duas
      // vezes, então a `key` da lista é o id da linha de saldo.
      id: item.id,
      produtoId: item.produtoId,
      produto: item.produto,
      sku: item.sku,
      disponivel: num(item.disponivel),
      minimo: num(item.minimo),
      status: item.status,
      deposito: item.deposito,
    }));

  return {
    estoque: {
      valorEmEstoque: num(resumo?.valorEmEstoque),
      estoqueBaixo: num(resumo?.estoqueBaixo),
      semEstoque: num(resumo?.semEstoque),
      totalProdutos: num(resumo?.totalProdutos),
    },
    alertasEstoque,
  };
}

/**
 * Painel fiscal — `GET /v1/notas-fiscais/estatisticas`, a mesma fonte da tela
 * Fiscal (o backend já devolve os Decimais em `number`).
 *
 * `nfsPendentes` não existe no contrato, mas é derivável sem margem de dúvida:
 * notas em RASCUNHO ou VALIDADA são exatamente as prontas para emitir.
 */
async function carregarFiscal(): Promise<ResumoFiscalDashboard> {
  const est = await fiscalService.estatisticas();
  const porStatus = est?.porStatus ?? {};
  return {
    faturado30d: num(est?.faturado30d),
    impostos30d: num(est?.impostos30d),
    emitidas30d: num(est?.emitidas30d),
    taxaEmissao: num(est?.taxaEmissao),
    nfsPendentes: num(porStatus['RASCUNHO']) + num(porStatus['VALIDADA']),
  };
}

/**
 * Caixa — `GET /v1/caixa/atual` (sempre 200; sem turno devolve `aberto: false`).
 * `caixaService` já normalizou os Decimais e achatou os opcionais.
 */
async function carregarCaixa(): Promise<ResumoCaixaDashboard> {
  const atual = await caixaService.obterAtual();
  const sessao = atual.sessao;

  if (!atual.aberto || !sessao) {
    return { aberto: false, totalEntradas: 0, totalSaidas: 0, saldoEmCaixa: 0 };
  }

  return {
    aberto: true,
    operador: sessao.operador,
    caixa: sessao.caixa,
    abertoDesde: sessao.aberturaEm,
    totalEntradas: sessao.totalEntradas,
    totalSaidas: sessao.totalSaidas,
    saldoEmCaixa: sessao.saldoEsperadoDinheiro,
  };
}

/** Clientes — `GET /v1/clientes/estatisticas`, mesma fonte dos KPIs do CRM. */
async function carregarClientes(): Promise<ResumoClientesDashboard> {
  const est = await clientesService.obterEstatisticas();
  return {
    total: num(est?.total),
    ativos: num(est?.ativos),
    novosEsteMes: num(est?.novosEsteMes),
    ticketMedioCliente: num(est?.ticketMedioCliente),
  };
}

// ─── Composição ───────────────────────────────────────────────────────────────

function resolver<T>(resultado: PromiseSettledResult<T>, fonte: FonteDashboard, padrao: T): T {
  if (resultado.status === 'fulfilled') return resultado.value;
  registrarFalha(fonte, resultado.reason);
  return padrao;
}

function estado(resultado: PromiseSettledResult<unknown>): StatusFonte {
  return resultado.status === 'fulfilled' ? 'ok' : 'erro';
}

const VENDAS_VAZIO: BlocoVendas = {
  receitaMes: 0,
  pedidosMes: 0,
  ticketMedio: 0,
  pedidosPendentes: 0,
  porStatus: {},
  topProdutos5: [],
};

const SERIE_VAZIA: BlocoSerie7d = { receita7d: 0, vendas7d: [], porCanal: [] };

const ESTOQUE_VAZIO: BlocoEstoque = {
  estoque: { valorEmEstoque: 0, estoqueBaixo: 0, semEstoque: 0, totalProdutos: 0 },
  alertasEstoque: [],
};

const FISCAL_VAZIO: ResumoFiscalDashboard = {
  faturado30d: 0,
  impostos30d: 0,
  emitidas30d: 0,
  taxaEmissao: 0,
  nfsPendentes: 0,
};

const CAIXA_VAZIO: ResumoCaixaDashboard = {
  aberto: false,
  totalEntradas: 0,
  totalSaidas: 0,
  saldoEmCaixa: 0,
};

const CLIENTES_VAZIO: ResumoClientesDashboard = {
  total: 0,
  ativos: 0,
  novosEsteMes: 0,
  ticketMedioCliente: 0,
};

export const dashboardService = {
  /**
   * Dispara as 8 fontes em paralelo e devolve o resumo com o status de cada uma.
   * Nenhuma falha propaga: o pior caso é um resumo inteiro marcado como 'erro',
   * e a tela diz isso em vez de mostrar zeros.
   */
  async obterResumo(): Promise<DashboardResumo> {
    const [vendas, serie7d, recentes, urgentes, estoque, fiscal, caixa, clientes] =
      await Promise.allSettled([
        carregarVendas(),
        carregarSerie7d(),
        carregarRecentes(),
        carregarUrgentes(),
        carregarEstoque(),
        carregarFiscal(),
        carregarCaixa(),
        carregarClientes(),
      ]);

    const blocoVendas = resolver(vendas, 'vendas', VENDAS_VAZIO);
    const blocoSerie = resolver(serie7d, 'serie7d', SERIE_VAZIA);
    const blocoEstoque = resolver(estoque, 'estoque', ESTOQUE_VAZIO);

    return {
      fontes: {
        vendas: estado(vendas),
        serie7d: estado(serie7d),
        recentes: estado(recentes),
        urgentes: estado(urgentes),
        estoque: estado(estoque),
        fiscal: estado(fiscal),
        caixa: estado(caixa),
        clientes: estado(clientes),
      },
      ...blocoVendas,
      ...blocoSerie,
      pedidosRecentes: resolver(recentes, 'recentes', []),
      pedidosUrgentes: resolver(urgentes, 'urgentes', []),
      ...blocoEstoque,
      fiscal: resolver(fiscal, 'fiscal', FISCAL_VAZIO),
      caixa: resolver(caixa, 'caixa', CAIXA_VAZIO),
      clientes: resolver(clientes, 'clientes', CLIENTES_VAZIO),
    };
  },
};
