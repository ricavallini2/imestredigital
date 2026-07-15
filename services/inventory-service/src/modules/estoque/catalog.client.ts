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

import { Injectable, Logger } from '@nestjs/common';
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

  private paraNumero(valor: string | number | null | undefined): number {
    if (valor === null || valor === undefined) return 0;
    const n = typeof valor === 'number' ? valor : parseFloat(valor);
    return Number.isFinite(n) ? n : 0;
  }
}
