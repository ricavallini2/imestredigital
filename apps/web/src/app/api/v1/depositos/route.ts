import { NextRequest, NextResponse } from 'next/server';
import { DEPOSITOS_MOCK } from '../estoque/_mock-data';

export async function GET() {
  return NextResponse.json(DEPOSITOS_MOCK);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, descricao, endereco, area, responsavel } = body;
  if (!nome) return NextResponse.json({ message: 'nome é obrigatório' }, { status: 400 });

  const novo = {
    id: `dep-${Date.now()}`,
    nome, descricao, endereco,
    area: Number(area) || 0,
    responsavel: responsavel ?? '',
    ativo: true,
  };
  DEPOSITOS_MOCK.push(novo);
  return NextResponse.json(novo, { status: 201 });
}
