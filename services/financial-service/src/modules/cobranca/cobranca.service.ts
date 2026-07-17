/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Cobrança
 * ═══════════════════════════════════════════════════════════════
 *
 * Os TÍTULOS de cobrança DERIVAM de lançamentos do tipo RECEITA vencidos e não
 * pagos (financial-service é dono do recebível). A sincronização é idempotente
 * por [tenantId, lancamentoId] e roda na leitura (lista/stats), refletindo os
 * recebíveis atuais sem precisar de cron.
 *
 * Disparo: por e-mail REAL, via notification-service (SMTP). Canais
 * WhatsApp/SMS/Ligação são REGISTRADOS como ação manual (sem sender no sistema).
 * O contato (e-mail do cliente) é resolvido sob demanda no order-service a
 * partir do pedidoId do lançamento — encaminhando o JWT do usuário.
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../../generated/client';
import {
  AcaoCobrancaDto,
  ConfiguracaoCobrancaDto,
  CriarTituloDto,
  DispararDto,
  ListarAcordosDto,
  ListarHistoricoDto,
  ListarTitulosDto,
  NegociarDto,
} from '../../dtos/cobranca/cobranca.dto';

const ORDER_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3005';
const NOTIFICATION_URL =
  process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3009';

const MS_DIA = 86_400_000;

/** Dias de atraso (>= 0) a partir da data de vencimento. */
function diasAtraso(dataVencimento: Date, hoje = new Date()): number {
  const diff = Math.floor((hoje.getTime() - new Date(dataVencimento).getTime()) / MS_DIA);
  return diff > 0 ? diff : 0;
}

/** Prioridade em função de dias de atraso e valor. */
function calcularPrioridade(dias: number, valor: number): 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA' {
  if (dias >= 60 || valor >= 5000) return 'CRITICA';
  if (dias >= 30 || valor >= 2000) return 'ALTA';
  if (dias >= 7) return 'MEDIA';
  return 'BAIXA';
}

/**
 * Score 0–100 de urgência da cobrança (heurística determinística, não é ML):
 * pondera atraso, valor e nº de tentativas. Maior = mais urgente/crítico.
 */
function calcularScoreIA(dias: number, valor: number, tentativas: number): number {
  const sAtraso = Math.min(dias, 90) * 0.7; // até ~63
  const sValor = Math.min(valor / 200, 25); // até 25
  const sTentativas = Math.min(tentativas * 3, 12); // até 12
  return Math.max(0, Math.min(100, Math.round(sAtraso + sValor + sTentativas)));
}

type TituloRow = {
  id: string;
  lancamentoId: string | null;
  clienteId: string | null;
  clienteNome: string;
  clienteTelefone: string | null;
  clienteEmail: string | null;
  descricao: string;
  valor: Prisma.Decimal;
  dataVencimento: Date;
  status: string;
  prioridade: string;
  tentativas: number;
  ultimaAcaoEm: Date | null;
  canalUltimaAcao: string | null;
  observacao: string | null;
};

const STATUS_ATIVOS = ['EM_ABERTO', 'EM_COBRANCA', 'NEGOCIANDO', 'ACORDO'] as const;

