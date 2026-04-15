/**
 * DTOs para estatísticas e KPIs de pedidos.
 */

import { IsString, IsOptional } from 'class-validator';

export class PeriodoEstatisticasDto {
  @IsOptional()
  @IsString()
  dataInicio?: string; // ISO 8601

  @IsOptional()
  @IsString()
  dataFim?: string; // ISO 8601

  @IsOptional()
  @IsString()
  periodo?: string; // 'hoje', 'semana', 'mes', 'ano', 'customizado'
}

export class EstatisticasResponseDto {
  totalPedidos: number;
  pedidosPendentes: number;
  pedidosConfirmados: number;
  pedidosSeparando: number;
  pedidosFaturados: number;
  pedidosEnviados: number;
  pedidosEntregues: number;
  pedidosCancelados: number;
  pedidosDevolucoes: number;

  totalVendas: number;
  ticketMedio: number;
  valorDesconto: number;
  valorFrete: number;

  taxaCancelamento: number; // %
  taxaDevolucao: number; // %

  topCanais: Array<{
    canal: string;
    quantidade: number;
    percentual: number;
  }>;

  topProdutos: Array<{
    produtoId: string;
    sku: string;
    titulo: string;
    quantidade: number;
    valorTotal: number;
  }>;

  statusPagamento: {
    pendente: number;
    autorizado: number;
    pago: number;
    recusado: number;
    estornado: number;
  };
}
