/**
 * ═══════════════════════════════════════════════════════════════
 * Controller de Formas de Pagamento - REST API
 * ═══════════════════════════════════════════════════════════════
 * Cadastro por tenant usado no PDV e no recebimento do caixa
 * (ex: "Amex Crédito 2x", "PIX", "Dinheiro").
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { FormaPagamentoService } from './forma-pagamento.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  CriarFormaPagamentoDto,
  AtualizarFormaPagamentoDto,
  ListarFormasPagamentoDto,
} from '../../dtos/forma-pagamento.dto';

@ApiTags('formas-pagamento')
@ApiBearerAuth()
@Controller('formas-pagamento')
@UseGuards(JwtAuthGuard)
export class FormaPagamentoController {
  constructor(private readonly service: FormaPagamentoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar formas de pagamento do tenant' })
  listar(@Req() req: any, @Query() filtros: ListarFormasPagamentoDto) {
    return this.service.listar(req.tenantId, filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar forma de pagamento por id' })
  buscar(@Req() req: any, @Param('id') id: string) {
    return this.service.buscarPorId(req.tenantId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar forma de pagamento' })
  criar(@Req() req: any, @Body() dto: CriarFormaPagamentoDto) {
    return this.service.criar(req.tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar forma de pagamento' })
  atualizar(@Req() req: any, @Param('id') id: string, @Body() dto: AtualizarFormaPagamentoDto) {
    return this.service.atualizar(req.tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar forma de pagamento (soft delete)' })
  async remover(@Req() req: any, @Param('id') id: string) {
    await this.service.remover(req.tenantId, id);
  }
}
