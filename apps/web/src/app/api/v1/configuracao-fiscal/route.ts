import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig } from '../notas-fiscais/_mock-data';

// GET /api/v1/configuracao-fiscal
export async function GET() {
  return NextResponse.json(getConfig());
}

// PUT /api/v1/configuracao-fiscal
export async function PUT(req: NextRequest) {
  const body    = await req.json();
  const updated = updateConfig(body);
  return NextResponse.json(updated);
}
