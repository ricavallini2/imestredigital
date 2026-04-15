/**
 * Controller de Depósitos.
 * CRUD de depósitos/armazéns do tenant.
 */

import { Controller, Get, Post, Put, Param, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepositoService } from './deposito.service';
import { CriarDepositoDto } from '../../dtos/deposito/criar-deposito.dto';

@ApiTags('depositos')
@ApiBearerAuth()
@Controller('depositos')
export class DepositoController {
  constructor(private readonly depositoService: DepositoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar depósitos da empresa' })
  async listar(@Request() req: any) {
    return this.depositoService.listar(req.tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo depósito' })
  async criar(@Request() req: any, @Body() dto: CriarDepositoDto) {
    return this.depositoService.criar(req.tenantId, dto);
  }
}
