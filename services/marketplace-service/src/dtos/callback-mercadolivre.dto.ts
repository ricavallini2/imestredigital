import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * Corpo do callback OAuth do Mercado Livre.
 * Recebido após o seller autorizar a aplicação e ser redirecionado.
 */
export class CallbackMercadoLivreDto {
  @ApiProperty({
    description: 'Authorization code retornado pelo Mercado Livre',
    example: 'TG-abcdef123456-1234567',
  })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({
    description: 'State assinado devolvido pelo Mercado Livre (anti-CSRF)',
  })
  @IsString()
  @IsNotEmpty()
  state: string
}
