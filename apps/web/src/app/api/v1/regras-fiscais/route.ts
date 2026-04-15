import { NextRequest, NextResponse } from 'next/server';
import { getRegras, addRegra, updateRegra, type RegraFiscalMock } from '../notas-fiscais/_mock-data';

// GET /api/v1/regras-fiscais
export async function GET(req: NextRequest) {
  const sp    = req.nextUrl.searchParams;
  const busca = sp.get('busca')?.toLowerCase() ?? '';
  let regras  = getRegras().slice();

  if (busca) {
    regras = regras.filter(r =>
      r.ncm.includes(busca) || r.descricaoNCM.toLowerCase().includes(busca)
    );
  }
  return NextResponse.json({ regras, total: regras.length });
}

// POST /api/v1/regras-fiscais
export async function POST(req: NextRequest) {
  const body = await req.json();
  const nova: RegraFiscalMock = {
    id: `r-${Date.now()}`,
    ncm: body.ncm,
    descricaoNCM: body.descricaoNCM ?? '',
    cfopEstadual: body.cfopEstadual ?? '5102',
    cfopInterestadual: body.cfopInterestadual ?? '6102',
    cst: body.cst,
    csosn: body.csosn,
    aliquotaICMS: body.aliquotaICMS ?? 12,
    aliquotaPIS: body.aliquotaPIS ?? 0.65,
    aliquotaCOFINS: body.aliquotaCOFINS ?? 3,
    aliquotaIPI: body.aliquotaIPI,
    observacao: body.observacao,
    ativo: body.ativo ?? true,
  };
  addRegra(nova);
  return NextResponse.json(nova, { status: 201 });
}
