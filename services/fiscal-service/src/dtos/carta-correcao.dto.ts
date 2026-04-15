/**
 * DTO para Carta de Correção de Nota Fiscal
 */

import { IsString, MinLength } from 'class-validator';

export class CartaCorrecaoDto {
  @IsString()
  @MinLength(15, {
    message: 'Descrição da correção deve ter pelo menos 15 caracteres',
  })
  descricaoCorrecao: string;
}
