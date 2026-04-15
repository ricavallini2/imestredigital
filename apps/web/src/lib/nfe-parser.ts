/**
 * Parser de NF-e XML — sem dependências externas.
 * Usa regex para extrair dados do XML da Nota Fiscal Eletrônica (layout 4.00).
 */

export interface NFeParsed {
  chave: string;
  numero: string;
  serie: string;
  dataEmissao: string;
  naturezaOperacao: string;
  fornecedor: {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    telefone: string;
    email: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    };
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
    impostos: {
      vICMS: number;
      vIPI: number;
      vPIS: number;
      vCOFINS: number;
    };
  }>;
  totais: {
    valorProdutos: number;
    valorFrete: number;
    valorSeguro: number;
    valorDesconto: number;
    valorIPI: number;
    valorICMS: number;
    valorPIS: number;
    valorCOFINS: number;
    valorTotal: number;
    valorTributos: number;
  };
  pagamento: Array<{
    forma: string;
    valor: number;
  }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tag(xml: string, tagName: string): string {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function tagFirst(xml: string, tagName: string): string {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function num(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return cnpj;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatCEP(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

const FORMAS_PAGAMENTO: Record<string, string> = {
  '01': 'Dinheiro',
  '02': 'Cheque',
  '03': 'Cartão de Crédito',
  '04': 'Cartão de Débito',
  '05': 'Crédito Loja',
  '10': 'Vale Alimentação',
  '11': 'Vale Refeição',
  '12': 'Vale Presente',
  '13': 'Vale Combustível',
  '14': 'Duplicata Mercantil',
  '15': 'Boleto Bancário',
  '16': 'Depósito Bancário',
  '17': 'PIX',
  '18': 'Transferência bancária',
  '19': 'Programa de fidelidade',
  '90': 'Sem pagamento',
  '99': 'Outros',
};

// ─── Parser principal ─────────────────────────────────────────────────────────

export function parseNFe(xmlString: string): NFeParsed | null {
  try {
    // Extrai chave da NF-e do atributo Id do infNFe
    const chaveMatch = xmlString.match(/Id=["']NFe(\d{44})["']/i);
    if (!chaveMatch) {
      // Tenta alternativa
      const altMatch = xmlString.match(/chNFe[^>]*>(\d{44})/i);
      if (!altMatch) return null;
    }
    const chave = chaveMatch ? `NFe${chaveMatch[1]}` : (xmlString.match(/chNFe[^>]*>(\d{44})/i)?.[1] ?? '');

    // Extrai bloco infNFe
    const infNFeMatch = xmlString.match(/<infNFe[\s\S]*?>([\s\S]*?)<\/infNFe>/i);
    const infNFe = infNFeMatch ? infNFeMatch[0] : xmlString;

    // ─── IDE ──────────────────────────────────────────────────────────────────
    const ideBlock = tag(infNFe, 'ide');
    const numero = tag(ideBlock, 'nNF');
    const serie = tag(ideBlock, 'serie');
    const dataEmissao = tag(ideBlock, 'dhEmi') || tag(ideBlock, 'dEmi');
    const naturezaOperacao = tag(ideBlock, 'natOp');

    // ─── EMIT (Emitente/Fornecedor) ───────────────────────────────────────────
    const emitBlock = tag(infNFe, 'emit');
    const enderEmitBlock = tag(emitBlock, 'enderEmit');

    const fornecedor = {
      cnpj: formatCNPJ(tag(emitBlock, 'CNPJ')),
      razaoSocial: tag(emitBlock, 'xNome'),
      nomeFantasia: tag(emitBlock, 'xFant') || tag(emitBlock, 'xNome'),
      inscricaoEstadual: tag(emitBlock, 'IE'),
      telefone: tag(emitBlock, 'fone'),
      email: tag(emitBlock, 'email'),
      endereco: {
        logradouro: tag(enderEmitBlock, 'xLgr'),
        numero: tag(enderEmitBlock, 'nro'),
        complemento: tag(enderEmitBlock, 'xCpl'),
        bairro: tag(enderEmitBlock, 'xBairro'),
        cidade: tag(enderEmitBlock, 'xMun'),
        uf: tag(enderEmitBlock, 'UF'),
        cep: formatCEP(tag(enderEmitBlock, 'CEP')),
      },
    };

    // ─── DET (Itens) ──────────────────────────────────────────────────────────
    const detMatches = infNFe.match(/<det\s[^>]*>[\s\S]*?<\/det>/gi) ?? [];

    const itens = detMatches.map((detBlock) => {
      const prodBlock = tag(detBlock, 'prod');
      const impostoBlock = tag(detBlock, 'imposto');

      // ICMS — pode estar em vários sub-grupos
      const icmsBlock = tag(impostoBlock, 'ICMS');
      const icmsSubBlocks = icmsBlock.match(/<ICMS\d+[^>]*>[\s\S]*?<\/ICMS\d+>/i);
      const icmsInner = icmsSubBlocks ? icmsSubBlocks[0] : icmsBlock;
      const vICMS = num(tag(icmsInner, 'vICMS'));

      // IPI
      const ipiBlock = tag(impostoBlock, 'IPI');
      const ipiTrib = tag(ipiBlock, 'IPITrib') || ipiBlock;
      const vIPI = num(tag(ipiTrib, 'vIPI'));

      // PIS
      const pisBlock = tag(impostoBlock, 'PIS');
      const pisAliq = tag(pisBlock, 'PISAliq') || tag(pisBlock, 'PISNT') || pisBlock;
      const vPIS = num(tag(pisAliq, 'vPIS'));

      // COFINS
      const cofinsBlock = tag(impostoBlock, 'COFINS');
      const cofinsAliq = tag(cofinsBlock, 'COFINSAliq') || tag(cofinsBlock, 'COFINSNT') || cofinsBlock;
      const vCOFINS = num(tag(cofinsAliq, 'vCOFINS'));

      return {
        codigo: tag(prodBlock, 'cProd'),
        ean: tag(prodBlock, 'cEAN'),
        descricao: tag(prodBlock, 'xProd'),
        ncm: tag(prodBlock, 'NCM'),
        cfop: tag(prodBlock, 'CFOP'),
        unidade: tag(prodBlock, 'uCom'),
        quantidade: num(tag(prodBlock, 'qCom')),
        valorUnitario: num(tag(prodBlock, 'vUnCom')),
        valorTotal: num(tag(prodBlock, 'vProd')),
        impostos: { vICMS, vIPI, vPIS, vCOFINS },
      };
    });

    // ─── TOTAL ────────────────────────────────────────────────────────────────
    const totalBlock = tag(infNFe, 'total');
    const icmsTotBlock = tag(totalBlock, 'ICMSTot');

    const totais = {
      valorProdutos: num(tag(icmsTotBlock, 'vProd')),
      valorFrete: num(tag(icmsTotBlock, 'vFrete')),
      valorSeguro: num(tag(icmsTotBlock, 'vSeg')),
      valorDesconto: num(tag(icmsTotBlock, 'vDesc')),
      valorIPI: num(tag(icmsTotBlock, 'vIPI')),
      valorICMS: num(tag(icmsTotBlock, 'vICMS')),
      valorPIS: num(tag(icmsTotBlock, 'vPIS')),
      valorCOFINS: num(tag(icmsTotBlock, 'vCOFINS')),
      valorTotal: num(tag(icmsTotBlock, 'vNF')),
      valorTributos: num(tag(icmsTotBlock, 'vTotTrib')),
    };

    // ─── PAGAMENTO ────────────────────────────────────────────────────────────
    const pagBlock = tag(infNFe, 'pag');
    const detPagMatches = pagBlock.match(/<detPag>[\s\S]*?<\/detPag>/gi) ?? [];

    const pagamento = detPagMatches.map((dpBlock) => {
      const tPag = tag(dpBlock, 'tPag');
      return {
        forma: FORMAS_PAGAMENTO[tPag] ?? `Código ${tPag}`,
        valor: num(tag(dpBlock, 'vPag')),
      };
    });

    // Se não há detPag mas há vPag no bloco pag direto
    if (pagamento.length === 0) {
      const vPagGlobal = tag(pagBlock, 'vPag');
      const tPagGlobal = tag(pagBlock, 'tPag');
      if (vPagGlobal) {
        pagamento.push({
          forma: FORMAS_PAGAMENTO[tPagGlobal] ?? 'Outros',
          valor: num(vPagGlobal),
        });
      }
    }

    return {
      chave: chave.replace(/^NFe/, 'NFe'),
      numero,
      serie,
      dataEmissao,
      naturezaOperacao,
      fornecedor,
      itens,
      totais,
      pagamento,
    };
  } catch {
    return null;
  }
}
