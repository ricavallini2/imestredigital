import { NextRequest, NextResponse } from 'next/server';
export { FornecedorMock, FORNECEDORES_MOCK } from './_mock-data';
import { FornecedorMock, FORNECEDORES_MOCK } from './_mock-data';

// Helper kept for INITIAL_FORNECEDORES reference
const d = (diasAtras: number) => new Date(Date.now() - diasAtras * 86400000).toISOString();

const INITIAL_FORNECEDORES: FornecedorMock[] = [
  {
    id: 'f-001',
    razaoSocial: 'Tech Distribuidora Ltda',
    nomeFantasia: 'TechDist',
    cnpj: '12.345.678/0001-90',
    inscricaoEstadual: '123.456.789.000',
    email: 'compras@techdist.com.br',
    telefone: '(11) 3456-7890',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: 'Sala 501',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
    },
    status: 'ATIVO',
    totalCompras: 145000,
    qtdCompras: 12,
    ultimaCompra: d(5),
    prazoMedioPagamento: 30,
    criadoEm: d(180),
  },
  {
    id: 'f-002',
    razaoSocial: 'Eletrônicos Brasil S.A.',
    nomeFantasia: 'ElecBrasil',
    cnpj: '98.765.432/0001-10',
    inscricaoEstadual: '987.654.321.000',
    email: 'fornecedor@elecbrasil.com.br',
    telefone: '(21) 2345-6789',
    endereco: {
      logradouro: 'Rua da Assembleia',
      numero: '200',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      uf: 'RJ',
      cep: '20011-000',
    },
    status: 'ATIVO',
    totalCompras: 89000,
    qtdCompras: 8,
    ultimaCompra: d(12),
    prazoMedioPagamento: 45,
    criadoEm: d(150),
  },
  {
    id: 'f-003',
    razaoSocial: 'Moda Fashion Importações Ltda',
    nomeFantasia: 'Moda Fashion',
    cnpj: '45.678.901/0001-23',
    inscricaoEstadual: '456.789.012.000',
    email: 'contato@modafashion.com.br',
    telefone: '(48) 3456-7890',
    endereco: {
      logradouro: 'Rua das Palmeiras',
      numero: '500',
      bairro: 'Centro',
      cidade: 'Blumenau',
      uf: 'SC',
      cep: '89010-200',
    },
    status: 'ATIVO',
    totalCompras: 56000,
    qtdCompras: 15,
    ultimaCompra: d(8),
    prazoMedioPagamento: 28,
    criadoEm: d(200),
  },
  {
    id: 'f-004',
    razaoSocial: 'Calçados Premium Ltda',
    nomeFantasia: 'Calçados Premium',
    cnpj: '23.456.789/0001-45',
    inscricaoEstadual: '234.567.890.000',
    email: 'vendas@calcadospremium.com.br',
    telefone: '(51) 3456-7890',
    endereco: {
      logradouro: 'Av. Borges de Medeiros',
      numero: '800',
      bairro: 'Moinhos de Vento',
      cidade: 'Porto Alegre',
      uf: 'RS',
      cep: '90020-030',
    },
    status: 'ATIVO',
    totalCompras: 34000,
    qtdCompras: 6,
    ultimaCompra: d(20),
    prazoMedioPagamento: 30,
    criadoEm: d(120),
  },
  {
    id: 'f-005',
    razaoSocial: 'InfoParts Componentes Eletrônicos Ltda',
    nomeFantasia: 'InfoParts',
    cnpj: '67.890.123/0001-67',
    inscricaoEstadual: '678.901.234.000',
    email: 'pedidos@infoparts.com.br',
    telefone: '(31) 3456-7890',
    endereco: {
      logradouro: 'Rua dos Caetés',
      numero: '300',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      uf: 'MG',
      cep: '30120-040',
    },
    status: 'INATIVO',
    totalCompras: 12000,
    qtdCompras: 3,
    ultimaCompra: d(90),
    prazoMedioPagamento: 15,
    criadoEm: d(300),
  },
];

// Mock data initialized in _mock-data.ts
void INITIAL_FORNECEDORES;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  const status = searchParams.get('status') ?? '';

  let lista = [...FORNECEDORES_MOCK];

  if (busca) {
    lista = lista.filter(
      (f) =>
        f.razaoSocial.toLowerCase().includes(busca) ||
        f.nomeFantasia.toLowerCase().includes(busca) ||
        f.cnpj.includes(busca) ||
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

  const novo: FornecedorMock = {
    id: `f-${Date.now()}`,
    razaoSocial: body.razaoSocial,
    nomeFantasia: body.nomeFantasia || body.razaoSocial,
    cnpj: body.cnpj,
    inscricaoEstadual: body.inscricaoEstadual,
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
