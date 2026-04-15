/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Devoluções
 * ═══════════════════════════════════════════════════════════════
 *
 * Gerencia devoluções e reembolsos:
 * - Solicitar devolução
 * - Aprovar devolução (gera código de retorno)
 * - Receber devolução (atualiza estoque)
 * - Reembolsar pagamento
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DevolucaoRepository } from './devolucao.repository';
import { CacheService } from '../cache/cache.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { PedidoService } from '../pedido/pedido.service';
import { SolicitarDevolucaoDto } from '../../dtos/devolucao.dto';

@Injectable()
export class DevolucaoService {
  constructor(
    private devolucaoRepository: DevolucaoRepository,
    private cache: CacheService,
    private kafkaProducer: KafkaProducerService,
    private pedidoService: PedidoService,
  ) {}

  /**
   * Solicitar devolução (SOLICITADA).
   * Cliente abre solicitação de devolução.
   */
  async solicitarDevolucao(
    tenantId: string,
    pedidoId: string,
    dto: SolicitarDevolucaoDto,
  ) {
    // Validar que pedido existe
    const pedido = await this.pedidoService.buscarPorId(tenantId, pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${pedidoId} não encontrado`);
    }

    // Validar que itens solicitados existem no pedido
    const idsItens = pedido.itens.map((i: any) => i.id);
    const itensValidos = dto.itens.every((item) =>
      idsItens.includes(item.itemPedidoId),
    );

    if (!itensValidos) {
      throw new BadRequestException(
        'Um ou mais itens não pertencem a este pedido',
      );
    }

    // Calcular valor de reembolso (será validado após aprovação)
    let valorReembolso = 0;
    for (const itemSolicitado of dto.itens) {
      const itemPedido = pedido.itens.find((i: any) => i.id === itemSolicitado.itemPedidoId);
      if (itemPedido) {
        valorReembolso += parseFloat(itemPedido.valorTotal.toString()) *
          (itemSolicitado.quantidade / itemPedido.quantidade);
      }
    }

    // Criar devolução
    const devolucao = await this.devolucaoRepository.criar(
      tenantId,
      pedidoId,
      {
        motivo: dto.motivo,
        status: 'SOLICITADA',
        valorReembolso,
        observacao: dto.observacao,
      },
    );

    // Adicionar itens
    const itensFormatados = dto.itens.map((item) => ({
      itemPedidoId: item.itemPedidoId,
      quantidade: item.quantidade,
      motivo: item.motivo,
    }));

    await this.devolucaoRepository.adicionarItens(devolucao.id, itensFormatados);

    // Publicar evento
    await this.kafkaProducer.publicarDevolucaoSolicitada(
      tenantId,
      pedidoId,
      devolucao.id,
      {
        motivo: dto.motivo,
        itens: itensFormatados,
        valorReembolso,
      },
    );

    // Limpar cache
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`devolucoes:${tenantId}:*`);

    return devolucao;
  }

  /**
   * Aprovar devolução (APROVADA).
   * Gera código de rastreio de retorno.
   */
  async aprovarDevolucao(
    tenantId: string,
    devolucaoId: string,
    observacao?: string,
  ) {
    const devolucao = await this.devolucaoRepository.buscarPorId(
      tenantId,
      devolucaoId,
    );

    if (!devolucao) {
      throw new NotFoundException(`Devolução ${devolucaoId} não encontrada`);
    }

    if (devolucao.status !== 'SOLICITADA') {
      throw new BadRequestException(
        `Apenas devoluções SOLICITADAS podem ser aprovadas`,
      );
    }

    // Gerar código de rastreio de retorno (simulado)
    const codigoRastreio = `RET${Date.now().toString().slice(-8)}`;

    const devolucaoAtualizada = await this.devolucaoRepository.atualizarStatus(
      tenantId,
      devolucaoId,
      'APROVADA',
    );

    await this.devolucaoRepository.atualizarRastreioRetorno(
      tenantId,
      devolucaoId,
      codigoRastreio,
    );

    // Publicar evento
    await this.kafkaProducer.publicarDevolucaoAprovada(
      tenantId,
      devolucao.pedidoId,
      devolucaoId,
    );

    // Limpar cache
    await this.cache.deleteByPattern(`devolucoes:${tenantId}:*`);

    return devolucaoAtualizada;
  }

  /**
   * Receber devolução (RECEBIDA).
   * Reintegra estoque.
   */
  async receberDevolucao(
    tenantId: string,
    devolucaoId: string,
    observacao?: string,
  ) {
    const devolucao = await this.devolucaoRepository.buscarPorId(
      tenantId,
      devolucaoId,
    );

    if (!devolucao) {
      throw new NotFoundException(`Devolução ${devolucaoId} não encontrada`);
    }

    if (devolucao.status !== 'APROVADA') {
      throw new BadRequestException(
        `Apenas devoluções APROVADAS podem ser recebidas`,
      );
    }

    const devolucaoAtualizada = await this.devolucaoRepository.atualizarStatus(
      tenantId,
      devolucaoId,
      'RECEBIDA',
    );

    // Publicar evento (inventory-service reintegrará estoque)
    await this.kafkaProducer.publicarDevolucaoRecebida(
      tenantId,
      devolucao.pedidoId,
      devolucaoId,
    );

    // Limpar cache
    await this.cache.deleteByPattern(`devolucoes:${tenantId}:*`);

    return devolucaoAtualizada;
  }

  /**
   * Reembolsar devolução (REEMBOLSADA).
   * Processa reembolso do pagamento.
   */
  async reembolsar(
    tenantId: string,
    devolucaoId: string,
    valor?: number,
  ) {
    const devolucao = await this.devolucaoRepository.buscarPorId(
      tenantId,
      devolucaoId,
    );

    if (!devolucao) {
      throw new NotFoundException(`Devolução ${devolucaoId} não encontrada`);
    }

    if (devolucao.status !== 'RECEBIDA') {
      throw new BadRequestException(
        `Apenas devoluções RECEBIDAS podem ser reembolsadas`,
      );
    }

    const valorReembolso = valor || parseFloat(devolucao.valorReembolso.toString());

    const devolucaoAtualizada = await this.devolucaoRepository.atualizarStatus(
      tenantId,
      devolucaoId,
      'REEMBOLSADA',
    );

    // Publicar evento (payment-service processará reembolso)
    await this.kafkaProducer.publicarDevolucaoReembolsada(
      tenantId,
      devolucao.pedidoId,
      devolucaoId,
      valorReembolso,
    );

    // Limpar cache
    await this.cache.deleteByPattern(`devolucoes:${tenantId}:*`);

    return devolucaoAtualizada;
  }

  /**
   * Listar devoluções de um pedido.
   */
  async listarPorPedido(tenantId: string, pedidoId: string) {
    return this.devolucaoRepository.buscarPorPedido(tenantId, pedidoId);
  }

  /**
   * Listar devoluções do tenant.
   */
  async listar(tenantId: string, filtros: any) {
    return this.devolucaoRepository.listar(tenantId, filtros);
  }
}
