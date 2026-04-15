/**
 * DTO para troca de senha do usuário logado.
 */

import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrocarSenhaDto {
  @ApiProperty({ description: 'Senha atual' })
  @IsString()
  senhaAtual: string;

  @ApiProperty({ description: 'Nova senha (mínimo 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'A nova senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'A senha deve conter letras maiúsculas, minúsculas e números',
  })
  novaSenha: string;
}
