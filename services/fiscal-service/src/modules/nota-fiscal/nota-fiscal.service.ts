/**
 * Nota Fiscal Service
 * Orquestra toda a lógica de gestão de notas fiscais.
 */

import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { CriarNotaFiscalDto } from '../../dtos/criar-nota-fiscal.dto';
import { FiltroNotaFiscalDto } from '../../dtos/filtro-nota-fiscal.dto';
import { CancelarNotaDto } from '../../dtos/cancelar-nota.dto';
import { CartaCorrecaoDto } from '../../dtos/carta-correcao.dto';
import { InutilizarNumeracaoDto } from '../../dtos/inutilizar-numeracao.dto';
import { CalcularImpostosDto } from '../../dtos/calcular-impostos.dto';
import { NotaFiscalRepository } from './nota-fiscal.repository';
import { SefazService } from '../sefaz/sefaz.service';
import { XmlBuilderService } from '../sefaz/xml-builder.service';
import { AssinaturaService } from '../sefaz/assinatura.service';
import { ConfiguracaoFiscalRepository } from '../configuracao-fiscal/configuracao-fiscal.repository';
import { RegraFiscalRepository } from '../regra-fiscal/regra-fiscal.repository';
import { ProdutorEventosService } from '../../events/produtor-eventos.service';
import { CacheService } from '../cache/cache.service';
import { gerarChaveAcesso } from '../../utils/chave-acesso.util';

@Injectable()
export class NotaFiscalService {
  private readonly logger = new Logger('NotaFiscalService');

