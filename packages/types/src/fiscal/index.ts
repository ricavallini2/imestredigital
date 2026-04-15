/**
 * Tipos do domínio Fiscal.
 * Define notas fiscais, tributação e obrigações acessórias.
 */

import { BaseEntity, EntityId, Moeda } from '../common';

/** Tipos de documento fiscal */
export enum TipoDocumentoFiscal {
  NFE = 'nfe',       // Nota Fiscal Eletrônica (produto)
  NFSE = 'nfse',     // Nota Fiscal de Serviço Eletrônica
  NFCE = 'nfce',     // Nota Fiscal ao Consumidor Eletrônica
  CTE = 'cte',       // Conhecimento de Transporte Eletrônico
  MDFE = 'mdfe',     // Manifesto de Documentos Fiscais Eletrônicos
}

/** Status da nota fiscal */
export enum StatusNotaFiscal {
  RASCUNHO = 'rascunho',
  VALIDANDO = 'validando',
  AUTORIZADA = 'autorizada',
  REJEITADA = 'rejeitada',
  CANCELADA = 'cancelada',
  INUTILIZADA = 'inutilizada',
  DENEGADA = 'denegada',
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
