/**
 * ═══════════════════════════════════════════════════════════════
 * Serviço de Pagamentos
 * ═══════════════════════════════════════════════════════════════
 *
 * Gerencia registros de pagamento:
 * - Registrar pagamentos (webhook do gateway)
 * - Processar autorização e captura
 * - Estornar pagamentos
 */

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PagamentoRepository } from './pagamento.repository';
import { CacheService } from '../cache/cache.service';
import { CaixaService } from '../caixa/caixa.service';
import { PrismaService, ClientePrisma } from '../prisma/prisma.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { RegistrarPagamentoDto } from '../../dtos/pagamento.dto';
import {
  OrigemPedido,
  Prisma,
  StatusPagamento,
  StatusPagamentoDetalhado,
  TipoPagamento,
} from '../../../generated/client';

/**
 * Normaliza o status livre recebido (REST/webhook/evento) para o enum canônico
 * `StatusPagamentoDetalhado` do Prisma (fonte da verdade). Sinônimos legados
 * ("AUTORIZADO", "PAGO") mapeiam para APROVADO; desconhecidos caem em PENDENTE
 * (nunca gravamos string arbitrária no enum → evita erro de enum drift).
 */
const MAPA_STATUS_PAGAMENTO: Record<string, StatusPagamentoDetalhado> = {
  PENDENTE: StatusPagamentoDetalhado.PENDENTE,
  PROCESSANDO: StatusPagamentoDetalhado.PROCESSANDO,
  APROVADO: StatusPagamentoDetalhado.APROVADO,
  AUTORIZADO: StatusPagamentoDetalhado.APROVADO,
  PAGO: StatusPagamentoDetalhado.APROVADO,
  RECUSADO: StatusPagamentoDetalhado.RECUSADO,
  ESTORNADO: StatusPagamentoDetalhado.ESTORNADO,
};

function normalizarStatusPagamento(status: string | undefined): StatusPagamentoDetalhado {
  if (!status) return StatusPagamentoDetalhado.PENDENTE;
  return MAPA_STATUS_PAGAMENTO[status.trim().toUpperCase()] ?? StatusPagamentoDetalhado.PENDENTE;
}

/**
 * Origens cujo pagamento entra no caixa FÍSICO da loja. Marketplace/e-commerce
 * são recebidos pelo gateway/canal e nunca passam pela gaveta — lançá-los no
 * caixa inflaria o saldo esperado e produziria divergência no fechamento.
 */
const ORIGENS_BALCAO: OrigemPedido[] = [OrigemPedido.LOJA_FISICA, OrigemPedido.MANUAL];

@Injectable()
export class PagamentoService {
  private readonly logger = new Logger(PagamentoService.name);

  constructor(
    private pagamentoRepository: PagamentoRepository,
    private cache: CacheService,
    private kafkaProducer: KafkaProducerService,
    private prisma: PrismaService,
    private caixaService: CaixaService,
  ) {}

