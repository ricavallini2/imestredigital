/**
 * DTO para criação de contato de cliente
 */

import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarContatoDto {
  @ApiProperty({
    description: 'Nome do contato',
    example: 'Maria Silva',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({
    description: 'Cargo na empresa',
    example: 'Gerente de Vendas',
  })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiPropertyOptional({
    description: 'Email do contato',
    example: 'maria@empresa.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Telefone do contato',
    example: '1133334444',
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular/WhatsApp do contato',
    example: '11999998888',
  })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiPropertyOptional({
    description: 'Marcar como contato principal',
    example: false,
  })
  @IsOptional()
  principal?: boolean = false;

  @ApiPropertyOptional({
    description: 'Observações sobre o contato',
    example: 'Responsável pela aprovação de pedidos',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
