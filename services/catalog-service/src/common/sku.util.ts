/**
 * Utilitários de composição de SKU de variação.
 *
 * O SKU automático de uma variação segue a spec de varejo:
 *   `${produto.sku}-${VALOR_SLUG}-${TAMANHO}`
 * em MAIÚSCULAS e sem espaços (ex: 'CAM-001' + 'Preto' + '38' → 'CAM-001-PRETO-38').
 */

/**
 * Normaliza um segmento de SKU: remove acentos, coloca em MAIÚSCULAS, troca
 * espaços/underscores por hífen e descarta qualquer caractere que não seja
 * alfanumérico ou hífen. Colapsa hífens repetidos e apara as pontas.
 *
 * @example segmentoSku('Preto Fosco') // => 'PRETO-FOSCO'
 * @example segmentoSku('33/34')       // => '3334'
 */
export function segmentoSku(texto: string): string {
  return (texto ?? '')
    .normalize('NFD') // separa letras dos acentos
    .replace(/[̀-ͯ]/g, '') // remove os acentos
    .toUpperCase()
    .trim()
    .replace(/[\s_]+/g, '-') // espaços/underscores viram hífen
    .replace(/[^A-Z0-9-]/g, '') // remove o resto (barras, símbolos)
    .replace(/-+/g, '-') // colapsa hífens repetidos
    .replace(/^-+|-+$/g, '') // apara hífens das pontas
}

/**
 * Monta o SKU automático de uma variação a partir do SKU do produto, do valor
 * do atributo (ex: a cor) e do tamanho. Segmentos vazios após a normalização
 * são omitidos, evitando hífens soltos.
 *
 * @example
 *   composeSkuVariacao('CAM-001', 'Preto', '38') // => 'CAM-001-PRETO-38'
 */
export function composeSkuVariacao(skuProduto: string, valorAtributo: string, tamanho: string): string {
  const partes = [segmentoSku(skuProduto), segmentoSku(valorAtributo), segmentoSku(tamanho)]
  return partes.filter(Boolean).join('-')
}
