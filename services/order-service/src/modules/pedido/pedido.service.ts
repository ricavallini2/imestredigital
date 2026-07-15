/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Pedidos - Lógica de Negócio
 * ═══════════════════════════════════════════════════════════════
 *
 * Orquestra todo o workflow de pedidos:
 * - Criação (reserva estoque, publica PEDIDO_CRIADO)
 * - Confirmação (publica PEDIDO_CONFIRMADO)
 * - Separação (publica PEDIDO_SEPARANDO quando estoque reservado)
 * - Faturamento (publica PEDIDO_FATURAR ao fiscal-service)
 * - Envio (publica PEDIDO_ENVIADO)
 * - Entrega (publica PEDIDO_ENTREGUE)
 * - Cancelamento (publica PEDIDO_CANCELADO, libera estoque)
 *
 * Máquina de estados valida transições permitidas entre status.
 */

import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

import { PedidoRepository } from './pedido.repository';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { CacheService } from '../cache/cache.service';
import { CriarPedidoDto } from '../../dtos/criar-pedido.dto';
import { FiltroPedidoDto } from '../../dtos/filtro-pedido.dto';

@Injectable()
export class PedidoService {
  private readonly logger = new Logger(PedidoService.name);

  // Máquina de estados: transições permitidas
  private transicoePermitidas: Record<string, string[]> = {
    RASCUNHO: ['PENDENTE', 'CANCELADO'],
    PENDENTE: ['CONFIRMADO', 'CANCELADO'],
    CONFIRMADO: ['EM_SEPARACAO', 'CANCELADO'],
    EM_SEPARACAO: ['FATURADO', 'CANCELADO'],
    FATURADO: ['ENVIADO', 'CANCELADO'],
    ENVIADO: ['ENTREGUE', 'CANCELADO'],
    ENTREGUE: ['DEVOLVIDO'],
    CANCELADO: [],
    DEVOLVIDO: [],
  };

  constructor(
    private pedidoRepository: PedidoRepository,
    private kafkaProducer: KafkaProducerService,
    private cache: CacheService,
  ) {}

  /**
   * Criar novo pedido.
   * Publica PEDIDO_CRIADO e inicia fluxo de reserva de estoque.
   */
  async criarPedido(tenantId: string, dto: CriarPedidoDto) {
    // Monta os itens já com todos os valores em Decimal (fonte única de verdade
    // para persistência, somatório e evento — sem recalcular com float).
    const itensFormatados = dto.itens.map((item) => this.montarItemPedido(item));

    // Totais calculados em Decimal a partir dos itens (sem acúmulo de erro de
    // ponto flutuante). Desconto e frete do pedido também em Decimal.
    const totais = this.calcularTotais(itensFormatados, dto.valorDesconto, dto.valorFrete);

    // Criar pedido
    const pedido = await this.pedidoRepository.criar(tenantId, {
      origem: dto.origem || 'OUTRO',
      canalOrigem: dto.canalOrigem,
      pedidoExternoId: dto.pedidoExternoId,
      clienteId: dto.clienteId,
      clienteNome: dto.clienteNome,
      clienteEmail: dto.clienteEmail,
      clienteCpfCnpj: dto.clienteCpfCnpj,
      metodoPagamento: dto.metodoPagamento,
      parcelas: dto.parcelas || 1,
      valorProdutos: totais.valorProdutos,
      valorDesconto: totais.valorDesconto,
      valorFrete: totais.valorFrete,
      valorTotal: totais.valorTotal,
      enderecoEntrega: dto.enderecoEntrega,
      observacao: dto.observacao,
    });

    await this.pedidoRepository.adicionarItens(pedido.id, itensFormatados);

    // Adicionar ao histórico
    await this.pedidoRepository.adicionarHistorico(
      pedido.id,
      tenantId,
      null,
      'RASCUNHO',
      'Pedido criado',
    );

    // Publicar evento (contrato canônico da saga — payload PLANO consumido pelo
    // inventory-service). Itens no formato { produtoId, quantidade, precoUnitario }.
    await this.kafkaProducer.publicarPedidoCriado(tenantId, pedido.id, {
      numero: pedido.numero,
      clienteId: pedido.clienteId,
      cliente: pedido.clienteNome,
      itens: itensFormatados.map((i) => ({
        produtoId: i.produtoId,
        sku: i.sku,
        quantidade: i.quantidade,
        precoUnitario: i.valorUnitario.toNumber(),
      })),
      valorTotal: pedido.valorTotal.toNumber(),
    });

    // Limpar cache de listagem
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);

