/**
 * Utilitários para formatação de documentos (CPF e CNPJ)
 *
 * Converte documentos de formato numérico para formato legível.
 */

/**
 * Formata um CPF para o padrão xxx.xxx.xxx-xx
 *
 * @param cpf - CPF apenas com números (11 dígitos)
 * @returns CPF formatado ou null se inválido
 *
 * @example
 * formatarCPF('11144477735') // '111.444.777-35'
 */
export function formatarCPF(cpf: string): string | null {
  const numeros = cpf.replace(/\D/g, '');

  if (numeros.length !== 11) {
    return null;
  }

  return `${numeros.substring(0, 3)}.${numeros.substring(3, 6)}.${numeros.substring(6, 9)}-${numeros.substring(9, 11)}`;
}

/**
 * Formata um CNPJ para o padrão xx.xxx.xxx/xxxx-xx
 *
 * @param cnpj - CNPJ apenas com números (14 dígitos)
 * @returns CNPJ formatado ou null se inválido
 *
 * @example
 * formatarCNPJ('11222333000181') // '11.222.333/0001-81'
 */
export function formatarCNPJ(cnpj: string): string | null {
  const numeros = cnpj.replace(/\D/g, '');

  if (numeros.length !== 14) {
    return null;
  }

  return `${numeros.substring(0, 2)}.${numeros.substring(2, 5)}.${numeros.substring(5, 8)}/${numeros.substring(8, 12)}-${numeros.substring(12, 14)}`;
}

/**
 * Remove formatação de documento (CPF ou CNPJ)
 *
 * @param documento - Documento com ou sem formatação
 * @returns Documento apenas com números
 *
 * @example
 * removerFormatacao('111.444.777-35') // '11144477735'
 * removerFormatacao('11.222.333/0001-81') // '11222333000181'
 */
export function removerFormatacao(documento: string): string {
  return documento.replace(/\D/g, '');
}
