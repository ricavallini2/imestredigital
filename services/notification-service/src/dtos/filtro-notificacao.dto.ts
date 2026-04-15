/**
 * DTO para filtragem de notificações.
 */

import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum StatusNotificacao {
  PENDENTE = 'PENDENTE',
  ENVIANDO = 'ENVIANDO',
  ENVIADA = 'ENVIADA',
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
