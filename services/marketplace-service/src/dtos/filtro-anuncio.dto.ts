import { IsEnum, IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TipoMarketplace, StatusAnuncioMarketplace } from '@prisma/client';

/**
 * DTO para filtrar anúncios
 */
export class FiltroAnuncioDto {
  @ApiProperty({
    enum: TipoMarketplace,
    description: 'Filtrar por marketplace (opcional)',
    required: false,
  })
  @IsEnum(TipoMarketplace)
  @IsOptional()
  marketplace?: TipoMarketplace;

  @ApiProperty({
    enum: StatusAnuncioMarketplace,
    description: 'Filtrar por status (opcional)',
    required: false,
  })
  @IsEnum(StatusAnuncioMarketplace)
  @IsOptional()
  status?: StatusAnuncioMarketplace;

  @ApiProperty({
    description: 'Filtrar por ID do produto (opcional)',
    example: 'prod-001',
  })
  @IsString()
  @IsOptional()
  produtoId?: string;

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
