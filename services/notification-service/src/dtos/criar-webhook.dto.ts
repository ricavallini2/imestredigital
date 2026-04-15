/**
 * DTO para criação/atualização de configuração de webhook.
 */

import { IsString, IsUrl, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarWebhookDto {
  @ApiProperty({
    description: 'Nome descritivo do webhook',
    example: 'Notificar marketplace sobre pedidos',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'URL onde o webhook será enviado',
    example: 'https://api.marketplace.com/webhooks/pedidos',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Array de eventos para disparar o webhook',
    example: ['pedido.criado', 'pedido.status.alterado'],
  })
  @IsArray()
  @IsString({ each: true })
  eventos: string[];

  @ApiProperty({
    description: 'Segredo para assinatura HMAC-SHA256 (opcional)',
    example: 'seu-segredo-super-secreto',
    required: false,
  })
  @IsOptional()
  @IsString()
  segredo?: string;

  @ApiProperty({
    description: 'Se o webhook está ativo',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class AtualizarWebhookDto {
  @ApiProperty({
    description: 'Nome descritivo do webhook',
    example: 'Notificar marketplace sobre pedidos',
    required: false,
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    description: 'URL onde o webhook será enviado',
    example: 'https://api.marketplace.com/webhooks/pedidos',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    description: 'Array de eventos para disparar o webhook',
    example: ['pedido.criado', 'pedido.status.alterado'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventos?: string[];

  @ApiProperty({
    description: 'Segredo para assinatura HMAC-SHA256 (opcional)',
    example: 'seu-segredo-super-secreto',
    required: false,
  })
  @IsOptional()
  @IsString()
  segredo?: string;

  @ApiProperty({
    description: 'Se o webhook está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
