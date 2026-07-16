/**
 * DTO para listagem/filtragem de sugestões.
 *
 * Herda `pagina`/`limite` de PaginacaoDTO — ver o comentário lá sobre o motivo
 * de a paginação ser um DTO e não parâmetros primitivos com valor default.
 */

import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginacaoDTO } from '../../../common/dtos/paginacao.dto';
import { TipoSugestao } from '../../../../generated/client';

export class ListarSugestoesDTO extends PaginacaoDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de sugestão',
    enum: TipoSugestao,
  })
  @IsOptional()
  @IsEnum(TipoSugestao, { message: 'tipo inválido' })
  tipo?: TipoSugestao;

  @ApiPropertyOptional({
    description: 'true = apenas aceitas · false = apenas pendentes',
  })
  @IsOptional()
  // Ver ListarInsightsDTO.apenasNaoLidos: sem @Type(() => String) o
  // enableImplicitConversion resolveria 'false' como true antes do @Transform.
  @Type(() => String)
  @Transform(({ value }) =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
  @IsBoolean()
  aceita?: boolean;
}
