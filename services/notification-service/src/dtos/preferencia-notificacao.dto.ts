/**
 * DTO para gerenciamento de preferências de notificação.
 */

import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PreferenciaNotificacaoDto {
  @ApiProperty({
    description: 'Canal de notificação',
    example: 'email',
    enum: ['email', 'push', 'sms', 'interna'],
  })
  @IsString()
  canal: string;

  @ApiProperty({
    description: 'Tipo de evento',
    example: 'pedido.criado',
  })
  @IsString()
  tipoEvento: string;

  @ApiProperty({
    description: 'Se a notificação está habilitada',
    example: true,
  })
  @IsBoolean()
  habilitado: boolean;
}

export class AtualizarPreferenciasDto {
  @ApiProperty({
    description: 'Array de preferências a atualizar',
    isArray: true,
    type: PreferenciaNotificacaoDto,
  })
  @IsArray()
  preferencias: PreferenciaNotificacaoDto[];
}
