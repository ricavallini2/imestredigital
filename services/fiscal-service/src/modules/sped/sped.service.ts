/**
 * Serviço de geração de arquivos SPED (Sistema Público de Escrituração Digital).
 * Gera SPED Fiscal (ICMS/IPI) e SPED Contribuições (PIS/COFINS).
 * Formato: registros por linha com separador pipe (|REG|campo1|campo2|...|)
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

/** Interface para período do SPED */
interface PeriodoSped {
  /** Mês de referência (1-12) */
  mes: number;
  /** Ano de referência */
  ano: number;
}

/** Interface para resultado da geração do SPED */
interface ResultadoSped {
  /** Conteúdo do arquivo SPED gerado */
  conteudo: string;
  /** Nome do arquivo sugerido */
  nomeArquivo: string;
  /** Quantidade de registros gerados */
  totalRegistros: number;
  /** Período de referência */
  periodo: PeriodoSped;
  /** Hash de verificação do arquivo */
  hash: string;
}

@Injectable()
export class SpedService {
  private readonly logger = new Logger('SpedService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Gera arquivo SPED Fiscal (EFD ICMS/IPI).
   * Contém registros de documentos fiscais, apuração de ICMS e IPI.
   *
   * Blocos gerados:
   * - Bloco 0: Abertura, identificação e referências
   * - Bloco C: Documentos fiscais (NF-e)
   * - Bloco E: Apuração do ICMS e IPI
   * - Bloco H: Inventário físico
   * - Bloco 9: Controle e encerramento
   *
   * @param tenantId - ID do tenant
   * @param periodo - Mês e ano de referência
   * @returns Arquivo SPED Fiscal gerado
   */
  async gerarSpedFiscal(tenantId: string, periodo: PeriodoSped): Promise<ResultadoSped> {
    try {
      this.logger.log(
        `Gerando SPED Fiscal para tenant ${tenantId} - ${periodo.mes}/${periodo.ano}`,
      );

      this.validarPeriodo(periodo);

      // Busca notas do período
      const dataInicio = new Date(periodo.ano, periodo.mes - 1, 1);
      const dataFim = new Date(periodo.ano, periodo.mes, 0, 23, 59, 59);

      const notas = await this.prisma.notaFiscal.findMany({
        where: {
          tenantId,
          dataEmissao: {
            gte: dataInicio,
            lte: dataFim,
          },
          status: 'AUTORIZADA',
        },
        include: {
          itens: true,
        },
        orderBy: { dataEmissao: 'asc' },
      });

      // Busca configuração fiscal
      const config = await this.prisma.configuracaoFiscal.findUnique({
        where: { tenantId },
      });

      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada para gerar SPED');
      }

      const linhas: string[] = [];
      let contadorRegistros = 0;

      // ========================================
      // BLOCO 0 — Abertura e Identificação
      // ========================================

      // Registro 0000: Abertura do arquivo digital
      linhas.push(this.formatarLinha('0000', [
        '017',                                         // COD_VER - Versão do leiaute (017 = 2024)
        '0',                                           // COD_FIN - Finalidade (0=Original)
        this.formatarData(dataInicio),                 // DT_INI
        this.formatarData(dataFim),                    // DT_FIN
        config.razaoSocial || 'EMPRESA',               // NOME
        config.cnpj || '',                             // CNPJ
        '',                                            // CPF
        config.uf || 'SP',                             // UF
        config.inscricaoEstadual || '',                // IE
        config.codigoMunicipio || '3550308',           // COD_MUN
        '',                                            // IM
        '',                                            // SUFRAMA
        config.regimeTributario === 'SIMPLES_NACIONAL' ? '1' : '0', // IND_PERFIL
        '1',                                           // IND_ATIV - Atividade industrial
      ]));
      contadorRegistros++;

      // Registro 0001: Abertura do bloco 0
      linhas.push(this.formatarLinha('0001', ['0'])); // 0 = com dados
      contadorRegistros++;

      // Registro 0005: Dados complementares da entidade
      linhas.push(this.formatarLinha('0005', [
        config.nomeFantasia || config.razaoSocial || 'EMPRESA',
        config.cep || '',
        config.endereco || '',
        config.numero || '',
        config.complemento || '',
        config.bairro || '',
        config.telefone || '',
        config.fax || '',
        config.email || '',
      ]));
      contadorRegistros++;

      // Registro 0100: Dados do contabilista
      linhas.push(this.formatarLinha('0100', [
        'CONTABILISTA',                // NOME
        '',                            // CPF
        '',                            // CRC
        '',                            // CNPJ escritório
        '',                            // CEP
        '',                            // END
        '',                            // NUM
        '',                            // COMPL
        '',                            // BAIRRO
        '',                            // FONE
        '',                            // FAX
        '',                            // EMAIL
        '3550308',                     // COD_MUN
      ]));
      contadorRegistros++;

      // Registro 0990: Encerramento do bloco 0
      linhas.push(this.formatarLinha('0990', [(contadorRegistros + 1).toString()]));
      contadorRegistros++;

      // ========================================
      // BLOCO C — Documentos Fiscais (NF-e)
      // ========================================

      // Registro C001: Abertura do bloco C
      const temNotas = notas.length > 0;
      linhas.push(this.formatarLinha('C001', [temNotas ? '0' : '1']));
      contadorRegistros++;

      if (temNotas) {
        for (const nota of notas) {
          // Registro C100: Nota Fiscal (modelos 01 e 55 - NF-e)
          linhas.push(this.formatarLinha('C100', [
            '0',                                           // IND_OPER (0=Entrada, 1=Saída)
            '1',                                           // IND_EMIT (0=Própria, 1=Terceiros)
            '',                                            // COD_PART
            '55',                                          // COD_MOD (55=NF-e)
            '00',                                          // COD_SIT (00=Regular)
            nota.serie?.toString() || '1',                 // SER
            nota.numero?.toString() || '',                 // NUM_DOC
            nota.chaveAcesso || '',                        // CHV_NFE
            this.formatarData(nota.dataEmissao),           // DT_DOC
            this.formatarData(nota.dataSaida || nota.dataEmissao), // DT_E_S
            this.formatarValor(nota.valorTotal),           // VL_DOC
            '9',                                           // IND_PGTO
            this.formatarValor(nota.valorDesconto),        // VL_DESC
            '0',                                           // VL_ABAT_NT
            this.formatarValor(nota.valorProdutos),        // VL_MERC
            '9',                                           // IND_FRT
            this.formatarValor(nota.valorFrete),           // VL_FRT
            this.formatarValor(nota.valorSeguro),          // VL_SEG
            this.formatarValor(nota.valorOutros),          // VL_DA
            this.formatarValor(nota.valorIcms),            // VL_BC_ICMS
            this.formatarValor(nota.valorIcms),            // VL_ICMS
            '0',                                           // VL_BC_ICMS_ST
            '0',                                           // VL_ICMS_ST
            this.formatarValor(nota.valorIpi),             // VL_IPI
            this.formatarValor(nota.valorPis),             // VL_PIS
            this.formatarValor(nota.valorCofins),          // VL_COFINS
            '0',                                           // VL_PIS_ST
            '0',                                           // VL_COFINS_ST
          ]));
          contadorRegistros++;

          // Registro C170: Itens do documento
          for (let i = 0; i < nota.itens.length; i++) {
            const item = nota.itens[i];
            linhas.push(this.formatarLinha('C170', [
              (i + 1).toString(),                            // NUM_ITEM
              item.produtoId || '',                           // COD_ITEM
              item.descricao || '',                           // DESCR_COMPL
              this.formatarValor(item.quantidade),            // QTD
              item.unidade || 'UN',                           // UNID
              this.formatarValor(item.valorUnitario),         // VL_ITEM
              this.formatarValor(item.valorDesconto || 0),    // VL_DESC
              '0',                                            // IND_MOV
              item.cstIcms || '00',                           // CST_ICMS
              item.cfop || '5102',                            // CFOP
              item.ncm || '',                                 // COD_NAT
              this.formatarValor(item.baseIcms || 0),         // VL_BC_ICMS
              this.formatarValor(item.aliquotaIcms || 0),     // ALIQ_ICMS
              this.formatarValor(item.valorIcms || 0),        // VL_ICMS
              '0',                                            // VL_BC_ICMS_ST
              '0',                                            // ALIQ_ST
              '0',                                            // VL_ICMS_ST
              '0',                                            // IND_APUR
              item.cstIpi || '99',                            // CST_IPI
              '',                                             // COD_ENQ
              this.formatarValor(item.baseIpi || 0),          // VL_BC_IPI
              this.formatarValor(item.aliquotaIpi || 0),      // ALIQ_IPI
              this.formatarValor(item.valorIpi || 0),         // VL_IPI
              item.cstPis || '99',                            // CST_PIS
              this.formatarValor(item.basePis || 0),          // VL_BC_PIS
              this.formatarValor(item.aliquotaPis || 0),      // ALIQ_PIS
              this.formatarValor(item.valorPis || 0),         // VL_PIS
              item.cstCofins || '99',                         // CST_COFINS
              this.formatarValor(item.baseCofins || 0),       // VL_BC_COFINS
              this.formatarValor(item.aliquotaCofins || 0),   // ALIQ_COFINS
              this.formatarValor(item.valorCofins || 0),      // VL_COFINS
            ]));
            contadorRegistros++;
          }

          // Registro C190: Registro analítico do documento (consolidação por CST/CFOP)
          linhas.push(this.formatarLinha('C190', [
            nota.itens[0]?.cstIcms || '00',                // CST_ICMS
            nota.itens[0]?.cfop || '5102',                 // CFOP
            '0',                                            // ALIQ_ICMS
            this.formatarValor(nota.valorTotal),            // VL_OPR
            this.formatarValor(nota.valorIcms),             // VL_BC_ICMS
            this.formatarValor(nota.valorIcms),             // VL_ICMS
            '0',                                            // VL_BC_ICMS_ST
            '0',                                            // VL_ICMS_ST
            '0',                                            // VL_RED_BC
            this.formatarValor(nota.valorIpi),              // VL_IPI
          ]));
          contadorRegistros++;
        }
      }

      // Registro C990: Encerramento do bloco C
      linhas.push(this.formatarLinha('C990', [contadorRegistros.toString()]));
      contadorRegistros++;

      // ========================================
      // BLOCO E — Apuração do ICMS e IPI
      // ========================================

      linhas.push(this.formatarLinha('E001', ['0']));
      contadorRegistros++;

      // E100: Período de apuração do ICMS
      linhas.push(this.formatarLinha('E100', [
        this.formatarData(dataInicio),
        this.formatarData(dataFim),
      ]));
      contadorRegistros++;

      // E110: Apuração do ICMS - operações próprias
      const totalIcmsDebito = notas.reduce((acc, n) => acc + (Number(n.valorIcms) || 0), 0);
      linhas.push(this.formatarLinha('E110', [
        this.formatarValor(totalIcmsDebito),   // VL_TOT_DEBITOS
        '0',                                     // VL_AJ_DEBITOS
        this.formatarValor(totalIcmsDebito),   // VL_TOT_AJ_DEBITOS
        '0',                                     // VL_TOT_CREDITOS
        '0',                                     // VL_AJ_CREDITOS
        '0',                                     // VL_TOT_AJ_CREDITOS
        '0',                                     // VL_ESTORNOS_DEB
        '0',                                     // VL_ESTORNOS_CRED
        this.formatarValor(totalIcmsDebito),   // VL_SLD_CREDOR_ANT
        this.formatarValor(totalIcmsDebito),   // VL_SLD_APURADO
        '0',                                     // VL_TOT_DED
        this.formatarValor(totalIcmsDebito),   // VL_ICMS_RECOLHER
        '0',                                     // VL_SLD_CREDOR_TRANSPORTAR
        '0',                                     // DEB_ESP
      ]));
      contadorRegistros++;

      // E990: Encerramento do bloco E
      linhas.push(this.formatarLinha('E990', [contadorRegistros.toString()]));
      contadorRegistros++;

      // ========================================
      // BLOCO H — Inventário Físico
      // ========================================

      // Bloco H vazio (preenchido no inventário anual)
      linhas.push(this.formatarLinha('H001', ['1'])); // 1 = sem dados
      contadorRegistros++;

      linhas.push(this.formatarLinha('H990', ['2']));
      contadorRegistros++;

      // ========================================
      // BLOCO 9 — Controle e Encerramento
      // ========================================

      linhas.push(this.formatarLinha('9001', ['0']));
      contadorRegistros++;

      // Registro 9900: Registros do arquivo
      linhas.push(this.formatarLinha('9900', ['0000', '1']));
      contadorRegistros++;

      linhas.push(this.formatarLinha('9900', ['9999', '1']));
      contadorRegistros++;

      // Registro 9999: Encerramento do arquivo digital
      linhas.push(this.formatarLinha('9999', [(contadorRegistros + 1).toString()]));
      contadorRegistros++;

      // Monta conteúdo final
      const conteudo = linhas.join('\r\n');
      const nomeArquivo = `SPED_FISCAL_${periodo.ano}${periodo.mes.toString().padStart(2, '0')}.txt`;

      // Calcula hash do arquivo
      const crypto = require('crypto');
      const hash = crypto.createHash('md5').update(conteudo).digest('hex');

      this.logger.log(
        `SPED Fiscal gerado: ${contadorRegistros} registros, hash: ${hash}`,
      );

      return {
        conteudo,
        nomeArquivo,
        totalRegistros: contadorRegistros,
        periodo,
        hash,
      };
    } catch (erro) {
      this.logger.error('Erro ao gerar SPED Fiscal:', erro);
      throw erro;
    }
  }

