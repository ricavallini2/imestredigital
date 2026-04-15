/**
 * Serviço de Classificação Fiscal
 *
 * Sugere NCM (Nomenclatura Comum do Mercosul)
 * e CFOP (Código Fiscal de Operação)
 * usando IA
 */

import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../assistente/llm.service';
import { promptClassificacaoFiscal } from '../assistente/prompts/system-prompt';

interface SugestaoNCM {
  ncm: string;
  descricao: string;
  confianca: number;
  aliquotas: {
    icms: string;
    pis: string;
    cofins: string;
  };
  observacoes: string;
}

interface SugestaoCFOP {
  cfop: string;
  descricao: string;
  operacao: string;
  ufOrigem: string;
  ufDestino: string;
  tributacaoNormal: boolean;
}

@Injectable()
export class ClassificacaoService {
  private logger = new Logger('ClassificacaoService');

  // Banco local de NCMs (simplificado)
  private tabelaNcms: Map<string, any> = new Map([
    [
      '84729000',
      {
        descricao: 'Peças e acessórios de máquinas',
        icms: 'Variável',
        pis: '1.65%',
        cofins: '7.6%',
      },
    ],
    [
      '39269099',
      {
        descricao: 'Artigos de plástico diversos',
        icms: 'Variável',
        pis: '1.65%',
        cofins: '7.6%',
      },
    ],
    [
      '85176290',
      {
        descricao: 'Partes e acessórios de telefones',
        icms: 'Variável',
        pis: '1.65%',
        cofins: '7.6%',
      },
    ],
  ]);

  // Banco local de CFOPs (simplificado)
  private tabelaCfops: Map<string, any> = new Map([
    [
      '5102',
      {
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
        operacao: 'VENDA_INTERNA',
        tributacaoNormal: true,
      },
    ],
    [
      '6102',
      {
        descricao: 'Venda de mercadoria adquirida ou recebida de terceiros',
        operacao: 'VENDA_ESTADUAL',
        tributacaoNormal: true,
      },
    ],
    [
      '6108',
      {
        descricao: 'Venda de mercadoria destinada ao exterior',
        operacao: 'VENDA_EXPORTACAO',
        tributacaoNormal: false,
      },
    ],
  ]);

  constructor(private llmService: LLMService) {}

  /**
   * Sugere NCM para um produto
   */
  async sugerirNcm(
    tenantId: string,
    descricaoProduto: string,
    categoria?: string,
  ): Promise<SugestaoNCM> {
    this.logger.debug(`Sugerindo NCM para: ${descricaoProduto}`);

    const prompt = `${promptClassificacaoFiscal}

Produto: ${descricaoProduto}
${categoria ? `Categoria: ${categoria}` : ''}

Sugira o NCM mais apropriado em formato JSON.`;

    try {
      const resposta = await this.llmService.completar(prompt, {
        temperatura: 0.1,
        maxTokens: 500,
      });

      // Tentar parsear resposta JSON
      const match = resposta.conteudo.match(/\{[\s\S]*\}/);
      if (match) {
        const sugestao = JSON.parse(match[0]);

        // Validar contra tabela
        const ncmValidado = this.tabelaNcms.get(sugestao.ncm);
        const confianca = ncmValidado ? 0.9 : 0.6;

        return {
          ncm: sugestao.ncm,
          descricao: sugestao.descricao || 'Produto genérico',
          confianca,
          aliquotas: ncmValidado || {
            icms: 'Verificar estado',
            pis: '1.65%',
            cofins: '7.6%',
          },
          observacoes: 'Consulte seu contador para confirmação definitiva',
        };
      }

      // Fallback
      return {
        ncm: '00000000',
        descricao: 'NCM não identificado',
        confianca: 0.3,
        aliquotas: {
          icms: 'A definir',
          pis: '1.65%',
          cofins: '7.6%',
        },
        observacoes: 'Não foi possível classificar. Consulte um especialista fiscal.',
      };
    } catch (erro) {
      this.logger.error(`Erro ao sugerir NCM: ${erro.message}`);

      return {
        ncm: '00000000',
        descricao: 'Erro na análise',
        confianca: 0,
        aliquotas: {
          icms: 'A definir',
          pis: 'A definir',
          cofins: 'A definir',
        },
        observacoes: 'Ocorreu um erro. Tente novamente ou consulte especialista.',
      };
    }
  }

  /**
   * Sugere CFOP para uma operação
   */
  async sugerirCfop(
    tenantId: string,
    operacao: 'VENDA_INTERNA' | 'VENDA_ESTADUAL' | 'VENDA_EXPORTACAO',
    ufOrigem: string,
    ufDestino: string,
  ): Promise<SugestaoCFOP> {
    this.logger.debug(
      `Sugerindo CFOP: ${operacao} de ${ufOrigem} para ${ufDestino}`,
    );

    let cfopSugerido = '5102'; // Default: venda interna

    if (operacao === 'VENDA_ESTADUAL' && ufOrigem !== ufDestino) {
      cfopSugerido = '6102';
    } else if (operacao === 'VENDA_EXPORTACAO') {
      cfopSugerido = '6108';
    }

    const dados = this.tabelaCfops.get(cfopSugerido);

    return {
      cfop: cfopSugerido,
      descricao: dados?.descricao || 'Venda de mercadoria',
      operacao,
      ufOrigem,
      ufDestino,
      tributacaoNormal: dados?.tributacaoNormal || true,
    };
  }

  /**
   * Classifica um produto completamente
   */
  async classificarProduto(
    tenantId: string,
    produtoId: string,
    dados: { descricao: string; categoria?: string },
  ) {
    this.logger.debug(`Classificando produto ${produtoId}`);

    const ncm = await this.sugerirNcm(
      tenantId,
      dados.descricao,
      dados.categoria,
    );

    const cfop = await this.sugerirCfop(
      tenantId,
      'VENDA_INTERNA',
      'SP',
      'SP',
    );

    return {
      produtoId,
      ncm,
      cfop,
      classificadoEm: new Date(),
    };
  }

  /**
   * Valida se um NCM existe na tabela TIPI
   */
  async validarNcm(ncm: string): Promise<{
    valido: boolean;
    descricao?: string;
    aliquotas?: Record<string, string>;
  }> {
    const dados = this.tabelaNcms.get(ncm);

    if (dados) {
      return {
        valido: true,
        descricao: dados.descricao,
        aliquotas: {
          icms: dados.icms,
          pis: dados.pis,
          cofins: dados.cofins,
        },
      };
    }

    return {
      valido: false,
      descricao: 'NCM não encontrado na tabela TIPI',
    };
  }
}
