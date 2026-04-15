/**
 * Controller de Movimentações.
 * Consulta histórico de movimentações de estoque.
 */

import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MovimentacaoService } from './movimentacao.service';

@ApiTags('movimentacoes')
@ApiBearerAuth()
@Controller('movimentacoes')
export class MovimentacaoController {
  constructor(private readonly movService: MovimentacaoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar histórico de movimentações' })
  async listar(
    @Request() req: any,
    @Query('produtoId') produtoId?: string,
    @Query('depositoId') depositoId?: string,
    @Query('tipo') tipo?: string,
    @Query('pagina') pagina: number = 1,
    @Query('itensPorPagina') itensPorPagina: number = 50,
  ) {
    return this.movService.listar(req.tenantId, { produtoId, depositoId, tipo, pagina, itensPorPagina });
  }
}
