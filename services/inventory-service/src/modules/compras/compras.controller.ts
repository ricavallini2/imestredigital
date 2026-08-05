/**
 * Controller de Compras — REST API.
 *
 * ATENÇÃO à ordem das rotas: 'estatisticas' e 'importar-nfe' são estáticas e
 * DEVEM vir antes de ':id', senão o ':id' as captura e o Prisma tenta ler a
 * string como UUID (500) — exatamente o bug que derrubou o fiscal em produção.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { ComprasService } from './compras.service';
import {
  CriarCompraDto,
  ReceberCompraDto,
  ListarComprasDto,
} from '../../dtos/compras/compras.dto';
import {
  AnalisarNfeDto,
  ConfirmarImportacaoNfeDto,
} from '../../dtos/compras/importacao-nfe.dto';

@ApiTags('compras')
@ApiBearerAuth()
@Controller('compras')
export class ComprasController {
  constructor(private readonly service: ComprasService) {}

  @Get('estatisticas')
  @ApiOperation({ summary: 'KPIs de compras (gastos, pendentes, top fornecedores)' })
  estatisticas(@Request() req: any) {
    return this.service.estatisticas(req.tenantId);
  }

  @Post('analisar-nfe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ETAPA 1: analisa o XML e devolve fornecedor + itens reconhecidos (não grava nada)',
  })
  analisarNfe(@Request() req: any, @Body() dto: AnalisarNfeDto) {
    // Propaga o JWT: a resolução consulta catalog-service e customer-service.
    return this.service.analisarNfe(req.tenantId, dto, req.headers?.authorization);
  }

  @Post('importar-nfe')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'ETAPA 2: confirma a importação aplicando as decisões do usuário ' +
      '(fornecedor, produtos e vínculos De-Para)',
  })
  importarNfe(@Request() req: any, @Body() dto: ConfirmarImportacaoNfeDto) {
    return this.service.confirmarImportacaoNfe(req.tenantId, dto, req.headers?.authorization);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos de compra' })
  listar(@Request() req: any, @Query() filtros: ListarComprasDto) {
    return this.service.listar(req.tenantId, filtros);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar pedido de compra' })
  criar(@Request() req: any, @Body() dto: CriarCompraDto) {
    return this.service.criar(req.tenantId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do pedido de compra' })
  buscar(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(req.tenantId, id);
  }

  @Post(':id/receber')
  @ApiOperation({ summary: 'Receber itens (total ou parcial) — gera entrada de estoque' })
  receber(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReceberCompraDto,
  ) {
    return this.service.receber(req.tenantId, id, dto, req.usuarioId);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar pedido de compra (não recebido)' })
  cancelar(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.cancelar(req.tenantId, id);
  }
}
