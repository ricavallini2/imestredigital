/**
 * Configuração centralizada do OpenAI / LLM Provider
 *
 * Define parâmetros, modelos e comportamento do provider de IA
 */

export const openaiConfig = {
  // Chave API do OpenAI
  apiKey: process.env.OPENAI_API_KEY || '',

  // Modelo principal (GPT-4, GPT-3.5-turbo, etc)
  modelo: process.env.OPENAI_MODEL || 'gpt-4',

  // Temperatura (criatividade): 0.0 (preciso) a 1.0 (criativo)
  temperatura: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),

  // Máximo de tokens na resposta
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),

  // Tokens por minuto (rate limiting)
  tokensporMinuto: parseInt(
    process.env.RATE_LIMIT_TOKENS_POR_MINUTO || '10000',
  ),

  // Requisições por minuto (rate limiting)
  requisicoesPorMinuto: parseInt(
    process.env.RATE_LIMIT_REQUISICOES_POR_MINUTO || '100',
  ),
};

/**
 * Configuração específica para cada tipo de tarefa de IA
 * Permite ajustes por caso de uso
 */
export const configPorTarefa = {
  // Assistente - conversas normais
  assistente: {
    temperatura: 0.7,
    maxTokens: 2000,
    topP: 0.9,
  },

  // Análise - insights estruturados
  analise: {
    temperatura: 0.3,
    maxTokens: 1500,
    topP: 0.95,
  },

  // Classificação fiscal - precisa ser muito precisa
  classificacao: {
    temperatura: 0.1,
    maxTokens: 500,
    topP: 0.99,
  },

  // Geração de descrição - criativa mas não extrema
  geracao: {
    temperatura: 0.6,
    maxTokens: 800,
    topP: 0.9,
  },

  // Previsão - analítica
  previsao: {
    temperatura: 0.2,
    maxTokens: 500,
    topP: 0.95,
  },
};

/**
 * Modelos alternativos em caso de fallback
 * Se OpenAI não funcionar, tentar estes
 */
export const modelosFallback = [
  'gpt-3.5-turbo', // Mais rápido e barato que GPT-4
  'text-davinci-003', // Legado
];
