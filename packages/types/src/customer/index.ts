/**
 * Tipos do domínio de Clientes (CRM).
 * Define clientes, segmentação e histórico de interações.
 */

import { BaseEntity, EntityId, Endereco } from '../common';

// Enums UPPERCASE alinhados ao padrão canônico dos schemas Prisma.

/** Tipo de pessoa (física ou jurídica). Prisma `TipoCliente` = PESSOA_FISICA/PESSOA_JURIDICA. */
export enum TipoPessoa {
  FISICA = 'FISICA',
  JURIDICA = 'JURIDICA',
}

/** Segmento do cliente atribuído por IA (classificação de CRM). */
export enum SegmentoCliente {
  VIP = 'VIP',
  RECORRENTE = 'RECORRENTE',
  OCASIONAL = 'OCASIONAL',
  NOVO = 'NOVO',
  EM_RISCO = 'EM_RISCO',
  INATIVO = 'INATIVO',
}

/** Cliente do sistema */
export interface Cliente extends BaseEntity {
  tenantId: EntityId;
  tipoPessoa: TipoPessoa;
  nome: string;
  razaoSocial?: string;
  cpfCnpj: string;
  inscricaoEstadual?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: Endereco;
  segmento: SegmentoCliente;
  totalCompras: number;
  valorTotalGasto: number;
  ultimaCompra?: Date;
  observacoes?: string;
}
