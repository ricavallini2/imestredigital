/**
 * DTO para criação/atualização de template de notificação.
 */

import { IsString, IsArray, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoTemplate {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
  INTERNA = 'INTERNA',
}

export class CriarTemplateDto {
  @ApiProperty({
    description: 'Nome do template',
    example: 'Boas-vindas ao iMestreDigital',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Slug do template (identificador único)',
    example: 'boas-vindas',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Tipo do template',
    enum: TipoTemplate,
    example: TipoTemplate.EMAIL,
  })
  @IsEnum(TipoTemplate)
  tipo: TipoTemplate;

  @ApiProperty({
    description: 'Assunto (para emails)',
    example: 'Bem-vindo ao iMestreDigital!',
    required: false,
  })
  @IsOptional()
  @IsString()
  assunto?: string;

  @ApiProperty({
    description: 'Conteúdo do template (Handlebars)',
    example: '<p>Olá {{nomeUsuario}},</p><p>Bem-vindo ao iMestreDigital!</p>',
  })
  @IsString()
  conteudo: string;

  @ApiProperty({
    description: 'Array de nomes das variáveis esperadas',
    example: ['nomeUsuario', 'emailUsuario', 'codigoVerificacao'],
  })
  @IsArray()
  @IsString({ each: true })
  variaveis: string[];

  @ApiProperty({
    description: 'Se o template está ativo',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class AtualizarTemplateDto {
  @ApiProperty({
    description: 'Nome do template',
    example: 'Boas-vindas ao iMestreDigital',
    required: false,
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    description: 'Assunto (para emails)',
    example: 'Bem-vindo ao iMestreDigital!',
    required: false,
  })
  @IsOptional()
  @IsString()
  assunto?: string;

  @ApiProperty({
    description: 'Conteúdo do template (Handlebars)',
    example: '<p>Olá {{nomeUsuario}},</p><p>Bem-vindo ao iMestreDigital!</p>',
    required: false,
  })
  @IsOptional()
  @IsString()
  conteudo?: string;

  @ApiProperty({
    description: 'Array de nomes das variáveis esperadas',
    example: ['nomeUsuario', 'emailUsuario', 'codigoVerificacao'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variaveis?: string[];

  @ApiProperty({
    description: 'Se o template está ativo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
