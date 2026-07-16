/**
 * Nota Fiscal Service
 * Orquestra toda a lógica de gestão de notas fiscais.
 */

import { Injectable, BadRequestException, NotFoundException, Logger, Inject } from '@nestjs/common';
import { Prisma } from '../../../generated/client';
import { CriarNotaFiscalDto } from '../../dtos/criar-nota-fiscal.dto';
import { FiltroNotaFiscalDto } from '../../dtos/filtro-nota-fiscal.dto';
import { CancelarNotaDto } from '../../dtos/cancelar-nota.dto';
import { CartaCorrecaoDto } from '../../dtos/carta-correcao.dto';
import { InutilizarNumeracaoDto } from '../../dtos/inutilizar-numeracao.dto';
import { CalcularImpostosDto } from '../../dtos/calcular-impostos.dto';
import { NotaFiscalRepository } from './nota-fiscal.repository';
import { ConfiguracaoFiscalRepository } from '../configuracao-fiscal/configuracao-fiscal.repository';
import { TributosService } from '../tributos/tributos.service';
import { ProdutorEventosService } from '../../events/produtor-eventos.service';
import { CacheService } from '../cache/cache.service';
import { gerarChaveAcesso } from '../../utils/chave-acesso.util';
import { gerarDanfePdfMinimo } from '../../utils/danfe-pdf.util';
import { ItemTributavel, ResultadoCalculoTributos, UfOperacao } from '../tributos/tributos.types';
import { transicaoPermitida, mensagemTransicaoInvalida } from '../../utils/ciclo-vida-nota.util';
import { StatusNotaFiscal, RegimeTributario } from '../../../generated/client';
import {
  ProvedorFiscalPort,
  PROVEDOR_FISCAL_PORT,
  ContextoOperacaoFiscal,
} from '../provedor-fiscal/provedor-fiscal.port';
import {
  ResultadoProvedorFiscal,
  StatusProvedorFiscal,
  AmbienteFiscal,
  ModeloDocumentoFiscal,
} from '../provedor-fiscal/tipos/provedor-fiscal.tipos';
import { montarDocumentoFiscal } from '../provedor-fiscal/montar-documento-fiscal';

/**
 * Contrato de resposta de GET /notas-fiscais/estatisticas.
 *
 * Espelha exatamente o tipo `EstatisticasFiscais` consumido pelo front
 * (`apps/web/src/services/fiscal.service.ts` → tela `dashboard/fiscal`).
 * Todos os valores monetários saem como `number` em REAIS (nunca `Decimal`).
 */
export interface EstatisticasFiscais {
  /** Somatório de `valorTotal` das notas AUTORIZADAS nos últimos 30 dias. */
  faturado30d: number;
  /** Somatório de `valorTotal` das notas AUTORIZADAS nos últimos 7 dias. */
  faturado7d: number;
  /** ICMS + PIS + COFINS das notas AUTORIZADAS nos últimos 30 dias. */
  impostos30d: number;
  /** Total de notas do tenant, em qualquer status. */
  totalNFs: number;
  /** Quantidade de notas AUTORIZADAS nos últimos 30 dias. */
  emitidas30d: number;
  /** Quantidade de notas AUTORIZADAS nos últimos 7 dias. */
  emitidas7d: number;
  /** % de rejeitadas sobre as notas submetidas (fora rascunho), 1 decimal. */
  taxaRejeicao: number;
  /** % de autorizadas sobre as notas submetidas (fora rascunho), 1 decimal. */
  taxaEmissao: number;
  /** Distribuição de todas as notas por status (chaves do enum). */
  porStatus: Record<string, number>;
  /** Distribuição de todas as notas por tipo (NFE/NFCE/NFSE). */
  porTipo: Record<string, number>;
  /** Notas TRANSMITIDAS aguardando retorno da SEFAZ. */
  processando: number;
}

@Injectable()
export class NotaFiscalService {
  private readonly logger = new Logger('NotaFiscalService');

  constructor(
    private readonly notaFiscalRepository: NotaFiscalRepository,
    private readonly configuracaoRepository: ConfiguracaoFiscalRepository,
    private readonly tributos: TributosService,
    private readonly produtor: ProdutorEventosService,
    private readonly cache: CacheService,
    @Inject(PROVEDOR_FISCAL_PORT)
    private readonly provedorFiscal: ProvedorFiscalPort,
  ) {}

