import { NextResponse } from 'next/server';
import { PEDIDOS_MOCK } from '../pedidos/_mock-data';
import { SALDOS_MOCK } from '../estoque/_mock-data';
import { TITULOS_COBRANCA_MOCK } from '../cobranca/_mock-data';
import { getNotasFiscais } from '../notas-fiscais/_mock-data';
import { PERGUNTAS_MOCK } from '../marketplaces/_mock-data';

export interface NotificacaoItem {
  id: string
  tipo: 'pedido' | 'estoque' | 'cobranca' | 'fiscal' | 'marketplace'
  prioridade: 'critica' | 'alta' | 'normal'
  titulo: string
  desc: string
  href: string
  criadoEm: string
}

const moeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export async function GET() {
  const notifs: NotificacaoItem[] = [];

  // ── 1. Pedidos urgentes (PENDENTE / CONFIRMADO) ──────────────────────────
  try {
    const urgentes = (PEDIDOS_MOCK ?? [])
      .filter(p => ['PENDENTE', 'CONFIRMADO'].includes(p.status))
      .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
      .slice(0, 5);

    for (const p of urgentes) {
      const horasAtraso = Math.floor(
        (Date.now() - new Date(p.criadoEm).getTime()) / 3_600_000,
      );
      notifs.push({
        id: `pedido-${p.id}`,
        tipo: 'pedido',
        prioridade: horasAtraso >= 4 ? 'alta' : 'normal',
        titulo: p.status === 'PENDENTE' ? 'Pedido aguardando confirmação' : 'Pedido confirmado em processamento',
        desc: `${p.numero} · ${p.cliente} · ${moeda(p.valor)}`,
        href: '/dashboard/pedidos',
        criadoEm: p.criadoEm,
      });
    }
  } catch { /* módulo não inicializado */ }

  // ── 2. Alertas de estoque ────────────────────────────────────────────────
  try {
    const alertas = (SALDOS_MOCK ?? [])
      .filter(s => s.status !== 'NORMAL')
      .sort((a, b) => {
        const ord = { SEM_ESTOQUE: 0, CRITICO: 1, BAIXO: 2, NORMAL: 3 };
        return (ord[a.status as keyof typeof ord] ?? 3) - (ord[b.status as keyof typeof ord] ?? 3);
      })
      .slice(0, 5);

    for (const s of alertas) {
      const prioridade = s.status === 'SEM_ESTOQUE' ? 'critica'
        : s.status === 'CRITICO' ? 'alta' : 'normal';
      const titulo = s.status === 'SEM_ESTOQUE' ? 'Produto sem estoque'
        : s.status === 'CRITICO' ? 'Estoque crítico' : 'Estoque baixo';
      notifs.push({
        id: `estoque-${s.produtoId}-${s.depositoId ?? ''}`,
        tipo: 'estoque',
        prioridade,
        titulo,
        desc: `${s.produto} (${s.sku}) · ${s.disponivel} un. disponível`,
        href: '/dashboard/estoque',
        criadoEm: new Date().toISOString(),
      });
    }
  } catch { /* módulo não inicializado */ }

  // ── 3. Cobranças críticas / altas ────────────────────────────────────────
  try {
    const titulos = (TITULOS_COBRANCA_MOCK ?? [])
      .filter(t => ['CRITICA', 'ALTA'].includes(t.prioridade) && !['PAGO', 'PERDIDO'].includes(t.status))
      .sort((a, b) => b.diasAtraso - a.diasAtraso)
      .slice(0, 4);

    for (const t of titulos) {
      notifs.push({
        id: `cobranca-${t.id}`,
        tipo: 'cobranca',
        prioridade: t.prioridade === 'CRITICA' ? 'critica' : 'alta',
        titulo: `Cobrança ${t.prioridade === 'CRITICA' ? 'crítica' : 'alta'} — ${t.diasAtraso}d em atraso`,
        desc: `${t.clienteNome} · ${moeda(t.valor)}`,
        href: '/dashboard/cobranca',
        criadoEm: t.dataVencimento,
      });
    }
  } catch { /* módulo não inicializado */ }

  // ── 4. NF-e com erro ────────────────────────────────────────────────────
  try {
    const nfsComErro = getNotasFiscais()
      .filter(n => ['REJEITADA', 'DENEGADA'].includes(n.status))
      .slice(0, 3);

    for (const n of nfsComErro) {
      notifs.push({
        id: `fiscal-${n.id}`,
        tipo: 'fiscal',
        prioridade: 'critica',
        titulo: `NF-e ${n.status === 'REJEITADA' ? 'rejeitada' : 'denegada'} pela SEFAZ`,
        desc: `Nota #${n.numero} · ${n.destinatario}${n.motivoRejeicao ? ` · ${n.motivoRejeicao}` : ''}`,
        href: `/dashboard/fiscal/${n.id}`,
        criadoEm: n.atualizadoEm,
      });
    }
  } catch { /* módulo não inicializado */ }

  // ── 5. Perguntas de marketplace pendentes ────────────────────────────────
  try {
    const perguntas = (PERGUNTAS_MOCK ?? [])
      .filter(p => p.status === 'PENDENTE')
      .sort((a, b) => {
        if (a.prioridade === b.prioridade) return a.dataPergunta.localeCompare(b.dataPergunta);
        return a.prioridade === 'URGENTE' ? -1 : 1;
      })
      .slice(0, 4);

    for (const p of perguntas) {
      const horas = Math.floor(
        (Date.now() - new Date(p.dataPergunta).getTime()) / 3_600_000,
      );
      notifs.push({
        id: `marketplace-${p.id}`,
        tipo: 'marketplace',
        prioridade: p.prioridade === 'URGENTE' ? 'alta' : 'normal',
        titulo: p.prioridade === 'URGENTE' ? 'Pergunta urgente sem resposta' : 'Pergunta pendente no marketplace',
        desc: `${p.canal.replace('_', ' ')} · ${p.comprador} · ${horas}h atrás`,
        href: '/dashboard/marketplaces/perguntas',
        criadoEm: p.dataPergunta,
      });
    }
  } catch { /* módulo não inicializado */ }

  // Ordena: críticas primeiro, depois altas, depois normais; dentro de cada grupo, mais recente primeiro
  const ordemPrioridade = { critica: 0, alta: 1, normal: 2 };
  notifs.sort((a, b) => {
    const dp = ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade];
    if (dp !== 0) return dp;
    return b.criadoEm.localeCompare(a.criadoEm);
  });

  return NextResponse.json(notifs.slice(0, 15));
}
