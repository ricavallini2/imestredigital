/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Logger Estruturado
 * ═══════════════════════════════════════════════════════════════
 * Logger centralizado baseado em Pino para todos os microserviços.
 * Produz logs em formato JSON estruturado, facilitando
 * indexação no Grafana Loki / Elasticsearch.
 *
 * Uso:
 *   import { criarLogger } from '@imestredigital/logger';
 *   const logger = criarLogger({ servico: 'catalog-service' });
 *   logger.info({ produtoId: '123' }, 'Produto criado');
 */

/** Níveis de log suportados */
type NivelLog = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/** Opções para criar o logger */
interface OpcoesLogger {
  /** Nome do microserviço */
  servico: string;
  /** Nível mínimo de log (padrão: 'info' em produção, 'debug' em dev) */
  nivel?: NivelLog;
}

/** Interface do logger */
interface Logger {
  trace(dados: Record<string, any>, mensagem?: string): void;
  debug(dados: Record<string, any>, mensagem?: string): void;
  info(dados: Record<string, any>, mensagem?: string): void;
  warn(dados: Record<string, any>, mensagem?: string): void;
  error(dados: Record<string, any>, mensagem?: string): void;
  fatal(dados: Record<string, any>, mensagem?: string): void;
}

/**
 * Cria uma instância do logger para um microserviço.
 *
 * Em desenvolvimento: log formatado legível no console.
 * Em produção: JSON estruturado para ingestão no Loki/Elastic.
 *
 * @param opcoes - Nome do serviço e nível de log
 * @returns Instância do logger
 */
export function criarLogger(opcoes: OpcoesLogger): Logger {
  const { servico, nivel } = opcoes;
  const nivelAtivo = nivel || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
  const ehProducao = process.env.NODE_ENV === 'production';

  // Mapeamento de nível para prioridade numérica
  const niveis: Record<NivelLog, number> = {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
  };

  const nivelMinimo = niveis[nivelAtivo] || 30;

  /** Emite um log se o nível for suficiente */
  function emitir(nivel: NivelLog, dados: Record<string, any>, mensagem?: string) {
    if (niveis[nivel] < nivelMinimo) return;

    const registro = {
      timestamp: new Date().toISOString(),
      nivel,
      servico,
      mensagem: mensagem || '',
      ...dados,
    };

    if (ehProducao) {
      // JSON puro para ingestão em Loki/Elasticsearch
      console.log(JSON.stringify(registro));
    } else {
      // Formato legível para desenvolvimento
      const icones: Record<string, string> = {
        trace: '🔍', debug: '🐛', info: 'ℹ️',
        warn: '⚠️', error: '❌', fatal: '💀',
      };
      const cor = nivel === 'error' || nivel === 'fatal' ? '\x1b[31m' :
                  nivel === 'warn' ? '\x1b[33m' : '\x1b[36m';
      const reset = '\x1b[0m';
      const extra = Object.keys(dados).length > 0 ? ` ${JSON.stringify(dados)}` : '';
      console.log(`${cor}${icones[nivel]} [${servico}] ${mensagem || ''}${extra}${reset}`);
    }
  }

  return {
    trace: (dados, msg) => emitir('trace', dados, msg),
    debug: (dados, msg) => emitir('debug', dados, msg),
    info: (dados, msg) => emitir('info', dados, msg),
    warn: (dados, msg) => emitir('warn', dados, msg),
    error: (dados, msg) => emitir('error', dados, msg),
    fatal: (dados, msg) => emitir('fatal', dados, msg),
  };
}

export type { Logger, OpcoesLogger, NivelLog };