  /**
   * Cria uma nota fiscal em status RASCUNHO.
   *
   * Fluxo:
   *  1. Carrega a ConfiguracaoFiscal do tenant (regime, UF, CNPJ, natureza
   *     padrão) — obrigatória para emitir.
   *  2. Aplica o ENGINE DE TRIBUTOS automaticamente em todos os itens a partir
   *     das RegrasFiscais do tenant + regime (o payload não precisa trazer os
   *     valores de imposto).
   *  3. Reserva o número de forma ATÔMICA (transação + UPDATE ... RETURNING) e
   *     grava a nota na mesma transação, montando a chave de acesso com o
   *     número reservado e os dados reais do emitente (UF/CNPJ do config).
   */
  async criarRascunho(tenantId: string, dados: CriarNotaFiscalDto) {
    try {
      this.logger.log(`Criando rascunho de nota ${dados.tipo} para tenant ${tenantId}`);

      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      // Natureza de operação: usa a informada ou a padrão do tenant.
      // Série: quando o payload não informa, escolhe a série própria do modelo
      // (NFC-e → serieNfce; NF-e/NFS-e → serieNfe). Resolver aqui garante que a
      // MESMA série seja usada na reserva atômica de número e na chave de
      // acesso (senão a numeração e o campo `serie` da nota poderiam divergir).
      const serieResolvida =
        dados.serie || (dados.tipo === 'NFCE' ? config.serieNfce : config.serieNfe) || '1';
      const dadosNormalizados: CriarNotaFiscalDto = {
        ...dados,
        serie: serieResolvida,
        naturezaOperacao: dados.naturezaOperacao || config.naturezaOperacaoPadrao,
      };

      // 1. Calcula os tributos por item a partir das regras do tenant.
      const uf: UfOperacao = {
        origem: config.uf ?? undefined,
        destino: this.ufDestino(dadosNormalizados),
      };
      const calculo = await this.tributos.calcular(
        tenantId,
        this.itensParaTributar(dadosNormalizados),
        config.regimeTributario as RegimeTributario,
        uf,
      );

      // 2. Reserva número + grava a nota atomicamente (a chave usa o número
      // reservado dentro da transação, evitando duplicidade).
      const dataEmissao = new Date(dadosNormalizados.dataEmissao);
      const gerarChave = (numero: number): string =>
        gerarChaveAcesso({
          uf: config.uf || 'SP',
          ano: dataEmissao.getFullYear(),
          mes: dataEmissao.getMonth() + 1,
          cnpj: config.cnpj || '00000000000000',
          tipo: dadosNormalizados.tipo,
          serie: dadosNormalizados.serie || '1',
          numero,
        });

      const nota = await this.notaFiscalRepository.criarComNumeroAtomico(
        tenantId,
        dadosNormalizados,
        gerarChave,
        calculo.itens,
        calculo.totalizadores,
      );

      // O rascunho já entra em `totalNFs`/`porStatus`/`porTipo` das estatísticas.
      await this.invalidarEstatisticas(tenantId);

      this.logger.log(`Rascunho criado: ${nota.id} (número ${nota.numero})`);
      return nota;
    } catch (erro) {
      this.logger.error('Erro ao criar rascunho:', erro);
      throw erro;
    }
  }