@Injectable()
export class CobrancaService {
  private readonly logger = new Logger(CobrancaService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Serialização (Decimal→number, Date→ISO, + campos calculados) ──────────

  private serializarTitulo(t: TituloRow) {
    const dias = diasAtraso(t.dataVencimento);
    const valor = Number(t.valor);
    return {
      id: t.id,
      lancamentoId: t.lancamentoId,
      clienteId: t.clienteId,
      clienteNome: t.clienteNome,
      clienteTelefone: t.clienteTelefone ?? '',
      clienteEmail: t.clienteEmail ?? '',
      descricao: t.descricao,
      valor,
      dataVencimento: t.dataVencimento.toISOString(),
      diasAtraso: dias,
      status: t.status,
      prioridade: t.prioridade,
      tentativas: t.tentativas,
      ultimaAcaoEm: t.ultimaAcaoEm ? t.ultimaAcaoEm.toISOString() : null,
      canalUltimaAcao: t.canalUltimaAcao,
      observacao: t.observacao,
      scoreIA: calcularScoreIA(dias, valor, t.tentativas),
    };
  }

  private serializarAcao(a: any) {
    return {
      id: a.id,
      tituloId: a.tituloId,
      clienteNome: a.clienteNome,
      tipo: a.tipo,
      mensagem: a.mensagem,
      status: a.status,
      automatica: a.automatica,
      criadoEm: a.criadoEm.toISOString(),
      // Enriquecimento opcional do histórico (a UI usa quando presente).
      valor: a.titulo ? Number(a.titulo.valor) : undefined,
      dataVencimento: a.titulo ? a.titulo.dataVencimento.toISOString() : undefined,
      diasAtraso: a.titulo ? diasAtraso(a.titulo.dataVencimento) : undefined,
    };
  }

  private serializarAcordo(a: any) {
    return {
      id: a.id,
      tituloId: a.tituloId,
      clienteId: a.clienteId,
      clienteNome: a.clienteNome,
      valorOriginal: Number(a.valorOriginal),
      descontoAplicado: Number(a.descontoAplicado),
      valorFinal: Number(a.valorFinal),
      numeroParcelas: a.numeroParcelas,
      parcelas: (a.parcelas ?? [])
        .slice()
        .sort((x: any, y: any) => x.numero - y.numero)
        .map((p: any) => ({
          numero: p.numero,
          valor: Number(p.valor),
          vencimento: p.vencimento.toISOString(),
          pago: p.pago,
          pagoEm: p.pagoEm ? p.pagoEm.toISOString() : null,
        })),
      status: a.status,
      criadoEm: a.criadoEm.toISOString(),
      observacao: a.observacao,
    };
  }

  private serializarConfig(c: any) {
    return {
      ativo: c.ativo,
      webhookN8n: c.webhookN8n ?? '',
      callbackUrl: c.callbackUrl ?? '',
      regras: Array.isArray(c.regras) ? c.regras : [],
      descontoMaximo: Number(c.descontoMaximo),
      parcelasMaximas: c.parcelasMaximas,
      horarioInicio: c.horarioInicio,
      horarioFim: c.horarioFim,
      pausarFimDeSemana: c.pausarFimDeSemana,
    };
  }

  // ─── Sincronização dos títulos a partir dos recebíveis ─────────────────────

  /**
   * Deriva/atualiza títulos dos lançamentos RECEITA vencidos e não pagos, e
   * reconcilia títulos cujo lançamento já foi pago/cancelado. Idempotente.
   */
  private async sincronizarTitulos(tenantId: string): Promise<void> {
    const hoje = new Date();

    const vencidos = await this.prisma.lancamento.findMany({
      where: {
        tenantId,
        tipo: 'RECEITA',
        status: { in: ['PENDENTE', 'ATRASADO', 'PARCIAL'] },
        dataVencimento: { lt: hoje },
      },
      select: {
        id: true,
        pedidoId: true,
        cliente: true,
        descricao: true,
        valor: true,
        dataVencimento: true,
      },
    });

    for (const l of vencidos) {
      const dias = diasAtraso(l.dataVencimento, hoje);
      const prioridade = calcularPrioridade(dias, Number(l.valor));
      try {
        await this.prisma.tituloCobranca.upsert({
          where: { tenantId_lancamentoId: { tenantId, lancamentoId: l.id } },
          create: {
            tenantId,
            lancamentoId: l.id,
            pedidoId: l.pedidoId ?? null,
            clienteNome: (l.cliente && l.cliente.trim()) || 'Cliente',
            descricao: l.descricao,
            valor: l.valor,
            dataVencimento: l.dataVencimento,
            status: 'EM_ABERTO',
            prioridade,
          },
          // NÃO sobrescreve status/tentativas/contato/observação — preserva o
          // estado de cobrança. Só reflete mudanças do recebível de origem.
          update: {
            valor: l.valor,
            dataVencimento: l.dataVencimento,
            descricao: l.descricao,
            prioridade,
            pedidoId: l.pedidoId ?? undefined,
          },
        });
      } catch (e: unknown) {
        // O upsert de unique COMPOSTO não é atômico no Prisma (SELECT→INSERT).
        // Duas leituras concorrentes (lista + stats no dashboard) podem inserir
        // o mesmo [tenant, lançamento] e a 2ª bate P2002. É corrida benigna: o
        // título já foi criado pela outra — ignora. Mesmo padrão do
        // lancamento.repository (EventoProcessado).
        if ((e as { code?: string })?.code !== 'P2002') throw e;
      }
    }

    // Reconciliação em LOTE (2 updateMany): título AINDA em aberto cujo lançamento
    // saiu do estado devedor. Exclui ACORDO/NEGOCIANDO — um acordo ativo governa
    // o encerramento (não fechar por baixa direta do lançamento).
    const ativos = await this.prisma.tituloCobranca.findMany({
      where: {
        tenantId,
        status: { in: ['EM_ABERTO', 'EM_COBRANCA'] },
        lancamentoId: { not: null },
      },
      select: { id: true, lancamentoId: true },
    });
    if (ativos.length > 0) {
      const lancs = await this.prisma.lancamento.findMany({
        where: { tenantId, id: { in: ativos.map((a) => a.lancamentoId as string) } },
        select: { id: true, status: true },
      });
      const pagosLanc = new Set(lancs.filter((l) => l.status === 'PAGO').map((l) => l.id));
      const cancLanc = new Set(lancs.filter((l) => l.status === 'CANCELADO').map((l) => l.id));
      const idsPagos = ativos.filter((t) => pagosLanc.has(t.lancamentoId as string)).map((t) => t.id);
      const idsPerd = ativos.filter((t) => cancLanc.has(t.lancamentoId as string)).map((t) => t.id);
      if (idsPagos.length) {
        await this.prisma.tituloCobranca.updateMany({
          where: { tenantId, id: { in: idsPagos } },
          data: { status: 'PAGO' },
        });
      }
      if (idsPerd.length) {
        await this.prisma.tituloCobranca.updateMany({
          where: { tenantId, id: { in: idsPerd } },
          data: { status: 'PERDIDO' },
        });
      }
    }
  }

  // ─── Listagem / estatísticas ───────────────────────────────────────────────

  async listar(tenantId: string, filtros: ListarTitulosDto) {
    await this.sincronizarTitulos(tenantId);

    const where: Prisma.TituloCobrancaWhereInput = { tenantId };
    if (filtros.status) where.status = filtros.status as any;
    if (filtros.prioridade) where.prioridade = filtros.prioridade as any;
    if (filtros.busca) {
      const termo = filtros.busca.trim();
      where.OR = [
        { clienteNome: { contains: termo, mode: 'insensitive' } },
        { descricao: { contains: termo, mode: 'insensitive' } },
        { clienteEmail: { contains: termo, mode: 'insensitive' } },
      ];
    }

    const titulos = await this.prisma.tituloCobranca.findMany({
      where,
      orderBy: { dataVencimento: 'asc' },
    });

    // diasMin/diasMax filtram sobre o atraso CALCULADO.
    const filtrados = titulos.filter((t) => {
      const dias = diasAtraso(t.dataVencimento);
      if (filtros.diasMin != null && dias < filtros.diasMin) return false;
      if (filtros.diasMax != null && dias > filtros.diasMax) return false;
      return true;
    });

    const pagina = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 100;
    const inicio = (pagina - 1) * limite;
    const pageItems = filtrados.slice(inicio, inicio + limite);

    return { dados: pageItems.map((t) => this.serializarTitulo(t as TituloRow)), total: filtrados.length };
  }

  async estatisticas(tenantId: string) {
    await this.sincronizarTitulos(tenantId);

    const [titulos, acordosAtivos, parcelasPagas, acordosTitulos] = await Promise.all([
      this.prisma.tituloCobranca.findMany({ where: { tenantId } }),
      this.prisma.acordoCobranca.count({ where: { tenantId, status: 'ATIVO' } }),
      this.prisma.parcelaAcordo.aggregate({ where: { tenantId, pago: true }, _sum: { valor: true } }),
      this.prisma.acordoCobranca.findMany({ where: { tenantId }, select: { tituloId: true } }),
    ]);

    const ativos = titulos.filter((t) => (STATUS_ATIVOS as readonly string[]).includes(t.status));
    const pagos = titulos.filter((t) => t.status === 'PAGO');
    const perdidos = titulos.filter((t) => t.status === 'PERDIDO');

    const totalVencido = ativos.reduce((s, t) => s + Number(t.valor), 0);
    const somaDias = ativos.reduce((s, t) => s + diasAtraso(t.dataVencimento), 0);
    // Recuperado = o EFETIVAMENTE recebido: parcelas de acordo pagas + títulos
    // PAGO sem acordo (quitação direta). NÃO conta o valor original de um título
    // negociado com desconto (senão um perdão de 100% inflaria a recuperação).
    const comAcordo = new Set(acordosTitulos.map((a) => a.tituloId));
    const valorParcelasPagas = Number(parcelasPagas._sum.valor ?? 0);
    const valorPagoDireto = pagos
      .filter((t) => !comAcordo.has(t.id))
      .reduce((s, t) => s + Number(t.valor), 0);
    const valorRecuperado = valorParcelasPagas + valorPagoDireto;
    const valorPerdido = perdidos.reduce((s, t) => s + Number(t.valor), 0);
    const baseRecuperacao = valorRecuperado + valorPerdido + totalVencido;

    const porPrioridade: Record<string, number> = { BAIXA: 0, MEDIA: 0, ALTA: 0, CRITICA: 0 };
    for (const t of ativos) porPrioridade[t.prioridade] = (porPrioridade[t.prioridade] ?? 0) + 1;

    const topCriticos = ativos
      .map((t) => ({
        titulo: t,
        score: calcularScoreIA(diasAtraso(t.dataVencimento), Number(t.valor), t.tentativas),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => this.serializarTitulo(x.titulo as TituloRow));

    return {
      totalVencido: Math.round(totalVencido * 100) / 100,
      emCobranca: titulos.filter((t) => t.status === 'EM_COBRANCA').length,
      negociando: titulos.filter((t) => t.status === 'NEGOCIANDO').length,
      acordo: titulos.filter((t) => t.status === 'ACORDO').length,
      acordosAtivos,
      // Recuperação = valor recebido sobre a base histórica (recebido + perdido + em aberto).
      taxaRecuperacao:
        baseRecuperacao > 0 ? Math.round((valorRecuperado / baseRecuperacao) * 1000) / 10 : 0,
      // Previsão simples: metade do que está em aberto (heurística conservadora).
      previsaoRecuperacao: Math.round(totalVencido * 0.5 * 100) / 100,
      mediaDiasAtraso: ativos.length ? Math.round(somaDias / ativos.length) : 0,
      porPrioridade,
      topCriticos,
      pagos: pagos.length,
      perdidos: perdidos.length,
      totalTitulos: titulos.length,
    };
  }

  async criarTitulo(tenantId: string, dto: CriarTituloDto) {
    const titulo = await this.prisma.tituloCobranca.create({
      data: {
        tenantId,
        lancamentoId: null,
        clienteId: dto.clienteId ?? null,
        clienteNome: dto.clienteNome,
        clienteTelefone: dto.clienteTelefone ?? null,
        clienteEmail: dto.clienteEmail ?? null,
        descricao: dto.descricao,
        valor: new Prisma.Decimal(dto.valor),
        dataVencimento: new Date(dto.dataVencimento),
        status: 'EM_ABERTO',
        prioridade: calcularPrioridade(diasAtraso(new Date(dto.dataVencimento)), dto.valor),
        observacao: dto.observacao ?? null,
      },
    });
    return this.serializarTitulo(titulo as TituloRow);
  }

  // ─── Contato + e-mail (integração cross-service) ───────────────────────────

  /** Resolve e-mail/clienteId do pedido no order-service (best-effort). */
  private async resolverContato(
    pedidoId: string,
    authorization?: string,
  ): Promise<{ clienteEmail: string | null; clienteId: string | null }> {
    try {
      const resp = await fetch(`${ORDER_URL}/api/v1/pedidos/${pedidoId}`, {
        headers: authorization ? { Authorization: authorization } : {},
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) return { clienteEmail: null, clienteId: null };
      const p: any = await resp.json();
      return { clienteEmail: p?.clienteEmail ?? null, clienteId: p?.clienteId ?? null };
    } catch (e) {
      this.logger.warn(`Falha ao resolver contato do pedido ${pedidoId}: ${String(e)}`);
      return { clienteEmail: null, clienteId: null };
    }
  }

  /** Envia e-mail via notification-service (SMTP). Retorna sucesso + detalhe. */
  private async enviarEmail(
    email: string,
    assunto: string,
    corpo: string,
    authorization?: string,
  ): Promise<{ ok: boolean; detalhe: string }> {
    try {
      const resp = await fetch(`${NOTIFICATION_URL}/api/v1/email/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify({ email, assunto, corpo }),
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        return { ok: false, detalhe: `HTTP ${resp.status} ${txt}`.slice(0, 400) };
      }
      const data: any = await resp.json().catch(() => ({}));
      return { ok: true, detalhe: data?.mensagemId ? String(data.mensagemId) : 'enviado' };
    } catch (e) {
      return { ok: false, detalhe: String(e).slice(0, 400) };
    }
  }

  /**
   * Garante o e-mail do título: usa o já salvo ou resolve no pedido e persiste.
   */
  private async garantirEmail(titulo: TituloRow, authorization?: string): Promise<string | null> {
    if (titulo.clienteEmail && titulo.clienteEmail.includes('@')) return titulo.clienteEmail;
    // Título manual sem e-mail e sem pedido de origem: nada a resolver.
    const pedidoId = (titulo as any).pedidoId as string | null;
    if (!pedidoId) return null;
    const { clienteEmail, clienteId } = await this.resolverContato(pedidoId, authorization);
    if (clienteEmail) {
      await this.prisma.tituloCobranca.update({
        where: { id: titulo.id },
        data: { clienteEmail, clienteId: clienteId ?? undefined },
      });
    }
    return clienteEmail;
  }

  // ─── Ações ─────────────────────────────────────────────────────────────────

  async registrarAcao(
    tenantId: string,
    tituloId: string,
    dto: AcaoCobrancaDto,
    authorization?: string,
  ) {
    const titulo = await this.prisma.tituloCobranca.findFirst({
      where: { id: tituloId, tenantId },
    });
    if (!titulo) throw new NotFoundException('Título de cobrança não encontrado');

    let status = 'ENVIADO';
    let detalhe: string | null = null;

    if (dto.tipo === 'EMAIL') {
      const email = await this.garantirEmail(titulo as TituloRow, authorization);
      if (!email) {
        status = 'FALHOU';
        detalhe = 'Cliente sem e-mail cadastrado';
      } else {
        const r = await this.enviarEmail(
          email,
          `Cobrança: ${titulo.descricao}`.slice(0, 120),
          dto.mensagem,
          authorization,
        );
        status = r.ok ? 'ENVIADO' : 'FALHOU';
        detalhe = r.detalhe;
      }
    }
    // WHATSAPP/SMS/LIGACAO: registrados como ação manual (sem sender no sistema).

    const acao = await this.prisma.acaoCobranca.create({
      data: {
        tenantId,
        tituloId,
        clienteNome: titulo.clienteNome,
        tipo: dto.tipo as any,
        mensagem: dto.mensagem,
        status: status as any,
        automatica: dto.automatica ?? false,
        detalhe,
      },
    });

    // Atualiza o título: tentativa, canal e passa a EM_COBRANCA se estava aberto.
    await this.prisma.tituloCobranca.update({
      where: { id: tituloId },
      data: {
        tentativas: { increment: 1 },
        ultimaAcaoEm: new Date(),
        canalUltimaAcao: dto.tipo,
        status: titulo.status === 'EM_ABERTO' ? 'EM_COBRANCA' : undefined,
      },
    });

    return this.serializarAcao(acao);
  }

  // ─── Negociação / Acordos ──────────────────────────────────────────────────

  async negociar(tenantId: string, tituloId: string, dto: NegociarDto) {
    const titulo = await this.prisma.tituloCobranca.findFirst({
      where: { id: tituloId, tenantId },
    });
    if (!titulo) throw new NotFoundException('Título de cobrança não encontrado');

    // Bloqueia estados terminais e já-negociados (evita reabrir/duplicar).
    if (['PAGO', 'PERDIDO', 'ACORDO'].includes(titulo.status)) {
      throw new BadRequestException(`Título com status ${titulo.status} não pode ser negociado.`);
    }

    // Governança: config ausente = default restritivo (deny). Valida SEMPRE — não
    // pode depender de a tela de config ter materializado a linha antes.
    const config = await this.prisma.configuracaoCobranca.findUnique({ where: { tenantId } });
    const descontoMaximo = config ? Number(config.descontoMaximo) : 0;
    const parcelasMaximas = config ? config.parcelasMaximas : 1;
    if (dto.descontoAplicado > descontoMaximo) {
      throw new BadRequestException(`Desconto acima do máximo permitido (${descontoMaximo}%).`);
    }
    if (dto.numeroParcelas > parcelasMaximas) {
      throw new BadRequestException(
        `Número de parcelas acima do máximo permitido (${parcelasMaximas}).`,
      );
    }

    const valorOriginal = Number(titulo.valor);
    const valorFinal = Math.round(valorOriginal * (1 - dto.descontoAplicado / 100) * 100) / 100;
    const base = dto.primeiroVencimento ? new Date(dto.primeiroVencimento) : new Date();

    // Distribui em CENTAVOS inteiros: base + 1 centavo nas primeiras `resto`
    // parcelas. Soma exata, nenhuma parcela negativa (piso >= 0).
    const totalCents = Math.round(valorFinal * 100);
    const baseCents = Math.floor(totalCents / dto.numeroParcelas);
    const resto = totalCents - baseCents * dto.numeroParcelas;
    const parcelas = Array.from({ length: dto.numeroParcelas }, (_, i) => {
      const venc = new Date(base);
      venc.setMonth(venc.getMonth() + i);
      const cents = baseCents + (i < resto ? 1 : 0);
      return { tenantId, numero: i + 1, valor: new Prisma.Decimal(cents / 100), vencimento: venc };
    });

    const acordo = await this.prisma.$transaction(async (tx) => {
      // Trava contra duplo-submit: só um acordo ATIVO por título.
      const existente = await tx.acordoCobranca.findFirst({
        where: { tenantId, tituloId, status: 'ATIVO' },
        select: { id: true },
      });
      if (existente) {
        throw new BadRequestException('Já existe um acordo ativo para este título.');
      }
      const criado = await tx.acordoCobranca.create({
        data: {
          tenantId,
          tituloId,
          clienteId: titulo.clienteId,
          clienteNome: titulo.clienteNome,
          valorOriginal: titulo.valor,
          descontoAplicado: new Prisma.Decimal(dto.descontoAplicado),
          valorFinal: new Prisma.Decimal(valorFinal),
          numeroParcelas: dto.numeroParcelas,
          status: 'ATIVO',
          observacao: dto.observacao ?? null,
          parcelas: { create: parcelas },
        },
        include: { parcelas: true },
      });
      await tx.tituloCobranca.update({ where: { id: tituloId }, data: { status: 'ACORDO' } });
      return criado;
    });

    return this.serializarAcordo(acordo);
  }

  async listarAcordos(tenantId: string, filtros: ListarAcordosDto) {
    const where: Prisma.AcordoCobrancaWhereInput = { tenantId };
    if (filtros.status) where.status = filtros.status as any;
    if (filtros.clienteId) where.clienteId = filtros.clienteId;

    const acordos = await this.prisma.acordoCobranca.findMany({
      where,
      include: { parcelas: true },
      orderBy: { criadoEm: 'desc' },
    });
    return { dados: acordos.map((a) => this.serializarAcordo(a)), total: acordos.length };
  }

  async pagarParcela(tenantId: string, acordoId: string, numeroParcela: number) {
    const acordo = await this.prisma.acordoCobranca.findFirst({
      where: { id: acordoId, tenantId },
      include: { parcelas: true },
    });
    if (!acordo) throw new NotFoundException('Acordo não encontrado');

    const parcela = acordo.parcelas.find((p) => p.numero === numeroParcela);
    if (!parcela) throw new NotFoundException('Parcela não encontrada');
    if (parcela.pago) throw new BadRequestException('Parcela já está paga');

    // Pagamento da parcela + fechamento do acordo/título numa ÚNICA transação:
    // uma falha reverte tudo (nada de parcela paga com acordo aberto).
    const todasPagas = acordo.parcelas.every((p) => p.id === parcela.id || p.pago);
    await this.prisma.$transaction(async (tx) => {
      await tx.parcelaAcordo.update({
        where: { id: parcela.id },
        data: { pago: true, pagoEm: new Date() },
      });
      if (todasPagas) {
        await tx.acordoCobranca.update({ where: { id: acordoId }, data: { status: 'CUMPRIDO' } });
        await tx.tituloCobranca.update({
          where: { id: acordo.tituloId },
          data: { status: 'PAGO' },
        });
      }
    });

    const atualizado = await this.prisma.acordoCobranca.findFirst({
      where: { id: acordoId, tenantId },
      include: { parcelas: true },
    });
    return this.serializarAcordo(atualizado);
  }

  // ─── Configuração / Régua ──────────────────────────────────────────────────

  async obterConfiguracao(tenantId: string) {
    // READ-ONLY: não materializa a linha numa leitura. Se materializasse com os
    // defaults restritivos (descontoMaximo=0/parcelasMaximas=1), toda negociação
    // passaria a ser barrada só por alguém ter aberto a tela. Sem linha =
    // defaults em memória (deny-by-default), coerente com o que `negociar` assume.
    const cfg = await this.prisma.configuracaoCobranca.findUnique({ where: { tenantId } });
    if (cfg) return this.serializarConfig(cfg);
    return {
      ativo: false,
      webhookN8n: '',
      callbackUrl: '',
      regras: [] as unknown[],
      descontoMaximo: 0,
      parcelasMaximas: 1,
      horarioInicio: '08:00',
      horarioFim: '18:00',
      pausarFimDeSemana: true,
    };
  }

  async salvarConfiguracao(tenantId: string, dto: ConfiguracaoCobrancaDto) {
    const data: Prisma.ConfiguracaoCobrancaUncheckedUpdateInput &
      Prisma.ConfiguracaoCobrancaUncheckedCreateInput = { tenantId } as any;
    if (dto.ativo != null) data.ativo = dto.ativo;
    if (dto.webhookN8n != null) data.webhookN8n = dto.webhookN8n;
    if (dto.callbackUrl != null) data.callbackUrl = dto.callbackUrl;
    if (dto.regras != null) data.regras = dto.regras as unknown as Prisma.InputJsonValue;
    if (dto.descontoMaximo != null) data.descontoMaximo = new Prisma.Decimal(dto.descontoMaximo);
    if (dto.parcelasMaximas != null) data.parcelasMaximas = dto.parcelasMaximas;
    if (dto.horarioInicio != null) data.horarioInicio = dto.horarioInicio;
    if (dto.horarioFim != null) data.horarioFim = dto.horarioFim;
    if (dto.pausarFimDeSemana != null) data.pausarFimDeSemana = dto.pausarFimDeSemana;

    const cfg = await this.prisma.configuracaoCobranca.upsert({
      where: { tenantId },
      create: data,
      update: data,
    });
    return this.serializarConfig(cfg);
  }

  // ─── Disparo em lote ───────────────────────────────────────────────────────

  async disparar(tenantId: string, dto: DispararDto, authorization?: string) {
    await this.sincronizarTitulos(tenantId);

    const where: Prisma.TituloCobrancaWhereInput = {
      tenantId,
      status: { in: ['EM_ABERTO', 'EM_COBRANCA', 'NEGOCIANDO'] },
    };
    if (dto.ids && dto.ids.length > 0) {
      where.id = { in: dto.ids };
    } else if (dto.filtro) {
      if (dto.filtro.prioridade) where.prioridade = dto.filtro.prioridade as any;
    }

    let alvos = await this.prisma.tituloCobranca.findMany({ where });
    if (dto.filtro?.diasMin != null) {
      alvos = alvos.filter((t) => diasAtraso(t.dataVencimento) >= (dto.filtro!.diasMin as number));
    }

    const config = await this.prisma.configuracaoCobranca.findUnique({ where: { tenantId } });
    const acoes: any[] = [];

    for (const titulo of alvos) {
      const dias = diasAtraso(titulo.dataVencimento);
      const mensagem = this.montarMensagem(titulo.clienteNome, titulo.descricao, Number(titulo.valor), dias, config);
      const email = await this.garantirEmail(titulo as TituloRow, authorization);
      let status = 'ENVIADO';
      let detalhe: string | null = null;
      if (!email) {
        status = 'FALHOU';
        detalhe = 'Cliente sem e-mail cadastrado';
      } else {
        const r = await this.enviarEmail(
          email,
          `Cobrança: ${titulo.descricao}`.slice(0, 120),
          mensagem,
          authorization,
        );
        status = r.ok ? 'ENVIADO' : 'FALHOU';
        detalhe = r.detalhe;
      }

      const acao = await this.prisma.acaoCobranca.create({
        data: {
          tenantId,
          tituloId: titulo.id,
          clienteNome: titulo.clienteNome,
          tipo: 'EMAIL',
          mensagem,
          status: status as any,
          automatica: true,
          detalhe,
        },
      });
      await this.prisma.tituloCobranca.update({
        where: { id: titulo.id },
        data: {
          tentativas: { increment: 1 },
          ultimaAcaoEm: new Date(),
          canalUltimaAcao: 'EMAIL',
          status: titulo.status === 'EM_ABERTO' ? 'EM_COBRANCA' : undefined,
        },
      });
      acoes.push(this.serializarAcao(acao));
    }

    return {
      disparados: acoes.length,
      acoes,
      erroWebhook: null,
      webhookUrl: config?.webhookN8n ?? null,
    };
  }

  private montarMensagem(
    nome: string,
    descricao: string,
    valor: number,
    dias: number,
    config: any,
  ): string {
    // Usa o template da régua correspondente à faixa de atraso, se houver.
    const regras: any[] = Array.isArray(config?.regras) ? config.regras : [];
    const regra = regras
      .filter((r) => r?.ativo && Number(r.diasAtraso) <= dias)
      .sort((a, b) => Number(b.diasAtraso) - Number(a.diasAtraso))[0];
    const valorFmt = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (regra?.template) {
      return String(regra.template)
        .replace(/\{nome\}/g, nome)
        .replace(/\{valor\}/g, valorFmt)
        .replace(/\{dias\}/g, String(dias))
        .replace(/\{descricao\}/g, descricao);
    }
    return (
      `Olá, ${nome}. Consta em aberto o título "${descricao}" no valor de ${valorFmt}, ` +
      `com ${dias} dia(s) de atraso. Por favor, regularize ou entre em contato para negociar.`
    );
  }

  // ─── Histórico ─────────────────────────────────────────────────────────────

  async historico(tenantId: string, filtros: ListarHistoricoDto) {
    const where: Prisma.AcaoCobrancaWhereInput = { tenantId };
    if (filtros.tituloId) where.tituloId = filtros.tituloId;
    if (filtros.tipo) where.tipo = filtros.tipo as any;
    if (filtros.status) where.status = filtros.status as any;
    if (filtros.dataInicio || filtros.dataFim) {
      where.criadoEm = {};
      if (filtros.dataInicio) (where.criadoEm as any).gte = new Date(filtros.dataInicio);
      if (filtros.dataFim) (where.criadoEm as any).lte = new Date(filtros.dataFim);
    }
    if (filtros.busca) {
      const termo = filtros.busca.trim();
      where.OR = [
        { clienteNome: { contains: termo, mode: 'insensitive' } },
        { mensagem: { contains: termo, mode: 'insensitive' } },
      ];
    }

    const acoes = await this.prisma.acaoCobranca.findMany({
      where,
      include: { titulo: true },
      orderBy: { criadoEm: 'desc' },
      take: 500,
    });
    return { dados: acoes.map((a) => this.serializarAcao(a)), total: acoes.length };
  }
}
