/**
 * DTO para importação de clientes em lote
 */

import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum FormatoImportacaoEnum {
  CSV = 'CSV',
  XLSX = 'XLSX',
}

export class ImportarClientesDto {
  @ApiProperty({
    description: 'Formato do arquivo',
    enum: FormatoImportacaoEnum,
    example: 'CSV',
  })
  @IsEnum(FormatoImportacaoEnum, { message: 'Formato deve ser CSV ou XLSX' })
  @IsNotEmpty()
  formato: FormatoImportacaoEnum;

  @ApiProperty({
    description: 'Caminho ou ID do arquivo enviado',
    example: '/uploads/clientes_2024.csv',
  })
  @IsString()
  @IsNotEmpty()
  arquivo: string;
}
