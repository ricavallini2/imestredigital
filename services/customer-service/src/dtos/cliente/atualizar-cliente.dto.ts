/**
 * DTO para atualização de um cliente.
 *
 * Todos os campos são opcionais. Mantém paridade com o formulário de
 * edição do front-end para evitar rejeições por `forbidNonWhitelisted`.
 *
 * Documentos (cpf/cnpj) e tipo NÃO podem ser alterados via update — para
 * isso o cliente deve ser recriado, garantindo a integridade dos índices
 * únicos `(tenantId, cpf)` e `(tenantId, cnpj)`.
 */

import {
  IsString, IsOptional, IsEmail, IsEnum, IsArray, IsInt, IsBoolean,
  IsNumber, Min, Max, Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrigemClienteEnum, PapelEnum, RegimeTributarioEnum } from './criar-cliente.dto';

export enum StatusClienteEnum {
  PROSPECT = 'PROSPECT',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
}

export class AtualizarClienteDto {
  @ApiPropertyOptional({ description: 'Nome completo ou fantasia', example: 'João da Silva Atualizado' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Nome fantasia', example: 'Silva Comércio Ltda' })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({ description: 'Razão social', example: 'Silva Comércio de Produtos Eletrônicos Ltda' })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiPropertyOptional({ description: 'Inscrição estadual' })
  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @ApiPropertyOptional({ description: 'Email principal', example: 'joao.novo@exemplo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Email secundário', example: 'joao.secundario@exemplo.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email secundário inválido' })
  emailSecundario?: string;

  @ApiPropertyOptional({ description: 'Telefone comercial', example: '1133334444' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ description: 'Celular/WhatsApp', example: '11999998888' })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiPropertyOptional({ description: 'Data de nascimento', example: '1990-05-15' })
  @IsOptional()
  dataNascimento?: Date;

  @ApiPropertyOptional({ description: 'Gênero (M/F/O)', example: 'M' })
  @IsOptional()
  @Matches(/^[MFO]$/, { message: 'Gênero inválido (M, F ou O)' })
  genero?: string;

  @ApiPropertyOptional({ description: 'Observações internas', example: 'Cliente VIP' })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({ description: 'Tags/categorias', example: ['vip', 'industria'] })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Origem do cliente', enum: OrigemClienteEnum })
  @IsOptional()
  @IsEnum(OrigemClienteEnum, { message: 'Origem inválida' })
  origem?: string;

  @ApiPropertyOptional({ description: 'Status do cliente', enum: StatusClienteEnum })
  @IsOptional()
  @IsEnum(StatusClienteEnum, { message: 'Status inválido' })
  status?: string;

  @ApiPropertyOptional({ description: 'Score do cliente (0–100)', example: 75 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;

  // ── Parceiro de negócio ─────────────────────────────────────────────────────
  @ApiPropertyOptional({ description: 'Papéis do parceiro', enum: PapelEnum, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(PapelEnum, { each: true, message: 'Papel inválido' })
  papeis?: PapelEnum[];

  @ApiPropertyOptional({ description: 'RG (PF)' })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiPropertyOptional({ description: 'PJ isenta de Inscrição Estadual' })
  @IsOptional()
  @IsBoolean()
  ieIsento?: boolean;

  @ApiPropertyOptional({ description: 'Inscrição municipal (PJ)' })
  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({ description: 'Regime tributário (PJ)', enum: RegimeTributarioEnum })
  @IsOptional()
  @IsEnum(RegimeTributarioEnum, { message: 'Regime tributário inválido' })
  regimeTributario?: RegimeTributarioEnum;

  @ApiPropertyOptional({ description: 'Limite de crédito (papel CLIENTE)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limiteCredito?: number;

  @ApiPropertyOptional({ description: 'Vendedor/representante responsável' })
  @IsOptional()
  @IsString()
  vendedorId?: string;

  @ApiPropertyOptional({ description: 'Prazo médio de pagamento em dias (papel FORNECEDOR)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  prazoPagamento?: number;

  @ApiPropertyOptional({ description: 'Condições de pagamento (papel FORNECEDOR)' })
  @IsOptional()
  @IsString()
  condicoesPagamento?: string;

  @ApiPropertyOptional({ description: 'Chave PIX para pagamento ao fornecedor' })
  @IsOptional()
  @IsString()
  pixChave?: string;

  @ApiPropertyOptional({ description: 'Categorias de produtos fornecidos' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoriasFornecidas?: string[];

  @ApiPropertyOptional({ description: 'Avaliação do fornecedor (1 a 5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  avaliacaoFornecedor?: number;
}
