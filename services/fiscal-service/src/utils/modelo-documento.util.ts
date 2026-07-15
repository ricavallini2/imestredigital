/**
 * Utilitários de mapeamento entre o tipo de nota (TipoNotaFiscal), o enum de
 * modelo do Prisma (ModeloDocumento) e o código fiscal SEFAZ ("55"/"65").
 *
 * Fonte da verdade dos enums é o Prisma (UPPERCASE). Os códigos "55"/"65" são
 * os valores que a SEFAZ usa no XML (campo `mod`) e na chave de acesso.
 */

import { ModeloDocumento } from '../../generated/client'

/** Código fiscal SEFAZ do modelo do documento. */
export type CodigoModelo = '55' | '65'

/**
 * Converte o tipo da nota no enum de modelo do Prisma.
 * NFC-e → MODELO_65; qualquer outro (NF-e/NFS-e tratada como 55) → MODELO_55.
 */
export function tipoParaModelo(tipo: string): ModeloDocumento {
  return tipo === 'NFCE' ? ModeloDocumento.MODELO_65 : ModeloDocumento.MODELO_55
}

/** Converte o enum de modelo do Prisma no código fiscal SEFAZ ("55"/"65"). */
export function modeloParaCodigo(modelo: ModeloDocumento): CodigoModelo {
  return modelo === ModeloDocumento.MODELO_65 ? '65' : '55'
}

/** Converte o tipo da nota direto no código fiscal SEFAZ ("55"/"65"). */
export function tipoParaCodigoModelo(tipo: string): CodigoModelo {
  return tipo === 'NFCE' ? '65' : '55'
}
