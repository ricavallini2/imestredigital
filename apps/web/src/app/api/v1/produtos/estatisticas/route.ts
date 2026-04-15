import { NextResponse } from 'next/server';
import { PRODUTOS_MOCK } from '../_mock-data';

export async function GET() {
  const ativos = PRODUTOS_MOCK.filter(p => p.status === 'ATIVO').length;
  const inativos = PRODUTOS_MOCK.filter(p => p.status === 'INATIVO').length;
  const rascunhos = PRODUTOS_MOCK.filter(p => p.status === 'RASCUNHO').length;
  const semEstoque = PRODUTOS_MOCK.filter(p => p.estoque === 0).length;
  const estoqueMinimo = PRODUTOS_MOCK.filter(p => p.estoque > 0 && p.estoque <= p.estoqueMinimo).length;
  const valorCatalogo = PRODUTOS_MOCK.reduce((acc, p) => acc + p.preco * p.estoque, 0);
  const receitaTotal = PRODUTOS_MOCK.reduce((acc, p) => acc + p.receitaTotal, 0);
  const margemMedia = PRODUTOS_MOCK.filter(p => p.status === 'ATIVO').reduce((acc, p) => acc + p.margemLucro, 0) / ativos;

  const categorias = Object.entries(
    PRODUTOS_MOCK.reduce((acc, p) => ({ ...acc, [p.categoria]: (acc[p.categoria] || 0) + 1 }), {} as Record<string, number>)
  ).map(([nome, total]) => ({ nome, total })).sort((a, b) => b.total - a.total);

  return NextResponse.json({
    total: PRODUTOS_MOCK.length, ativos, inativos, rascunhos,
    semEstoque, estoqueMinimo,
    valorCatalogo: parseFloat(valorCatalogo.toFixed(2)),
    receitaTotal: parseFloat(receitaTotal.toFixed(2)),
    margemMedia: parseFloat(margemMedia.toFixed(1)),
    categorias,
  });
}