  /**
   * Gera arquivo SPED Contribuições (EFD PIS/COFINS).
   * Contém registros de apuração de PIS e COFINS.
   *
   * Blocos gerados:
   * - Bloco 0: Abertura, identificação e referências
   * - Bloco A: Documentos fiscais de serviços (NFS-e)
   * - Bloco C: Documentos fiscais de mercadorias (NF-e)
   * - Bloco M: Apuração de PIS/COFINS
   * - Bloco 9: Controle e encerramento
   *
   * @param tenantId - ID do tenant
   * @param periodo - Mês e ano de referência
   * @returns Arquivo SPED Contribuições gerado
   */
  async gerarSpedContribuicoes(tenantId: string, periodo: PeriodoSped): Promise<ResultadoSped> {
    try {
      this.logger.log(
        `Gerando SPED Contribuições para tenant ${tenantId} - ${periodo.mes}/${periodo.ano}`,
      );

      this.validarPeriodo(periodo);

      const dataInicio = new Date(periodo.ano, periodo.mes - 1, 1);
      const dataFim = new Date(periodo.ano, periodo.mes, 0, 23, 59, 59);

      // Busca notas autorizadas do período
      const notas = await this.prisma.notaFiscal.findMany({
        where: {
          tenantId,
          dataEmissao: { gte: dataInicio, lte: dataFim },
          status: 'AUTORIZADA',
        },
        include: { itens: true },
        orderBy: { dataEmissao: 'asc' },
      });

      const config = await this.prisma.configuracaoFiscal.findUnique({
        where: { tenantId },
      });

      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      const linhas: string[] = [];
      let contadorRegistros = 0;

      // ========================================
      // BLOCO 0 — Abertura e Identificação
      // ========================================

      linhas.push(this.formatarLinha('0000', [
        '006',                                             // COD_VER (006 = leiaute EFD Contribuições)
        '0',                                               // TIPO_ESCRIT (0=Original)
        '0',                                               // IND_SIT_ESP
        '',                                                // NUM_REC_ANTERIOR
        this.formatarData(dataInicio),                     // DT_INI
        this.formatarData(dataFim),                        // DT_FIN
        config.razaoSocial || 'EMPRESA',                   // NOME
        config.cnpj || '',                                 // CNPJ
        config.uf || 'SP',                                 // UF
        config.codigoMunicipio || '3550308',               // COD_MUN
        '',                                                // SUFRAMA
        '1',                                               // IND_NAT_PJ
        '1',                                               // IND_ATIV
      ]));
      contadorRegistros++;

      linhas.push(this.formatarLinha('0001', ['0']));
      contadorRegistros++;

      linhas.push(this.formatarLinha('0990', [(contadorRegistros + 1).toString()]));
      contadorRegistros++;

      // ========================================
      // BLOCO A — Documentos de Serviços (vazio se não houver NFS-e)
      // ========================================

      linhas.push(this.formatarLinha('A001', ['1'])); // 1 = sem dados
      contadorRegistros++;

      linhas.push(this.formatarLinha('A990', ['2']));
      contadorRegistros++;

      // ========================================
      // BLOCO C — Documentos Fiscais de Mercadorias
      // ========================================

      const temNotas = notas.length > 0;
      linhas.push(this.formatarLinha('C001', [temNotas ? '0' : '1']));
      contadorRegistros++;

      if (temNotas) {
        for (const nota of notas) {
          // C010: Identificação do estabelecimento
          linhas.push(this.formatarLinha('C010', [
            config.cnpj || '',
            '1', // IND_ESCRIT (1=Consolidada)
          ]));
          contadorRegistros++;

          // C100: Documento - NF-e
          linhas.push(this.formatarLinha('C100', [
            '1',                                             // IND_OPER (1=Saída)
            '0',                                             // IND_EMIT (0=Própria)
            '',                                              // COD_PART
            '55',                                            // COD_MOD
            '00',                                            // COD_SIT
            nota.serie?.toString() || '1',                   // SER
            nota.numero?.toString() || '',                   // NUM_DOC
            nota.chaveAcesso || '',                          // CHV_NFE
            this.formatarData(nota.dataEmissao),             // DT_DOC
            this.formatarValor(nota.valorTotal),             // VL_DOC
            '9',                                             // IND_PGTO
            this.formatarValor(nota.valorDesconto),          // VL_DESC
            '0',                                             // VL_ABAT_NT
            this.formatarValor(nota.valorProdutos),          // VL_MERC
          ]));
          contadorRegistros++;

          // C170: Itens do documento com PIS/COFINS
          for (let i = 0; i < nota.itens.length; i++) {
            const item = nota.itens[i];
            linhas.push(this.formatarLinha('C170', [
              (i + 1).toString(),                              // NUM_ITEM
              item.produtoId || '',                             // COD_ITEM
              item.descricao || '',                             // DESCR_COMPL
              this.formatarValor(item.quantidade),              // QTD
              item.unidade || 'UN',                             // UNID
              this.formatarValor(item.valorTotal),              // VL_ITEM
              this.formatarValor(item.valorDesconto || 0),      // VL_DESC
              item.cstPis || '99',                              // CST_PIS
              this.formatarValor(item.basePis || 0),            // VL_BC_PIS
              this.formatarValor(item.aliquotaPis || 0),        // ALIQ_PIS
              this.formatarValor(item.valorPis || 0),           // VL_PIS
              item.cstCofins || '99',                           // CST_COFINS
              this.formatarValor(item.baseCofins || 0),         // VL_BC_COFINS
              this.formatarValor(item.aliquotaCofins || 0),     // ALIQ_COFINS
              this.formatarValor(item.valorCofins || 0),        // VL_COFINS
            ]));
            contadorRegistros++;
          }
        }
      }

      linhas.push(this.formatarLinha('C990', [contadorRegistros.toString()]));
      contadorRegistros++;

      // ========================================
      // BLOCO M — Apuração da Contribuição
      // ========================================

      linhas.push(this.formatarLinha('M001', ['0']));
      contadorRegistros++;

      // Totaliza PIS e COFINS do período
      const totalPis = notas.reduce((acc, n) => acc + (Number(n.valorPis) || 0), 0);
      const totalCofins = notas.reduce((acc, n) => acc + (Number(n.valorCofins) || 0), 0);
      const totalBase = notas.reduce((acc, n) => acc + (Number(n.valorProdutos) || 0), 0);

      // M200: Consolidação PIS/PASEP
      linhas.push(this.formatarLinha('M200', [
        this.formatarValor(totalBase),       // VL_TOT_CONT_NC_PER
        this.formatarValor(totalBase),       // VL_TOT_CRED_DESC
        this.formatarValor(0),               // VL_TOT_CRED_DESC_ANT
        this.formatarValor(totalPis),        // VL_TOT_CONT_NC_DEV
        this.formatarValor(0),               // VL_RET_NC
        this.formatarValor(0),               // VL_OUT_DED_NC
        this.formatarValor(totalPis),        // VL_CONT_NC_REC
        this.formatarValor(totalBase),       // VL_TOT_CONT_CUM_PER
        this.formatarValor(0),               // VL_RET_CUM
        this.formatarValor(0),               // VL_OUT_DED_CUM
        this.formatarValor(totalPis),        // VL_CONT_CUM_REC
        this.formatarValor(totalPis),        // VL_TOT_CONT_REC
      ]));
      contadorRegistros++;

      // M600: Consolidação COFINS
      linhas.push(this.formatarLinha('M600', [
        this.formatarValor(totalBase),       // VL_TOT_CONT_NC_PER
        this.formatarValor(totalBase),       // VL_TOT_CRED_DESC
        this.formatarValor(0),               // VL_TOT_CRED_DESC_ANT
        this.formatarValor(totalCofins),     // VL_TOT_CONT_NC_DEV
        this.formatarValor(0),               // VL_RET_NC
        this.formatarValor(0),               // VL_OUT_DED_NC
        this.formatarValor(totalCofins),     // VL_CONT_NC_REC
        this.formatarValor(totalBase),       // VL_TOT_CONT_CUM_PER
        this.formatarValor(0),               // VL_RET_CUM
        this.formatarValor(0),               // VL_OUT_DED_CUM
        this.formatarValor(totalCofins),     // VL_CONT_CUM_REC
        this.formatarValor(totalCofins),     // VL_TOT_CONT_REC
      ]));
      contadorRegistros++;

      linhas.push(this.formatarLinha('M990', [contadorRegistros.toString()]));
      contadorRegistros++;

      // ========================================
      // BLOCO 9 — Controle e Encerramento
      // ========================================

      linhas.push(this.formatarLinha('9001', ['0']));
      contadorRegistros++;

      linhas.push(this.formatarLinha('9900', ['0000', '1']));
      contadorRegistros++;

      linhas.push(this.formatarLinha('9999', [(contadorRegistros + 1).toString()]));
      contadorRegistros++;

      const conteudo = linhas.join('\r\n');
      const nomeArquivo = `SPED_CONTRIB_${periodo.ano}${periodo.mes.toString().padStart(2, '0')}.txt`;

      const crypto = require('crypto');
      const hash = crypto.createHash('md5').update(conteudo).digest('hex');

      this.logger.log(
        `SPED Contribuições gerado: ${contadorRegistros} registros, hash: ${hash}`,
      );

      return {
        conteudo,
        nomeArquivo,
        totalRegistros: contadorRegistros,
        periodo,
        hash,
      };
    } catch (erro) {
      this.logger.error('Erro ao gerar SPED Contribuições:', erro);
      throw erro;
    }
  }

