/**
 * DTO para listagem/filtragem de insights.
 *
 * Herda `pagina`/`limite` de PaginacaoDTO — ver o comentário lá sobre o motivo
 * de a paginação ser um DTO e não parâmetros primitivos com valor default.
 *
 * Os filtros de enum são validados aqui (@IsEnum) para que um valor inválido
 * responda 400, em vez de chegar cru no `where` do Prisma e derrubar o findMany
 * com PrismaClientValidationError (500).
 */

import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginacaoDTO } from '../../../common/dtos/paginacao.dto';
import { TipoInsight, PrioridadeInsight } from '../../../../generated/client';

export class ListarInsightsDTO extends PaginacaoDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de insight',
    enum: TipoInsight,
  })
  @IsOptional()
  @IsEnum(TipoInsight, { message: 'tipo inválido' })
  tipo?: TipoInsight;

  @ApiPropertyOptional({
    description: 'Filtrar por prioridade',
    enum: PrioridadeInsight,
  })
  @IsOptional()
  @IsEnum(PrioridadeInsight, { message: 'prioridade inválida' })
  prioridade?: PrioridadeInsight;

  @ApiPropertyOptional({ description: 'Retornar apenas insights não lidos' })
  @IsOptional()
  // @Type(() => String) é obrigatório aqui: o pipe roda com enableImplicitConversion,
  // que converte pelo design:type ANTES do @Transform. Sem isto, o booleano seria
  // resolvido como Boolean('false') === true e ?apenasNaoLidos=false filtraria ao contrário.
  @Type(() => String)
  @Transform(({ value }) =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
  @IsBoolean()
  apenasNaoLidos?: boolean;
}
