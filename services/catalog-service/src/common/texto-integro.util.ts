/**
 * Guarda de integridade de texto (proteção contra mojibake U+FFFD).
 *
 * CONTEXTO — causa raiz do bug de encoding do catálogo:
 * o banco chegou a armazenar o caractere de substituição Unicode U+FFFD
 * (`�`, bytes UTF-8 `ef bf bd`) na coluna `nome` de alguns produtos
 * (ex.: "Teclado Mec�nico", "T�nis"), SOMENTE nos circunflexos `â`/`ê`.
 * A leitura/serialização do Prisma+NestJS estava correta — a corrupção era
 * NOS BYTES ARMAZENADOS, gravados por uma execução de seed cujo texto já
 * havia sido transcodificado errado (console/pipe do Windows em code page
 * OEM, ou arquivo re-salvo em charset incompatível) ANTES do INSERT.
 *
 * Esta função transforma esse cenário silencioso num erro imediato: qualquer
 * string que contenha U+FFFD é rejeitada antes de ser persistida. É usada pelo
 * seed (e pode ser usada em qualquer ponto de escrita) como rede de segurança.
 */

/** Caractere de substituição Unicode (mojibake sentinel). */
export const CARACTERE_SUBSTITUICAO = '�'

/**
 * Percorre recursivamente `valor` e retorna o caminho da PRIMEIRA string que
 * contém U+FFFD, ou `null` se todo o texto estiver íntegro.
 *
 * Detecta corrupção em strings aninhadas em objetos e arrays (ex.: `tags[]`,
 * campos de um produto), preservando o caminho para diagnóstico.
 */
export function encontrarTextoCorrompido(
  valor: unknown,
  caminho = 'raiz',
): string | null {
  if (typeof valor === 'string') {
    return valor.includes(CARACTERE_SUBSTITUICAO) ? caminho : null
  }
  if (Array.isArray(valor)) {
    for (let i = 0; i < valor.length; i++) {
      const achado = encontrarTextoCorrompido(valor[i], `${caminho}[${i}]`)
      if (achado) return achado
    }
    return null
  }
  if (valor && typeof valor === 'object') {
    for (const [chave, sub] of Object.entries(valor as Record<string, unknown>)) {
      const achado = encontrarTextoCorrompido(sub, `${caminho}.${chave}`)
      if (achado) return achado
    }
  }
  return null
}

/**
 * Falha (lança `Error`) se `valor` contiver qualquer string com U+FFFD.
 * No-op quando o texto está íntegro.
 *
 * @throws Error quando encontra mojibake, com o caminho do campo afetado.
 */
export function garantirTextoIntegro(valor: unknown, caminho = 'raiz'): void {
  const corrompido = encontrarTextoCorrompido(valor, caminho)
  if (corrompido) {
    throw new Error(
      `Texto corrompido detectado em "${corrompido}": contém U+FFFD (${CARACTERE_SUBSTITUICAO}). ` +
        `Isso indica transcodificação incorreta antes da escrita (ex.: code page do ` +
        `console no Windows, ou arquivo salvo fora de UTF-8). ` +
        `Garanta UTF-8 de ponta a ponta — NÃO persista mojibake no banco.`,
    )
  }
}
