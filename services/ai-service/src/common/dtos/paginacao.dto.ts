/**
 * DTO base de paginação das listagens do ai-service.
 *
 * Por que um DTO e não `@Query('pagina') pagina: number = 0`:
 *
 * O ValidationPipe global roda com `transform: true`. Para um parâmetro
 * primitivo anotado como `number`, ele cai em `transformPrimitive()`, que faz
 * simplesmente `return +value` — sem guarda de `isUndefined` (diferente de
 * Boolean e String, que têm essa guarda). Quando o cliente não envia a query
 * string, `value` é `undefined` e `+undefined` é `NaN`.
 *
 * O valor default do parâmetro (`= 0`) nunca entrava em ação, porque o default
 * de um parâmetro só se aplica quando o argumento é `undefined` — e o pipe
 * devolvia `NaN`. Esse `NaN` viajava até o Prisma como `take`/`skip` e derrubava
 * o `findMany` com PrismaClientValidationError (HTTP 500).
 *
 * Com um DTO, o pipe usa class-transformer (`plainToClass`), que respeita os
 * valores default dos campos ausentes. `@Type(() => Number)` converte a string
 * da query para número apenas quando ela de fato existe.
 */

import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginacaoDTO {
  @ApiPropertyOptional({
    description: 'Página desejada (base zero)',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pagina deve ser um número inteiro' })
  @Min(0, { message: 'pagina não pode ser negativa' })
  pagina?: number = 0;

  @ApiPropertyOptional({
    description: 'Itens por página',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limite deve ser um número inteiro' })
  @Min(1, { message: 'limite deve ser no mínimo 1' })
  @Max(100, { message: 'Máximo de 100 itens por página' })
  limite?: number = 20;
}
