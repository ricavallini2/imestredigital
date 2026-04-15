/**
 * Controlador de Contas Financeiras.
 * Endpoints CRUD para gerenciamento de contas.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContaService } from './conta.service';
import { CriarContaDTO } from '../../dtos/conta/criar-conta.dto';

interface TransferirDTO {
  contaOrigemId: string;
  contaDestinoId: string;
  valor: number;
}

@ApiTags('contas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/contas')
export class ContaController {
  constructor(private contaService: ContaService) {}

  /**
   * Cria uma nova conta financeira.
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Criar nova conta financeira' })
  async criar(@Request() req: any, @Body() dto: CriarContaDTO) {
    return this.contaService.criar({
      tenantId: req.tenantId,
      ...dto,
    });
  }

  /**
   * Lista todas as contas ativas do tenant.
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas as contas' })
  async listar(@Request() req: any) {
    return this.contaService.listar(req.tenantId);
  }

  /**
   * Busca conta por ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter conta por ID' })
  async buscarPorId(@Request() req: any, @Param('id') id: string) {
    return this.contaService.buscarPorId(id, req.tenantId);
  }

  /**
   * Obtém saldo da conta.
   */
  @Get(':id/saldo')
  @ApiOperation({ summary: 'Obter saldo da conta' })
  async obterSaldo(@Request() req: any, @Param('id') id: string) {
    return this.contaService.obterSaldo(id, req.tenantId);
  }

  /**
   * Obtém saldo total de todas as contas.
   */
  @Get('resumo/total')
  @ApiOperation({ summary: 'Obter saldo total de todas as contas' })
  async obterSaldoTotal(@Request() req: any) {
    return this.contaService.obterSaldoTotal(req.tenantId);
  }

  /**
   * Atualiza conta.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar conta' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CriarContaDTO>,
  ) {
    return this.contaService.atualizar(id, req.tenantId, {
      tenantId: req.tenantId,
      ...dto,
    });
  }

  /**
   * Desativa conta.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Desativar conta' })
  async desativar(@Request() req: any, @Param('id') id: string) {
    return this.contaService.desativar(id, req.tenantId);
  }

  /**
   * Realiza transferência entre contas.
   */
  @Post('transferencia')
  @ApiOperation({ summary: 'Realizar transferência entre contas' })
  async transferir(@Request() req: any, @Body() dto: TransferirDTO) {
    return this.contaService.transferir(
      dto.contaOrigemId,
      dto.contaDestinoId,
      req.tenantId,
      dto.valor,
    );
  }
}
