/**
 * Regras de negócio do cadastro de Formas de Pagamento.
 */

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { FormaPagamentoRepository } from './forma-pagamento.repository';
import {
  CriarFormaPagamentoDto,
  AtualizarFormaPagamentoDto,
  ListarFormasPagamentoDto,
} from '../../dtos/forma-pagamento.dto';

@Injectable()
export class FormaPagamentoService {
  constructor(private readonly repo: FormaPagamentoRepository) {}

  listar(tenantId: string, filtros: ListarFormasPagamentoDto) {
    return this.repo.listar(tenantId, filtros);
  }

  async buscarPorId(tenantId: string, id: string) {
    const forma = await this.repo.buscarPorId(tenantId, id);
    if (!forma) throw new NotFoundException('Forma de pagamento não encontrada');
    return forma;
  }

  async criar(tenantId: string, dto: CriarFormaPagamentoDto) {
    try {
      return await this.repo.criar(tenantId, dto);
    } catch (e: any) {
      // P2002 = unique [tenantId, descricao]
      if (e?.code === 'P2002')
        throw new ConflictException(`Já existe uma forma de pagamento "${dto.descricao}"`);
      throw e;
    }
  }

  async atualizar(tenantId: string, id: string, dto: AtualizarFormaPagamentoDto) {
    await this.buscarPorId(tenantId, id);
    try {
      return await this.repo.atualizar(tenantId, id, dto);
    } catch (e: any) {
      if (e?.code === 'P2002')
        throw new ConflictException(`Já existe uma forma de pagamento "${dto.descricao}"`);
      throw e;
    }
  }

  async remover(tenantId: string, id: string) {
    await this.buscarPorId(tenantId, id);
    await this.repo.inativar(tenantId, id);
  }
}