  /**
   * Valida uma nota fiscal antes de emitir (RASCUNHO → VALIDADA).
   *
   * Recalcula os tributos (fonte da verdade = regras atuais do tenant) e
   * persiste os valores por item e os totalizadores da nota, além de validar a
   * transição de status.
   */
  async validarNota(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Validando nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      this.garantirTransicao(nota.status, StatusNotaFiscal.VALIDADA);

      // Validações estruturais básicas.
      if (!nota.chaveAcesso || nota.chaveAcesso.length !== 44) {
        throw new BadRequestException('Chave de acesso inválida');
      }
      if (!nota.itens || nota.itens.length === 0) {
        throw new BadRequestException('Nota fiscal sem itens');
      }

      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      // Recalcula tributos com base nos itens persistidos.
      const uf: UfOperacao = {
        origem: config.uf ?? undefined,
        destino: this.ufDestinoDaNota(nota),
      };
      const calculo = await this.tributos.calcular(
        tenantId,
        nota.itens.map((item) => this.itemPersistidoParaTributavel(item)),
        config.regimeTributario as RegimeTributario,
        uf,
      );

      // Persiste tributos por item + totalizadores e transiciona para VALIDADA.
      // Passa os itens persistidos (com ids) na mesma ordem usada para montar
      // calculo.itens, garantindo o casamento por índice no repositório.
      await this.notaFiscalRepository.atualizarTributos(
        tenantId,
        notaId,
        nota.itens,
        calculo.itens,
        calculo.totalizadores,
        StatusNotaFiscal.VALIDADA,
      );

      await this.cache.remover(`nota:${tenantId}:${notaId}`).catch(() => undefined);
      // RASCUNHO → VALIDADA muda `porStatus` (e o denominador das taxas).
      await this.invalidarEstatisticas(tenantId);
      this.logger.log(`Nota ${notaId} validada com sucesso`);

      return this.notaFiscalRepository.buscarPorId(tenantId, notaId);
    } catch (erro) {
      this.logger.error('Erro ao validar nota:', erro);
      throw erro;
    }
  }

  /**
   * Emite uma nota fiscal transmitindo pelo provedor fiscal (ProvedorFiscalPort,
   * ADR-001). O domínio monta o documento a partir da nota + configuração e
   * delega a transmissão ao provedor selecionado (fake em dev, Focus NFe na
   * v1). O resultado normalizado é aplicado à nota por `aplicarResultadoProvedor`.
   */
  async emitirNota(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Emitindo nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      // Ciclo de vida: só transmite a partir de VALIDADA (fluxo normal) ou
      // REJEITADA (reenvio após correção). Bloqueia RASCUNHO (não validada),
      // duplicidade (já AUTORIZADA/TRANSMITIDA) e estados terminais.
      if (nota.status !== StatusNotaFiscal.VALIDADA && nota.status !== StatusNotaFiscal.REJEITADA) {
        throw new BadRequestException(
          `Nota em status ${nota.status} não pode ser emitida. ` +
            'Valide a nota (status VALIDADA) antes de transmitir.',
        );
      }

      // Obtém configuração fiscal (emitente, ambiente, CSC).
      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      // Monta o documento de domínio e transmite pelo provedor.
      const documento = montarDocumentoFiscal(
        nota as unknown as Record<string, unknown>,
        config as unknown as Record<string, unknown>,
      );

      // NFC-e (modelo 65) exige CSC (token + id) configurado no tenant: é o
      // segredo usado no QR Code e na assinatura do modelo 65. Falha cedo com
      // 400 claro em vez de deixar a SEFAZ rejeitar depois da transmissão.
      if (documento.modelo === 'NFCE' && (!documento.cscToken || !documento.cscId)) {
        throw new BadRequestException(
          'NFC-e (modelo 65) exige CSC configurado (tokenCsc e idCsc na configuração fiscal)',
        );
      }

      const resultado =
        documento.modelo === 'NFCE'
          ? await this.provedorFiscal.emitirNfce(documento)
          : await this.provedorFiscal.emitirNfe(documento);

      // Aplica o resultado (status + XML/protocolo + eventos Kafka).
      await this.aplicarResultadoProvedor(tenantId, notaId, resultado);

      return resultado;
    } catch (erro) {
      this.logger.error('Erro ao emitir nota:', erro);
      throw erro;
    }
  }

  /**
   * Aplica um resultado do provedor fiscal (emissão síncrona OU webhook
   * assíncrono) ao ciclo de vida da nota: transiciona o status, persiste
   * XML/protocolo/motivo e publica os eventos Kafka correspondentes
   * (NOTA_AUTORIZADA / NOTA_REJEITADA).
   *
   * Ponto único de aplicação para não duplicar regra de transição entre o
   * caminho síncrono e o webhook. Idempotente o suficiente: reaplicar um
   * AUTORIZADO sobre nota já autorizada apenas reescreve os mesmos campos.
   *
   * @param resultado Resultado normalizado do ProvedorFiscalPort.
   */
  async aplicarResultadoProvedor(
    tenantId: string,
    notaId: string,
    resultado: ResultadoProvedorFiscal,
  ): Promise<void> {
    // Invalida o cache da nota (status mudou).
    await this.cache.remover(`nota:${tenantId}:${notaId}`).catch(() => undefined);

    // pedidoId vinculado (se houver) — necessário no evento para o
    // order-service marcar o pedido como FATURADO.
    const notaVinculada = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
    const pedidoId = notaVinculada?.pedidoId ?? null;

    switch (resultado.status) {
      case StatusProvedorFiscal.AUTORIZADO: {
        await this.notaFiscalRepository.armazenarAutorizacao(
          tenantId,
          notaId,
          resultado.xml ?? '',
          resultado.protocolo ?? '',
        );
        await this.produtor.publicarNotaAutorizada(
          tenantId,
          notaId,
          resultado.protocolo ?? '',
          pedidoId,
        );
        this.logger.log(`Nota ${notaId} autorizada (protocolo ${resultado.protocolo ?? 'n/d'})`);
        break;
      }

      case StatusProvedorFiscal.PROCESSANDO: {
        // Recebida pelo provedor, autorização assíncrona: marca TRANSMITIDA e
        // aguarda o webhook para o desfecho.
        await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'TRANSMITIDA');
        this.logger.log(`Nota ${notaId} em processamento na SEFAZ (aguardando webhook)`);
        break;
      }

      case StatusProvedorFiscal.DENEGADO: {
        await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'DENEGADA', {
          motivoRejeicao: resultado.motivo,
          xmlRetorno: resultado.xml,
        });
        await this.produtor.publicarNotaRejeitada(
          tenantId,
          notaId,
          resultado.motivo ?? 'Documento denegado pela SEFAZ',
          pedidoId,
        );
        this.logger.warn(`Nota ${notaId} denegada: ${resultado.motivo ?? 'sem motivo'}`);
        break;
      }

      case StatusProvedorFiscal.CANCELADO: {
        await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'CANCELADA', {
          xmlRetorno: resultado.xml,
          protocolo: resultado.protocolo,
        });
        this.logger.log(`Nota ${notaId} cancelada (protocolo ${resultado.protocolo ?? 'n/d'})`);
        break;
      }

      case StatusProvedorFiscal.REJEITADO:
      case StatusProvedorFiscal.ERRO:
      case StatusProvedorFiscal.ERRO_CANCELAMENTO:
      default: {
        await this.notaFiscalRepository.atualizarStatus(tenantId, notaId, 'REJEITADA', {
          motivoRejeicao: resultado.motivo,
          xmlRetorno: resultado.xml,
        });
        await this.produtor.publicarNotaRejeitada(
          tenantId,
          notaId,
          resultado.motivo ?? 'Documento rejeitado pela SEFAZ',
          pedidoId,
        );
        this.logger.warn(`Nota ${notaId} rejeitada: ${resultado.motivo ?? 'sem motivo'}`);
        break;
      }
    }

    // Invalida os KPIs DEPOIS de gravar o novo status. Invalidar antes abriria
    // uma janela (a escrita acima tem vários awaits) na qual uma leitura de
    // /notas-fiscais/estatisticas repovoaria o cache com o estado ANTERIOR e o
    // congelaria por 60s — visível sobretudo no webhook, que roda fora do
    // request do usuário (a nota autoriza e o contador não sobe).
    await this.invalidarEstatisticas(tenantId);
  }

  /**
   * Monta o contexto de operação (ambiente/modelo/token do tenant) a partir da
   * nota e da configuração fiscal, para as chamadas por referência ao provedor
   * (consulta, cancelamento, CC-e, inutilização).
   */
  private montarContextoOperacao(
    nota: { tipo?: unknown },
    config: { ambienteSefaz?: unknown; tokenProvedorFiscal?: unknown } | null,
  ): ContextoOperacaoFiscal {
    const modelo: ModeloDocumentoFiscal = nota.tipo === 'NFCE' ? 'NFCE' : 'NFE';
    const ambiente: AmbienteFiscal =
      config?.ambienteSefaz === 'PRODUCAO' ? 'PRODUCAO' : 'HOMOLOGACAO';
    return {
      ambiente,
      modelo,
      tokenProvedor:
        typeof config?.tokenProvedorFiscal === 'string' ? config.tokenProvedorFiscal : undefined,
    };
  }

  /**
   * Gera e emite uma NF-e automaticamente a partir do evento `pedido.faturar`
   * publicado pelo order-service (saga de faturamento).
   *
   * Idempotente: se já existe nota ativa vinculada ao pedido, retorna-a sem
   * criar outra (reentregas do Kafka não duplicam notas).
   *
   * Enriquecimento de NCM/CFOP por produto via catalog-service fica como
   * evolução (Etapa 9 do plano fiscal) — aqui usamos os dados do evento com
   * defaults seguros; o engine de tributos recalcula tudo na validação.
   */
  async gerarNotaAutomaticamente(
    tenantId: string,
    evento: {
      pedidoId: string;
      numero?: number;
      clienteId?: string;
      cliente?: string;
      clienteCpfCnpj?: string;
      valorTotal?: number;
      itens?: Array<{
        produtoId: string;
        sku?: string;
        titulo?: string;
        quantidade: number;
        valorUnitario: number;
        valorTotal?: number;
        ncm?: string;
        cfop?: string;
      }>;
    },
  ) {
    const existente = await this.notaFiscalRepository.buscarPorPedido(tenantId, evento.pedidoId);
    if (existente) {
      this.logger.log(
        `pedido.faturar [${evento.pedidoId}]: nota ${existente.id} já existe (${existente.status}) — ignorando reentrega`,
      );
      return existente;
    }

    if (!evento.itens || evento.itens.length === 0) {
      this.logger.warn(`pedido.faturar [${evento.pedidoId}] sem itens — nota não gerada`);
      return null;
    }

    const cpfCnpj = (evento.clienteCpfCnpj ?? '').replace(/\D/g, '');
    const dto: CriarNotaFiscalDto = {
      tipo: 'NFE',
      naturezaOperacao: 'VENDA',
      dataEmissao: new Date().toISOString(),
      clienteId: evento.clienteId,
      pedidoId: evento.pedidoId,
      destinatario: {
        nome: evento.cliente ?? 'CONSUMIDOR NAO IDENTIFICADO',
        // CNPJ de teste padrão quando o pedido não tem documento — suficiente
        // para homologação/fake; produção exigirá documento real do cliente.
        cpfCnpj: cpfCnpj || '99999999000191',
      },
      itens: evento.itens.map((item) => ({
        produtoId: item.produtoId,
        descricao: item.titulo ?? item.sku ?? 'Item do pedido',
        ncm: item.ncm ?? '00000000',
        cfop: item.cfop ?? '5102',
        unidade: 'UN',
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal ?? item.quantidade * item.valorUnitario,
        valorDesconto: 0,
        origemMercadoria: '0',
        cstIcms: '102',
        aliquotaIcms: 0,
        cstPis: '07',
        aliquotaPis: 0,
        cstCofins: '07',
        aliquotaCofins: 0,
        cstIpi: '53',
        aliquotaIpi: 0,
      })),
    } as CriarNotaFiscalDto;

    const rascunho = await this.criarRascunho(tenantId, dto);
    await this.validarNota(tenantId, rascunho.id);
    const resultado = await this.emitirNota(tenantId, rascunho.id);

    this.logger.log(
      `pedido.faturar [${evento.pedidoId}]: nota ${rascunho.id} gerada e transmitida automaticamente`,
    );
    return resultado;
  }

  /**
   * Consulta a situação de uma nota junto ao provedor fiscal (que consulta a
   * SEFAZ). A referência do provedor é o id da nota no nosso domínio.
   */
  async consultarNota(tenantId: string, notaId: string) {
    try {
      this.logger.log(`Consultando nota ${notaId} no provedor fiscal`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }

      const contexto = this.montarContextoOperacao(nota, config);
      return await this.provedorFiscal.consultar(notaId, contexto);
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
      const contexto = this.montarContextoOperacao(nota, config);

      // Registra evento de cancelamento (auditoria do ciclo de vida).
      const evento = await this.notaFiscalRepository.registrarEvento(
        tenantId,
        notaId,
        'CANCELAMENTO',
        1,
        dados.justificativa,
      );

      // Solicita o cancelamento ao provedor fiscal (que transmite à SEFAZ).
      const resultado = await this.provedorFiscal.cancelar(notaId, dados.justificativa, contexto);

      if (resultado.status === StatusProvedorFiscal.CANCELADO) {
        await this.notaFiscalRepository.atualizarEvento(
          tenantId,
          evento.id,
          'AUTORIZADO',
          resultado.xml,
          resultado.protocolo,
        );
        await this.aplicarResultadoProvedor(tenantId, notaId, resultado);
        await this.produtor.publicarNotaCancelada(
          tenantId,
          notaId,
          dados.justificativa,
          nota.pedidoId ?? null,
        );
        this.logger.log(`Nota ${notaId} cancelada com sucesso`);
      } else {
        await this.notaFiscalRepository.atualizarEvento(
          tenantId,
          evento.id,
          'REJEITADO',
          resultado.xml,
          resultado.protocolo,
        );
        this.logger.warn(
          `Cancelamento da nota ${notaId} rejeitado: ${resultado.motivo ?? 'sem motivo'}`,
        );
      }

      return resultado;
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
      const contexto = this.montarContextoOperacao(nota, config);

      // Registra evento de carta de correção (sequência incremental).
      const eventos = await this.notaFiscalRepository.buscarEventos(notaId);
      const proximaSequencia = (eventos.length || 0) + 1;

      const evento = await this.notaFiscalRepository.registrarEvento(
        tenantId,
        notaId,
        'CARTA_CORRECAO',
        proximaSequencia,
        dados.descricaoCorrecao,
      );

      // Solicita a CC-e ao provedor fiscal.
      const resultado = await this.provedorFiscal.cartaCorrecao(
        notaId,
        dados.descricaoCorrecao,
        contexto,
      );

      const eventoAutorizado = resultado.status === StatusProvedorFiscal.AUTORIZADO;
      await this.notaFiscalRepository.atualizarEvento(
        tenantId,
        evento.id,
        eventoAutorizado ? 'AUTORIZADO' : 'REJEITADO',
        resultado.xml,
        resultado.protocolo,
      );

      if (eventoAutorizado) {
        this.logger.log(`Carta de correção autorizada para nota ${notaId}`);
      } else {
        this.logger.warn(
          `Carta de correção da nota ${notaId} rejeitada: ${resultado.motivo ?? 'sem motivo'}`,
        );
      }

      return resultado;
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
      this.logger.log(`Inutilizando notas de ${dados.numeroInicial} a ${dados.numeroFinal}`);

      const config = await this.configuracaoRepository.obter(tenantId);
      if (!config) {
        throw new BadRequestException('Configuração fiscal não encontrada');
      }
      if (!config.cnpj) {
        throw new BadRequestException(
          'CNPJ do emitente não configurado — necessário para inutilização',
        );
      }

      // Inutilização é sempre de NF-e (mod. 55) neste fluxo.
      const contexto = {
        ...this.montarContextoOperacao({ tipo: 'NFE' }, config),
        cnpjEmitente: config.cnpj,
      };

      const resultado = await this.provedorFiscal.inutilizar(
        dados.serie,
        { inicial: dados.numeroInicial, final: dados.numeroFinal },
        dados.justificativa,
        contexto,
      );

      this.logger.log(
        `Inutilização processada: status=${resultado.status} protocolo=${resultado.protocolo ?? 'n/d'}`,
      );

      return resultado;
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
   * Estatísticas fiscais agregadas do tenant (KPIs da tela Fiscal).
   *
   * Agrega no BANCO (groupBy/aggregate) em vez de carregar as notas em
   * memória: os totais cobrem TODAS as notas do tenant, e não apenas a
   * primeira página como fazia o cálculo client-side.
   *
   * Semântica (espelha o que a tela `dashboard/fiscal` consome):
   *  - janelas de 30/7 dias filtram por `dataEmissao` e status AUTORIZADA —
   *    faturamento só considera nota efetivamente autorizada pela SEFAZ;
   *  - `taxaEmissao`/`taxaRejeicao` têm como denominador as notas SUBMETIDAS
   *    (total - RASCUNHO), pois rascunho ainda não foi à SEFAZ e não deve
   *    diluir as taxas;
   *  - `porStatus`/`porTipo` trazem apenas as chaves presentes; a UI já faz
   *    fallback para 0 nas ausentes.
   *
   * Resultado cacheado por 60s (KPI tolera leve defasagem) e invalidado via
   * `invalidarEstatisticas` sempre que uma nota do tenant nasce ou muda de
   * status — o TTL é só a rede de segurança, não a via normal de atualização.
   */
  async obterEstatisticas(tenantId: string): Promise<EstatisticasFiscais> {
    try {
      const cacheKey = this.chaveEstatisticas(tenantId);
      const emCache = await this.cache.obter<EstatisticasFiscais>(cacheKey);
      if (emCache) {
        return emCache;
      }

      const agora = Date.now();
      const desde30 = new Date(agora - 30 * 24 * 60 * 60 * 1000);
      const desde7 = new Date(agora - 7 * 24 * 60 * 60 * 1000);

      const { porStatus, porTipo, janela30d, janela7d } =
        await this.notaFiscalRepository.agregarEstatisticas(tenantId, desde30, desde7);

      // Distribuição por status + total geral derivado das contagens.
      const contagemStatus: Record<string, number> = {};
      let totalNFs = 0;
      for (const linha of porStatus) {
        contagemStatus[linha.status] = linha._count._all;
        totalNFs += linha._count._all;
      }

      const contagemTipo: Record<string, number> = {};
      for (const linha of porTipo) {
        contagemTipo[linha.tipo] = linha._count._all;
      }

      const autorizadas = contagemStatus[StatusNotaFiscal.AUTORIZADA] ?? 0;
      const rejeitadas = contagemStatus[StatusNotaFiscal.REJEITADA] ?? 0;
      const processando = contagemStatus[StatusNotaFiscal.TRANSMITIDA] ?? 0;
      const rascunhos = contagemStatus[StatusNotaFiscal.RASCUNHO] ?? 0;
      // Denominador das taxas: notas efetivamente submetidas à SEFAZ.
      const submetidas = totalNFs - rascunhos;

      // Decimal → number (reais) na fronteira da resposta.
      const faturado30d = this.decimalParaNumero(janela30d._sum.valorTotal) ?? 0;
      const faturado7d = this.decimalParaNumero(janela7d._sum.valorTotal) ?? 0;
      const impostos30d =
        (this.decimalParaNumero(janela30d._sum.valorIcms) ?? 0) +
        (this.decimalParaNumero(janela30d._sum.valorPis) ?? 0) +
        (this.decimalParaNumero(janela30d._sum.valorCofins) ?? 0);

      const estatisticas: EstatisticasFiscais = {
        faturado30d: this.arredondar(faturado30d, 2),
        faturado7d: this.arredondar(faturado7d, 2),
        impostos30d: this.arredondar(impostos30d, 2),
        totalNFs,
        emitidas30d: janela30d._count._all,
        emitidas7d: janela7d._count._all,
        taxaRejeicao: submetidas > 0 ? this.arredondar((rejeitadas / submetidas) * 100, 1) : 0,
        taxaEmissao: submetidas > 0 ? this.arredondar((autorizadas / submetidas) * 100, 1) : 0,
        porStatus: contagemStatus,
        porTipo: contagemTipo,
        processando,
      };

      await this.cache.armazenar(cacheKey, estatisticas, 60);

      return estatisticas;
    } catch (erro) {
      this.logger.error('Erro ao agregar estatísticas fiscais:', erro);
      throw erro;
    }
  }

  /** Chave do cache de estatísticas fiscais do tenant (uma por tenant). */
  private chaveEstatisticas(tenantId: string): string {
    return `nota:estatisticas:${tenantId}`;
  }

  /**
   * Invalida o cache de estatísticas do tenant.
   *
   * Deve ser chamado em TODO ponto que altera o conjunto de notas (criação) ou
   * o status/valores de uma nota — senão os KPIs da tela Fiscal ficam até 60s
   * defasados ("emiti a NF-e e o contador não subiu").
   *
   * Nunca derruba a operação de negócio: uma falha de Redis só custa a
   * defasagem do TTL, então o erro é engolido (mesmo padrão da invalidação da
   * nota individual).
   */
  private async invalidarEstatisticas(tenantId: string): Promise<void> {
    await this.cache.remover(this.chaveEstatisticas(tenantId)).catch(() => undefined);
  }

  /** Arredonda para `casas` decimais devolvendo number (não a string de toFixed). */
  private arredondar(valor: number, casas: number): number {
    return Number(valor.toFixed(casas));
  }

  /**
   * Calcula impostos para uma lista de itens avulsos (endpoint
   * POST /calcular-impostos).
   *
   * Delega ao ENGINE DE TRIBUTOS, usando o regime da ConfiguracaoFiscal do
   * tenant e as RegrasFiscais aplicáveis por NCM/CFOP/UF/regime. Retorna o
   * detalhamento por imposto (campo `tributos` de cada item) + os
   * totalizadores da operação.
   *
   * Unidade monetária: REAIS com Prisma.Decimal ponta a ponta (o engine
   * deriva valorTotal = quantidade × valorUnitário quando não informado).
   */
  async calcularImpostosItens(
    tenantId: string,
    itens: ItemTributavel[],
    ufDestino?: string,
  ): Promise<ResultadoCalculoTributos> {
    const config = await this.configuracaoRepository.obter(tenantId);
    if (!config) {
      throw new BadRequestException('Configuração fiscal não encontrada');
    }

    const uf: UfOperacao = {
      origem: config.uf ?? undefined,
      destino: ufDestino ?? this.primeiroUfDestino(itens),
    };

    return this.tributos.calcular(
      tenantId,
      itens ?? [],
      config.regimeTributario as RegimeTributario,
      uf,
    );
  }

  /**
   * Gera o PDF do DANFE (NF-e) / DANFCE (NFC-e).
   *
   * Fonte do PDF (nesta ordem):
   *  1. Provedor fiscal (`obterDanfePdf`): em produção a Focus NFe devolve o
   *     DANFE oficial renderizado a partir do XML autorizado.
   *  2. Fallback do domínio: quando o provedor não fornece o PDF, montamos um
   *     DANFE mínimo VÁLIDO a partir da própria nota (chave, número/série,
   *     emitente, valor) — suficiente para dev/testes.
   *
   * Só faz sentido para documentos com autorização (AUTORIZADA/CANCELADA); nos
   * demais status não há documento fiscal para o DANFE representar.
   *
   * @returns Buffer do PDF (o controller responde com Content-Type
   *   application/pdf).
   */
  async gerarDanfe(tenantId: string, notaId: string): Promise<Buffer> {
    try {
      this.logger.log(`Gerando DANFE para nota ${notaId}`);

      const nota = await this.notaFiscalRepository.buscarPorId(tenantId, notaId);
      if (!nota) {
        throw new NotFoundException('Nota fiscal não encontrada');
      }

      // DANFE representa um documento autorizado (ou já autorizado e depois
      // cancelado). Rascunho/validada/rejeitada não têm DANFE.
      if (nota.status !== 'AUTORIZADA' && nota.status !== 'CANCELADA') {
        throw new BadRequestException(
          `Nota em status ${nota.status} não possui DANFE. ` +
            'Emita e autorize a nota antes de gerar o DANFE.',
        );
      }

      const config = await this.configuracaoRepository.obter(tenantId);
      const contexto = this.montarContextoOperacao(nota, config);

      // 1. Tenta obter o PDF pelo provedor (autoritativo em produção).
      const pdfProvedor = await this.provedorFiscal.obterDanfePdf(notaId, contexto);
      if (pdfProvedor && pdfProvedor.length > 0) {
        return pdfProvedor;
      }

      // 2. Fallback: monta um DANFE mínimo válido com os dados reais da nota.
      this.logger.log(`Provedor sem DANFE para ${notaId} — gerando DANFE mínimo local`);
      return this.montarDanfeLocal(nota, config);
    } catch (erro) {
      this.logger.error('Erro ao gerar DANFE:', erro);
      throw erro;
    }
  }

  /**
   * Monta o DANFE mínimo local (fallback de dev) a partir da nota persistida e
   * da configuração do emitente. Extrai o nome do destinatário do JSON quando
   * presente (NFC-e a consumidor não identificado fica sem destinatário).
   */
  private montarDanfeLocal(
    nota: {
      tipo?: unknown;
      chaveAcesso?: unknown;
      numero?: unknown;
      serie?: unknown;
      valorTotal?: unknown;
      protocolo?: unknown;
      destinatario?: Prisma.JsonValue;
    },
    config: {
      razaoSocial?: unknown;
      nomeFantasia?: unknown;
      cnpj?: unknown;
      ambienteSefaz?: unknown;
    } | null,
  ): Buffer {
    const ehNfce = nota.tipo === 'NFCE';
    const dest = nota.destinatario as { nome?: string } | null;
    const emitente =
      (typeof config?.razaoSocial === 'string' && config.razaoSocial) ||
      (typeof config?.nomeFantasia === 'string' && config.nomeFantasia) ||
      undefined;

    return gerarDanfePdfMinimo({
      titulo: ehNfce
        ? 'DANFCE - Documento Auxiliar da NFC-e'
        : 'DANFE - Documento Auxiliar da NF-e',
      chaveAcesso: typeof nota.chaveAcesso === 'string' ? nota.chaveAcesso : '',
      numero:
        typeof nota.numero === 'number' || typeof nota.numero === 'string' ? nota.numero : '-',
      serie: typeof nota.serie === 'string' || typeof nota.serie === 'number' ? nota.serie : '-',
      modelo: ehNfce ? '65' : '55',
      emitente,
      cnpjEmitente: typeof config?.cnpj === 'string' ? config.cnpj : undefined,
      destinatario: dest?.nome,
      valorTotal: this.decimalParaNumero(nota.valorTotal),
      protocolo: typeof nota.protocolo === 'string' ? nota.protocolo : undefined,
      ambiente: config?.ambienteSefaz === 'PRODUCAO' ? 'PRODUCAO' : 'HOMOLOGACAO',
    });
  }

  /** Converte Prisma.Decimal | number | string | null → number (reais). */
  private decimalParaNumero(valor: unknown): number | undefined {
    if (valor === null || valor === undefined) {
      return undefined;
    }
    if (typeof valor === 'number') {
      return valor;
    }
    if (
      typeof valor === 'object' &&
      typeof (valor as { toNumber?: unknown }).toNumber === 'function'
    ) {
      return (valor as { toNumber: () => number }).toNumber();
    }
    const n = Number(valor);
    return Number.isNaN(n) ? undefined : n;
  }

  // ─── Helpers privados (ciclo de vida + tributos) ─────────────

  /**
   * Garante que a transição de status é permitida; senão lança 400 com a
   * mensagem padronizada da máquina de estados (`ciclo-vida-nota.util`).
   */
  private garantirTransicao(origem: StatusNotaFiscal, destino: StatusNotaFiscal): void {
    if (!transicaoPermitida(origem, destino)) {
      throw new BadRequestException(mensagemTransicaoInvalida(origem, destino));
    }
  }

  /** Converte os itens do DTO de criação em itens tributáveis para o engine. */
  private itensParaTributar(dados: CriarNotaFiscalDto): ItemTributavel[] {
    return dados.itens.map((item) => ({
      produtoId: item.produtoId,
      descricao: item.descricao,
      ncm: item.ncm,
      cfop: item.cfop,
      unidade: item.unidade,
      origemMercadoria: item.origemMercadoria,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotal: item.valorTotal,
      valorDesconto: item.valorDesconto,
    }));
  }

  /** Converte um item já persistido (Prisma) em item tributável. */
  private itemPersistidoParaTributavel(item: {
    produtoId: string;
    descricao: string;
    ncm: string;
    cfop: string;
    unidade: string;
    origemMercadoria: string;
    quantidade: Prisma.Decimal;
    valorUnitario: Prisma.Decimal;
    valorTotal: Prisma.Decimal;
    valorDesconto: Prisma.Decimal;
  }): ItemTributavel {
    return {
      produtoId: item.produtoId,
      descricao: item.descricao,
      ncm: item.ncm,
      cfop: item.cfop,
      unidade: item.unidade,
      origemMercadoria: item.origemMercadoria,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotal: item.valorTotal,
      valorDesconto: item.valorDesconto,
    };
  }

  /** UF de destino a partir do destinatário do payload (se houver). */
  private ufDestino(dados: CriarNotaFiscalDto): string | undefined {
    return dados.destinatario?.estado ?? undefined;
  }

  /** UF de destino a partir do JSON de destinatário persistido na nota. */
  private ufDestinoDaNota(nota: { destinatario: Prisma.JsonValue }): string | undefined {
    const dest = nota.destinatario as { estado?: string } | null;
    return dest?.estado ?? undefined;
  }

  /** Primeira UF de destino informada numa lista de itens de cálculo. */
  private primeiroUfDestino(itens: ItemTributavel[]): string | undefined {
    for (const item of itens ?? []) {
      const uf = (item as { ufDestino?: string }).ufDestino;
      if (uf) {
        return uf;
      }
    }
    return undefined;
  }
}
