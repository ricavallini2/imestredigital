/**
 * FocusNFeAdapter — implementação real do ProvedorFiscalPort sobre a API
 * Focus NFe v2 (ADR-001, provedor de transmissão da v1).
 *
 * Autenticação: HTTP Basic com o token da empresa como usuário e senha em
 * branco. Ambientes: homologação (default em dev) e produção, por base URL.
 *
 * Erros e rejeições da SEFAZ são mapeados para o domínio via
 * `focus-nfe.mapper` — o serviço de nota nunca vê o shape do provedor. Erros
 * de transporte (timeout, 5xx, corpo ilegível) viram
 * `StatusProvedorFiscal.ERRO`, nunca lançam para fora do adapter em fluxo
 * normal de emissão/consulta (o domínio decide o que fazer pelo status).
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';

import { ProvedorFiscalPort, ContextoOperacaoFiscal } from '../provedor-fiscal.port';
import {
  DocumentoFiscalParaEmissao,
  ResultadoProvedorFiscal,
  StatusProvedorFiscal,
  AmbienteFiscal,
} from '../tipos/provedor-fiscal.tipos';
import { baseUrlFocus, resolverTokenFocus, headerAuthorizationFocus } from './focus-nfe.config';
import { construirPayloadFocus } from './focus-nfe.payload';
import {
  RespostaFocusNFe,
  mapearRespostaFocus,
  mapearCancelamentoFocus,
  resultadoErroIntegracao,
} from './focus-nfe.mapper';

/** Timeout padrão das chamadas HTTP à Focus NFe (ms). */
const TIMEOUT_PADRAO_MS = 30000;

@Injectable()
export class FocusNFeAdapter implements ProvedorFiscalPort {
  private readonly logger = new Logger(FocusNFeAdapter.name);

  constructor(private readonly config: ConfigService) {}

  // ─────────────────────────────────────────────────────────────
  // Emissão
  // ─────────────────────────────────────────────────────────────

  async emitirNfe(nota: DocumentoFiscalParaEmissao): Promise<ResultadoProvedorFiscal> {
    return this.emitirDocumento(nota);
  }

  async emitirNfce(nota: DocumentoFiscalParaEmissao): Promise<ResultadoProvedorFiscal> {
    // A Focus usa o mesmo recurso /v2/nfe; o modelo 65 é distinguido pelo
    // payload (modelo/indicador_presenca/consumidor_final montados no
    // construirPayloadFocus a partir de nota.modelo === 'NFCE').
    return this.emitirDocumento(nota);
  }

