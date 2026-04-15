// Shared mock data for all clientes API routes
export const TENANT_ID = '10000000-0000-0000-0000-000000000001';

export interface ClienteMock {
  id: string; tenantId: string; tipo: string; nome: string;
  razaoSocial?: string; cnpj?: string; cpf?: string;
  email: string; telefone: string; celular?: string;
  status: string; origem: string; score: number;
  totalCompras: number; quantidadePedidos: number;
  ultimaCompra: string | null; tags: string[];
  criadoEm: string; observacoes?: string;
  enderecos: EnderecoMock[]; contatos: ContatoMock[];
  interacoes: InteracaoMock[];
}

export interface EnderecoMock {
  id: string; tipo: string; logradouro: string; numero: string;
  complemento?: string; bairro: string; cidade: string;
  estado: string; cep: string; principal: boolean;
}

export interface ContatoMock {
  id: string; nome: string; cargo?: string;
  email?: string; telefone?: string; celular?: string; principal: boolean;
}

export interface InteracaoMock {
  id: string; tipo: string; titulo: string; descricao?: string;
  criadoEm: string; usuarioNome?: string;
}

const d = (diasAtras: number) => new Date(Date.now() - diasAtras * 86400000).toISOString();

declare global {
  // eslint-disable-next-line no-var
  var __clientesMock: ClienteMock[] | undefined;
}

