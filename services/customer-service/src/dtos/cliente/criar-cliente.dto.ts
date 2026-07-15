/**
 * DTO para criação de um novo cliente
 *
 * Valida os dados necessários para criar um cliente
 * (pessoa física ou jurídica).
 */

import {
  IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsArray, IsInt,
  IsBoolean, IsNumber, Min, Max, Matches, ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PapelEnum {
  CLIENTE = 'CLIENTE',
  FORNECEDOR = 'FORNECEDOR',
  TRANSPORTADORA = 'TRANSPORTADORA',
}

export enum RegimeTributarioEnum {
  SIMPLES_NACIONAL = 'SIMPLES_NACIONAL',
  MEI = 'MEI',
  LUCRO_PRESUMIDO = 'LUCRO_PRESUMIDO',
  LUCRO_REAL = 'LUCRO_REAL',
  ISENTO = 'ISENTO',
}

export enum TipoClienteEnum {
  PESSOA_FISICA = 'PESSOA_FISICA',
  PESSOA_JURIDICA = 'PESSOA_JURIDICA',
  PF = 'PF',
  PJ = 'PJ',
}

export enum OrigemClienteEnum {
  MANUAL = 'MANUAL',
  MARKETPLACE = 'MARKETPLACE',
  SITE = 'SITE',
  INDICACAO = 'INDICACAO',
  IMPORTACAO = 'IMPORTACAO',
  WEBSITE = 'WEBSITE',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  WHATSAPP = 'WHATSAPP',
  VENDA_DIRETA = 'VENDA_DIRETA',
  FEIRA = 'FEIRA',
  TELEFONE = 'TELEFONE',
  EMAIL = 'EMAIL',
  OUTRO = 'OUTRO',
}

export class EnderecoInlineDto {
  @IsOptional() @IsString() logradouro?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() complemento?: string;
  @IsOptional() @IsString() bairro?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() estado?: string;
  @IsOptional() @IsString() cep?: string;
  @IsOptional() @IsString() tipo?: string;
}

export class CriarClienteDto {
  @ApiPropertyOptional({
    description: 'Papéis do parceiro (cliente/fornecedor). Default: [CLIENTE]',
    enum: PapelEnum,
    isArray: true,
    example: ['CLIENTE'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PapelEnum, { each: true, message: 'Papel inválido' })
  papeis?: PapelEnum[];

  @ApiProperty({
    description: 'Tipo de cliente',
    enum: TipoClienteEnum,
    example: 'PESSOA_FISICA',
  })
  @IsEnum(TipoClienteEnum, { message: 'Tipo de cliente inválido' })
  @IsNotEmpty()
  tipo: TipoClienteEnum;

  @ApiProperty({
    description: 'Nome completo (PF) ou nome fantasia (PJ)',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({
    description: 'Nome fantasia (apenas para PESSOA_JURIDICA)',
    example: 'Silva Comércio Ltda',
  })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiPropertyOptional({
    description: 'Razão social (apenas para PESSOA_JURIDICA)',
    example: 'Silva Comércio de Produtos Eletrônicos Ltda',
  })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiPropertyOptional({
    description: 'CPF sem formatação (apenas para PESSOA_FISICA)',
    example: '12345678901',
  })
  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'CNPJ sem formatação (apenas para PESSOA_JURIDICA)',
    example: '12345678000190',
  })
  @IsOptional()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'RG (apenas para PESSOA_FISICA)',
    example: '12.345.678-9',
  })
  @IsOptional()
  @IsString()
  rg?: string;

  @ApiPropertyOptional({
    description: 'Inscrição estadual (apenas para PESSOA_JURIDICA)',
    example: '123.456.789.012',
  })
  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @ApiPropertyOptional({
    description: 'Indica que a PJ é isenta de Inscrição Estadual',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  ieIsento?: boolean;

  @ApiPropertyOptional({
    description: 'Inscrição municipal (apenas para PESSOA_JURIDICA)',
    example: '1234567',
  })
  @IsOptional()
  @IsString()
  inscricaoMunicipal?: string;

  @ApiPropertyOptional({
    description: 'Regime tributário (apenas para PESSOA_JURIDICA)',
    enum: RegimeTributarioEnum,
    example: 'SIMPLES_NACIONAL',
  })
  @IsOptional()
  @IsEnum(RegimeTributarioEnum, { message: 'Regime tributário inválido' })
  regimeTributario?: RegimeTributarioEnum;

  @ApiProperty({
    description: 'Email principal',
    example: 'joao@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email: string;

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
    description: 'Data de nascimento (apenas PESSOA_FISICA)',
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
    example: 'Cliente VIP, excelente pagador',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Tags/categorias',
    example: ['vip', 'industria', 'sp'],
  })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Origem do cliente',
    enum: OrigemClienteEnum,
    example: 'SITE',
  })
  @IsOptional()
  @IsEnum(OrigemClienteEnum, { message: 'Origem inválida' })
  origem?: string;

  // ── Grupo CLIENTE ──────────────────────────────────────────────────────────
  @ApiPropertyOptional({ description: 'Limite de crédito (papel CLIENTE)', example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  limiteCredito?: number;

  @ApiPropertyOptional({ description: 'ID do vendedor/representante responsável' })
  @IsOptional()
  @IsString()
  vendedorId?: string;

  // ── Grupo FORNECEDOR ───────────────────────────────────────────────────────
  @ApiPropertyOptional({ description: 'Prazo médio de pagamento em dias (papel FORNECEDOR)', example: 30 })
  @IsOptional()
  @IsInt()
  @Min(0)
  prazoPagamento?: number;

  @ApiPropertyOptional({ description: 'Condições de pagamento (papel FORNECEDOR)', example: '30/60/90' })
  @IsOptional()
  @IsString()
  condicoesPagamento?: string;

  @ApiPropertyOptional({ description: 'Chave PIX para pagamento ao fornecedor' })
  @IsOptional()
  @IsString()
  pixChave?: string;

  @ApiPropertyOptional({ description: 'Categorias de produtos fornecidos', example: ['eletrônicos', 'cabos'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoriasFornecidas?: string[];

  @ApiPropertyOptional({ description: 'Avaliação do fornecedor (1 a 5)', example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  avaliacaoFornecedor?: number;

  @ApiPropertyOptional({
    description: 'Endereço inicial do cliente (opcional)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoInlineDto)
  endereco?: EnderecoInlineDto;
}
