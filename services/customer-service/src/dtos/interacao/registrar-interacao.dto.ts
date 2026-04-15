/**
 * DTO para registro de interação com cliente
 */

import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoInteracaoEnum {
  VENDA = 'VENDA',
  ATENDIMENTO = 'ATENDIMENTO',
  RECLAMACAO = 'RECLAMACAO',
  DEVOLUCAO = 'DEVOLUCAO',
  EMAIL = 'EMAIL',
  TELEFONE = 'TELEFONE',
  CHAT = 'CHAT',
  MARKETPLACE = 'MARKETPLACE',
  NOTA = 'NOTA',
}

export enum CanalInteracaoEnum {
  TELEFONE = 'TELEFONE',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  CHAT = 'CHAT',
  PRESENCIAL = 'PRESENCIAL',
  MARKETPLACE = 'MARKETPLACE',
}

export class RegistrarInteracaoDto {
  @ApiProperty({
    description: 'Tipo de interação',
    enum: TipoInteracaoEnum,
    example: 'ATENDIMENTO',
  })
  @IsEnum(TipoInteracaoEnum, { message: 'Tipo de interação inválido' })
  @IsNotEmpty()
  tipo: TipoInteracaoEnum;

  @ApiProperty({
    description: 'Canal de comunicação',
    enum: CanalInteracaoEnum,
    example: 'EMAIL',
  })
  @IsEnum(CanalInteracaoEnum, { message: 'Canal de interação inválido' })
  @IsNotEmpty()
  canal: CanalInteracaoEnum;

  @ApiProperty({
    description: 'Título/assunto da interação',
    example: 'Suporte com pedido atrasado',
  })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada',
    example: 'Cliente relatou que o pedido está atrasado e gostaria de saber status.',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiPropertyOptional({
    description: 'ID do pedido relacionado',
    example: 'ped_123456',
  })
  @IsOptional()
  @IsString()
  pedidoId?: string;

  @ApiPropertyOptional({
    description: 'Metadados adicionais em JSON',
    example: { statusAtual: 'em_transito', dataEntregaEstimada: '2024-03-25' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
