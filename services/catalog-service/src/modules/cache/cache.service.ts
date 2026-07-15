/**
 * Serviço de Cache (Redis com fallback em memória).
 *
 * Abstrai as operações de cache usadas pelos services do catálogo
 * (padrões cache-aside e invalidação seletiva).
 *
 * Backend: Redis via `ioredis` — o mesmo cliente já usado por
 * fiscal-service/marketplace-service no monorepo. A configuração de
 * conexão segue o padrão dos demais serviços (REDIS_HOST/REDIS_PORT/
 * REDIS_PASSWORD, ou REDIS_URL com parsing manual tolerante a senhas
 * com caracteres especiais como `/`, `=` e `@`).
 *
 * Robustez: é totalmente tolerante a falhas. Se o Redis estiver
 * indisponível (comum em dev sem docker), o serviço degrada para um
 * cache in-memory local e NUNCA propaga exceção de cache para a request
 * do usuário — no pior caso o cache vira no-op e a fonte original é
 * sempre consultada.
 */

import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name)

  /** Cliente Redis (null enquanto não conectado / em modo fallback). */
  private redis: Redis | null = null

  /** Indica se o Redis está operacional. Em falha, usamos o fallback. */
  private redisDisponivel = false

  /** Fallback in-memory: chave -> { valor serializado, expiraEm(ms epoch) }. */
  private readonly memoria = new Map<string, { valor: string; expiraEm: number }>()

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.conectar()
  }

  async onModuleDestroy() {
    if (this.redis) {
      try {
        await this.redis.quit()
      } catch {
        // encerramento best-effort
      }
    }
    this.memoria.clear()
  }

  // ── Conexão ────────────────────────────────────────────────────────────────

  private conectar(): void {
    const { host, port, password } = this.resolverConexao()

    try {
      this.redis = new Redis({
        host,
        port,
        password,
        // Não bloqueia o boot: comandos aguardam a conexão ficar pronta.
        lazyConnect: false,
        // Backoff limitado — evita tempestade de reconexão em dev sem Redis.
        retryStrategy: (tentativas) => {
          if (tentativas > 10) return null // desiste; segue em fallback
          return Math.min(tentativas * 100, 2000)
        },
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
      })

      this.redis.on('ready', () => {
        this.redisDisponivel = true
        this.logger.log(`Cache Redis conectado (${host}:${port})`)
      })

      this.redis.on('error', (erro) => {
        // Só loga a transição para indisponível, para não poluir o log.
        if (this.redisDisponivel) {
          this.logger.warn(`Redis indisponível, usando cache em memória: ${erro?.message ?? erro}`)
        }
        this.redisDisponivel = false
      })

      this.redis.on('end', () => {
        this.redisDisponivel = false
      })
    } catch (erro: any) {
      this.logger.warn(
        `Falha ao inicializar Redis (${host}:${port}); usando cache em memória: ${erro?.message ?? erro}`,
      )
      this.redis = null
      this.redisDisponivel = false
    }
  }

  /**
   * Resolve host/porta/senha do Redis a partir do ambiente.
   * Prioriza REDIS_HOST explícito (evita problemas de parsing de URL com
   * senhas contendo `/`, `=` ou `@`); cai para REDIS_URL quando presente.
   */
  private resolverConexao(): { host: string; port: number; password?: string } {
    const redisHost = this.config.get<string>('REDIS_HOST')
    const redisUrl = this.config.get<string>('REDIS_URL')

    if (redisHost) {
      return {
        host: redisHost,
        port: parseInt(this.config.get<string>('REDIS_PORT') || '6379', 10),
        password: this.config.get<string>('REDIS_PASSWORD') || undefined,
      }
    }

    if (redisUrl) {
      const m = redisUrl.match(/^redis[s]?:\/\/(?::([^@]*)@)?([^:/]+)(?::(\d+))?/)
      if (m) {
        return {
          password: m[1] || undefined,
          host: m[2] || 'localhost',
          port: parseInt(m[3] || '6379', 10),
        }
      }
    }

    return { host: 'localhost', port: 6379, password: undefined }
  }

  // ── API pública (mantém a assinatura consumida pelos services) ───────────────

  /**
   * Busca valor no cache.
   * @returns valor desserializado ou undefined se ausente/erro.
   */
  async obter<T>(chave: string): Promise<T | undefined> {
    if (this.redisDisponivel && this.redis) {
      try {
        const bruto = await this.redis.get(chave)
        return bruto ? (JSON.parse(bruto) as T) : undefined
      } catch (erro: any) {
        this.logger.warn(`Erro ao obter cache ${chave}: ${erro?.message ?? erro}`)
        return undefined
      }
    }
    return this.obterMemoria<T>(chave)
  }

  /**
   * Armazena valor no cache.
   * @param ttl tempo de vida em segundos (padrão 300s / 5min).
   */
  async definir<T>(chave: string, valor: T, ttl = 300): Promise<void> {
    const bruto = JSON.stringify(valor)

    if (this.redisDisponivel && this.redis) {
      try {
        if (ttl > 0) {
          await this.redis.set(chave, bruto, 'EX', ttl)
        } else {
          await this.redis.set(chave, bruto)
        }
        return
      } catch (erro: any) {
        this.logger.warn(`Erro ao definir cache ${chave}: ${erro?.message ?? erro}`)
        // cai para o fallback abaixo
      }
    }
    this.definirMemoria(chave, bruto, ttl)
  }

  /**
   * Remove uma chave específica do cache (usado em update/delete).
   */
  async invalidar(chave: string): Promise<void> {
    this.memoria.delete(chave)
    if (this.redisDisponivel && this.redis) {
      try {
        await this.redis.del(chave)
      } catch (erro: any) {
        this.logger.warn(`Erro ao invalidar cache ${chave}: ${erro?.message ?? erro}`)
      }
    }
  }

  /**
   * Remove todas as chaves que começam com `prefixo` (invalidação em massa).
   * Usada para limpar todas as páginas de uma listagem de uma vez
   * (ex.: `tenant:{id}:produtos-lista:` cobre todas as combinações de página/limite).
   *
   * No Redis usa SCAN + DEL (não bloqueante); no fallback percorre o Map.
   */
  async invalidarPorPrefixo(prefixo: string): Promise<void> {
    // Fallback in-memory: sempre limpo (barato e mantém consistência).
    for (const chave of Array.from(this.memoria.keys())) {
      if (chave.startsWith(prefixo)) this.memoria.delete(chave)
    }

    if (this.redisDisponivel && this.redis) {
      try {
        const padrao = `${prefixo}*`
        let cursor = '0'
        do {
          const [proximo, chaves] = await this.redis.scan(
            cursor,
            'MATCH',
            padrao,
            'COUNT',
            100,
          )
          cursor = proximo
          if (chaves.length > 0) {
            await this.redis.del(...chaves)
          }
        } while (cursor !== '0')
      } catch (erro: any) {
        this.logger.warn(`Erro ao invalidar prefixo ${prefixo}: ${erro?.message ?? erro}`)
      }
    }
  }

  /**
   * Padrão cache-aside: busca no cache; se não encontrar, executa `fn`,
   * armazena o resultado e o retorna.
   *
   * @param ttl tempo de vida em segundos (padrão 300s).
   */
  async obterOuCarregar<T>(
    chave: string,
    fn: () => Promise<T>,
    ttl = 300,
  ): Promise<T> {
    const cacheado = await this.obter<T>(chave)
    if (cacheado !== undefined && cacheado !== null) {
      return cacheado
    }

    const resultado = await fn()

    if (resultado !== null && resultado !== undefined) {
      await this.definir(chave, resultado, ttl)
    }

    return resultado
  }

  /**
   * Gera chave de cache padronizada e isolada por tenant.
   * Formato: tenant:{tenantId}:{recurso}[:{id}]
   *
   * @example gerarChave('uuid-tenant', 'produto', 'uuid-produto')
   * // => 'tenant:uuid-tenant:produto:uuid-produto'
   */
  gerarChave(tenantId: string, recurso: string, id?: string): string {
    const partes = ['tenant', tenantId, recurso]
    if (id) partes.push(id)
    return partes.join(':')
  }

  // ── Fallback in-memory ───────────────────────────────────────────────────────

  private obterMemoria<T>(chave: string): T | undefined {
    const entrada = this.memoria.get(chave)
    if (!entrada) return undefined
    if (entrada.expiraEm !== 0 && entrada.expiraEm < Date.now()) {
      this.memoria.delete(chave)
      return undefined
    }
    try {
      return JSON.parse(entrada.valor) as T
    } catch {
      return undefined
    }
  }

  private definirMemoria(chave: string, valor: string, ttl: number): void {
    // Teto simples de tamanho para não vazar memória em dev sem Redis.
    if (this.memoria.size >= 1000) {
      const primeira = this.memoria.keys().next().value
      if (primeira !== undefined) this.memoria.delete(primeira)
    }
    const expiraEm = ttl > 0 ? Date.now() + ttl * 1000 : 0
    this.memoria.set(chave, { valor, expiraEm })
  }
}
