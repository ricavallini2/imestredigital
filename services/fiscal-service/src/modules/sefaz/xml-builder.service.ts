/**
 * XML Builder Service
 * Gera XMLs de NF-e, eventos e inutilização conforme layout 4.00 da SEFAZ.
 *
 * Unidade monetária: todos os valores chegam em REAIS (Prisma.Decimal ou
 * number) e são serializados com 2 casas decimais SEM nenhuma conversão de
 * centavos. `formatarValor` normaliza Decimal|number|string → "0.00".
 */

import { Injectable, Logger } from '@nestjs/common';
import { create } from 'xmlbuilder2';

/** Códigos de tipo de evento (NT SEFAZ). */
const TP_EVENTO_CANCELAMENTO = '110111';
const TP_EVENTO_CARTA_CORRECAO = '110110';

@Injectable()
export class XmlBuilderService {
  private readonly logger = new Logger('XmlBuilderService');

  /**
   * Formata um valor monetário em reais para o padrão do XML (ponto decimal,
   * 2 casas). Aceita Prisma.Decimal, number ou string sem perder escala.
   */
  private formatarValor(valor: any): string {
    if (valor === null || valor === undefined) {
      return '0.00';
    }
    // Prisma.Decimal expõe toFixed; number/string caem no Number(...)
    if (typeof valor === 'object' && typeof valor.toFixed === 'function') {
      return valor.toFixed(2);
    }
    return Number(valor).toFixed(2);
  }

