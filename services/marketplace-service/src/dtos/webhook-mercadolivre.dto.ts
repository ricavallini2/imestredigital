import { IsOptional, IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * Payload de notificação (webhook) do Mercado Livre.
 * Ver docs/pesquisa/mercado-livre-api.md (seção 2.3).
 *
 * O payload traz apenas a referência do recurso (`resource`) e o `user_id` do
 * seller — nunca o recurso completo. Todos os campos são opcionais/validados de
 * forma tolerante: o ML pode variar o formato e o endpoint precisa responder 200
 * mesmo diante de payloads parciais.
 */
export class WebhookMercadoLivreDto {
  @ApiProperty({ description: 'ID da notificação', required: false })
  @IsString()
  @IsOptional()
  _id?: string

  @ApiProperty({
    description: 'Path do recurso alterado (ex.: /orders/123)',
    required: false,
  })
  @IsString()
  @IsOptional()
  resource?: string

  @ApiProperty({ description: 'user_id do seller no Mercado Livre', required: false })
  @IsOptional()
  @IsNumber()
  user_id?: number

  @ApiProperty({
    description: 'Tópico da notificação (orders_v2, items, questions, ...)',
    required: false,
  })
  @IsString()
  @IsOptional()
  topic?: string

  @ApiProperty({ description: 'application_id da aplicação', required: false })
  @IsOptional()
  @IsNumber()
  application_id?: number

  @ApiProperty({ description: 'Número de tentativas de entrega', required: false })
  @IsOptional()
  @IsNumber()
  attempts?: number

  @ApiProperty({ description: 'Timestamp de envio', required: false })
  @IsString()
  @IsOptional()
  sent?: string

  @ApiProperty({ description: 'Timestamp de recebimento', required: false })
  @IsString()
  @IsOptional()
  received?: string
}
