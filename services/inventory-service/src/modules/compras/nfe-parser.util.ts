/**
 * Parser de NF-e XML (layout 4.00) — regex puro, sem dependências externas.
 *
 * Portado de apps/web/src/lib/nfe-parser.ts (que atende o modo mock local).
 * Mudanças aqui devem ser espelhadas lá enquanto os dois existirem.
 */

export interface NFeParseada {
  chave: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  naturezaOperacao: string;
  fornecedor: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
  };
  itens: Array<{
    codigo: string;
    ean: string;
    descricao: string;
    ncm: string;
    cfop: string;
    unidade: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    impostos: { vICMS: number; vIPI: number; vPIS: number; vCOFINS: number };
  }>;
  totais: {
    valorProdutos: number;
    valorFrete: number;
    valorTotal: number;
    valorImpostos: number;
  };
  formaPagamento: string | null;
}

function tag(xml: string, tagName: string): string {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function num(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

const FORMAS_PAGAMENTO_NFE: Record<string, string> = {
  '01': 'Dinheiro',
  '02': 'Cheque',
  '03': 'Cartão de Crédito',
  '04': 'Cartão de Débito',
  '05': 'Crédito Loja',
  '14': 'Duplicata Mercantil',
  '15': 'Boleto Bancário',
  '16': 'Depósito Bancário',
  '17': 'PIX',
  '18': 'Transferência bancária',
  '90': 'Sem pagamento',
  '99': 'Outros',
};

export function parseNFe(xmlString: string): NFeParseada | null {
  try {
    // Chave: atributo Id do infNFe, ou chNFe do protocolo.
    const chaveMatch = xmlString.match(/Id=["']NFe(\d{44})["']/i);
    const chaveAlt = xmlString.match(/chNFe[^>]*>(\d{44})/i);
    const chave = chaveMatch?.[1] ?? chaveAlt?.[1] ?? '';
    if (!chave) return null;

    const infNFeMatch = xmlString.match(/<infNFe[\s\S]*?>([\s\S]*?)<\/infNFe>/i);
    const infNFe = infNFeMatch ? infNFeMatch[0] : xmlString;

    const ideBlock = tag(infNFe, 'ide');
    const emitBlock = tag(infNFe, 'emit');

    // Itens (blocos <det>)
    const detMatches = infNFe.match(/<det\s[^>]*>[\s\S]*?<\/det>/gi) ?? [];
    const itens = detMatches.map((detBlock) => {
      const prodBlock = tag(detBlock, 'prod');
      const impostoBlock = tag(detBlock, 'imposto');

      const icmsBlock = tag(impostoBlock, 'ICMS');
      const icmsSub = icmsBlock.match(/<ICMS\d+[^>]*>[\s\S]*?<\/ICMS\d+>/i);
      const vICMS = num(tag(icmsSub ? icmsSub[0] : icmsBlock, 'vICMS'));

      const ipiBlock = tag(impostoBlock, 'IPI');
      const vIPI = num(tag(tag(ipiBlock, 'IPITrib') || ipiBlock, 'vIPI'));

      const pisBlock = tag(impostoBlock, 'PIS');
      const vPIS = num(tag(tag(pisBlock, 'PISAliq') || tag(pisBlock, 'PISNT') || pisBlock, 'vPIS'));

      const cofinsBlock = tag(impostoBlock, 'COFINS');
      const vCOFINS = num(
        tag(
          tag(cofinsBlock, 'COFINSAliq') || tag(cofinsBlock, 'COFINSNT') || cofinsBlock,
          'vCOFINS',
        ),
      );

      return {
        codigo: tag(prodBlock, 'cProd'),
        ean: tag(prodBlock, 'cEAN'),
        descricao: tag(prodBlock, 'xProd'),
        ncm: tag(prodBlock, 'NCM'),
        cfop: tag(prodBlock, 'CFOP'),
        unidade: tag(prodBlock, 'uCom') || 'UN',
        quantidade: num(tag(prodBlock, 'qCom')),
        valorUnitario: num(tag(prodBlock, 'vUnCom')),
        valorTotal: num(tag(prodBlock, 'vProd')),
        impostos: { vICMS, vIPI, vPIS, vCOFINS },
      };
    });

    const icmsTot = tag(tag(infNFe, 'total'), 'ICMSTot');
    const totais = {
      valorProdutos: num(tag(icmsTot, 'vProd')),
      valorFrete: num(tag(icmsTot, 'vFrete')),
      valorTotal: num(tag(icmsTot, 'vNF')),
      valorImpostos:
        num(tag(icmsTot, 'vICMS')) +
        num(tag(icmsTot, 'vIPI')) +
        num(tag(icmsTot, 'vPIS')) +
        num(tag(icmsTot, 'vCOFINS')),
    };

    const pagBlock = tag(infNFe, 'pag');
    const tPag = tag(pagBlock, 'tPag');
    const formaPagamento = tPag ? (FORMAS_PAGAMENTO_NFE[tPag] ?? `Código ${tPag}`) : null;

    return {
      chave,
      numero: tag(ideBlock, 'nNF'),
      serie: tag(ideBlock, 'serie'),
      dataEmissao: tag(ideBlock, 'dhEmi') || tag(ideBlock, 'dEmi'),
      naturezaOperacao: tag(ideBlock, 'natOp'),
      fornecedor: {
        cnpj: tag(emitBlock, 'CNPJ'),
        razaoSocial: tag(emitBlock, 'xNome'),
        nomeFantasia: tag(emitBlock, 'xFant') || tag(emitBlock, 'xNome'),
      },
      itens,
      totais,
      formaPagamento,
    };
  } catch {
    return null;
  }
}