  /**
   * Gera XML da NF-e no formato correto do layout 4.00.
   * Estrutura simplificada para fins de exemplo.
   */
  async gerarXmlNfe(
    nota: any,
    itens: any[],
    emitente: any,
    destinatario: any,
    config: any,
  ): Promise<string> {
    try {
      this.logger.log(`Gerando XML para NF-e ${nota.chaveAcesso}`);

      const doc = create({ version: '1.0', encoding: 'UTF-8' });

      const nfe = doc
        .ele('nfe', {
          xmlns: 'http://www.portalfiscal.inf.br/nfe',
        })
        .ele('infNfe', {
          Id: `NFe${nota.chaveAcesso}`,
          versao: '4.00',
        });

      // IDE - Identificação
      const ide = nfe.ele('ide');
      ide.ele('cUF').txt('35'); // São Paulo (simplificado)
      ide.ele('natOp').txt(nota.naturezaOperacao);
      ide.ele('indPag').txt('0'); // Pagamento na entrega
      ide.ele('mod').txt('55'); // NF-e
      ide.ele('serie').txt(nota.serie);
      ide.ele('nNF').txt(nota.numero.toString());
      ide.ele('dhEmi').txt(nota.dataEmissao.toISOString());
      ide.ele('dhSaiEnt').txt((nota.dataSaida || nota.dataEmissao).toISOString());
      ide.ele('tpNF').txt('1'); // Saída
      ide.ele('idDest').txt('1'); // Destinação (simplificado)
      ide.ele('cMunFG').txt('3550308'); // Município SP (simplificado)
      ide.ele('tpImp').txt('1'); // Retrato
      ide.ele('tpEmis').txt('1'); // Normal
      ide.ele('cDV').txt('0');
      ide.ele('tpAmb').txt(config.ambienteSefaz === 'PRODUCAO' ? '1' : '2');
      ide.ele('finNFe').txt('1'); // Operação normal
      ide.ele('indFinal').txt('0'); // Não é consumidor final
      ide.ele('indPres').txt('1'); // Operação presencial
      ide.ele('procEmi').txt('0'); // Emissão normal
      ide.ele('verProc').txt('1.0.0');

      // EMIT - Emitente (simplificado)
      const emit = nfe.ele('emit');
      emit.ele('CNPJ').txt('00000000000000'); // TODO: obter do config
      emit.ele('xNome').txt(emitente?.nome || 'Empresa LTDA');
      emit.ele('xFant').txt(emitente?.nomeFantasia || 'Empresa');
      const enderEmit = emit.ele('enderEmit');
      enderEmit.ele('xLgr').txt(emitente?.endereco || 'Rua Exemplo');
      enderEmit.ele('nro').txt(emitente?.numero || '0');
      enderEmit.ele('xBairro').txt(emitente?.bairro || 'Centro');
      enderEmit.ele('cMun').txt('3550308'); // São Paulo
      enderEmit.ele('xMun').txt('SAO PAULO');
      enderEmit.ele('UF').txt('SP');
      enderEmit.ele('CEP').txt('01000000');
      enderEmit.ele('cPais').txt('1058');
      enderEmit.ele('xPais').txt('Brasil');
      emit.ele('IE').txt(config.inscricaoEstadual || '');

      // DEST - Destinatário
      const dest = nfe.ele('dest');
      if (destinatario?.cpfCnpj) {
        if (destinatario.cpfCnpj.length === 11) {
          dest.ele('CPF').txt(destinatario.cpfCnpj);
        } else {
          dest.ele('CNPJ').txt(destinatario.cpfCnpj);
        }
      }
      dest.ele('xNome').txt(destinatario?.nome || 'Cliente');
      const enderDest = dest.ele('enderDest');
      enderDest.ele('xLgr').txt(destinatario?.endereco || 'Rua Exemplo');
      enderDest.ele('nro').txt(destinatario?.numero || '0');
      enderDest.ele('xBairro').txt(destinatario?.bairro || 'Centro');
      enderDest.ele('cMun').txt('3550308');
      enderDest.ele('xMun').txt('SAO PAULO');
      enderDest.ele('UF').txt('SP');
      enderDest.ele('CEP').txt(destinatario?.cep || '01000000');
      enderDest.ele('cPais').txt('1058');
      enderDest.ele('xPais').txt('Brasil');

      // DET - Detalhes dos produtos/serviços
      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        const det = nfe.ele('det', { nItem: (i + 1).toString() });

        // PROD
        const prod = det.ele('prod');
        prod.ele('CProd').txt(item.produtoId.substring(0, 30));
        prod.ele('cEAN').txt('SEM GTIN');
        prod.ele('xProd').txt(item.descricao.substring(0, 120));
        prod.ele('NCM').txt(item.ncm);
        prod.ele('CFOP').txt(item.cfop);
        prod.ele('uCom').txt(item.unidade);
        prod.ele('qCom').txt(item.quantidade.toString());
        prod.ele('vUnCom').txt(this.formatarValor(item.valorUnitario));
        prod.ele('vProd').txt(this.formatarValor(item.valorTotal));
        if (Number(item.valorDesconto) > 0) {
          prod.ele('vDesc').txt(this.formatarValor(item.valorDesconto));
        }
        prod.ele('vItem12741').txt('0');
        prod.ele('vOutros').txt('0');
        prod.ele('indTot').txt('1');

        // IMPOSTO
        const imposto = det.ele('imposto');

        // ICMS — o grupo é nomeado ICMS<CST> (ex.: ICMS00). O CST puro ("00")
        // é um nome XML inválido (não pode iniciar com dígito); o prefixo
        // resolve isso e segue o layout NF-e 4.00.
        const icms = imposto.ele('ICMS').ele(`ICMS${item.cstIcms}`);
        icms.ele('orig').txt(item.origemMercadoria);
        icms.ele('CST').txt(item.cstIcms);
        if (item.cstIcms === '00') {
          icms.ele('modBC').txt('0');
          icms.ele('vBC').txt(this.formatarValor(item.baseIcms));
          // Alíquota é fração decimal (0.1800 = 18%); XML exige percentual.
          icms.ele('pICMS').txt((Number(item.aliquotaIcms) * 100).toFixed(2));
          icms.ele('vICMS').txt(this.formatarValor(item.valorIcms));
        }

        // PIS / COFINS — prefixo garante nome XML válido a partir do CST.
        // A tipagem completa do grupo (PISAliq/PISNT/... por faixa de CST) é
        // responsabilidade do engine de tributação (Etapa 3).
        const pis = imposto.ele('PIS').ele(`PIS${item.cstPis}`);
        pis.ele('CST').txt(item.cstPis);

        const cofins = imposto.ele('COFINS').ele(`COFINS${item.cstCofins}`);
        cofins.ele('CST').txt(item.cstCofins);
      }

      // TOTAL
      const total = nfe.ele('total').ele('ICMSTot');
      total.ele('vBC').txt(this.formatarValor(nota.valorProdutos));
      total.ele('vICMS').txt(this.formatarValor(nota.valorIcms));
      total.ele('vICMSDeson').txt('0');
      total.ele('vFCP').txt('0');
      total.ele('vBCST').txt('0');
      total.ele('vST').txt('0');
      total.ele('vFCPST').txt('0');
      total.ele('vFCPSTRet').txt('0');
      total.ele('vProd').txt(this.formatarValor(nota.valorProdutos));
      total.ele('vFrete').txt(this.formatarValor(nota.valorFrete));
      total.ele('vSeg').txt(this.formatarValor(nota.valorSeguro));
      total.ele('vDesc').txt(this.formatarValor(nota.valorDesconto));
      total.ele('vII').txt('0');
      total.ele('vIPI').txt(this.formatarValor(nota.valorIpi));
      total.ele('vIPIDevol').txt('0');
      total.ele('vPIS').txt(this.formatarValor(nota.valorPis));
      total.ele('vCOFINS').txt(this.formatarValor(nota.valorCofins));
      total.ele('vOutro').txt(this.formatarValor(nota.valorOutros));
      total.ele('vNF').txt(this.formatarValor(nota.valorTotal));

      // TRANSP
      const transp = nfe.ele('transp');
      transp.ele('modFrete').txt('9'); // Sem frete

      // COBR - Cobrança
      const cobr = nfe.ele('cobr');
      const dup = cobr.ele('dup');
      dup.ele('nDup').txt('001');
      dup.ele('dVenc').txt(new Date().toISOString().split('T')[0]);
      dup.ele('vDup').txt(this.formatarValor(nota.valorTotal));

      // INFADIC
      nfe
        .ele('infAdic')
        .ele('infAdFisco')
        .txt(nota.informacoesAdicionais || '');

      const xml = doc.end({ prettyPrint: true });
      this.logger.log('XML NF-e gerado com sucesso');

      return xml;
    } catch (erro) {
      this.logger.error('Erro ao gerar XML NF-e:', erro);
      throw erro;
    }
  }

  /**
   * Gera XML de evento (cancelamento, carta de correção).
   *
   * @param evento - Registro do evento fiscal (tipo, sequência, justificativa)
   * @param chaveAcesso - Chave de acesso de 44 dígitos da nota vinculada
   * @param config - Configuração fiscal do tenant
   */
  async gerarXmlEvento(evento: any, chaveAcesso: string, config: any): Promise<string> {
    try {
      this.logger.log(`Gerando XML de evento ${evento.tipo}`);

      // tpEvento por tipo: cancelamento = 110111, carta de correção = 110110.
      const tpEvento =
        evento.tipo === 'CANCELAMENTO' ? TP_EVENTO_CANCELAMENTO : TP_EVENTO_CARTA_CORRECAO;

      const doc = create({ version: '1.0', encoding: 'UTF-8' });

      const eventoInfo = doc.ele('evento', {
        versao: '1.00',
      });

      eventoInfo
        .ele('infEvento', {
          id: `ID${tpEvento}${chaveAcesso}${evento.sequencia.toString().padStart(2, '0')}`,
          versao: '1.00',
        })
        .ele('cOrgao')
        .txt('35')
        .up() // Sefaz SP
        .ele('CNPJ')
        .txt('00000000000000')
        .up()
        // chNFe deve ser a chave de acesso real de 44 dígitos da nota.
        .ele('chNFe')
        .txt(chaveAcesso)
        .up()
        .ele('dhEvento')
        .txt(evento.dataEvento.toISOString())
        .up()
        .ele('tpEvento')
        .txt(tpEvento)
        .up()
        .ele('nSeqEvento')
        .txt(evento.sequencia.toString())
        .up()
        .ele('detEvento', { versao: '1.00' })
        .ele('descEvento')
        .txt(evento.tipo)
        .up()
        .ele('xJust')
        .txt(evento.justificativa);

      const xml = doc.end({ prettyPrint: true });
      this.logger.log('XML de evento gerado com sucesso');

      return xml;
    } catch (erro) {
      this.logger.error('Erro ao gerar XML de evento:', erro);
      throw erro;
    }
  }

  /**
   * Gera XML de inutilização de numeração.
   */
  async gerarXmlInutilizacao(dados: any, config: any): Promise<string> {
    try {
      this.logger.log(
        `Gerando XML de inutilização de ${dados.numeroInicial} a ${dados.numeroFinal}`,
      );

      const doc = create({ version: '1.0', encoding: 'UTF-8' });

      const inutNFe = doc.ele('inutNFe', { versao: '4.00' });

      inutNFe
        .ele('infInut', {
          Id: `ID${Math.random().toString().substring(2, 17)}`,
        })
        .ele('tpAmb')
        .txt(config.ambienteSefaz === 'PRODUCAO' ? '1' : '2')
        .up()
        .ele('cUF')
        .txt('35')
        .up() // São Paulo
        .ele('CNPJ')
        .txt('00000000000000')
        .up()
        .ele('mod')
        .txt('55')
        .up() // NF-e
        .ele('serie')
        .txt(dados.serie)
        .up()
        .ele('nNFIni')
        .txt(dados.numeroInicial.toString())
        .up()
        .ele('nNFFin')
        .txt(dados.numeroFinal.toString())
        .up()
        .ele('dhRecbto')
        .txt(new Date().toISOString())
        .up()
        .ele('xJust')
        .txt(dados.justificativa);

      const xml = doc.end({ prettyPrint: true });
      this.logger.log('XML de inutilização gerado com sucesso');

      return xml;
    } catch (erro) {
      this.logger.error('Erro ao gerar XML de inutilização:', erro);
      throw erro;
    }
  }
}
