/**
 * Utilitário para validação de CPF
 *
 * Implementa o algoritmo de validação de CPF usando módulo 11.
 * CPF deve estar em formato numérico (sem caracteres especiais).
 */

/**
 * Valida um CPF usando o algoritmo módulo 11
 *
 * @param cpf - CPF em formato numérico (11 dígitos)
 * @returns true se CPF é válido, false caso contrário
 *
 * @example
 * validarCPF('12345678901') // verifica se é válido
 * validarCPF('11144477735') // true (CPF válido)
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const numeros = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (numeros.length !== 11) {
    return false;
  }

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  // Calcula primeiro dígito verificador
  let soma = 0;
  let resto: number;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(numeros.substring(i - 1, i), 10) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(numeros.substring(9, 10), 10)) {
    return false;
  }

  // Calcula segundo dígito verificador
  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma += parseInt(numeros.substring(i - 1, i), 10) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(numeros.substring(10, 11), 10)) {
    return false;
  }

  return true;
}

/**
 * Limpa e formata um CPF para validação
 *
 * @param cpf - CPF com ou sem formatação
 * @returns CPF apenas com números, ou null se inválido
 *
 * @example
 * limparCPF('111.444.777-35') // '11144477735'
 */
export function limparCPF(cpf: string): string | null {
  const numeros = cpf.replace(/\D/g, '');

  if (numeros.length !== 11) {
    return null;
  }

  return numeros;
}
