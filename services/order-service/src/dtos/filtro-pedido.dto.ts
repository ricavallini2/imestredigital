/**
 * DTO para filtros de listagem de pedidos.
 */

import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class FiltroPedidoDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  statusPagamento?: string;

  @IsOptional()
  @IsString()
  canalOrigem?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  dataInicio?: string; // ISO 8601

  @IsOptional()
  @IsString()
  dataFim?: string; // ISO 8601

  @IsOptional()
  @IsNumber()
  @Min(1)
  pagina?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limite?: number;

  @IsOptional()
  @IsString()
  ordenacao?: string; // 'criadoEm_asc', 'criadoEm_desc', 'valorTotal_asc', 'valorTotal_desc'
}
