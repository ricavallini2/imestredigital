import { NextRequest, NextResponse } from 'next/server';
import { findProduto, PRODUTOS_MOCK, derivarPrecos } from '../_mock-data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = findProduto(id);
  if (!p) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PRODUTOS_MOCK.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
  const body = await req.json();
  const novasVariacoes: { precoCusto?: number; preco?: number; estoque?: number }[] = body.variacoes ?? PRODUTOS_MOCK[idx].variacoes;
  const estoqueCalculado = novasVariacoes.length > 0
    ? novasVariacoes.reduce((s, v) => s + (Number(v.estoque) || 0), 0)
    : (body.estoque ?? PRODUTOS_MOCK[idx].estoque);
  const { preco: precoDerivado, precoCusto: precoCustoDerivado, margemLucro: margemDerivada } = derivarPrecos(
    novasVariacoes.map((v, i) => ({ id: String(i), tipo: '', valor: '', ...v, estoque: Number(v.estoque) || 0 }))
  );
  const atualizado = {
    ...PRODUTOS_MOCK[idx],
    ...body,
    preco: precoDerivado || body.preco || PRODUTOS_MOCK[idx].preco,
    precoCusto: precoCustoDerivado || body.precoCusto || PRODUTOS_MOCK[idx].precoCusto,
    estoque: estoqueCalculado,
    margemLucro: margemDerivada || PRODUTOS_MOCK[idx].margemLucro,
    atualizadoEm: new Date().toISOString(),
  };
  PRODUTOS_MOCK[idx] = atualizado;
  return NextResponse.json(atualizado);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = PRODUTOS_MOCK.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
  PRODUTOS_MOCK[idx] = { ...PRODUTOS_MOCK[idx], status: 'INATIVO', atualizadoEm: new Date().toISOString() };
  return NextResponse.json({ id, status: 'INATIVO' });
}
