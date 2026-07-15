/**
 * Gera um segmento de SKU a partir de um texto (valor de atributo/tamanho).
 * Regra ALINHADA byte a byte ao segmentoSku() do catalog-service
 * (services/catalog-service/src/common/sku.util.ts): espaços/underscores
 * viram hífen; acentos removidos; símbolos descartados; hífens colapsados.
 *
 * @example slugSku('Preto Fosco') // 'PRETO-FOSCO'
 * @example slugSku('Verde Água')  // 'VERDE-AGUA'
 * @example slugSku('33/34')       // '3334'
 */
export function slugSku(texto: string): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/p{Diacritic}/gu, '') // remove acentos
    .toUpperCase()
    .trim()
    .replace(/[s_]+/g, '-') // espaços/underscores viram hífen
    .replace(/[^A-Z0-9-]/g, '') // remove o resto (barras, símbolos)
    .replace(/-+/g, '-') // colapsa hífens repetidos
    .replace(/^-+|-+$/g, ''); // apara hífens das pontas
}
