/**
 * Utilitário para validação de CNPJ
 *
 * Implementa o algoritmo de validação de CNPJ usando módulo 11.
 * CNPJ deve estar em formato numérico (sem caracteres especiais).
 */

/**
 * Valida um CNPJ usando o algoritmo módulo 11
 *
 * @param cnpj - CNPJ em formato numérico (14 dígitos)
 * @returns true se CNPJ é válido, false caso contrário
 *
 * @example
 * validarCNPJ('11222333000181') // true (CNPJ válido)
 * validarCNPJ('00000000000000') // false (todos zeros)
 */
export function validarCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const numeros = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (numeros.length !== 14) {
    return false;
  }

  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(numeros)) {
    return false;
  }

  // Calcula primeiro dígito verificador
  let tamanho = numeros.length - 2;
  let numeros_validacao = numeros.substring(0, tamanho);
  let digitos = numeros.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros_validacao.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = Math.floor(soma / 11) % 2 === 0 ? 0 : 11 - (soma % 11);

  if (resultado !== parseInt(digitos.charAt(0), 10)) {
    return false;
  }

  // Calcula segundo dígito verificador
  tamanho = tamanho + 1;
  numeros_validacao = numeros.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros_validacao.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = Math.floor(soma / 11) % 2 === 0 ? 0 : 11 - (soma % 11);

  if (resultado !== parseInt(digitos.charAt(1), 10)) {
    return false;
  }

  return true;
}

/**
 * Limpa e formata um CNPJ para validação
 *
 * @param cnpj - CNPJ com ou sem formatação
 * @returns CNPJ apenas com números, ou null se inválido
 *
 * @example
 * limparCNPJ('11.222.333/0001-81') // '11222333000181'
 */
export function limparCNPJ(cnpj: string): string | null {
  const numeros = cnpj.replace(/\D/g, '');

  if (numeros.length !== 14) {
    return null;
  }

  return numeros;
}
