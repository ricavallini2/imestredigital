import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoSincronizacao } from '@prisma/client';

/**
 * DTO para disparar sincronização
 */
export class SincronizarDto {
  @ApiProperty({
    description: 'ID da conta marketplace para sincronizar',
    example: 'cm1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  contaMarketplaceId: string;

  @ApiProperty({
    enum: TipoSincronizacao,
    description: 'Tipo de sincronização a realizar',
    example: 'PRODUTO',
  })
  @IsEnum(TipoSincronizacao)
  @IsNotEmpty()
  tipo: TipoSincronizacao;

  @ApiProperty({
    description: 'Forçar sincronização completa (não usar cache)',
    example: false,
    required: false,
  })
  @IsOptional()
  forcado?: boolean = false;
}
