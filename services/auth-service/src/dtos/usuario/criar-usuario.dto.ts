/**
 * DTOs do cadastro de usuários do tenant.
 */

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  MinLength,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CHAVES_MODULOS } from '../../modules/usuario/permissoes.catalogo';

/** Espelha o enum CargoUsuario do Prisma (aceito em lowercase vindo do front). */
export enum CargoUsuario {
  ADMIN = 'admin',
  GERENTE = 'gerente',
  VENDEDOR = 'vendedor',
  CAIXA = 'caixa',
  ESTOQUISTA = 'estoquista',
  FINANCEIRO = 'financeiro',
  FUNCIONARIO = 'funcionario',
  OPERADOR = 'operador',
  VISUALIZADOR = 'visualizador',
}

export enum StatusUsuarioDto {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  BLOQUEADO = 'bloqueado',
  PENDENTE = 'pendente',
}

export class CriarUsuarioDto {
  @ApiProperty({ description: 'Nome completo', example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Email do novo usuário', example: 'maria@empresa.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Cargo/permissão', enum: CargoUsuario, default: 'funcionario' })
  @IsOptional()
  @IsEnum(CargoUsuario, { message: 'Cargo inválido' })
  cargo?: string;

  @ApiPropertyOptional({
    description: 'Senha inicial. Se omitida, o sistema gera uma e a devolve UMA vez na resposta.',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'A senha deve ter ao menos 8 caracteres' })
  senha?: string;

  @ApiPropertyOptional({
    description: 'Pode autorizar vendas com desconto acima do teto configurado',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  podeLiberarVenda?: boolean;
}

export class AtualizarUsuarioDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiPropertyOptional({ enum: CargoUsuario })
  @IsOptional()
  @IsEnum(CargoUsuario, { message: 'Cargo inválido' })
  cargo?: string;

  @ApiPropertyOptional({ enum: StatusUsuarioDto })
  @IsOptional()
  @IsEnum(StatusUsuarioDto, { message: 'Status inválido' })
  status?: string;

  @ApiPropertyOptional({ description: 'Nova senha (opcional)', minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'A senha deve ter ao menos 8 caracteres' })
  senha?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  podeLiberarVenda?: boolean;

  /**
   * Ao trocar o cargo, reaplica o template de permissões daquele cargo,
   * descartando os ajustes individuais. Default: false (mantém os ajustes).
   */
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  reaplicarTemplateCargo?: boolean;
}

export class PermissaoModuloDto {
  @ApiProperty({ description: 'Chave do módulo (ver GET /usuarios/permissoes/modulos)' })
  @IsIn(CHAVES_MODULOS, { message: 'Módulo desconhecido' })
  modulo: string;

  @IsBoolean()
  visualizar: boolean;

  @IsBoolean()
  incluir: boolean;

  @IsBoolean()
  editar: boolean;

  @IsBoolean()
  excluir: boolean;
}

export class DefinirPermissoesDto {
  @ApiProperty({ type: [PermissaoModuloDto], description: 'Matriz completa de permissões' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissaoModuloDto)
  permissoes: PermissaoModuloDto[];
}
