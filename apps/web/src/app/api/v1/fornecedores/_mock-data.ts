// ─── Interface ────────────────────────────────────────────────────────────────

export interface FornecedorMock {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  status: 'ATIVO' | 'INATIVO';
  totalCompras: number;
  qtdCompras: number;
  ultimaCompra?: string;
  prazoMedioPagamento: number;
  criadoEm: string;
}

// ─── globalThis declarations ──────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __fornecedoresMock: FornecedorMock[] | undefined;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const _d = (diasAtras: number) => new Date(Date.now() - diasAtras * 86400000).toISOString();

const INITIAL_FORNECEDORES: FornecedorMock[] = [
  {
    id: 'f-001', razaoSocial: 'Tech Distribuidora Ltda', nomeFantasia: 'TechDist',
    cnpj: '12.345.678/0001-90', inscricaoEstadual: '123.456.789.000',
    email: 'compras@techdist.com.br', telefone: '(11) 3456-7890',
    endereco: { logradouro: 'Av. Paulista', numero: '1000', complemento: 'Sala 501', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', cep: '01310-100' },
    status: 'ATIVO', totalCompras: 145000, qtdCompras: 12, ultimaCompra: _d(5), prazoMedioPagamento: 30, criadoEm: _d(180),
  },
  {
    id: 'f-002', razaoSocial: 'Eletrônicos Brasil S.A.', nomeFantasia: 'ElecBrasil',
    cnpj: '98.765.432/0001-10', inscricaoEstadual: '987.654.321.000',
    email: 'fornecedor@elecbrasil.com.br', telefone: '(21) 2345-6789',
    endereco: { logradouro: 'Rua da Assembleia', numero: '200', bairro: 'Centro', cidade: 'Rio de Janeiro', uf: 'RJ', cep: '20011-000' },
    status: 'ATIVO', totalCompras: 89000, qtdCompras: 8, ultimaCompra: _d(12), prazoMedioPagamento: 45, criadoEm: _d(150),
  },
  {
    id: 'f-003', razaoSocial: 'Moda Fashion Importações Ltda', nomeFantasia: 'Moda Fashion',
    cnpj: '45.678.901/0001-23', inscricaoEstadual: '456.789.012.000',
    email: 'contato@modafashion.com.br', telefone: '(48) 3456-7890',
    endereco: { logradouro: 'Rua das Palmeiras', numero: '500', bairro: 'Centro', cidade: 'Blumenau', uf: 'SC', cep: '89010-200' },
    status: 'ATIVO', totalCompras: 56000, qtdCompras: 15, ultimaCompra: _d(8), prazoMedioPagamento: 28, criadoEm: _d(200),
  },
  {
    id: 'f-004', razaoSocial: 'Calçados Premium Ltda', nomeFantasia: 'Calçados Premium',
    cnpj: '23.456.789/0001-45', inscricaoEstadual: '234.567.890.000',
    email: 'vendas@calcadospremium.com.br', telefone: '(51) 3456-7890',
    endereco: { logradouro: 'Av. Borges de Medeiros', numero: '800', bairro: 'Moinhos de Vento', cidade: 'Porto Alegre', uf: 'RS', cep: '90020-030' },
    status: 'ATIVO', totalCompras: 34000, qtdCompras: 6, ultimaCompra: _d(20), prazoMedioPagamento: 30, criadoEm: _d(120),
  },
  {
    id: 'f-005', razaoSocial: 'InfoParts Componentes Eletrônicos Ltda', nomeFantasia: 'InfoParts',
    cnpj: '67.890.123/0001-67', inscricaoEstadual: '678.901.234.000',
    email: 'pedidos@infoparts.com.br', telefone: '(31) 3456-7890',
    endereco: { logradouro: 'Rua dos Caetés', numero: '300', bairro: 'Centro', cidade: 'Belo Horizonte', uf: 'MG', cep: '30120-040' },
    status: 'INATIVO', totalCompras: 12000, qtdCompras: 3, ultimaCompra: _d(90), prazoMedioPagamento: 15, criadoEm: _d(300),
  },
];

// ─── Persistência via globalThis ──────────────────────────────────────────────

if (!globalThis.__fornecedoresMock) {
  globalThis.__fornecedoresMock = INITIAL_FORNECEDORES;
}

export const FORNECEDORES_MOCK: FornecedorMock[] = globalThis.__fornecedoresMock;
