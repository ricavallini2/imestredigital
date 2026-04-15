import { NextRequest, NextResponse } from 'next/server';
import { FORNECEDORES_MOCK } from '../_mock-data';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const fornecedor = FORNECEDORES_MOCK.find((f) => f.id === params.id);
  if (!fornecedor) {
    return NextResponse.json({ message: 'Fornecedor não encontrado' }, { status: 404 });
  }
  return NextResponse.json(fornecedor);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const idx = FORNECEDORES_MOCK.findIndex((f) => f.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Fornecedor não encontrado' }, { status: 404 });
  }

  const body = await req.json();
  FORNECEDORES_MOCK[idx] = { ...FORNECEDORES_MOCK[idx], ...body };
  return NextResponse.json(FORNECEDORES_MOCK[idx]);
}
