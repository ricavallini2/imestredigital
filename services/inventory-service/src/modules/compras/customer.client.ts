/**
 * Cliente HTTP do Customer Service (cadastro de parceiros).
 *
 * O fornecedor é um PARCEIRO com o papel FORNECEDOR — vive no customer-service
 * (bounded context separado). A importação de NF-e usa este client para achar,
 * criar e atualizar o fornecedor da nota.
 *
 * DIFERENÇA de filosofia para o CatalogClient: aqui as chamadas de ESCRITA são
 * essenciais (o usuário mandou criar/atualizar), então o erro PROPAGA em vez de
 * degradar em silêncio. Só a BUSCA degrada (devolve null) — a tela ainda
 * consegue oferecer "criar novo".
 */

import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface ParceiroResumo {
  id: string;
  nome: string;
  nomeFantasia?: string | null;
  razaoSocial?: string | null;
  cnpj?: string | null;
  inscricaoEstadual?: string | null;
  email?: string | null;
  telefone?: string | null;
  celular?: string | null;
  papeis?: string[];
  status?: string;
}

/** Só dígitos — a NF-e e o cadastro variam a formatação do CNPJ. */
export function normalizarCnpj(valor: string | null | undefined): string {
  return String(valor ?? '').replace(/\D/g, '');
}

@Injectable()
export class CustomerClient {
  private readonly logger = new Logger(CustomerClient.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('CUSTOMER_SERVICE_URL') || 'http://localhost:3012';
  }

  /**
   * Busca o parceiro pelo CNPJ. Usa a LISTAGEM com filtro `cnpj` de propósito:
   * o endpoint `buscar-documento/:doc` do customer-service responde 500 (não
   * 404) quando não encontra, o que tornaria "não achou" indistinguível de
   * "serviço com problema".
   */
  async buscarPorCnpj(
    authorization: string | undefined,
    cnpj: string,
  ): Promise<ParceiroResumo | null> {
    const doc = normalizarCnpj(cnpj);
    if (!authorization || !doc) return null;
    try {
      const { data } = await axios.get<{ dados?: ParceiroResumo[] }>(
        `${this.baseUrl}/api/v1/clientes`,
        {
          params: { cnpj: doc, limite: 5 },
          headers: { Authorization: authorization },
          timeout: 5000,
        },
      );
      const achados = data?.dados ?? [];
      return achados.length > 0 ? achados[0] : null;
    } catch (erro) {
      this.logger.warn(
        `Falha ao buscar fornecedor por CNPJ no customer-service: ${
          erro instanceof Error ? erro.message : String(erro)
        }`,
      );
      return null;
    }
  }

  /** Busca o parceiro pelo ID (usado para gravar o nome do que foi ESCOLHIDO). */
  async buscarPorId(
    authorization: string | undefined,
    id: string,
  ): Promise<ParceiroResumo | null> {
    if (!authorization || !id) return null;
    try {
      const { data } = await axios.get<ParceiroResumo>(
        `${this.baseUrl}/api/v1/clientes/${id}`,
        { headers: { Authorization: authorization }, timeout: 5000 },
      );
      return data?.id ? data : null;
    } catch {
      return null;
    }
  }

  /** Lista parceiros com papel FORNECEDOR (para o seletor manual da tela). */
  async listarFornecedores(
    authorization: string | undefined,
    busca?: string,
  ): Promise<ParceiroResumo[]> {
    if (!authorization) return [];
    try {
      const { data } = await axios.get<{ dados?: ParceiroResumo[] }>(
        `${this.baseUrl}/api/v1/clientes`,
        {
          params: { papel: 'FORNECEDOR', limite: 50, ...(busca ? { busca } : {}) },
          headers: { Authorization: authorization },
          timeout: 5000,
        },
      );
      return data?.dados ?? [];
    } catch {
      return [];
    }
  }

  /** Cria o parceiro (papel FORNECEDOR). Erro PROPAGA — é escrita pedida pelo usuário. */
  async criarFornecedor(
    authorization: string | undefined,
    dto: Record<string, unknown>,
  ): Promise<ParceiroResumo> {
    try {
      const { data } = await axios.post<ParceiroResumo>(
        `${this.baseUrl}/api/v1/clientes`,
        dto,
        { headers: { Authorization: authorization ?? '' }, timeout: 8000 },
      );
      return data;
    } catch (erro) {
      throw new BadGatewayException(this.mensagemErro(erro, 'criar o fornecedor'));
    }
  }

  /**
   * Atualiza o parceiro. ATENÇÃO: o AtualizarClienteDto do customer-service NÃO
   * aceita cnpj/tipo (imutáveis por design) — enviar esses campos daria 400 por
   * forbidNonWhitelisted, então quem chama precisa filtrá-los antes.
   */
  async atualizarFornecedor(
    authorization: string | undefined,
    id: string,
    dto: Record<string, unknown>,
  ): Promise<ParceiroResumo> {
    try {
      const { data } = await axios.put<ParceiroResumo>(
        `${this.baseUrl}/api/v1/clientes/${id}`,
        dto,
        { headers: { Authorization: authorization ?? '' }, timeout: 8000 },
      );
      return data;
    } catch (erro) {
      throw new BadGatewayException(this.mensagemErro(erro, 'atualizar o fornecedor'));
    }
  }

  /** Extrai a mensagem real do erro do serviço remoto (que pode vir como array). */
  private mensagemErro(erro: unknown, acao: string): string {
    if (axios.isAxiosError(erro)) {
      const m = (erro.response?.data as { message?: string | string[] } | undefined)?.message;
      const detalhe = Array.isArray(m) ? m.join('; ') : m;
      if (detalhe) return `Não foi possível ${acao}: ${detalhe}`;
      return `Não foi possível ${acao} (HTTP ${erro.response?.status ?? '?'}).`;
    }
    return `Não foi possível ${acao}.`;
  }
}
