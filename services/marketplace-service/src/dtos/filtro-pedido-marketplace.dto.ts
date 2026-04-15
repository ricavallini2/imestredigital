import { IsEnum, IsOptional, IsNumber, IsString, IsISO8601, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMarketplace, StatusPedidoMarketplace } from '@prisma/client';

/**
 * DTO para filtrar pedidos de marketplace
 */
export class FiltroPedidoMarketplaceDto {
  @ApiProperty({
    enum: TipoMarketplace,
    description: 'Filtrar por marketplace (opcional)',
    required: false,
  })
  @IsEnum(TipoMarketplace)
  @IsOptional()
  marketplace?: TipoMarketplace;

  @ApiProperty({
    enum: StatusPedidoMarketplace,
    description: 'Filtrar por status (opcional)',
    required: false,
  })
  @IsEnum(StatusPedidoMarketplace)
  @IsOptional()
  status?: StatusPedidoMarketplace;

  @ApiProperty({
    description: 'Data inicial de venda (formato ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  dataInicio?: string;

  @ApiProperty({
    description: 'Data final de venda (formato ISO 8601)',
    example: '2024-03-31T23:59:59Z',
  })
  @IsISO8601()
  @IsOptional()
  dataFim?: string;

  @ApiProperty({
    description: 'Número da página (padrão: 1)',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pagina?: number = 1;

  @ApiProperty({
    description: 'Quantidade de registros por página (padrão: 20)',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limite?: number = 20;
}