  /**
   * Emissão comum de NF-e/NFC-e: POST /v2/nfe?ref=<ref>. Aceita 201
   * (autorizado) e 202 (processando) como respostas de sucesso de
   * transporte; o status real vem do corpo.
   */
  private async emitirDocumento(
    nota: DocumentoFiscalParaEmissao,
  ): Promise<ResultadoProvedorFiscal> {
    try {
      const http = this.criarCliente(nota.ambiente, nota.cscToken);
      const payload = construirPayloadFocus(nota);

      this.logger.log(
        `Focus NFe: emitindo ${nota.modelo} ref=${nota.ref} ambiente=${nota.ambiente}`,
      );

      const resposta = await http.post<RespostaFocusNFe>('/v2/nfe', payload, {
        params: { ref: nota.ref },
      });

      return mapearRespostaFocus(resposta.data ?? {}, nota.ref);
    } catch (erro) {
      return this.tratarErro(erro, nota.ref, 'emitir documento');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Consulta
  // ─────────────────────────────────────────────────────────────

  async consultar(ref: string, contexto: ContextoOperacaoFiscal): Promise<ResultadoProvedorFiscal> {
    try {
      const http = this.criarCliente(contexto.ambiente, contexto.tokenProvedor);

      const resposta = await http.get<RespostaFocusNFe>(`/v2/nfe/${encodeURIComponent(ref)}`, {
        params: { completa: 1 },
      });

      return mapearRespostaFocus(resposta.data ?? {}, ref);
    } catch (erro) {
      return this.tratarErro(erro, ref, 'consultar');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Cancelamento
  // ─────────────────────────────────────────────────────────────

  async cancelar(
    ref: string,
    justificativa: string,
    contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal> {
    try {
      const http = this.criarCliente(contexto.ambiente, contexto.tokenProvedor);

      // A Focus recebe a justificativa no corpo do DELETE.
      const resposta = await http.delete<RespostaFocusNFe>(`/v2/nfe/${encodeURIComponent(ref)}`, {
        data: { justificativa },
      });

      return mapearCancelamentoFocus(resposta.data ?? {}, ref);
    } catch (erro) {
      return this.tratarErro(erro, ref, 'cancelar');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Carta de Correção
  // ─────────────────────────────────────────────────────────────

  async cartaCorrecao(
    ref: string,
    texto: string,
    contexto: ContextoOperacaoFiscal,
  ): Promise<ResultadoProvedorFiscal> {
    try {
      const http = this.criarCliente(contexto.ambiente, contexto.tokenProvedor);

      const resposta = await http.post<RespostaFocusNFe>(
        `/v2/nfe/${encodeURIComponent(ref)}/carta_correcao`,
        { correcao: texto },
      );

      return mapearRespostaFocus(resposta.data ?? {}, ref);
    } catch (erro) {
      return this.tratarErro(erro, ref, 'carta de correção');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Inutilização
  // ─────────────────────────────────────────────────────────────

  async inutilizar(
    serie: string,
    faixa: { inicial: number; final: number },
    justificativa: string,
    contexto: ContextoOperacaoFiscal & { cnpjEmitente: string },
  ): Promise<ResultadoProvedorFiscal> {
    try {
      const http = this.criarCliente(contexto.ambiente, contexto.tokenProvedor);

      const resposta = await http.post<RespostaFocusNFe>('/v2/nfe/inutilizacao', {
        cnpj: contexto.cnpjEmitente.replace(/\D/g, ''),
        serie,
        numero_inicial: String(faixa.inicial),
        numero_final: String(faixa.final),
        justificativa,
      });

      return mapearRespostaFocus(resposta.data ?? {});
    } catch (erro) {
      return this.tratarErro(erro, undefined, 'inutilizar');
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Download de artefatos (XML autorizado / DANFE)
  // ─────────────────────────────────────────────────────────────

  async obterXml(ref: string, contexto: ContextoOperacaoFiscal): Promise<string | null> {
    const caminho = await this.caminhoArtefato(ref, contexto, (r) => r.caminho_xml_nota_fiscal);
    if (!caminho) {
      return null;
    }
    return this.baixarTexto(caminho, contexto.ambiente, contexto.tokenProvedor);
  }

  async obterDanfePdf(ref: string, contexto: ContextoOperacaoFiscal): Promise<Buffer | null> {
    const caminho = await this.caminhoArtefato(ref, contexto, (r) => r.caminho_danfe);
    if (!caminho) {
      return null;
    }
    return this.baixarBinario(caminho, contexto.ambiente, contexto.tokenProvedor);
  }

  /**
   * Consulta o documento para descobrir o caminho relativo de um artefato
   * (XML/DANFE). A Focus devolve caminhos relativos que são baixados da
   * mesma base URL com a mesma autenticação.
   */
  private async caminhoArtefato(
    ref: string,
    contexto: ContextoOperacaoFiscal,
    seletor: (r: RespostaFocusNFe) => string | undefined,
  ): Promise<string | null> {
    try {
      const http = this.criarCliente(contexto.ambiente, contexto.tokenProvedor);
      const resposta = await http.get<RespostaFocusNFe>(`/v2/nfe/${encodeURIComponent(ref)}`, {
        params: { completa: 1 },
      });
      return seletor(resposta.data ?? {}) ?? null;
    } catch (erro) {
      this.logger.warn(
        `Focus NFe: falha ao obter caminho de artefato ref=${ref}: ${this.mensagemErro(erro)}`,
      );
      return null;
    }
  }

  private async baixarTexto(
    caminho: string,
    ambiente: AmbienteFiscal,
    tokenTenant?: string,
  ): Promise<string | null> {
    try {
      const http = this.criarCliente(ambiente, tokenTenant);
      const resposta = await http.get<string>(caminho, {
        responseType: 'text',
      });
      return typeof resposta.data === 'string' ? resposta.data : String(resposta.data);
    } catch (erro) {
      this.logger.warn(`Focus NFe: falha ao baixar XML ${caminho}: ${this.mensagemErro(erro)}`);
      return null;
    }
  }

  private async baixarBinario(
    caminho: string,
    ambiente: AmbienteFiscal,
    tokenTenant?: string,
  ): Promise<Buffer | null> {
    try {
      const http = this.criarCliente(ambiente, tokenTenant);
      const resposta = await http.get<ArrayBuffer>(caminho, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(resposta.data);
    } catch (erro) {
      this.logger.warn(`Focus NFe: falha ao baixar DANFE ${caminho}: ${this.mensagemErro(erro)}`);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Infra
  // ─────────────────────────────────────────────────────────────

  /**
   * Cria uma instância axios já autenticada para o ambiente. O token do
   * tenant, quando presente no contexto, tem precedência sobre o global.
   */
  private criarCliente(ambiente: AmbienteFiscal, tokenTenant?: string): AxiosInstance {
    const token = resolverTokenFocus(this.config, ambiente, tokenTenant);
    return axios.create({
      baseURL: baseUrlFocus(ambiente),
      timeout: TIMEOUT_PADRAO_MS,
      headers: {
        Authorization: headerAuthorizationFocus(token),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // Não lança para status 4xx: a Focus devolve corpo estruturado com o
      // erro (ex.: erro_autorizacao) que queremos mapear, não tratar como
      // exceção de transporte.
      validateStatus: (status) => status < 500,
    });
  }

  /**
   * Converte um erro (axios ou não) para um resultado de domínio. Chamado no
   * catch das operações de emissão/consulta/evento. Quando o erro carrega um
   * corpo estruturado da Focus (5xx com JSON, ou token não configurado),
   * ainda tenta extrair um motivo útil.
   */
  private tratarErro(
    erro: unknown,
    ref: string | undefined,
    operacao: string,
  ): ResultadoProvedorFiscal {
    const mensagem = this.mensagemErro(erro);
    this.logger.error(`Focus NFe: erro ao ${operacao} ref=${ref}: ${mensagem}`);

    // Se for erro axios com corpo estruturado da Focus (5xx com JSON), tenta
    // preservar erros/mensagem do provedor.
    if (this.ehAxiosError(erro) && erro.response?.data) {
      const dados = erro.response.data as RespostaFocusNFe;
      const resultado = mapearRespostaFocus(dados, ref);
      // Garante status de erro mesmo se o corpo não trouxer um status válido.
      if (resultado.status === StatusProvedorFiscal.AUTORIZADO) {
        resultado.status = StatusProvedorFiscal.ERRO;
      }
      resultado.motivo = resultado.motivo ?? mensagem;
      return resultado;
    }

    return resultadoErroIntegracao(mensagem, ref, this.brutoDoErro(erro));
  }

  private ehAxiosError(erro: unknown): erro is AxiosError {
    return typeof erro === 'object' && erro !== null && (erro as AxiosError).isAxiosError === true;
  }

  private mensagemErro(erro: unknown): string {
    if (this.ehAxiosError(erro)) {
      if (erro.code === 'ECONNABORTED') {
        return 'Timeout na comunicação com a Focus NFe';
      }
      const status = erro.response?.status;
      const corpo = erro.response?.data as RespostaFocusNFe | undefined;
      const detalhe =
        corpo?.mensagem ??
        corpo?.mensagem_sefaz ??
        (Array.isArray(corpo?.erros) ? corpo?.erros?.[0]?.mensagem : undefined) ??
        erro.message;
      return status
        ? `Focus NFe retornou HTTP ${status}: ${detalhe}`
        : `Falha de comunicação com a Focus NFe: ${detalhe}`;
    }
    if (erro instanceof Error) {
      return erro.message;
    }
    return 'Erro desconhecido na comunicação com a Focus NFe';
  }

  private brutoDoErro(erro: unknown): unknown {
    if (this.ehAxiosError(erro)) {
      return erro.response?.data ?? { code: erro.code, message: erro.message };
    }
    return undefined;
  }
}
