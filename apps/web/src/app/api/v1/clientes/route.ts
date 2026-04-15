import { NextRequest, NextResponse } from 'next/server';
import { CLIENTES_MOCK, TENANT_ID } from './_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  const status = searchParams.get('status') ?? '';
  const tipo = searchParams.get('tipo') ?? '';
  const origem = searchParams.get('origem') ?? '';
  const pagina = parseInt(searchParams.get('pagina') ?? '1');
  const limite = parseInt(searchParams.get('limite') ?? '20');

  let resultado = [...CLIENTES_MOCK];

  if (busca) {
    resultado = resultado.filter(
      (c) =>
        c.nome.toLowerCase().includes(busca) ||
        c.email.toLowerCase().includes(busca) ||
        (c.cnpj && c.cnpj.includes(busca)) ||
        (c.cpf && c.cpf.includes(busca)),
    );
  }
  if (status) resultado = resultado.filter((c) => c.status === status);
  if (tipo) resultado = resultado.filter((c) => c.tipo === tipo);
  if (origem) resultado = resultado.filter((c) => c.origem === origem);

  const total = resultado.length;
  const inicio = (pagina - 1) * limite;
  const dados = resultado.slice(inicio, inicio + limite);

  return NextResponse.json({ dados, total, pagina, limite, totalPaginas: Math.ceil(total / limite) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const novoCliente = {
    id: `c${Date.now()}-demo`,
    tenantId: TENANT_ID,
    score: 50,
    totalCompras: 0,
    quantidadePedidos: 0,
    ultimaCompra: null,
    tags: [],
    enderecos: [],
    contatos: [],
    interacoes: [],
    criadoEm: new Date().toISOString(),
    status: 'ATIVO',
    ...body,
  };
  return NextResponse.json(novoCliente, { status: 201 });
}
