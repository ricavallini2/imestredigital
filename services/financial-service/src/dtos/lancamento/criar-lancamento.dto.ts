/**
 * DTO para criação de lançamento financeiro.
 */

import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarLancamentoDTO {
  @ApiProperty({
    description: 'Tipo do lançamento',
    enum: ['RECEITA', 'DESPESA', 'TRANSFERENCIA'],
  })
  @IsEnum(['RECEITA', 'DESPESA', 'TRANSFERENCIA'])
  tipo: string;

  @ApiProperty({
    description: 'ID da conta financeira',
    example: 'uuid-aqui',
  })
  @IsString()
  @IsOptional()
  contaId?: string;

  @ApiProperty({
    description: 'Categoria do lançamento',
    example: 'vendas',
  })
  @IsString()
  @IsOptional()
  categoria?: string;

  @ApiProperty({
    description: 'Subcategoria do lançamento',
    example: 'produtos',
  })
  @IsString()
  @IsOptional()
  subcategoria?: string;

  @ApiProperty({
    description: 'Descrição do lançamento',
    example: 'Venda de produtos',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'Valor do lançamento em reais',
    example: 1500.50,
  })
  @IsNumber()
  valor: number;

  @ApiProperty({
    description: 'Data de vencimento (ISO 8601)',
    example: '2026-03-30',
  })
  @IsDateString()
  dataVencimento: string;

  @ApiProperty({
    description: 'Data de pagamento (ISO 8601) - opcional',
    example: '2026-03-25',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dataPagamento?: string;

  @ApiProperty({
    description: 'Data de competência (ISO 8601) - opcional',
    example: '2026-03-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dataCompetencia?: string;

  @ApiProperty({
    description: 'Forma de pagamento',
    enum: ['PIX', 'TED', 'DOC', 'BOLETO', 'DINHEIRO', 'CARTAO'],
    required: false,
  })
  @IsString()
  @IsOptional()
  formaPagamento?: string;

  @ApiProperty({
    description: 'Fornecedor ou cliente',
    example: 'João da Silva',
    required: false,
  })
  @IsString()
  @IsOptional()
  fornecedor?: string;

  @ApiProperty({
    description: 'Cliente (se for receita)',
    example: 'Empresa XYZ',
    required: false,
  })
  @IsString()
  @IsOptional()
  cliente?: string;

  @ApiProperty({
    description: 'Observações',
    example: 'Pagamento de aluguel do mês',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacao?: string;

  @ApiProperty({
    description: 'Array de tags para organização',
    example: ['importante', 'urgent'],
    required: false,
  })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'ID da nota fiscal (se houver)',
    required: false,
  })
  @IsString()
  @IsOptional()
  notaFiscalId?: string;

  @ApiProperty({
    description: 'ID do pedido relacionado',
    required: false,
  })
  @IsString()
  @IsOptional()
  pedidoId?: string;
}
