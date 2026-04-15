import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para responder pergunta de comprador
 */
export class ResponderPerguntaDto {
  @ApiProperty({
    description: 'Resposta à pergunta',
    example: 'Sim, o produto acompanha todos os acessórios necessários.',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  resposta: string;
}
