import { NextRequest, NextResponse } from 'next/server';
import { CLIENTES_MOCK, TENANT_ID, Papel } from './_mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const busca = searchParams.get('busca')?.toLowerCase() ?? '';
  // No customer-service real `status` é um array (?status[]=ATIVO); aceitamos as
  // duas formas para o mock responder igual ao backend.
  const status = searchParams.get('status') ?? searchParams.get('status[]') ?? '';
  const tipo = searchParams.get('tipo') ?? '';
  const origem = searchParams.get('origem') ?? '';
  const papel = searchParams.get('papel') ?? '';
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
  if (papel) resultado = resultado.filter((c) => (c.papeis ?? ['CLIENTE']).includes(papel as Papel));

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
    papeis: ['CLIENTE'],
    tipo: 'PF',
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
    // Persiste TODOS os campos enviados pelo form (nomeFantasia, razaoSocial, rg,
    // inscricaoEstadual, ieIsento, inscricaoMunicipal, regimeTributario,
    // dataNascimento, genero, emailSecundario, limiteCredito, vendedorId,
    // prazoPagamento, condicoesPagamento, pixChave, categoriasFornecidas,
    // avaliacaoFornecedor, endereco, etc.). Sobrescreve os defaults acima.
    ...body,
    // papeis default ['CLIENTE'] quando ausente ou vazio no body
    papeis:
      Array.isArray(body?.papeis) && body.papeis.length > 0
        ? body.papeis
        : ['CLIENTE'],
  };
  // Persiste em memória (mock) para que apareça nas listagens de Clientes e Fornecedores.
  const endereco = body?.endereco;
  if (endereco && Array.isArray(novoCliente.enderecos) && novoCliente.enderecos.length === 0) {
    novoCliente.enderecos = [{
      id: `e${Date.now()}`,
      tipo: endereco.tipo ?? 'AMBOS',
      logradouro: endereco.logradouro ?? '',
      numero: endereco.numero ?? 'S/N',
      complemento: endereco.complemento,
      bairro: endereco.bairro ?? '',
      cidade: endereco.cidade ?? '',
      estado: endereco.estado ?? endereco.uf ?? '',
      cep: (endereco.cep ?? '').replace(/\D/g, ''),
      principal: true,
    }];
  }
  CLIENTES_MOCK.push(novoCliente as unknown as (typeof CLIENTES_MOCK)[number]);
  return NextResponse.json(novoCliente, { status: 201 });
}
