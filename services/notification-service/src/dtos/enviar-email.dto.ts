/**
 * DTO para envio de email.
 */

import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarEmailDto {
  @ApiProperty({
    description: 'Endereço de email do destinatário',
    example: 'usuario@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Assunto do email',
    example: 'Seu pedido foi confirmado',
  })
  @IsString()
  assunto: string;

  @ApiProperty({
    description: 'Corpo do email (HTML permitido)',
    example: '<p>Seu pedido #123 foi confirmado!</p>',
  })
  @IsString()
  corpo: string;

  @ApiProperty({
    description: 'Email do remetente (opcional, usa padrão da config)',
    example: 'noreply@imestredigital.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  remetente?: string;

  @ApiProperty({
    description: 'Cópias (CC)',
    example: ['gerente@example.com'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  cc?: string[];

  @ApiProperty({
    description: 'Cópias ocultas (BCC)',
    example: ['admin@imestredigital.com'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  bcc?: string[];
}
