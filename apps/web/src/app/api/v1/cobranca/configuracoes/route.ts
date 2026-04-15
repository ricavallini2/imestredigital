import { NextRequest, NextResponse } from 'next/server';
import { getConfiguracao } from '../_mock-data';

export async function GET() {
  return NextResponse.json(getConfiguracao());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const config = getConfiguracao();
  Object.assign(config, body);
  if (body.regras) config.regras = body.regras;
  return NextResponse.json(config);
}
