/**
 * DTO para listagem/filtragem de previsões de demanda.
 *
 * Herda `pagina`/`limite` de PaginacaoDTO — ver o comentário lá sobre o motivo
 * de a paginação ser um DTO e não parâmetros primitivos com valor default.
 */

import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginacaoDTO } from '../../../common/dtos/paginacao.dto';

export class ListarPrevisoesDTO extends PaginacaoDTO {
  // produtoId é @db.Uuid no schema: validar aqui evita que uma string qualquer
  // chegue ao Postgres e estoure "invalid input syntax for type uuid" (500).
  @ApiPropertyOptional({ description: 'Filtrar por produto (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'produtoId deve ser um UUID válido' })
  produtoId?: string;
}
