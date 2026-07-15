/**
 * Utilitário de geração de slug.
 *
 * Converte um texto livre (nome de categoria/marca) em um slug estável,
 * seguro para URL e único por tenant: minúsculas, sem acentos, com hífens
 * no lugar de espaços e sem caracteres especiais.
 *
 * @example gerarSlug('Casa & Decoração') // => 'casa-decoracao'
 */
export function gerarSlug(texto: string): string {
  return texto
    .normalize('NFD') // separa letras dos acentos
    .replace(/[̀-ͯ]/g, '') // remove os acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres não alfanuméricos
    .replace(/[\s_-]+/g, '-') // colapsa espaços/underscores em hífen único
    .replace(/^-+|-+$/g, '') // remove hífens das pontas
}
