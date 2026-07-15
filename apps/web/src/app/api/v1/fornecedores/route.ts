import { NextRequest, NextResponse } from 'next/server';
import { FornecedorMock, FORNECEDORES_MOCK, TipoPessoa } from './_mock-data';

// CONTRATO: parceiro-unificado (papel FORNECEDOR). Ver docs/design/parceiro-unificado.md
// e o cabeçalho de _mock-data.ts. Suporta PF (MEI/autônomo) e PJ.
// TODO(unificação): substituir por /v1/clientes?papel=FORNECEDOR (já implementado lá).

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  const status = searchParams.get('status') ?? '';

  let lista = [...FORNECEDORES_MOCK];

  if (busca) {
    lista = lista.filter(
      (f) =>
        f.razaoSocial.toLowerCase().includes(busca) ||
        (f.nome ?? '').toLowerCase().includes(busca) ||
        f.nomeFantasia.toLowerCase().includes(busca) ||
        f.cnpj.includes(busca) ||
        (f.cpf ?? '').includes(busca) ||
        f.email.toLowerCase().includes(busca),
    );
  }

  if (status) {
    lista = lista.filter((f) => f.status === status.toUpperCase());
  }

  return NextResponse.json({ dados: lista, total: lista.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const tipo: TipoPessoa = body.tipo === 'PF' ? 'PF' : 'PJ';
  // PF: identificação social espelha o nome completo (mantém lista/cards consistentes).
  const razaoSocial = body.razaoSocial || body.nome || ''

  const novo: FornecedorMock = {
    id: `f-${Date.now()}`,
    tipo,
    razaoSocial,
    nomeFantasia: body.nomeFantasia || razaoSocial,
    nome: tipo === 'PF' ? body.nome || razaoSocial : undefined,
    // Documentos por tipo de pessoa. PF grava cnpj '' (campo obrigatório no shape).
    cnpj: tipo === 'PJ' ? body.cnpj || '' : '',
    cpf: tipo === 'PF' ? body.cpf : undefined,
    rg: tipo === 'PF' ? body.rg : undefined,
    // Fiscais (PJ). IE vazia quando isento.
    inscricaoEstadual: tipo === 'PJ' ? (body.ieIsento ? '' : body.inscricaoEstadual) : undefined,
    ieIsento: tipo === 'PJ' ? Boolean(body.ieIsento) : undefined,
    inscricaoMunicipal: tipo === 'PJ' ? body.inscricaoMunicipal : undefined,
    regimeTributario: tipo === 'PJ' ? body.regimeTributario : undefined,
    email: body.email || '',
    telefone: body.telefone || '',
    endereco: body.endereco || {
      logradouro: '', numero: '', bairro: '', cidade: '', uf: '', cep: '',
    },
    status: 'ATIVO',
    totalCompras: 0,
    qtdCompras: 0,
    prazoMedioPagamento: body.prazoMedioPagamento || 30,
    criadoEm: new Date().toISOString(),
  };

  FORNECEDORES_MOCK.unshift(novo);
  return NextResponse.json(novo, { status: 201 });
}
