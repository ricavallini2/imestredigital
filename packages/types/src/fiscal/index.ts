/**
 * Tipos do domínio Fiscal.
 * Define notas fiscais, tributação e obrigações acessórias.
 */

import { BaseEntity, EntityId, Moeda } from '../common';

// Enums UPPERCASE espelhando o schema Prisma do fiscal-service.

/** Tipos de documento fiscal (Prisma `TipoNotaFiscal` + CT-e/MDF-e). */
export enum TipoDocumentoFiscal {
  NFE = 'NFE',       // Nota Fiscal Eletrônica (produto)
  NFSE = 'NFSE',     // Nota Fiscal de Serviço Eletrônica
  NFCE = 'NFCE',     // Nota Fiscal ao Consumidor Eletrônica
  CTE = 'CTE',       // Conhecimento de Transporte Eletrônico
  MDFE = 'MDFE',     // Manifesto de Documentos Fiscais Eletrônicos
}

/** Status da nota fiscal (Prisma `StatusNotaFiscal`). */
export enum StatusNotaFiscal {
  RASCUNHO = 'RASCUNHO',
  VALIDADA = 'VALIDADA',
  TRANSMITIDA = 'TRANSMITIDA',
  AUTORIZADA = 'AUTORIZADA',
  REJEITADA = 'REJEITADA',
  CANCELADA = 'CANCELADA',
  INUTILIZADA = 'INUTILIZADA',
  DENEGADA = 'DENEGADA',
}

/** Nota fiscal */
export interface NotaFiscal extends BaseEntity {
  tenantId: EntityId;
  tipo: TipoDocumentoFiscal;
  numero: number;
  serie: number;
  chaveAcesso?: string;     // 44 dígitos
  protocolo?: string;
  status: StatusNotaFiscal;

  // Participantes
  emitenteId: EntityId;
  destinatarioId?: EntityId;

  // Valores
  valorProdutos: Moeda;
  valorFrete: Moeda;
  valorDesconto: Moeda;
  valorTotal: Moeda;
  valorImpostos: ValoresImpostos;

  // Referências
  pedidoId?: EntityId;

  // SEFAZ
  dataEmissao: Date;
  dataAutorizacao?: Date;
  xmlAutorizado?: string;
  motivoRejeicao?: string;
}

/** Valores de impostos da nota fiscal */
export interface ValoresImpostos {
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
  iss?: number;
  icmsSt?: number;
  fcp?: number;
  total: number;
}