    return pedido;
  }

  /**
   * Confirmar pedido (mover para CONFIRMADO).
   * Dispara reserva de estoque no inventory-service.
   */
  async confirmarPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'CONFIRMADO');

    // Atualizar status
    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'CONFIRMADO',
    );

    // Adicionar ao histórico
    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'CONFIRMADO',
      'Pedido confirmado pelo cliente',
    );

    // Publicar evento
    await this.kafkaProducer.publicarPedidoConfirmado(tenantId, pedidoId, {
      numero: pedido.numero,
      cliente: pedido.clienteNome,
    });

    // Limpar cache
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Confirmar pedido após pagamento ser autorizado.
   * Se pedido está em PENDENTE, passa para CONFIRMADO automaticamente.
   */
  async confirmarPedidoAposAutorizacao(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    if (pedido.status === 'PENDENTE') {
      await this.confirmarPedido(tenantId, pedidoId);
    }
  }

  /**
   * Iniciar separação do pedido (SEPARANDO).
   * Disparado quando estoque é reservado.
   */
  async iniciarSeparacao(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'EM_SEPARACAO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'EM_SEPARACAO',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'EM_SEPARACAO',
      'Iniciada separação dos itens',
    );

    await this.kafkaProducer.publicarPedidoSeparando(tenantId, pedidoId, {});

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Finalizar separação (SEPARADO).
   */
  async finalizarSeparacao(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    // EM_SEPARACAO cobre toda a fase de separação — apenas publica evento Kafka
    // sem alterar o status (que permanece EM_SEPARACAO até o faturamento)
    await this.kafkaProducer.publicarPedidoSeparado(tenantId, pedidoId, {});

    return pedido;
  }

  /**
   * Faturar pedido (FATURADO).
   * Publica PEDIDO_FATURAR ao fiscal-service.
   */
  async faturarPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'FATURADO');

    // Nota: O status FATURADO é atualizado quando recebe NOTA_AUTORIZADA do fiscal-service
    // Mas publicamos PEDIDO_FATURAR agora para solicitar

    await this.kafkaProducer.publicarPedidoFaturar(tenantId, pedidoId, {
      numero: pedido.numero,
      clienteId: pedido.clienteId,
      cliente: pedido.clienteNome,
      clienteCpfCnpj: pedido.clienteCpfCnpj,
      itens: pedido.itens.map((i) => ({
        produtoId: i.produtoId,
        sku: i.sku,
        titulo: i.titulo,
        quantidade: i.quantidade,
        valorUnitario: i.valorUnitario.toNumber(),
        valorTotal: i.valorTotal.toNumber(),
      })),
      valorTotal: pedido.valorTotal.toNumber(),
    });

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedido;
  }

  /**
   * Marcar pedido como FATURADO (chamado pelo consumidor de NOTA_AUTORIZADA).
   */
  async marcarComoFaturado(tenantId: string, pedidoId: string, notaFiscalId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    // Atualizar status via repository
    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'FATURADO',
    );

    // Atualizar notaFiscalId no banco (write multi-tenant seguro)
    await this.pedidoRepository.definirNotaFiscal(tenantId, pedidoId, notaFiscalId);

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      'EM_SEPARACAO',
      'FATURADO',
      `Nota Fiscal ${notaFiscalId} autorizada`,
    );

    await this.kafkaProducer.publicarPedidoFaturado(tenantId, pedidoId, notaFiscalId);

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Enviar pedido (ENVIADO).
   * Registra rastreamento.
   */
  async enviarPedido(
    tenantId: string,
    pedidoId: string,
    codigoRastreio: string,
    transportadora: string,
    prazoEntrega?: number,
  ) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'ENVIADO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'ENVIADO',
    );

    await this.pedidoRepository.atualizarRastreio(
      tenantId,
      pedidoId,
      codigoRastreio,
      transportadora,
      prazoEntrega,
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'ENVIADO',
      `Enviado por ${transportadora} - Rastreio: ${codigoRastreio}`,
    );

    await this.kafkaProducer.publicarPedidoEnviado(tenantId, pedidoId, {
      codigoRastreio,
      transportadora,
      prazoEntrega,
    });

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Marcar pedido como entregue.
   */
  async entregarPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'ENTREGUE');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'ENTREGUE',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'ENTREGUE',
      'Pedido entregue',
    );

    await this.kafkaProducer.publicarPedidoEntregue(tenantId, pedidoId);

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Cancelar pedido.
   * Publica PEDIDO_CANCELADO para liberar estoque e reembolsar pagamento.
   */
  async cancelarPedido(tenantId: string, pedidoId: string, motivo: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'CANCELADO');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'CANCELADO',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'CANCELADO',
      `Pedido cancelado: ${motivo}`,
    );

    // Registrar motivo de cancelamento (write multi-tenant seguro)
    await this.pedidoRepository.definirMotivoCancelamento(tenantId, pedidoId, motivo);

    // Publicar evento
    await this.kafkaProducer.publicarPedidoCancelado(tenantId, pedidoId, motivo);

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Buscar pedido por ID com todas as informações relacionadas.
   */
  async buscarPorId(tenantId: string, pedidoId: string) {
    // Tentar cache primeiro
    const chaveCache = `pedido:${tenantId}:${pedidoId}`;
    const cached = await this.cache.getJson<any>(chaveCache);
    if (cached) return cached;

    const pedido = await this.pedidoRepository.buscarPorId(tenantId, pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${pedidoId} não encontrado`);
    }

    // Guardar em cache por 10 minutos
    await this.cache.setJson(chaveCache, pedido, 600);

    return pedido;
  }

  /**
   * Listar pedidos com paginação e filtros.
   */
  async listar(tenantId: string, filtros: FiltroPedidoDto) {
    const resultado = await this.pedidoRepository.listar(tenantId, filtros);
    return resultado;
  }

  /**
   * Transição de status via endpoint de compatibilidade (PATCH /:id/status).
   *
   * Recebe o status ALVO (valores do enum Prisma) e delega para o método
   * semântico correspondente, reaproveitando toda a validação da máquina
   * de estados, histórico e publicação de eventos.
   */
  async transicionarStatus(
    tenantId: string,
    pedidoId: string,
    dados: {
      status: string;
      rastreio?: string;
      transportadora?: string;
      motivo?: string;
    },
  ) {
    switch (dados.status) {
      case 'CONFIRMADO':
        return this.confirmarPedido(tenantId, pedidoId);
      case 'EM_SEPARACAO':
        return this.iniciarSeparacao(tenantId, pedidoId);
      case 'FATURADO':
        return this.faturarPedido(tenantId, pedidoId);
      case 'ENVIADO':
        if (!dados.rastreio || !dados.transportadora) {
          throw new BadRequestException(
            'Código de rastreio e transportadora são obrigatórios para enviar o pedido',
          );
        }
        return this.enviarPedido(tenantId, pedidoId, dados.rastreio, dados.transportadora);
      case 'ENTREGUE':
        return this.entregarPedido(tenantId, pedidoId);
      case 'CANCELADO':
        return this.cancelarPedido(tenantId, pedidoId, dados.motivo || 'Cancelado pelo usuário');
      default:
        throw new BadRequestException(
          `Transição para o status ${dados.status} não é suportada por este endpoint`,
        );
    }
  }

  /**
   * Atualizar rastreamento.
   */
  async atualizarRastreio(
    tenantId: string,
    pedidoId: string,
    codigoRastreio: string,
    transportadora: string,
  ) {
    await this.validarExistencia(tenantId, pedidoId);

    await this.pedidoRepository.atualizarRastreio(
      tenantId,
      pedidoId,
      codigoRastreio,
      transportadora,
    );

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
  }

  /**
   * Calcular frete (placeholder para integração com APIs).
   */
  async calcularFrete(tenantId: string, dados: any) {
    // TODO: Integrar com Melhor Envio, Frenet, etc
    return {
      opcoes: [
        {
          servico: 'SEDEX',
          prazo: 2,
          valor: 50,
        },
        {
          servico: 'PAC',
          prazo: 7,
          valor: 20,
        },
      ],
    };
  }

  /**
   * Obter estatísticas (KPIs do dashboard).
   */
  async obterEstatisticas(tenantId: string, periodo: string) {
    const agora = new Date();
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        break;
      case 'semana':
        dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        break;
      case 'ano':
        dataInicio = new Date(agora.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias
    }

    return this.pedidoRepository.obterEstatisticas(tenantId, dataInicio, agora);
  }

  /**
   * Atualizar status do pedido (helper privado usado por consumidores de eventos).
   */
  async atualizarStatusPedido(
    tenantId: string,
    pedidoId: string,
    novoStatus: string,
    descricao: string,
  ) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      novoStatus,
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      novoStatus,
      descricao,
    );

    // SAGA: ao FATURAR (NF-e autorizada) publica pedido.faturado com o valor
    // real do pedido, para o financial-service gerar a conta a RECEBER.
    // Payload PLANO canônico: { tenantId, pedidoId, notaFiscalId?, valorTotal }.
    if (novoStatus === 'FATURADO') {
      await this.kafkaProducer.publicarPedidoFaturado(
        tenantId,
        pedidoId,
        pedidoAtualizado?.notaFiscalId ?? undefined,
        pedidoAtualizado?.valorTotal?.toNumber(),
      );
    }

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * Atualizar status de pagamento (helper privado).
   */
  async atualizarStatusPagamento(tenantId: string, pedidoId: string, novoStatus: string) {
    await this.validarExistencia(tenantId, pedidoId);
    await this.pedidoRepository.atualizarStatusPagamento(tenantId, pedidoId, novoStatus);

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
  }

  // ─── SAGA: Idempotência e Reações a Eventos de Estoque ──────

  /**
   * Idempotência do consumo Kafka: registra que um evento (por referenciaId,
   * ex. pedidoId) foi processado. Retorna `true` na primeira vez (aplicar o
   * efeito) ou `false` se já processado (ignorar reentrega do broker).
   */
  async registrarEvento(tenantId: string, evento: string, referenciaId: string): Promise<boolean> {
    return this.pedidoRepository.registrarEventoProcessado(tenantId, evento, referenciaId);
  }

  /**
   * SAGA — reação a `estoque.reservado` (inventory-service).
   *
   * O estoque foi garantido; o pedido avança na máquina de estados até
   * EM_SEPARACAO, passando por CONFIRMADO quando necessário. Reaproveita os
   * métodos semânticos (confirmarPedido/iniciarSeparacao), que já validam a
   * transição, registram histórico e publicam os eventos correspondentes.
   *
   * Idempotente por ESTADO (além do dedup do consumidor):
   * - já em EM_SEPARACAO ou posterior → no-op;
   * - CANCELADO/DEVOLVIDO → no-op (não ressuscita pedido encerrado).
   */
  async reagirEstoqueReservado(
    tenantId: string,
    pedidoId: string,
    itensReservados: number,
  ): Promise<void> {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    // Estados terminais ou já além da separação: nada a fazer.
    const jaSeparouOuAlem = [
      'EM_SEPARACAO',
      'FATURADO',
      'ENVIADO',
      'ENTREGUE',
      'CANCELADO',
      'DEVOLVIDO',
    ];
    if (jaSeparouOuAlem.includes(pedido.status)) {
      this.logger.log(
        `estoque.reservado [${pedidoId}] ignorado: status atual ${pedido.status} não requer avanço`,
      );
      return;
    }

    // Avança pela cadeia VÁLIDA da máquina de estados, um passo por vez:
    // RASCUNHO → PENDENTE → CONFIRMADO → EM_SEPARACAO. Como um pedido recém
    // criado nasce em RASCUNHO, o salto direto RASCUNHO→CONFIRMADO seria
    // rejeitado por validarTransicao — por isso passamos por PENDENTE primeiro.
    if (pedido.status === 'RASCUNHO') {
      await this.submeterPedido(tenantId, pedidoId);
    }
    // Neste ponto o pedido está (no mínimo) em PENDENTE → CONFIRMADO.
    await this.confirmarPedido(tenantId, pedidoId);
    // CONFIRMADO → EM_SEPARACAO.
    await this.iniciarSeparacao(tenantId, pedidoId);

    this.logger.log(
      `estoque.reservado [${pedidoId}]: ${itensReservados} item(ns) reservados → pedido em EM_SEPARACAO`,
    );
  }

  /**
   * Transição RASCUNHO → PENDENTE (pedido submetido, aguardando processamento).
   * Não há evento semântico dedicado; aplica o status validando a transição e
   * registra o histórico. Usado internamente pela saga para não saltar etapas
   * da máquina de estados.
   */
  private async submeterPedido(tenantId: string, pedidoId: string) {
    const pedido = await this.validarExistencia(tenantId, pedidoId);
    this.validarTransicao(pedido.status, 'PENDENTE');

    const pedidoAtualizado = await this.pedidoRepository.atualizarStatus(
      tenantId,
      pedidoId,
      'PENDENTE',
    );

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      'PENDENTE',
      'Pedido submetido para processamento',
    );

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    return pedidoAtualizado;
  }

  /**
   * SAGA — reação a `estoque.insuficiente` (inventory-service).
   *
   * Marca o pedido com pendência de estoque e registra o detalhe no histórico,
   * sem violar a máquina de estados. O pedido é mantido/colocado em PENDENTE
   * (aguardando reposição), permitindo nova tentativa de reserva depois.
   *
   * Se o pedido já estiver em estado terminal/avançado, apenas registra o
   * histórico (não rebaixa o status).
   */
  async reagirEstoqueInsuficiente(
    tenantId: string,
    pedidoId: string,
    itensFaltantes: Array<{
      produtoId?: string;
      sku?: string;
      quantidadeFaltante?: number;
    }>,
  ): Promise<void> {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    const detalhe =
      Array.isArray(itensFaltantes) && itensFaltantes.length > 0
        ? itensFaltantes
            .map((i) => `${i.sku ?? i.produtoId ?? 'item'} (${i.quantidadeFaltante ?? '?'} un)`)
            .join(', ')
        : 'itens não especificados';

    const descricao = `Estoque insuficiente: ${detalhe}`;

    // Estados em que faz sentido sinalizar pendência e permitir nova tentativa.
    const podeRebaixarParaPendente = ['RASCUNHO', 'CONFIRMADO'];

    if (podeRebaixarParaPendente.includes(pedido.status)) {
      // Coloca em PENDENTE (aguardando reposição) — write direto + histórico,
      // pois PENDENTE não é destino de transição semântica padrão.
      await this.pedidoRepository.atualizarStatus(tenantId, pedidoId, 'PENDENTE');
      await this.pedidoRepository.adicionarHistorico(
        pedidoId,
        tenantId,
        pedido.status,
        'PENDENTE',
        descricao,
      );
    } else {
      // PENDENTE (mantém) ou estados avançados/terminais: só registra o motivo.
      await this.pedidoRepository.adicionarHistorico(
        pedidoId,
        tenantId,
        pedido.status,
        pedido.status,
        descricao,
      );
    }

    await this.cache.deleteByPattern(`pedidos:${tenantId}:*`);
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    this.logger.warn(`estoque.insuficiente [${pedidoId}]: ${descricao}`);
  }

  /**
   * SAGA — reação a `estoque.liberado` (inventory-service).
   *
   * Confirmação assíncrona de que as reservas do pedido foram liberadas após
   * um cancelamento. O status CANCELADO já foi aplicado no fluxo de
   * cancelamento; aqui apenas registramos a confirmação no histórico
   * (observabilidade da saga), de forma idempotente.
   */
  async reagirEstoqueLiberado(
    tenantId: string,
    pedidoId: string,
    itensLiberados: number,
  ): Promise<void> {
    const pedido = await this.validarExistencia(tenantId, pedidoId);

    await this.pedidoRepository.adicionarHistorico(
      pedidoId,
      tenantId,
      pedido.status,
      pedido.status,
      `Estoque liberado: ${itensLiberados} reserva(s) devolvida(s) ao disponível`,
    );

    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);

    this.logger.log(`estoque.liberado [${pedidoId}]: ${itensLiberados} reserva(s) liberada(s)`);
  }

  // ─── Helpers Privados ────────────────────────────────────

  /**
   * Validar que pedido existe e pertence ao tenant.
   */
  private async validarExistencia(tenantId: string, pedidoId: string) {
    const pedido = await this.pedidoRepository.buscarPorId(tenantId, pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${pedidoId} não encontrado`);
    }
    return pedido;
  }

  /**
   * Validar transição de status permitida.
   */
  private validarTransicao(statusAtual: string, statusNovo: string) {
    const permitidas = this.transicoePermitidas[statusAtual] || [];
    if (!permitidas.includes(statusNovo)) {
      throw new BadRequestException(`Transição de ${statusAtual} para ${statusNovo} não permitida`);
    }
  }

  /**
   * Monta um item do pedido com todos os valores monetários e dimensões em
   * Decimal. O `valorTotal` do item é calculado uma única vez, em Decimal
   * (`(valorUnitario - valorDesconto) * quantidade`), e reaproveitado como
   * fonte única — evitando recomputar com float em qualquer ponto seguinte.
   */
  private montarItemPedido(item: {
    produtoId: string;
    variacaoId?: string;
    sku: string;
    titulo: string;
    quantidade: number;
    valorUnitario: number;
    valorDesconto?: number;
    peso?: number;
    largura?: number;
    altura?: number;
    comprimento?: number;
  }) {
    const valorUnitario = new Decimal(item.valorUnitario);
    const valorDesconto = new Decimal(item.valorDesconto || 0);
    const valorTotal = valorUnitario.minus(valorDesconto).times(item.quantidade);

    return {
      produtoId: item.produtoId,
      variacaoId: item.variacaoId,
      sku: item.sku,
      titulo: item.titulo,
      quantidade: item.quantidade,
      valorUnitario,
      valorDesconto,
      valorTotal,
      peso: item.peso != null ? new Decimal(item.peso) : null,
      largura: item.largura != null ? new Decimal(item.largura) : null,
      altura: item.altura != null ? new Decimal(item.altura) : null,
      comprimento: item.comprimento != null ? new Decimal(item.comprimento) : null,
    };
  }

  /**
   * Calcula os totais do pedido em Decimal (precisão exata, sem acúmulo de erro
   * de ponto flutuante).
   *
   * - `valorProdutos` = Σ (valorTotal de cada item, já líquido do desconto do item)
   * - `valorTotal`    = valorProdutos − valorDesconto (do pedido) + valorFrete
   *
   * Nota (mudança intencional): `valorProdutos` passa a somar o `valorTotal`
   * LÍQUIDO de cada item — isto é, já descontado o desconto de linha. A versão
   * anterior somava o bruto (valorUnitario × quantidade) e ignorava o desconto
   * de item no total do pedido, o que fazia o total do pedido NÃO fechar com a
   * soma dos itens quando havia desconto de linha (inconsistência fiscal). Aqui
   * o total do pedido é sempre igual à soma dos itens + frete − desconto geral.
   *
   * O desconto do pedido é limitado (clamp) para não deixar `valorTotal`
   * negativo caso o desconto informado exceda produtos + frete.
   */
  private calcularTotais(
    itens: Array<{ valorTotal: Decimal }>,
    valorDescontoPedido?: number,
    valorFretePedido?: number,
  ): {
    valorProdutos: Decimal;
    valorDesconto: Decimal;
    valorFrete: Decimal;
    valorTotal: Decimal;
  } {
    const valorProdutos = itens.reduce((acc, item) => acc.plus(item.valorTotal), new Decimal(0));
    const valorFrete = new Decimal(valorFretePedido || 0);

    // Nunca deixa o desconto do pedido ultrapassar produtos + frete.
    const descontoInformado = new Decimal(valorDescontoPedido || 0);
    const tetoDesconto = valorProdutos.plus(valorFrete);
    const valorDesconto = Decimal.min(descontoInformado, tetoDesconto);

    const valorTotal = valorProdutos.minus(valorDesconto).plus(valorFrete);

    return { valorProdutos, valorDesconto, valorFrete, valorTotal };
  }
}
