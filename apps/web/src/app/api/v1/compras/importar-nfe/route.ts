import { NextRequest, NextResponse } from 'next/server';
import { parseNFe } from '@/lib/nfe-parser';
import { COMPRAS_MOCK, nextNumeroCompra, type ItemCompraMock } from '../_mock-data';
import { FORNECEDORES_MOCK, type FornecedorMock } from '../../fornecedores/_mock-data';
// Inicializa mocks de estoque e produtos
import '../../estoque/_mock-data';
import '../../produtos/_mock-data';

const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { xml } = body as { xml?: string };

  if (!xml || typeof xml !== 'string') {
    return NextResponse.json(
      { message: 'Campo "xml" é obrigatório e deve ser uma string.' },
      { status: 400 },
    );
  }

  // 1. Parse da NF-e
  const nfe = parseNFe(xml);
  if (!nfe) {
    return NextResponse.json(
      {
        message: 'Não foi possível processar o XML. Verifique se é uma NF-e válida (layout 4.00).',
        dicas: [
          'O arquivo deve ser um XML de NF-e válido',
          'Certifique-se que o encoding é UTF-8',
          'O XML deve conter a tag <infNFe Id="NFe...">',
          'Verifique se o arquivo não está corrompido',
        ],
      },
      { status: 400 },
    );
  }

  // 2. Verifica duplicata
  const duplicata = COMPRAS_MOCK.find((c) => c.nfeChave === nfe.chave);
  if (duplicata) {
    return NextResponse.json(
      {
        message: `NF-e já importada. Compra #${duplicata.numero} criada em ${new Date(duplicata.criadoEm).toLocaleDateString('pt-BR')}.`,
        compraId: duplicata.id,
      },
      { status: 409 },
    );
  }

  const agora = new Date().toISOString();

  // 3. Localiza ou cria fornecedor
  const cnpjNFe = nfe.fornecedor.cnpj;
  let fornecedor = FORNECEDORES_MOCK.find(
    (f) => f.cnpj.replace(/\D/g, '') === cnpjNFe.replace(/\D/g, ''),
  );
  let fornecedorCriado = false;

  if (!fornecedor) {
    fornecedor = {
      id: genId(),
      razaoSocial: nfe.fornecedor.razaoSocial,
      nomeFantasia: nfe.fornecedor.nomeFantasia || nfe.fornecedor.razaoSocial,
      cnpj: nfe.fornecedor.cnpj,
      inscricaoEstadual: nfe.fornecedor.inscricaoEstadual || undefined,
      email: nfe.fornecedor.email || '',
      telefone: nfe.fornecedor.telefone || '',
      endereco: {
        logradouro: nfe.fornecedor.endereco.logradouro,
        numero: nfe.fornecedor.endereco.numero,
        complemento: nfe.fornecedor.endereco.complemento || undefined,
        bairro: nfe.fornecedor.endereco.bairro,
        cidade: nfe.fornecedor.endereco.cidade,
        uf: nfe.fornecedor.endereco.uf,
        cep: nfe.fornecedor.endereco.cep,
      },
      status: 'ATIVO',
      totalCompras: 0,
      qtdCompras: 0,
      prazoMedioPagamento: 30,
      criadoEm: agora,
    };
    FORNECEDORES_MOCK.push(fornecedor);
    fornecedorCriado = true;
  }

  // 4. Processa itens — localiza ou cria produtos
  const produtosResultado: Array<{
    criado: boolean;
    produtoId: string;
    nome: string;
    quantidade: number;
  }> = [];

  const itensCompra: ItemCompraMock[] = [];
  const depositoPadrao = 'dep-001';
  const depositoNome = 'Principal';

  for (const item of nfe.itens) {
    // Tenta localizar produto pelo código (cProd) no SKU ou pelo nome
    let produto = globalThis.__produtosMock?.find(
      (p) =>
        p.sku.toLowerCase() === item.codigo.toLowerCase() ||
        p.nome.toLowerCase().includes(item.descricao.toLowerCase().slice(0, 10)),
    );

    let produtoCriado = false;

    if (!produto) {
      const novoProduto = {
        id: genId(),
        tenantId: '10000000-0000-0000-0000-000000000001',
        sku: item.codigo || genId().slice(0, 12),
        ean: item.ean !== 'SEM GTIN' ? item.ean : undefined,
        nome: item.descricao,
        descricao: `${item.descricao} — Importado via NF-e ${nfe.numero}`,
        descricaoCurta: item.descricao.slice(0, 80),
        categoria: 'Importado',
        categoriaId: 'cat-importado',
        marca: fornecedor.nomeFantasia || fornecedor.razaoSocial,
        status: 'ATIVO' as const,
        preco: parseFloat((item.valorUnitario * 1.3).toFixed(2)),
        precoCusto: item.valorUnitario,
        margemLucro: 30,
        peso: 0,
        altura: 0,
        largura: 0,
        comprimento: 0,
        ncm: item.ncm,
        cfop: item.cfop,
        origem: 0,
        estoque: 0,
        estoqueMinimo: 5,
        tags: ['importado', 'nfe'],
        imagens: [],
        variacoes: [],
        vendasUltimos30Dias: 0,
        vendasTotal: 0,
        receitaTotal: 0,
        criadoEm: agora,
        atualizadoEm: agora,
      };

      if (!globalThis.__produtosMock) globalThis.__produtosMock = [];
      globalThis.__produtosMock.push(novoProduto);
      produto = novoProduto;
      produtoCriado = true;
    }

    produtosResultado.push({
      criado: produtoCriado,
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
    });

    itensCompra.push({
      id: genId(),
      produtoId: produto.id,
      produto: produto.nome,
      sku: produto.sku,
      ncm: item.ncm,
      cfop: item.cfop,
      unidade: item.unidade,
      quantidade: item.quantidade,
      quantidadeRecebida: item.quantidade, // NF importada = já recebido
      valorUnitario: item.valorUnitario,
      valorTotal: item.valorTotal,
      valorICMS: item.impostos.vICMS,
      valorIPI: item.impostos.vIPI,
      valorPIS: item.impostos.vPIS,
      valorCOFINS: item.impostos.vCOFINS,
    });

    // 5. Atualiza estoque (saldo)
    const saldoExistente = globalThis.__saldosMock?.find(
      (s) => s.produtoId === produto!.id && s.depositoId === depositoPadrao,
    );

    if (saldoExistente) {
      saldoExistente.fisico += item.quantidade;
      saldoExistente.disponivel = saldoExistente.fisico - saldoExistente.reservado;
      if (saldoExistente.fisico <= 0) saldoExistente.status = 'SEM_ESTOQUE';
      else if (saldoExistente.fisico <= saldoExistente.minimo * 0.5) saldoExistente.status = 'CRITICO';
      else if (saldoExistente.fisico <= saldoExistente.minimo) saldoExistente.status = 'BAIXO';
      else saldoExistente.status = 'NORMAL';
      saldoExistente.custo = item.valorUnitario;
    } else {
      if (!globalThis.__saldosMock) globalThis.__saldosMock = [];
      globalThis.__saldosMock.push({
        id: genId(),
        produtoId: produto.id,
        produto: produto.nome,
        sku: produto.sku,
        depositoId: depositoPadrao,
        deposito: depositoNome,
        fisico: item.quantidade,
        reservado: 0,
        disponivel: item.quantidade,
        minimo: 5,
        maximo: 100,
        custo: item.valorUnitario,
        preco: parseFloat((item.valorUnitario * 1.3).toFixed(2)),
        giro30d: 0,
        status: 'NORMAL',
      });
    }

    // Atualiza produto.estoque somando
    if (produto) {
      produto.estoque = (produto.estoque ?? 0) + item.quantidade;
    }

    // 6. Registra movimentação
    if (!globalThis.__movimentacoesMock) globalThis.__movimentacoesMock = [];
    globalThis.__movimentacoesMock.unshift({
      id: genId(),
      tipo: 'ENTRADA',
      produtoId: produto.id,
      produto: produto.nome,
      sku: produto.sku,
      quantidade: item.quantidade,
      depositoDestinoId: depositoPadrao,
      depositoDestino: depositoNome,
      motivo: `Importação NF-e ${nfe.numero}/${nfe.serie} — ${nfe.naturezaOperacao}`,
      responsavel: 'Sistema (NF-e)',
      criadoEm: agora,
    });
  }

  // 7. Cria pedido de compra
  const valorImpostos =
    nfe.totais.valorICMS + nfe.totais.valorIPI + nfe.totais.valorPIS + nfe.totais.valorCOFINS;

  const formasPag = nfe.pagamento.map((p) => p.forma).join(', ') || 'Boleto Bancário';

  const novaCompra = {
    id: genId(),
    numero: nextNumeroCompra(),
    fornecedorId: fornecedor.id,
    fornecedor: fornecedor.nomeFantasia || fornecedor.razaoSocial,
    status: 'RECEBIDO' as const,
    itens: itensCompra,
    valorProdutos: nfe.totais.valorProdutos,
    valorFrete: nfe.totais.valorFrete,
    valorImpostos: parseFloat(valorImpostos.toFixed(2)),
    valorTotal: nfe.totais.valorTotal,
    dataEmissao: nfe.dataEmissao || agora,
    dataRecebimento: agora,
    nfeNumero: nfe.numero,
    nfeSerie: nfe.serie,
    nfeChave: nfe.chave,
    condicaoPagamento: '30 dias',
    formaPagamento: formasPag,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  COMPRAS_MOCK.unshift(novaCompra);

  // 8. Cria conta a pagar
  const vencimento = new Date(Date.now() + 30 * 86400000).toISOString();
  const contaId = genId();

  if (!globalThis.__contasAPagarMock) globalThis.__contasAPagarMock = [];
  globalThis.__contasAPagarMock.push({
    id: contaId,
    compraId: novaCompra.id,
    fornecedorId: fornecedor.id,
    fornecedor: fornecedor.nomeFantasia || fornecedor.razaoSocial,
    valor: nfe.totais.valorTotal,
    vencimento,
    status: 'PENDENTE',
    criadoEm: agora,
  });

  // 9. Atualiza totais do fornecedor
  fornecedor.totalCompras += nfe.totais.valorTotal;
  fornecedor.qtdCompras += 1;
  fornecedor.ultimaCompra = agora;

  return NextResponse.json(
    {
      compra: novaCompra,
      fornecedor: { criado: fornecedorCriado, dados: fornecedor },
      produtos: produtosResultado,
      estoque: { itensAtualizados: itensCompra.length },
      financeiro: {
        contaId,
        valor: nfe.totais.valorTotal,
        vencimento,
      },
      nfe,
    },
    { status: 201 },
  );
}
