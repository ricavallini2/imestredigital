import { NextRequest, NextResponse } from 'next/server';
import { ANUNCIOS_MOCK } from '../../_mock-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const anuncio = ANUNCIOS_MOCK.find((a) => a.id === id);
  if (!anuncio) {
    return NextResponse.json({ erro: 'Anúncio não encontrado' }, { status: 404 });
  }

  return NextResponse.json(anuncio);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const idx = ANUNCIOS_MOCK.findIndex((a) => a.id === id);
  if (idx === -1) {
    return NextResponse.json({ erro: 'Anúncio não encontrado' }, { status: 404 });
  }

  const body = await req.json();
  const atual = ANUNCIOS_MOCK[idx];

  // Permite atualizar: preco, precoPromocional, status, estoque
  const atualizado = {
    ...atual,
    ...(body.preco !== undefined && { preco: Number(body.preco) }),
    ...(body.precoPromocional !== undefined && { precoPromocional: body.precoPromocional === null ? undefined : Number(body.precoPromocional) }),
    ...(body.status !== undefined && { status: body.status }),
    ...(body.estoque !== undefined && { estoque: Number(body.estoque) }),
    atualizadoEm: new Date().toISOString(),
  };

  // Se estoque vai a 0, o anúncio é pausado automaticamente (StatusAnuncio Prisma
  // não tem SEM_ESTOQUE; a falta de estoque é representada por estoque === 0)
  if (atualizado.estoque === 0 && atualizado.status === 'ATIVO') {
    atualizado.status = 'PAUSADO';
  }
  // Se o estoque volta e o anúncio estava pausado por falta de estoque, reativa
  if (atualizado.estoque > 0 && atual.estoque === 0 && atual.status === 'PAUSADO') {
    atualizado.status = 'ATIVO';
  }

  ANUNCIOS_MOCK[idx] = atualizado;
  return NextResponse.json(atualizado);
}