  /**
   * Registrar novo pagamento.
   *
   * Persiste o status já normalizado ao enum canônico e, quando o pagamento é
   * APROVADO, publica `pedido.pago` (contrato da saga → consumido por
   * inventory-service para baixa definitiva e financial-service para lançamento).
   *
   * Pagamento APROVADO de venda de balcão vira ENTRADA/VENDA na sessão de caixa
   * aberta, na MESMA transação — caixa e venda nunca divergem.
   */
  async registrarPagamento(tenantId: string, pedidoId: string, dto: RegistrarPagamentoDto) {
    const statusNormalizado = normalizarStatusPagamento(dto.status);

    const { pagamento, lancadoNoCaixa } = await this.prisma.$transaction(async (tx) => {
      // SERIALIZA pagamentos concorrentes do MESMO pedido: trava a linha ANTES de
      // ler a soma. Sem o lock, dois POSTs simultâneos leem Σ=0, ambos passam no
      // guard e gravam pagamentos acima do total — inflando a gaveta. $queryRaw
      // porque o Prisma não expõe FOR UPDATE; só vale DENTRO da transação.
      await tx.$queryRaw`
        SELECT id FROM pedidos
         WHERE id = ${pedidoId}::uuid AND tenant_id = ${tenantId}::uuid
         FOR UPDATE`;

      // INVARIANTE DE DINHEIRO: a soma dos pagamentos não pode ultrapassar o
      // total do pedido. `Pagamento.valor` é o valor EFETIVAMENTE pago naquela
      // forma — troco é devolução de excedente, não pagamento. Sem esta guarda a
      // regra viveria só na UI: um POST com o valor entregue pelo cliente
      // (R$ 100 num pedido de R$ 80) inflaria a gaveta em R$ 20 e o caixa
      // fecharia acusando falta. Pagamento parcial (soma < total) é legítimo.
      await this.garantirSomaNaoExcedeTotal(tx, tenantId, pedidoId, dto.valor, statusNormalizado);

      const pagamentoCriado = await this.pagamentoRepository.criar(
        tenantId,
        pedidoId,
        { ...dto, status: statusNormalizado },
        tx,
      );

      // A verdade do PEDIDO acompanha o dinheiro NA MESMA transação: recebeu →
      // PAGO. Antes isto dependia do evento `pagamento.capturado`, que NADA
      // publica no fluxo de caixa — o pedido ficava PENDENTE, reaparecia em
      // "vendas em aberto" e o operador rerecebia até o guard de soma travar.
      await this.sincronizarStatusPagamentoPedido(tx, tenantId, pedidoId);

      if (statusNormalizado !== StatusPagamentoDetalhado.APROVADO) {
        return { pagamento: pagamentoCriado, lancadoNoCaixa: false };
      }

      const pedido = await tx.pedido.findFirst({
        where: { id: pedidoId, tenantId },
        select: { numero: true, origem: true },
      });

      if (!pedido || !ORIGENS_BALCAO.includes(pedido.origem)) {
        return { pagamento: pagamentoCriado, lancadoNoCaixa: false };
      }

      const movimentacao = await this.caixaService.registrarVenda(tx, tenantId, {
        pagamentoId: pagamentoCriado.id,
        pedidoId,
        pedidoNumero: pedido.numero,
        valor: pagamentoCriado.valor,
        formaPagamento: this.resolverFormaPagamento(dto.tipo),
        // Ex.: "Amex Crédito 02x" — a forma cadastrada que o PDV/caixa usou.
        descricaoComplementar: (dto.dadosGateway as any)?.formaPagamento ?? null,
      });

      return { pagamento: pagamentoCriado, lancadoNoCaixa: movimentacao !== null };
    });

    // SEM CAIXA ABERTO: a venda NÃO falha. O Pagamento é a fonte da verdade e já
    // está gravado; a movimentação é só a projeção no caixa físico. Fica apenas
    // não conciliado (rastreável pelo pedido) — derrubar a venda por causa de um
    // detalhe de turno seria muito pior. O PDV já bloqueia venda sem caixa aberto,
    // então na prática isto só ocorre em recebimento fora do turno.
    if (statusNormalizado === StatusPagamentoDetalhado.APROVADO && !lancadoNoCaixa) {
      this.logger.warn(
        `Pagamento ${pagamento.id} (pedido ${pedidoId}) aprovado sem lançamento no caixa ` +
          '(sem sessão aberta ou pedido de origem não-balcão).',
      );
    }

    // Publica pedido.pago apenas quando o pagamento foi efetivamente aprovado.
    if (statusNormalizado === StatusPagamentoDetalhado.APROVADO) {
      await this.kafkaProducer.publicarPedidoPago(tenantId, pedidoId);
    }

    // Limpar cache
    await this.cache.delete(`pedido:${tenantId}:${pedidoId}`);
    await this.cache.deleteByPattern(`pagamentos:${tenantId}:*`);

    return pagamento;
  }

  /**
   * Traduz o `tipo` livre recebido para o enum TipoPagamento (usado nos totais
   * por forma do caixa). Valor desconhecido vira `undefined` — a movimentação é
   * lançada sem forma em vez de derrubar a venda com erro de enum.
   */
  private resolverFormaPagamento(tipo: string | undefined): TipoPagamento | undefined {
    if (!tipo) return undefined;
    const normalizado = tipo.trim().toUpperCase();
    return (TipoPagamento as Record<string, TipoPagamento>)[normalizado];
  }

