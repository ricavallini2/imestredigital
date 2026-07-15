/**
 * Serviço de Cache
 *
 * Centraliza operações de cache para melhor performance em listas,
 * buscas e dados frequentes. É tolerante a falhas do backend de cache:
 * em qualquer erro o método retorna sem propagar exceção, evitando
 * derrubar a request do usuário por causa de um problema de cache.
 *
 * O store em uso é o in-memory padrão do `cache-manager` v5.
 * Wildcards (ex.: `cliente:lista:tenant:*`) não são suportados nativamente
 * — para essas chamadas usamos um índice em memória (`tagsPorPrefixo`)
 * que registra todas as chaves criadas por prefixo.
 */

import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  /** Índice de chaves por prefixo, para suportar invalidação por padrão. */
  private readonly tagsPorPrefixo = new Map<string, Set<string>>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Obtém valor do cache.
   */
  async obter<T>(chave: string): Promise<T | null> {
    try {
      const valor = await this.cacheManager.get<T>(chave);
      return (valor as T) ?? null;
    } catch (erro: any) {
      this.logger.warn(`Erro ao obter cache ${chave}: ${erro?.message ?? erro}`);
      return null;
    }
  }

  /**
   * Define valor no cache.
   *
   * @param ttl - tempo de vida em segundos (padrão 5 minutos).
   */
  async definir<T>(chave: string, valor: T, ttl: number = 300): Promise<void> {
    try {
      await this.cacheManager.set(chave, valor, ttl * 1000);
      this.indexarChave(chave);
    } catch (erro: any) {
      this.logger.warn(`Erro ao definir cache ${chave}: ${erro?.message ?? erro}`);
    }
  }

  /**
   * Remove uma chave (ou padrão `prefixo:*`) do cache.
   */
  async remover(chave: string): Promise<void> {
    try {
      if (chave.endsWith('*')) {
        const prefixo = chave.slice(0, -1);
        const chaves = this.tagsPorPrefixo.get(prefixo);
        if (!chaves) return;
        await Promise.all(Array.from(chaves).map((c) => this.deletarSeguro(c)));
        this.tagsPorPrefixo.delete(prefixo);
        return;
      }

      await this.deletarSeguro(chave);
      this.removerDoIndice(chave);
    } catch (erro: any) {
      this.logger.warn(`Erro ao remover cache ${chave}: ${erro?.message ?? erro}`);
    }
  }

  /**
   * Remove múltiplas chaves do cache.
   */
  async removerMultiplos(chaves: string[]): Promise<void> {
    await Promise.all(chaves.map((c) => this.remover(c)));
  }

  /**
   * Limpa todo o cache (best-effort).
   */
  async limpar(): Promise<void> {
    try {
      const todas: string[] = [];
      for (const set of this.tagsPorPrefixo.values()) {
        for (const c of set) todas.push(c);
      }
      await Promise.all(todas.map((c) => this.deletarSeguro(c)));
      this.tagsPorPrefixo.clear();
    } catch (erro: any) {
      this.logger.warn(`Erro ao limpar cache: ${erro?.message ?? erro}`);
    }
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  private async deletarSeguro(chave: string): Promise<void> {
    try {
      await this.cacheManager.del(chave);
    } catch (erro: any) {
      this.logger.debug?.(`Falha silenciosa ao apagar ${chave}: ${erro?.message ?? erro}`);
    }
  }

  private indexarChave(chave: string): void {
    // Indexa pelo prefixo até o último ":" (ex.: "cliente:lista:tenant:123" -> "cliente:lista:tenant:")
    const ultimoSep = chave.lastIndexOf(':');
    if (ultimoSep <= 0) return;
    const prefixo = chave.slice(0, ultimoSep + 1);
    const set = this.tagsPorPrefixo.get(prefixo) ?? new Set<string>();
    set.add(chave);
    this.tagsPorPrefixo.set(prefixo, set);
  }

  private removerDoIndice(chave: string): void {
    const ultimoSep = chave.lastIndexOf(':');
    if (ultimoSep <= 0) return;
    const prefixo = chave.slice(0, ultimoSep + 1);
    const set = this.tagsPorPrefixo.get(prefixo);
    if (!set) return;
    set.delete(chave);
    if (set.size === 0) this.tagsPorPrefixo.delete(prefixo);
  }
}
