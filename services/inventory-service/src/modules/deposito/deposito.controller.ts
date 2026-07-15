/**
 * Controller de Depósitos.
 * CRUD de depósitos/armazéns do tenant.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DepositoService } from './deposito.service';
import { CriarDepositoDto } from '../../dtos/deposito/criar-deposito.dto';
import { AtualizarDepositoDto } from '../../dtos/deposito/atualizar-deposito.dto';

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

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar depósito' })
  @ApiParam({ name: 'id', description: 'UUID do depósito' })
  async atualizar(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: AtualizarDepositoDto,
  ) {
    return this.depositoService.atualizar(req.tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover depósito (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID do depósito' })
  async remover(@Request() req: any, @Param('id') id: string) {
    await this.depositoService.remover(req.tenantId, id);
  }
}