  constructor(
    private readonly notaFiscalRepository: NotaFiscalRepository,
    private readonly configuracaoRepository: ConfiguracaoFiscalRepository,
    private readonly regraRepository: RegraFiscalRepository,
    private readonly sefazService: SefazService,
    private readonly xmlBuilder: XmlBuilderService,
    private readonly assinatura: AssinaturaService,
    private readonly produtor: ProdutorEventosService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Cria uma nota fiscal em status RASCUNHO.
   */
  async criarRascunho(tenantId: string, dados: CriarNotaFiscalDto) {
    try {
      this.logger.log(`Criando rascunho de nota ${dados.tipo} para tenant ${tenantId}`);

      // Gera chave de acesso
      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      const proximoNumero = await this.notaFiscalRepository.obterProximoNumero(
        tenantId,
        dados.serie || '1',
        dados.tipo === 'NFCE' ? 'NFCE' : 'NFE',
      );

      const chaveAcesso = gerarChaveAcesso({
        uf: 'SP', // TODO: obter do config
        ano: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,
        cnpj: config.cnpj || '00000000000000', // TODO: obter do config
        tipo: dados.tipo,
        serie: dados.serie || '1',
        numero: proximoNumero,
      });

      const nota = await this.notaFiscalRepository.criar(tenantId, dados, chaveAcesso);

      this.logger.log(`Rascunho criado: ${nota.id}`);

      return nota;
    } catch (erro) {
      this.logger.error('Erro ao criar rascunho:', erro);
      throw erro;
    }
  }

  /**
   * Valida uma nota fiscal antes de emitir.
   */
  async validarNota(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Validando nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      // Validações básicas
      if (!nota.chaveAcesso || nota.chaveAcesso.length !== 44) {
        throw new BadRequestException('Chave de acesso inválida');
      }

      if (!nota.itens || nota.itens.length === 0) {
        throw new BadRequestException('Nota fiscal sem itens');
      }

      // Calcula impostos
      const notaComImpostos = await this.calcularImpostos(tenantId, nota.itens);

      // Atualiza status
      await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'VALIDADA');

      this.logger.log(`Nota ${notaId} validada com sucesso`);

      return {
        ...nota,
        ...notaComImpostos,
      };
    } catch (erro) {
      this.logger.error('Erro ao validar nota:', erro);
      throw erro;
    }
  }

  /**
   * Emite uma nota fiscal (gera XML, assina, envia para SEFAZ).
   */
  async emitirNota(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Emitindo nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      if (nota.status === 'AUTORIZADA' || nota.status === 'CANCELADA') {
        throw new BadRequestException(`Nota já está em status ${nota.status}`);
      }

      // Obtém configuração fiscal
      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      // Gera XML
      const xmlNfe = await this.xmlBuilder.gerarXmlNfe(
        nota,
        nota.itens,
        config.emitente,
        nota.destinatario,
        config,
      );

      this.logger.debug(`XML gerado para nota ${notaId}`);

      // Assina XML (apenas em ambiente de produção, homologação usa mock)
      let xmlAssinado = xmlNfe;
      if (config.ambienteSefaz === 'PRODUCAO' && config.certificadoDigital) {
        xmlAssinado = await this.assinatura.assinarXml(
          xmlNfe,
          config.certificadoDigital,
          config.senhaCertificado,
        );
      }

      // Envia para SEFAZ
      const respostaSefaz = await this.sefazService.enviarNfe(xmlAssinado, config);

      // Atualiza status conforme resposta SEFAZ
      if (respostaSefaz.autorizado) {
        await this.notaFiscalRepository.armazenarAutorizacao(
          tenantId,
          notaId,
          respostaSefaz.xmlRetorno,
          respostaSefaz.protocolo,
        );

        // Publica evento
        await this.produtor.publicarNotaAutorizada(tenantId, notaId, respostaSefaz.protocolo);

        this.logger.log(`Nota ${notaId} autorizada com protocolo ${respostaSefaz.protocolo}`);
      } else {
        await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'REJEITADA', {
          motivoRejeicao: respostaSefaz.motivo,
          xmlRetorno: respostaSefaz.xmlRetorno,
        });

        // Publica evento
        await this.produtor.publicarNotaRejeitada(tenantId, notaId, respostaSefaz.motivo);

        this.logger.warn(`Nota ${notaId} rejeitada: ${respostaSefaz.motivo}`);
      }

      return respostaSefaz;
    } catch (erro) {
      this.logger.error('Erro ao emitir nota:', erro);
      throw erro;
    }
  }

  /**
   * Consulta o status de uma nota junto à SEFAZ.
   */
  async consultarNota(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Consultando nota ${notaId} na SEFAZ`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      const resultado = await this.sefazService.consultarProtocolo(
        nota.chaveAcesso,
        config,
      );

      return resultado;
    } catch (erro) {
      this.logger.error('Erro ao consultar nota:', erro);
      throw erro;
    }
  }

  /**
   * Cancela uma nota fiscal.
   */
  async cancelarNota(tenantId: string, notaId: string, dados: CancelarNotaDto) {
    try {
      this.logger.log(`Cancelando nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      if (nota.status === 'CANCELADA') {
        throw new BadRequestException('Nota já está cancelada');
      }

      if (nota.status !== 'AUTORIZADA') {
        throw new BadRequestException('Apenas notas autorizadas podem ser canceladas');
      }

      const config = await this.configuracaoRepository.obter(tenantId);

      // Registra evento de cancelamento
      const evento = await this.notaFiscalRepository.registrarEvento(
        tenantId,
        notaId,
        'CANCELAMENTO',
        1,
        dados.justificativa,
      );

      // Gera XML do evento
      const xmlEvento = await this.xmlBuilder.gerarXmlEvento(evento, config);

      // Envia para SEFAZ
      const respostaSefaz = await this.sefazService.enviarEvento(xmlEvento, config);

      if (respostaSefaz.autorizado) {
        await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'CANCELADA');
        await this.notaFiscalRepository.atualizarEvento(
          evento.id,
          'AUTORIZADO',
          respostaSefaz.xmlRetorno,
          respostaSefaz.protocolo,
        );

        // Publica evento
        await this.produtor.publicarNotaCancelada(tenantId, notaId, dados.justificativa);

        this.logger.log(`Nota ${notaId} cancelada com sucesso`);
      }

      return respostaSefaz;
    } catch (erro) {
      this.logger.error('Erro ao cancelar nota:', erro);
      throw erro;
    }
  }

  /**
   * Emite carta de correção para uma nota.
   */
  async cartaCorrecao(tenantId: string, notaId: string, dados: CartaCorrecaoDto) {
    try {
      this.logger.log(`Emitindo carta de correção para nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      const config = await this.configuracaoRepository.obter(tenantId);

      // Registra evento de carta de correção
      const eventos = await this.notaFiscalRepository.buscarEventos(notaId);
      const proximaSequencia = (eventos.length || 0) + 1;

      const evento = await this.notaFiscalRepository.registrarEvento(
        tenantId,
        notaId,
        'CARTA_CORRECAO',
        proximaSequencia,
        dados.descricaoCorrecao,
      );

      // Gera XML do evento
      const xmlEvento = await this.xmlBuilder.gerarXmlEvento(evento, config);

      // Envia para SEFAZ
      const respostaSefaz = await this.sefazService.enviarEvento(xmlEvento, config);

      if (respostaSefaz.autorizado) {
        await this.notaFiscalRepository.atualizarEvento(
          evento.id,
          'AUTORIZADO',
          respostaSefaz.xmlRetorno,
          respostaSefaz.protocolo,
        );

        this.logger.log(`Carta de correção enviada para nota ${notaId}`);
      }

      return respostaSefaz;
    } catch (erro) {
      this.logger.error('Erro ao emitir carta de correção:', erro);
      throw erro;
    }
  }

  /**
   * Inutiliza uma faixa de numeração de notas fiscais.
   */
  async inutilizarNumeracao(tenantId: string, dados: InutilizarNumeracaoDto) {
    try {
      this.logger.log(
        `Inutilizando notas de ${dados.numeroInicial} a ${dados.numeroFinal}`,
      );

      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      // Gera XML de inutilização
      const xmlInutilizacao = await this.xmlBuilder.gerarXmlInutilizacao(dados, config);

      // Envia para SEFAZ
      const respostaSefaz = await this.sefazService.inutilizar(xmlInutilizacao, config);

      this.logger.log(`Inutilização processada com protocolo ${respostaSefaz.protocolo}`);

      return respostaSefaz;
    } catch (erro) {
      this.logger.error('Erro ao inutilizar numeração:', erro);
      throw erro;
    }
  }

  /**
   * Busca uma nota fiscal por ID.
   */
  async buscarPorId(tenantId: string, notaId: string) {
    try {
      const cacheKey = `nota:${tenantId}:${notaId}`;
      const cached = await this.cache.obter(cacheKey);
      if (cached) {
        return cached;
      }

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      // Cache por 1 hora
      await this.cache.armazenar(cacheKey, nota, 3600);

      return nota;
    } catch (erro) {
      this.logger.error('Erro ao buscar nota:', erro);
      throw erro;
    }
  }

  /**
   * Lista notas fiscais com filtros.
   */
  async listar(tenantId: string, filtros: FiltroNotaFiscalDto) {
    try {
      return await this.notaFiscalRepository.listar(tenantId, filtros);
    } catch (erro) {
      this.logger.error('Erro ao listar notas:', erro);
      throw erro;
    }
  }

  /**
   * Calcula impostos para itens de nota.
   */
  async calcularImpostos(tenantId: string, itens: any) {
    try {
      const config = await this.configuracaoRepository.obter(tenantId);

      let totalIcms = 0;
      let totalPis = 0;
      let totalCofins = 0;
      let totalIpi = 0;

      for (const item of itens) {
        // Busca regra fiscal aplicável
        const regra = await this.regraRepository.buscarRegraAplicavel(
          tenantId,
          item.ncm,
          null,
          null,
          config?.regimeTributario,
        );

        if (regra) {
          item.cstIcms = regra.cstIcms;
          item.aliquotaIcms = regra.aliquotaIcms;
          item.baseIcms = item.valorTotal;
          item.valorIcms = Math.round((item.valorTotal * regra.aliquotaIcms) / 10000);

          item.cstPis = regra.cstPis;
          item.aliquotaPis = regra.aliquotaPis;
          item.basePis = item.valorTotal;
          item.valorPis = Math.round((item.valorTotal * regra.aliquotaPis) / 10000);

          item.cstCofins = regra.cstCofins;
          item.aliquotaCofins = regra.aliquotaCofins;
          item.baseCofins = item.valorTotal;
          item.valorCofins = Math.round((item.valorTotal * regra.aliquotaCofins) / 10000);

          totalIcms += item.valorIcms;
          totalPis += item.valorPis;
          totalCofins += item.valorCofins;
          totalIpi += item.valorIpi || 0;
        }
      }

      return {
        itens,
        totalizadores: {
          valorIcms: totalIcms,
          valorPis: totalPis,
          valorCofins: totalCofins,
          valorIpi: totalIpi,
        },
      };
    } catch (erro) {
      this.logger.error('Erro ao calcular impostos:', erro);
      throw erro;
    }
  }

  /**
   * Gera PDF do DANFE (Documento Auxiliar da Nota Fiscal Eletrônica).
   */
  async gerarDanfe(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Gerando DANFE para nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      // TODO: Implementar geração real de PDF
      // Por enquanto, retorna placeholder

      return {
        notaId,
        chaveAcesso: nota.chaveAcesso,
        mensagem: 'DANFE em desenvolvimento',
      };
    } catch (erro) {
      this.logger.error('Erro ao gerar DANFE:', erro);
      throw erro;
    }
  }
}