  /**
   * Invariante de dinheiro: Σ pagamentos efetivos ≤ valorTotal do pedido.
   *
   * `Pagamento.valor` é o quanto foi EFETIVAMENTE pago naquela forma. Troco não
   * é pagamento (é devolução de excedente), então registrar o valor entregue
   * pelo cliente — R$ 100 num pedido de R$ 80 — inflaria a gaveta em R$ 20 e o
   * caixa fecharia acusando falta. Esta guarda desce a regra da UI para o
   * servidor: sem ela, o próximo consumidor da API repete o bug.
   *
   * Pagamento PARCIAL (soma < total) é legítimo e passa. Só o EXCESSO é barrado.
   * Estornados não contam (o valor voltou ao cliente). Tudo em Decimal — dinheiro
   * nunca em float. Tolerância de 1 centavo para arredondamento do cliente.
   */
  private async garantirSomaNaoExcedeTotal(
    cliente: ClientePrisma,
    tenantId: string,
    pedidoId: string,
    valorNovo: number,
    status: StatusPagamentoDetalhado,
  ): Promise<void> {
    // Só pagamentos que contam como recebidos entram na soma.
    if (
      status === StatusPagamentoDetalhado.RECUSADO ||
      status === StatusPagamentoDetalhado.ESTORNADO
    ) {
      return;
    }

    const pedido = await cliente.pedido.findFirst({
      where: { id: pedidoId, tenantId },
      select: { valorTotal: true },
    });
    // Pedido inexistente: quem trata é o fluxo normal (não é papel desta guarda).
    if (!pedido) return;

    const agregado = await cliente.pagamento.aggregate({
      where: {
        pedidoId,
        tenantId,
        status: { notIn: [StatusPagamentoDetalhado.RECUSADO, StatusPagamentoDetalhado.ESTORNADO] },
      },
      _sum: { valor: true },
    });

    const jaPago = agregado._sum.valor ?? new Prisma.Decimal(0);
    const somaFinal = jaPago.plus(new Prisma.Decimal(valorNovo));
    const tolerancia = new Prisma.Decimal('0.01');

    if (somaFinal.minus(pedido.valorTotal).greaterThan(tolerancia)) {
      const restante = pedido.valorTotal.minus(jaPago);
      throw new BadRequestException(
        `Valor excede o total do pedido. Restante a pagar: R$ ${restante.toFixed(2)}. ` +
          `Se o cliente entregou mais em dinheiro, registre o valor do pedido e devolva o troco.`,
      );
    }
  }

  /**
   * Sincroniza o `statusPagamento` do PEDIDO com a soma dos pagamentos APROVADOS,
   * na MESMA transação do registro/estorno — a verdade do pedido acompanha o
   * dinheiro na hora, sem depender de round-trip por Kafka.
   *
   * MOTIVO: a transição para PAGO só existia no consumo de `pagamento.capturado`,
   * evento que NADA publica no fluxo de balcão/caixa (registrarPagamento publica
   * `pedido.pago`, consumido por inventory/financial). O pedido recebido no caixa
   * ficava PENDENTE para sempre, reaparecendo em "vendas em aberto".
   *
   * PAGO quando Σ aprovados ≥ total (tolerância de 1 centavo). PARCIAL quando há
   * aprovado que não cobre. Sem aprovado: REEMBOLSADO se houve estorno (o valor
   * voltou ao cliente), senão PENDENTE. Tudo em Decimal — dinheiro nunca em float.
   */
  private async sincronizarStatusPagamentoPedido(
    cliente: ClientePrisma,
    tenantId: string,
    pedidoId: string,
  ): Promise<void> {
    const pedido = await cliente.pedido.findFirst({
      where: { id: pedidoId, tenantId },
      select: { valorTotal: true, statusPagamento: true },
    });
    if (!pedido) return;

    const [aprovado, estornos] = await Promise.all([
      cliente.pagamento.aggregate({
        where: { pedidoId, tenantId, status: StatusPagamentoDetalhado.APROVADO },
        _sum: { valor: true },
      }),
      cliente.pagamento.count({
        where: { pedidoId, tenantId, status: StatusPagamentoDetalhado.ESTORNADO },
      }),
    ]);

    const pago = aprovado._sum.valor ?? new Prisma.Decimal(0);
    const tolerancia = new Prisma.Decimal('0.01');

    let novo: StatusPagamento;
    if (pago.greaterThan(0) && pago.greaterThanOrEqualTo(pedido.valorTotal.minus(tolerancia))) {
      novo = StatusPagamento.PAGO;
    } else if (pago.greaterThan(0)) {
      novo = StatusPagamento.PARCIAL;
    } else if (estornos > 0) {
      novo = StatusPagamento.REEMBOLSADO;
    } else {
      novo = StatusPagamento.PENDENTE;
    }

    if (novo !== pedido.statusPagamento) {
      await cliente.pedido.updateMany({
        where: { id: pedidoId, tenantId },
        data: { statusPagamento: novo, atualizadoEm: new Date() },
      });
    }
  }