// Mutável em runtime (em-memória por processo Next.js dev)
const INITIAL_CLIENTES: ClienteMock[] = [
  {
    id: 'c0000001-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, tipo: 'PJ',
    nome: 'Tech Solutions Ltda', razaoSocial: 'Tech Solutions Comércio e Serviços Ltda',
    cnpj: '12.345.678/0001-90', email: 'contato@techsolutions.com.br',
    telefone: '(11) 3456-7890', celular: '(11) 99999-0001',
    status: 'ATIVO', origem: 'INDICACAO', score: 87,
    totalCompras: 42500.00, quantidadePedidos: 8,
    ultimaCompra: d(15), tags: ['premium', 'b2b'],
    criadoEm: '2024-03-15T10:00:00Z', observacoes: 'Cliente estratégico, parceiro desde 2024.',
    enderecos: [{
      id: 'e0001', tipo: 'Comercial', logradouro: 'Av. Paulista', numero: '1000',
      complemento: 'Sala 301', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP',
      cep: '01310-100', principal: true,
    }],
    contatos: [{
      id: 'ct0001', nome: 'João Silva', cargo: 'Diretor Comercial',
      email: 'joao.silva@techsolutions.com.br', telefone: '(11) 3456-7890',
      celular: '(11) 98765-1234', principal: true,
    }],
    interacoes: [
      { id: 'i0001', tipo: 'COMPRA', titulo: 'Pedido #1042', descricao: 'Compra de equipamentos', criadoEm: d(15), usuarioNome: 'Admin Teste' },
      { id: 'i0002', tipo: 'LIGACAO', titulo: 'Follow-up pós-venda', descricao: 'Cliente satisfeito com entrega', criadoEm: d(10), usuarioNome: 'Admin Teste' },
      { id: 'i0003', tipo: 'EMAIL', titulo: 'Proposta enviada', descricao: 'Proposta para renovação anual', criadoEm: d(5), usuarioNome: 'Admin Teste' },
    ],
  },
  {
    id: 'c0000002-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, tipo: 'PF',
    nome: 'Ana Paula Rodrigues', cpf: '123.456.789-00',
    email: 'ana.rodrigues@gmail.com', telefone: '(11) 98765-4321',
    status: 'ATIVO', origem: 'SITE', score: 72,
    totalCompras: 8750.50, quantidadePedidos: 5,
    ultimaCompra: d(8), tags: ['recorrente'],
    criadoEm: '2024-06-20T14:00:00Z',
    enderecos: [{
      id: 'e0002', tipo: 'Residencial', logradouro: 'Rua das Flores', numero: '42',
      complemento: 'Apto 12', bairro: 'Jardim América', cidade: 'São Paulo', estado: 'SP',
      cep: '01453-000', principal: true,
    }],
    contatos: [],
    interacoes: [
      { id: 'i0004', tipo: 'COMPRA', titulo: 'Pedido #987', descricao: 'Produto A e B', criadoEm: d(8), usuarioNome: 'Admin Teste' },
      { id: 'i0005', tipo: 'WHATSAPP', titulo: 'Dúvida sobre entrega', descricao: 'Perguntou sobre prazo', criadoEm: d(7), usuarioNome: 'Admin Teste' },
    ],
  },
  {
    id: 'c0000003-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, tipo: 'PJ',
    nome: 'Grupo Varejo Nacional', razaoSocial: 'Grupo Varejo Nacional S.A.',
    cnpj: '98.765.432/0001-90', email: 'compras@gvn.com.br',
    telefone: '(21) 2345-6789', celular: '(21) 99999-0003',
    status: 'ATIVO', origem: 'VENDA_DIRETA', score: 95,
    totalCompras: 128000.00, quantidadePedidos: 24,
    ultimaCompra: d(3), tags: ['premium', 'b2b', 'grande-conta'],
    criadoEm: '2023-11-01T09:00:00Z', observacoes: 'Grande conta. Contato preferencial via WhatsApp.',
    enderecos: [{
      id: 'e0003', tipo: 'Comercial', logradouro: 'Av. Rio Branco', numero: '200',
      bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ',
      cep: '20040-020', principal: true,
    }],
    contatos: [
      { id: 'ct0002', nome: 'Maria Santos', cargo: 'Gerente de Compras', email: 'maria@gvn.com.br', celular: '(21) 98888-0001', principal: true },
      { id: 'ct0003', nome: 'Pedro Alves', cargo: 'Financeiro', email: 'pedro@gvn.com.br', principal: false },
    ],
    interacoes: [
      { id: 'i0006', tipo: 'COMPRA', titulo: 'Pedido #2001 — Lote trimestral', criadoEm: d(3), usuarioNome: 'Admin Teste' },
      { id: 'i0007', tipo: 'REUNIAO', titulo: 'Reunião de planejamento Q2', descricao: 'Alinhamento de demanda', criadoEm: d(20), usuarioNome: 'Admin Teste' },
      { id: 'i0008', tipo: 'ELOGIO', titulo: 'Feedback positivo', descricao: 'Cliente elogiou prazo de entrega', criadoEm: d(18), usuarioNome: 'Admin Teste' },
    ],
  },
  {
    id: 'c0000004-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, tipo: 'PF',
    nome: 'Carlos Eduardo Mendes', cpf: '987.654.321-00',
    email: 'carlos.mendes@outlook.com', telefone: '(31) 99876-5432',
    status: 'INATIVO', origem: 'INSTAGRAM', score: 28,
    totalCompras: 1200.00, quantidadePedidos: 1,
    ultimaCompra: d(120), tags: [],
    criadoEm: '2024-01-10T11:00:00Z',
    enderecos: [],
    contatos: [],
    interacoes: [
      { id: 'i0009', tipo: 'COMPRA', titulo: 'Pedido #201', descricao: 'Primeiro e único pedido', criadoEm: d(120), usuarioNome: 'Admin Teste' },
    ],
  },
  {
    id: 'c0000005-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, tipo: 'PJ',
    nome: 'Distribuidora Beta', razaoSocial: 'Beta Distribuição e Logística Ltda',
    cnpj: '11.223.344/0001-55', email: 'pedidos@betadist.com.br',
    telefone: '(41) 3456-7890',
    status: 'ATIVO', origem: 'FEIRA', score: 68,
    totalCompras: 35800.00, quantidadePedidos: 12,
    ultimaCompra: d(22), tags: ['b2b', 'distribuidor'],
    criadoEm: '2024-02-28T08:00:00Z',
    enderecos: [{
      id: 'e0004', tipo: 'Comercial', logradouro: 'Rua XV de Novembro', numero: '500',
      bairro: 'Centro', cidade: 'Curitiba', estado: 'PR',
      cep: '80020-310', principal: true,
    }],
    contatos: [{ id: 'ct0004', nome: 'Roberto Lima', cargo: 'Comprador', email: 'roberto@betadist.com.br', principal: true }],
    interacoes: [
      { id: 'i0010', tipo: 'COMPRA', titulo: 'Pedido #1800', criadoEm: d(22), usuarioNome: 'Admin Teste' },
      { id: 'i0011', tipo: 'ORCAMENTO', titulo: 'Orçamento Q2 enviado', criadoEm: d(14), usuarioNome: 'Admin Teste' },
    ],
  },
  {
    id: 'c0000006-0000-0000-0000-000000000001',
    tenantId: TENANT_ID, tipo: 'PF',
    nome: 'Fernanda Lima Costa', cpf: '456.789.123-00',
    email: 'fernanda.lima@yahoo.com.br', telefone: '(51) 98234-5678',
    status: 'ATIVO', origem: 'INDICACAO', score: 55,
    totalCompras: 4300.00, quantidadePedidos: 3,
    ultimaCompra: d(45), tags: [],
    criadoEm: '2024-08-05T16:00:00Z',
    enderecos: [],
    contatos: [],
    interacoes: [
      { id: 'i0012', tipo: 'COMPRA', titulo: 'Pedido #654', criadoEm: d(45), usuarioNome: 'Admin Teste' },
      { id: 'i0013', tipo: 'EMAIL', titulo: 'Newsletter enviada', criadoEm: d(30), usuarioNome: 'Admin Teste' },
    ],
  },
];

if (!globalThis.__clientesMock) {
  globalThis.__clientesMock = INITIAL_CLIENTES;
}
export const CLIENTES_MOCK: ClienteMock[] = globalThis.__clientesMock;

export function findCliente(id: string): ClienteMock | undefined {
  return CLIENTES_MOCK.find((c) => c.id === id);
}
