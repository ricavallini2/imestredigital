/**
 * DTO para filtragem de notificações.
 */

import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Status de notificação — alinhado 1:1 com o enum StatusNotificacao do
 * schema Prisma (fonte da verdade). NÃO adicionar valores que não existam
 * no Prisma (ex.: o antigo 'ENVIANDO', que não era persistido em lugar nenhum).
 */
export enum StatusNotificacao {
  PENDENTE = 'PENDENTE',
  ENVIADA = 'ENVIADA',
  ENTREGUE = 'ENTREGUE',
  FALHA = 'FALHA',
  LIDA = 'LIDA',
}

export class FiltroNotificacaoDto {
  @ApiProperty({
    description: 'Status das notificações',
    enum: StatusNotificacao,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusNotificacao)
  status?: StatusNotificacao;

  @ApiProperty({
    description: 'Tipo de notificação',
    example: 'EMAIL',
    required: false,
  })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiProperty({
    description: 'Página para paginação (padrão: 1)',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  pagina?: string;

  @ApiProperty({
    description: 'Limite de itens por página (padrão: 20)',
    example: '20',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limite?: string;

  @ApiProperty({
    description: 'Campo para ordenação (padrão: criadoEm)',
    example: 'criadoEm',
    required: false,
  })
  @IsOptional()
  @IsString()
  ordenarPor?: string;

  @ApiProperty({
    description: 'Direção da ordenação: asc ou desc (padrão: desc)',
    example: 'desc',
    required: false,
  })
  @IsOptional()
  @IsString()
  direcao?: string;
}
