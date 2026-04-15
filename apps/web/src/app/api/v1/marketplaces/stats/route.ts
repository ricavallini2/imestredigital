import { NextResponse } from 'next/server';
import {
  MARKETPLACES_MOCK,
  ANUNCIOS_MOCK,
  PERGUNTAS_MOCK,
  VENDAS_POR_CANAL,
} from '../_mock-data';

interface HealthIssue {
  tipo: string;
  descricao: string;
}

interface HealthScore {
  canal: string;
  nome: string;
  score: number; // 0-100
  issues: HealthIssue[];
}

function calcularHealthScore(canal: string, nome: string): HealthScore {
  const mkp = MARKETPLACES_MOCK.find((m) => m.canal === canal);
  const issues: HealthIssue[] = [];
  let score = 100;

  if (!mkp) return { canal, nome, score: 0, issues: [{ tipo: 'DESCONECTADO', descricao: 'Marketplace não encontrado' }] };

  if (mkp.status === 'ERRO') {
    score -= 40;
    issues.push({ tipo: 'CONEXAO', descricao: 'Erro na conexão com o marketplace' });
  }
  if (mkp.status === 'PAUSADO') {
    score -= 20;
    issues.push({ tipo: 'PAUSADO', descricao: 'Marketplace pausado' });
  }
  if (mkp.taxaResposta < 90) {
    score -= 15;
    issues.push({ tipo: 'RESPOSTA', descricao: `Taxa de resposta baixa: ${mkp.taxaResposta}%` });
  }
  if (mkp.taxaReclamacao > 2) {
    score -= 20;
    issues.push({ tipo: 'RECLAMACAO', descricao: `Taxa de reclamação alta: ${mkp.taxaReclamacao}%` });
  }
  if (mkp.perguntasPendentes > 10) {
    score -= 10;
    issues.push({ tipo: 'PERGUNTAS', descricao: `${mkp.perguntasPendentes} perguntas sem resposta` });
  }
  if (mkp.avaliacaoVendedor < 4.5) {
    score -= 10;
    issues.push({ tipo: 'AVALIACAO', descricao: `Avaliação abaixo do ideal: ${mkp.avaliacaoVendedor}` });
  }

  const semEstoque = ANUNCIOS_MOCK.filter(
    (a) => a.canal === canal && a.status === 'SEM_ESTOQUE',
  ).length;
  if (semEstoque > 0) {
    score -= Math.min(semEstoque * 3, 15);
    issues.push({ tipo: 'ESTOQUE', descricao: `${semEstoque} anúncios sem estoque` });
  }

  return { canal, nome, score: Math.max(0, score), issues };
}

export async function GET() {
  const totalReceita = MARKETPLACES_MOCK.reduce((s, m) => s + m.receitaMes, 0);
  const totalReceitaLiquida = MARKETPLACES_MOCK.reduce((s, m) => s + m.receitaLiquidaMes, 0);
  const totalPedidosMes = MARKETPLACES_MOCK.reduce((s, m) => s + m.pedidosMes, 0);
  const totalAnuncios = ANUNCIOS_MOCK.filter((a) => a.status === 'ATIVO').length;
  const perguntasPendentes = PERGUNTAS_MOCK.filter((p) => p.status === 'PENDENTE').length;

  const mkpsConectados = MARKETPLACES_MOCK.filter((m) => m.status === 'CONECTADO');
  const taxaRespostaMedia =
    mkpsConectados.length > 0
      ? Math.round(
          mkpsConectados.reduce((s, m) => s + m.taxaResposta, 0) / mkpsConectados.length,
        )
      : 0;

  const avaliacaoMedia =
    mkpsConectados.length > 0
      ? Number(
          (
            mkpsConectados.reduce((s, m) => s + m.avaliacaoVendedor, 0) /
            mkpsConectados.length
          ).toFixed(1),
        )
      : 0;

  // Top 5 anúncios por receita30d
  const topAnuncios = [...ANUNCIOS_MOCK]
    .filter((a) => a.receita30d > 0)
    .sort((a, b) => b.receita30d - a.receita30d)
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      titulo: a.titulo,
      canal: a.canal,
      sku: a.sku,
      preco: a.preco,
      vendas30d: a.vendas30d,
      receita30d: a.receita30d,
      conversao: a.conversao,
      estoque: a.estoque,
    }));

  // Crescimento: receita mês atual vs mês anterior (usando VENDAS_POR_CANAL)
  const mesesDisponiveis = [...new Set(VENDAS_POR_CANAL.map((v) => v.mes))].sort();
  let crescimentoMes = 0;
  if (mesesDisponiveis.length >= 2) {
    const mesAtual   = mesesDisponiveis[mesesDisponiveis.length - 1];
    const mesAnterior = mesesDisponiveis[mesesDisponiveis.length - 2];
    const recAtual   = VENDAS_POR_CANAL.filter((v) => v.mes === mesAtual).reduce((s, v) => s + v.receita, 0);
    const recAnterior = VENDAS_POR_CANAL.filter((v) => v.mes === mesAnterior).reduce((s, v) => s + v.receita, 0);
    if (recAnterior > 0) {
      crescimentoMes = Number((((recAtual - recAnterior) / recAnterior) * 100).toFixed(1));
    }
  }

  // Health score por canal
  const healthScore: HealthScore[] = [
    calcularHealthScore('MERCADO_LIVRE', 'Mercado Livre'),
    calcularHealthScore('SHOPEE', 'Shopee'),
    calcularHealthScore('AMAZON', 'Amazon'),
    calcularHealthScore('SHOPIFY', 'Shopify'),
  ];

  return NextResponse.json({
    totalReceita,
    totalReceitaLiquida,
    totalPedidosMes,
    totalAnuncios,
    perguntasPendentes,
    taxaRespostaMedia,
    avaliacaoMedia,
    topAnuncios,
    vendasPorCanal: VENDAS_POR_CANAL,
    crescimentoMes,
    healthScore,
  });
}
