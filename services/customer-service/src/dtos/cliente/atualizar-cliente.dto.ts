/**
 * DTO para atualização de um cliente
 *
 * Todos os campos são opcionais.
 */

import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarClienteDto {
  @ApiPropertyOptional({
    description: 'Nome completo ou fantasia',
    example: 'João da Silva Atualizado',
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Nome fantasia',
    example: 'Silva Comércio Ltda',
  })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({
    description: 'Razão social',
    example: 'Silva Comércio de Produtos Eletrônicos Ltda',
  })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiPropertyOptional({
    description: 'Email principal',
    example: 'joao.novo@exemplo.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Email secundário',
    example: 'joao.secundario@exemplo.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email secundário inválido' })
  emailSecundario?: string;

  @ApiPropertyOptional({
    description: 'Telefone comercial',
    example: '1133334444',
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Celular/WhatsApp',
    example: '11999998888',
  })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento',
    example: '1990-05-15',
  })
  @IsOptional()
  dataNascimento?: Date;

  @ApiPropertyOptional({
    description: 'Gênero (M/F/O)',
    example: 'M',
  })
  @IsOptional()
  @Matches(/^[MFO]$/, { message: 'Gênero inválido (M, F ou O)' })
  genero?: string;

  @ApiPropertyOptional({
    description: 'Observações internas',
    example: 'Cliente VIP',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Tags/categorias',
    example: ['vip', 'industria'],
  })
  @IsOptional()
  tags?: string[];
}
