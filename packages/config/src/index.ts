/**
 * @imestredigital/config
 *
 * Módulo de configuração centralizado do iMestreDigital.
 * Usa Zod para validação de variáveis de ambiente em tempo de execução.
 * Garante que nenhum serviço inicie sem as configurações obrigatórias.
 */

import { z } from 'zod';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

/**
 * Schema de validação das variáveis de ambiente.
 * Cada variável é validada quanto ao tipo e formato.
 * Valores padrão são fornecidos para desenvolvimento local.
 */
const envSchema = z.object({
  // ─── Geral ──────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  // ─── Banco de Dados ─────────────────────────────────
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/imestredigital'),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // ─── Redis ──────────────────────────────────────────
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // ─── Kafka ──────────────────────────────────────────
  KAFKA_BROKERS: z.string().default('localhost:9092'),
  KAFKA_CLIENT_ID: z.string().default('imestredigital'),
  KAFKA_GROUP_ID: z.string().default('imestredigital-group'),

  // ─── JWT / Auth ─────────────────────────────────────
  JWT_SECRET: z.string().default('dev-secret-trocar-em-producao'),
  JWT_EXPIRATION: z.string().default('1h'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // ─── IA / LLM ──────────────────────────────────────
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL_DEFAULT: z.string().default('gpt-4o'),

  // ─── Armazenamento ─────────────────────────────────
  STORAGE_PROVIDER: z.enum(['local', 's3', 'gcs']).default('local'),
  STORAGE_BUCKET: z.string().default('imestredigital-uploads'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('sa-east-1'),

  // ─── SEFAZ / Fiscal ────────────────────────────────
  SEFAZ_AMBIENTE: z.enum(['homologacao', 'producao']).default('homologacao'),
  CERTIFICADO_DIGITAL_PATH: z.string().optional(),
  CERTIFICADO_DIGITAL_SENHA: z.string().optional(),

  // ─── Elasticsearch ─────────────────────────────────
  ELASTICSEARCH_URL: z.string().default('http://localhost:9200'),

  // ─── Observabilidade ───────────────────────────────
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  OTEL_EXPORTER_URL: z.string().optional(),
});

/** Tipo inferido das variáveis de ambiente validadas */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Valida e retorna as variáveis de ambiente.
 * Lança erro detalhado se alguma variável obrigatória estiver faltando.
 */
export function carregarConfig(): EnvConfig {
  const resultado = envSchema.safeParse(process.env);

  if (!resultado.success) {
    console.error('❌ Erro na validação das variáveis de ambiente:');
    console.error(resultado.error.format());
    throw new Error('Configuração inválida. Verifique as variáveis de ambiente.');
  }

  return resultado.data;
}

/** Instância singleton da configuração */
let _config: EnvConfig | null = null;

/**
 * Retorna a configuração do ambiente (singleton).
 * Inicializa na primeira chamada e reutiliza nas seguintes.
 */
export function getConfig(): EnvConfig {
  if (!_config) {
    _config = carregarConfig();
  }
  return _config;
}

export default getConfig;