  // ==========================================
  // Métodos auxiliares de formatação SPED
  // ==========================================

  /**
   * Formata uma linha no padrão SPED: |REG|campo1|campo2|...|
   */
  private formatarLinha(registro: string, campos: string[]): string {
    return `|${registro}|${campos.join('|')}|`;
  }

  /**
   * Formata data no padrão SPED: DDMMAAAA
   */
  private formatarData(data: Date): string {
    const d = new Date(data);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const ano = d.getFullYear().toString();
    return `${dia}${mes}${ano}`;
  }

  /**
   * Formata valor numérico no padrão SPED: inteiro em centavos → decimal com vírgula.
   * Valores são armazenados em centavos no banco, ex: 10050 → "100,50"
   */
  private formatarValor(valorCentavos: number | any): string {
    const v = Number(valorCentavos);
    if (!v) return '0,00';
    const reais = (v / 100).toFixed(2);
    return reais.replace('.', ',');
  }

  /**
   * Valida o período informado para geração do SPED.
   */
  private validarPeriodo(periodo: PeriodoSped): void {
    if (periodo.mes < 1 || periodo.mes > 12) {
      throw new BadRequestException('Mês deve estar entre 1 e 12');
    }
    if (periodo.ano < 2000 || periodo.ano > 2099) {
      throw new BadRequestException('Ano inválido');
    }
  }
}
