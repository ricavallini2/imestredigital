/**
 * Cliente HTTP do Catalog Service.
 *
 * O inventory-service é a fonte da verdade de QUANTIDADES (saldo/reserva),
 * mas o nome e o SKU do produto vivem no catalog-service (bounded context
 * separado, banco separado). Para o resumo de estoque exibido no front,
 * enriquecemos os saldos com metadados do produto buscados no catálogo.
 *
 * Falha graciosa: se o catálogo estiver indisponível, devolvemos um mapa
 * vazio — o resumo ainda funciona (usa fallback de nome), nunca quebra.
 */

import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/** Metadados de produto usados no enriquecimento do resumo. */
export interface ProdutoResumo {
  id: string;
  nome: string;
  sku: string;
  precoVenda: number;
  estoqueMinimo: number;
}

/** Produto como devolvido na busca (usado no casamento de itens da NF-e). */
export interface ProdutoBusca {
  id: string;
  nome: string;
  sku: string;
  gtin: string | null;
  precoVenda: number;
  precoCusto: number;
  unidadeMedida: string | null;
}

interface ProdutoCatalogo {
  id: string;
  nome?: string;
  sku?: string;
  precoVenda?: string | number | null;
  estoqueMinimo?: number | null;
}

interface RespostaPaginadaProdutos {
  dados: ProdutoCatalogo[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

@Injectable()
export class CatalogClient {
  private readonly logger = new Logger(CatalogClient.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    // URL do catalog-service. Em Docker é http://catalog-service:3010;
    // em dev local, http://localhost:3010.
    this.baseUrl =
      this.configService.get<string>('CATALOG_SERVICE_URL') ||
      'http://localhost:3010';
  }

  /**
   * Busca todos os produtos do tenant e devolve um mapa produtoId → metadados.
   *
   * Propaga o JWT do chamador (Authorization) porque o catalog-service exige
   * autenticação e isola por tenant. Percorre todas as páginas do envelope
   * paginado canônico { dados, total, pagina, limite, totalPaginas }.
   *
   * @param authorization Header Authorization ("Bearer ...") do request original.
   */
  async mapaProdutos(
    authorization: string | undefined,
  ): Promise<Map<string, ProdutoResumo>> {
    const mapa = new Map<string, ProdutoResumo>();
    if (!authorization) return mapa;

    try {
      const limite = 100;
      let pagina = 1;
      let totalPaginas = 1;

      do {
        const { data } = await axios.get<RespostaPaginadaProdutos>(
          `${this.baseUrl}/api/v1/produtos`,
          {
            params: { pagina, itensPorPagina: limite },
            headers: { Authorization: authorization },
            timeout: 5000,
          },
        );

        for (const p of data?.dados ?? []) {
          mapa.set(p.id, {
            id: p.id,
            nome: p.nome ?? 'Produto sem nome',
            sku: p.sku ?? '—',
            precoVenda: this.paraNumero(p.precoVenda),
            estoqueMinimo: p.estoqueMinimo ?? 0,
          });
        }

        totalPaginas = data?.totalPaginas ?? 1;
        pagina += 1;
      } while (pagina <= totalPaginas);
    } catch (erro) {
      // Degrada graciosamente: resumo funciona sem enriquecimento.
      this.logger.warn(
        `Falha ao buscar produtos no catalog-service (${this.baseUrl}); ` +
          `resumo seguirá sem nome/sku enriquecidos. Detalhe: ${
            erro instanceof Error ? erro.message : String(erro)
          }`,
      );
    }

    return mapa;
  }

  /**
   * Busca produtos por termo livre (o catálogo casa `nome`, `sku` e `gtin` por
   * "contains"). Devolve a lista crua — quem chama decide o que é match EXATO.
   *
   * Não existe endpoint de busca por SKU exato no catalog-service; por isso a
   * filtragem exata é feita por quem consome (ver ComprasService.analisarNfe).
   */
  async buscarProdutos(
    authorization: string | undefined,
    termo: string,
  ): Promise<ProdutoBusca[]> {
    if (!authorization || !termo?.trim()) return [];
    try {
      const { data } = await axios.get<{ dados?: Record<string, unknown>[] }>(
        `${this.baseUrl}/api/v1/produtos`,
        {
          params: { busca: termo.trim(), itensPorPagina: 20 },
          headers: { Authorization: authorization },
          timeout: 5000,
        },
      );
      return (data?.dados ?? []).map((p) => ({
        id: String(p.id),
        nome: String(p.nome ?? ''),
        sku: String(p.sku ?? ''),
        gtin: (p.gtin as string | null) ?? null,
        precoVenda: this.paraNumero(p.precoVenda as string | number | null),
        precoCusto: this.paraNumero(p.precoCusto as string | number | null),
        unidadeMedida: (p.unidadeMedida as string | null) ?? null,
      }));
    } catch (erro) {
      this.logger.warn(
        `Falha ao buscar produtos no catalog-service: ${
          erro instanceof Error ? erro.message : String(erro)
        }`,
      );
      return [];
    }
  }

  /** Busca 1 produto por id (usado para gravar SKU/nome corretos no De-Para). */
  async buscarProdutoPorId(
    authorization: string | undefined,
    id: string,
  ): Promise<ProdutoBusca | null> {
    if (!authorization || !id) return null;
    try {
      const { data } = await axios.get<Record<string, unknown>>(
        `${this.baseUrl}/api/v1/produtos/${id}`,
        { headers: { Authorization: authorization }, timeout: 5000 },
      );
      if (!data?.id) return null;
      return {
        id: String(data.id),
        nome: String(data.nome ?? ''),
        sku: String(data.sku ?? ''),
        gtin: (data.gtin as string | null) ?? null,
        precoVenda: this.paraNumero(data.precoVenda as string | number | null),
        precoCusto: this.paraNumero(data.precoCusto as string | number | null),
        unidadeMedida: (data.unidadeMedida as string | null) ?? null,
      };
    } catch {
      return null;
    }
  }

  /**
   * Cria um produto no catálogo. Erro PROPAGA (é escrita pedida pelo usuário na
   * confirmação da importação, diferente das leituras que degradam em silêncio).
   *
   * ATENÇÃO a dois detalhes do contrato do catalog-service:
   * - `precoVenda`/`precoCusto` vão em REAIS (o texto "em centavos" no
   *   @ApiProperty do DTO está desatualizado; a coluna é Decimal(19,2) e a UI
   *   grava reais — conferido em produção);
   * - `descricao` exige 10+ caracteres e peso/dimensões têm mínimo — quem chama
   *   precisa mandar defaults válidos quando a NF-e não traz esses dados.
   */
  async criarProduto(
    authorization: string | undefined,
    dto: Record<string, unknown>,
  ): Promise<ProdutoBusca> {
    try {
      const { data } = await axios.post<Record<string, unknown>>(
        `${this.baseUrl}/api/v1/produtos`,
        dto,
        { headers: { Authorization: authorization ?? '' }, timeout: 8000 },
      );
      return {
        id: String(data.id),
        nome: String(data.nome ?? ''),
        sku: String(data.sku ?? ''),
        gtin: (data.gtin as string | null) ?? null,
        precoVenda: this.paraNumero(data.precoVenda as string | number | null),
        precoCusto: this.paraNumero(data.precoCusto as string | number | null),
        unidadeMedida: (data.unidadeMedida as string | null) ?? null,
      };
    } catch (erro) {
      if (axios.isAxiosError(erro)) {
        const m = (erro.response?.data as { message?: string | string[] } | undefined)?.message;
        const detalhe = Array.isArray(m) ? m.join('; ') : m;
        throw new BadGatewayException(
          detalhe
            ? `Não foi possível criar o produto no catálogo: ${detalhe}`
            : `Não foi possível criar o produto no catálogo (HTTP ${erro.response?.status ?? '?'}).`,
        );
      }
      throw new BadGatewayException('Não foi possível criar o produto no catálogo.');
    }
  }

  private paraNumero(valor: string | number | null | undefined): number {
    if (valor === null || valor === undefined) return 0;
    const n = typeof valor === 'number' ? valor : parseFloat(valor);
    return Number.isFinite(n) ? n : 0;
  }
}
