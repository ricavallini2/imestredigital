/**
 * Funções utilitárias compartilhadas no frontend.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS com suporte a condicionais e merge do Tailwind.
 * Evita conflitos de classes duplicadas.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor em centavos para moeda brasileira.
 *
 * @param centavos - Valor em centavos (ex: 5990 = R$ 59,90)
 * @returns String formatada (ex: "R$ 59,90")
 */
export function formatarMoeda(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
}

/**
 * Formata um número com separadores de milhar brasileiros.
 *
 * @param valor - Número a ser formatado
 * @returns String formatada (ex: "1.247")
 */
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}

/**
 * Formata uma data para o padrão brasileiro.
 *
 * @param data - Data a ser formatada (string ISO ou Date)
 * @returns String formatada (ex: "23/03/2026 14:30")
 */
export function formatarData(data: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data));
}

/**
 * Formata CPF ou CNPJ com pontuação.
 *
 * @param documento - CPF (11 dígitos) ou CNPJ (14 dígitos)
 * @returns Documento formatado
 */
export function formatarDocumento(documento: string): string {
  const limpo = documento.replace(/\D/g, '');

  if (limpo.length === 11) {
    return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (limpo.length === 14) {
    return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return documento;
}

/**
 * Trunca texto com reticências se exceder o limite.
 *
 * @param texto - Texto original
 * @param limite - Número máximo de caracteres
 */
export function truncar(texto: string, limite: number): string {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite) + '...';
}
