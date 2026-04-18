import { IsEnum, IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PlataformaMarketplace, StatusAnuncio } from '../../generated/client';

/**
 * DTO para filtrar anúncios
 */
export class FiltroAnuncioDto {
  @ApiProperty({
    enum: PlataformaMarketplace,
    description: 'Filtrar por marketplace (opcional)',
    required: false,
  })
  @IsEnum(PlataformaMarketplace)
  @IsOptional()
  marketplace?: PlataformaMarketplace;

  @ApiProperty({
    enum: StatusAnuncio,
    description: 'Filtrar por status (opcional)',
    required: false,
  })
  @IsEnum(StatusAnuncio)
  @IsOptional()
  status?: StatusAnuncio;

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