  /**
   * Processar webhook de gateway de pagamento.
   * Chamado por POST /pagamentos/webhook
   *
   * TODO(Fase 1): STUB. Implementar:
   * - Validação da assinatura HMAC do gateway (segurança do endpoint público).
   * - Resolução do tenantId a partir da credencial/payload do webhook.
   * - Atualização do status do pagamento e publicação de PAGAMENTO_CAPTURADO
   *   (APROVADO) / PAGAMENTO_RECUSADO (RECUSADO) via KafkaProducerService.
   */
  async processarWebhook(tenantId: string, dadosWebhook: any) {
    const { pedidoId, status, transacaoExternaId, motivo } = dadosWebhook;

    if (status === 'APROVADO') {
      // Atualizar status para PAGO + publicar evento PAGAMENTO_CAPTURADO
    } else if (status === 'RECUSADO') {
      // Atualizar status + publicar evento PAGAMENTO_RECUSADO
    }

    return { sucesso: true };
  }

  /**
   * Estornar pagamento.
   *
   * Estorno de venda de balcão em dinheiro TIRA dinheiro da gaveta: além de
   * mudar o status, lança REEMBOLSO/SAÍDA na sessão de caixa ABERTA, na MESMA
   * transação. Sem esse lançamento o fechamento acusaria falta do valor
   * devolvido — e a diferença errada viraria auditoria.
   *
   * O reembolso vai para a sessão aberta AGORA, que pode não ser a da venda
   * original (estorno de ontem sai da gaveta de hoje) — é assim que a gaveta
   * física se comporta.
   */
  async estornarPagamento(tenantId: string, pagamentoId: string, motivo: string) {
    const pagamento = await this.pagamentoRepository.buscarPorId(tenantId, pagamentoId);

    if (!pagamento) {
      throw new NotFoundException(`Pagamento ${pagamentoId} não encontrado`);
    }

    // Só APROVADO estorna: um PENDENTE/RECUSADO nunca moveu dinheiro, e marcá-lo
    // ESTORNADO rebaixaria o pedido para REEMBOLSADO sem nada ter entrado/saído.
    if (pagamento.status !== StatusPagamentoDetalhado.APROVADO) {
      throw new BadRequestException('Só é possível estornar um pagamento aprovado.');
    }

    const { pagamentoAtualizado, lancadoNoCaixa } = await this.prisma.$transaction(async (tx) => {
      // Serializa com registrarPagamento/estorno concorrentes do mesmo pedido.
      await tx.$queryRaw`
        SELECT id FROM pedidos
         WHERE id = ${pagamento.pedidoId}::uuid AND tenant_id = ${tenantId}::uuid
         FOR UPDATE`;

      const atualizado = await this.pagamentoRepository.atualizarStatus(
        tenantId,
        pagamentoId,
        'ESTORNADO',
        tx,
      );

      // O estorno rebaixa o pedido: PAGO → PARCIAL (se sobra pagamento aprovado)
      // ou REEMBOLSADO (se nada mais aprovado resta). Mesma transação do estorno.
      await this.sincronizarStatusPagamentoPedido(tx, tenantId, pagamento.pedidoId);

      // MESMA tolerância do registrarVenda: sem caixa aberto (ou sem VENDA
      // lançada no caixa) devolve null e NÃO derruba o estorno. O estorno é
      // soberano; a movimentação é só a projeção no caixa físico.
      const movimentacao = await this.caixaService.registrarEstorno(
        tx,
        tenantId,
        pagamentoId,
        motivo,
      );

      return { pagamentoAtualizado: atualizado, lancadoNoCaixa: movimentacao !== null };
    });

    if (!lancadoNoCaixa) {
      this.logger.warn(
        `Pagamento ${pagamentoId} estornado sem lançamento de reembolso no caixa ` +
          '(sem sessão aberta, sem venda lançada no caixa ou reembolso já existente).',
      );
    }

    // Publicar evento
    // await this.kafkaProducer.publicarPagamentoEstornado(...)

    // Limpar cache
    await this.cache.deleteByPattern(`pagamentos:${tenantId}:*`);

    return pagamentoAtualizado;
  }

  /**
   * Listar pagamentos do tenant.
   */
  async listar(tenantId: string, filtros: any) {
    return this.pagamentoRepository.listar(tenantId, filtros);
  }

  /**
   * Buscar pagamentos de um pedido específico.
   */
  async buscarPorPedido(tenantId: string, pedidoId: string) {
    return this.pagamentoRepository.buscarPorPedido(tenantId, pedidoId);
  }
}
