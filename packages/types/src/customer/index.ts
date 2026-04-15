/**
 * Tipos do domínio de Clientes (CRM).
 * Define clientes, segmentação e histórico de interações.
 */

import { BaseEntity, EntityId, Endereco } from '../common';

/** Tipo de pessoa (física ou jurídica) */
export enum TipoPessoa {
  FISICA = 'fisica',
  JURIDICA = 'juridica',
}

/** Segmento do cliente atribuído por IA */
export enum SegmentoCliente {
  VIP = 'vip',
  RECORRENTE = 'recorrente',
  OCASIONAL = 'ocasional',
  NOVO = 'novo',
  EM_RISCO = 'em_risco',
  INATIVO = 'inativo',
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
