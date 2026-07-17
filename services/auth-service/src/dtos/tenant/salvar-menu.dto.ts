/**
 * DTO para salvar a ordem do menu lateral do tenant.
 *
 * `ordem` é uma árvore de nós { id, filhos? } que reflete SÓ a ordem/aninhamento
 * dos itens do menu — nunca labels/ícones/hrefs (esses vivem no frontend). O
 * TenantService sanitiza (cap de profundidade e de nós) antes de persistir, então
 * o DTO só precisa garantir que veio um array.
 */

import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SalvarMenuDto {
  @ApiProperty({
    description: 'Árvore de ordem do menu: [{ id, filhos?: [...] }]',
    type: 'array',
    items: { type: 'object' },
  })
  @IsArray()
  ordem: unknown[];
}
