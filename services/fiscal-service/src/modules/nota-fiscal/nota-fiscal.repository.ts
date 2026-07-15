/**
 * Repositório de Nota Fiscal
 * Encapsula operações de banco de dados com Prisma.
 *
 * Unidade monetária: todos os valores trafegam em REAIS (Decimal(19,2)),
 * ponta a ponta (DTO → repository → banco). Não há conversão para/de
 * centavos. As colunas Decimal do Prisma preservam a escala definida no
 * schema, portanto R$ 1.234,56 entra e sai idêntico.
 */

import { Injectable } from '@nestjs/common';
import { Prisma, ModeloDocumento, StatusNotaFiscal } from '../../../generated/client';
import { PrismaService } from '../prisma/prisma.service';
import { CriarNotaFiscalDto } from '../../dtos/criar-nota-fiscal.dto';
import { FiltroNotaFiscalDto } from '../../dtos/filtro-nota-fiscal.dto';
import { tipoParaModelo } from '../../utils/modelo-documento.util';
import { ItemNotaCalculado, TotaisNota } from '../tributos/tributos.types';

@Injectable()
export class NotaFiscalRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova nota fiscal em rascunho.
   *
   * Aceita um cliente de transação (`tx`) opcional, permitindo que a reserva
   * atômica do número e a criação da nota ocorram na MESMA transação — assim
   * o número só é efetivamente consumido se a nota for gravada.
   *
   * Os campos tributários por item (base/valor de ICMS/PIS/COFINS/IPI, CST) e
   * os totalizadores da nota são recebidos já calculados pelo engine de
   * tributos (ver NotaFiscalService.criarRascunho). Se `itensCalculados` não
   * vier, cai no comportamento anterior (apenas os campos do payload).
   *
   * Os totais são somados com Prisma.Decimal para evitar erros de ponto
   * flutuante ao consolidar os itens (todos em reais).
   */
  async criar(
    tenantId: string,
    dados: CriarNotaFiscalDto,
    chaveAcesso: string,
    numero: number,
    itensCalculados?: ItemNotaCalculado[],
    totais?: TotaisNota,
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx ?? this.prisma;
    const itensParaGravar = itensCalculados ?? this.itensDoPayload(dados);

    const valorProdutos = itensParaGravar.reduce(
      (soma, item) => soma.plus(new Prisma.Decimal(item.valorTotal)),
      new Prisma.Decimal(0),
    );
    const valorDesconto = itensParaGravar.reduce(
      (soma, item) => soma.plus(new Prisma.Decimal(item.valorDesconto ?? 0)),
      new Prisma.Decimal(0),
    );

    // Total da nota = produtos - desconto + frete + seguro + outros.
    const valorFrete = new Prisma.Decimal(dados.valorFrete ?? 0);
    const valorSeguro = new Prisma.Decimal(dados.valorSeguro ?? 0);
    const valorOutros = new Prisma.Decimal(dados.valorOutros ?? 0);
    const valorTotal = valorProdutos
      .minus(valorDesconto)
      .plus(valorFrete)
      .plus(valorSeguro)
      .plus(valorOutros);

    return db.notaFiscal.create({
      data: {
        tenantId,
        tipo: dados.tipo as any,
        serie: dados.serie || '1',
        numero,
        chaveAcesso,
        naturezaOperacao: dados.naturezaOperacao as any,
        dataEmissao: new Date(dados.dataEmissao),
        dataSaida: dados.dataSaida ? new Date(dados.dataSaida) : null,
        status: 'RASCUNHO' as any,
        valorTotal,
        valorProdutos,
        valorDesconto,
        valorFrete,
        valorSeguro,
        valorOutros,
        valorIcms: new Prisma.Decimal(totais?.valorIcms ?? 0),
        valorPis: new Prisma.Decimal(totais?.valorPis ?? 0),
        valorCofins: new Prisma.Decimal(totais?.valorCofins ?? 0),
        valorIpi: new Prisma.Decimal(totais?.valorIpi ?? 0),
        destinatario: dados.destinatario as any,
        informacoesAdicionais: dados.informacoesAdicionais,
        pedidoId: dados.pedidoId,
        clienteId: dados.clienteId,
        itens: {
          create: itensParaGravar.map((item) => ({
            produtoId: item.produtoId,
            descricao: item.descricao,
            ncm: item.ncm,
            cfop: item.cfop,
            unidade: item.unidade,
            quantidade: new Prisma.Decimal(item.quantidade),
            valorUnitario: new Prisma.Decimal(item.valorUnitario),
            valorTotal: new Prisma.Decimal(item.valorTotal),
            valorDesconto: new Prisma.Decimal(item.valorDesconto ?? 0),
            origemMercadoria: item.origemMercadoria,
            cstIcms: item.cstIcms,
            aliquotaIcms: new Prisma.Decimal(item.aliquotaIcms ?? 0),
            baseIcms: new Prisma.Decimal(item.baseIcms ?? 0),
            valorIcms: new Prisma.Decimal(item.valorIcms ?? 0),
            cstPis: item.cstPis,
            aliquotaPis: new Prisma.Decimal(item.aliquotaPis ?? 0),
            basePis: new Prisma.Decimal(item.basePis ?? 0),
            valorPis: new Prisma.Decimal(item.valorPis ?? 0),
            cstCofins: item.cstCofins,
            aliquotaCofins: new Prisma.Decimal(item.aliquotaCofins ?? 0),
            baseCofins: new Prisma.Decimal(item.baseCofins ?? 0),
            valorCofins: new Prisma.Decimal(item.valorCofins ?? 0),
            cstIpi: item.cstIpi ?? null,
            aliquotaIpi: new Prisma.Decimal(item.aliquotaIpi ?? 0),
            baseIpi: new Prisma.Decimal(item.baseIpi ?? 0),
            valorIpi: new Prisma.Decimal(item.valorIpi ?? 0),
          })),
        },
      },
      include: { itens: true, eventos: true },
    });
  }

  /**
   * Normaliza os itens do payload para o formato de gravação quando não há
   * cálculo tributário prévio (base/valor de impostos ficam em zero). Usado
   * apenas como fallback — o fluxo normal grava itens já calculados pelo
   * engine de tributos.
   */
  private itensDoPayload(dados: CriarNotaFiscalDto): ItemNotaCalculado[] {
    return dados.itens.map((item) => ({
      produtoId: item.produtoId,
      descricao: item.descricao,
      ncm: item.ncm,
      cfop: item.cfop,
      unidade: item.unidade,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotal: item.valorTotal,
      valorDesconto: item.valorDesconto ?? 0,
      origemMercadoria: item.origemMercadoria,
      cstIcms: item.cstIcms,
      aliquotaIcms: item.aliquotaIcms ?? 0,
      baseIcms: 0,
      valorIcms: 0,
      cstPis: item.cstPis,
      aliquotaPis: item.aliquotaPis ?? 0,
      basePis: 0,
      valorPis: 0,
      cstCofins: item.cstCofins,
      aliquotaCofins: item.aliquotaCofins ?? 0,
      baseCofins: 0,
      valorCofins: 0,
      cstIpi: item.cstIpi ?? null,
      aliquotaIpi: item.aliquotaIpi ?? 0,
      baseIpi: 0,
      valorIpi: 0,
    }));
  }

  /**
   * Cria a nota reservando o número de forma ATÔMICA na mesma transação.
   *
   * Fluxo: abre `$transaction` → reserva número (UPDATE ... RETURNING) →
   * monta a chave de acesso com esse número → grava a nota. Se qualquer etapa
   * falhar, a transação inteira sofre rollback e o número NÃO é consumido.
   *
   * @param gerarChave - callback puro que monta a chave de acesso a partir do
   *   número reservado (injetado pelo service para não acoplar o util aqui).
   */
  async criarComNumeroAtomico(
    tenantId: string,
    dados: CriarNotaFiscalDto,
    gerarChave: (numero: number) => string,
    itensCalculados?: ItemNotaCalculado[],
    totais?: TotaisNota,
  ) {
    const serie = dados.serie || '1';
    const tipo: 'NFE' | 'NFCE' = dados.tipo === 'NFCE' ? 'NFCE' : 'NFE';

    return this.prisma.$transaction(async (tx) => {
      const numero = await this.obterProximoNumero(tenantId, serie, tipo, tx);
      const chaveAcesso = gerarChave(numero);
      return this.criar(tenantId, dados, chaveAcesso, numero, itensCalculados, totais, tx);
    });
  }

  /**
   * Busca uma nota fiscal por ID (filtrada por tenantId).
   */
  async buscarPorId(tenantId: string, notaId: string) {
    return this.prisma.notaFiscal.findFirst({
      where: { id: notaId, tenantId },
      include: { itens: true, eventos: true },
    });
  }

  /**
   * Busca a nota fiscal vinculada a um pedido (idempotência do faturamento
   * automático: 1 pedido → 1 nota, exceto notas canceladas/inutilizadas).
   */
  async buscarPorPedido(tenantId: string, pedidoId: string) {
    return this.prisma.notaFiscal.findFirst({
      where: {
        tenantId,
        pedidoId,
        status: { notIn: ['CANCELADA', 'INUTILIZADA'] },
      },
      include: { itens: true },
    });
  }

  /**
   * Lista notas fiscais com filtros e paginação.
   */
  async listar(tenantId: string, filtros: FiltroNotaFiscalDto) {
    const skip = (filtros.pagina - 1) * filtros.limite;

    const where: any = { tenantId };

    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.status) where.status = filtros.status;
    if (filtros.clienteId) where.clienteId = filtros.clienteId;
    if (filtros.chaveAcesso) where.chaveAcesso = filtros.chaveAcesso;

    if (filtros.dataInicio || filtros.dataFim) {
      where.dataEmissao = {};
      if (filtros.dataInicio) where.dataEmissao.gte = new Date(filtros.dataInicio);
      if (filtros.dataFim) where.dataEmissao.lte = new Date(filtros.dataFim);
    }

    const [notas, total] = await Promise.all([
      this.prisma.notaFiscal.findMany({
        where,
        skip,
        take: filtros.limite,
        include: { itens: true },
        orderBy: { dataEmissao: 'desc' },
      }),
      this.prisma.notaFiscal.count({ where }),
    ]);

    // Envelope paginado canônico: { dados, total, pagina, limite, totalPaginas }
    return {
      dados: notas,
      total,
      pagina: filtros.pagina,
      limite: filtros.limite,
      totalPaginas: Math.ceil(total / filtros.limite),
    };
  }

  /**
   * Atualiza o status de uma nota fiscal.
   *
   * O update é escopado por { id, tenantId } (via updateMany) para nunca
   * alterar nota de outro tenant, mesmo que o id seja forjado. Em seguida
   * relê a nota já filtrada por tenantId.
   */
  async atualizarStatus(tenantId: string, notaId: string, novoStatus: string, dados?: any) {
    await this.prisma.notaFiscal.updateMany({
      where: { id: notaId, tenantId },
      data: {
        status: novoStatus as any,
        xmlEnvio: dados?.xmlEnvio,
        xmlRetorno: dados?.xmlRetorno,
        protocolo: dados?.protocolo,
        motivoRejeicao: dados?.motivoRejeicao,
      },
    });

    return this.buscarPorId(tenantId, notaId);
  }

  /**
   * Atualiza os tributos calculados de uma nota (por item) + os totalizadores
   * da nota + o status, tudo numa única transação.
   *
   * `itensPersistidos` são os itens lidos pelo serviço (com seus ids) e
   * `itensCalculados` são derivados deles na MESMA ordem — o casamento é por
   * índice. Passar os ids explicitamente evita depender da ordem de uma
   * releitura (Prisma não garante ordem sem `orderBy`). Cada item é atualizado
   * escopado por { id, notaFiscalId } para não vazar entre notas.
   *
   * Todos os valores são gravados como Prisma.Decimal (reais).
   */
  async atualizarTributos(
    tenantId: string,
    notaId: string,
    itensPersistidos: Array<{ id: string }>,
    itensCalculados: ItemNotaCalculado[],
    totais: TotaisNota,
    novoStatus: StatusNotaFiscal,
  ) {
    await this.prisma.$transaction(async (tx) => {
      // Garante que a nota pertence ao tenant antes de tocar nos itens.
      const atualizados = await tx.notaFiscal.updateMany({
        where: { id: notaId, tenantId },
        data: {
          status: novoStatus,
          valorIcms: new Prisma.Decimal(totais.valorIcms),
          valorPis: new Prisma.Decimal(totais.valorPis),
          valorCofins: new Prisma.Decimal(totais.valorCofins),
          valorIpi: new Prisma.Decimal(totais.valorIpi),
        },
      });

      if (atualizados.count === 0) {
        // Nota inexistente para o tenant → não altera itens.
        return;
      }

      const total = Math.min(itensPersistidos.length, itensCalculados.length);
      for (let i = 0; i < total; i++) {
        const persistido = itensPersistidos[i];
        const calc = itensCalculados[i];
        await tx.itemNotaFiscal.updateMany({
          where: { id: persistido.id, notaFiscalId: notaId },
          data: {
            cstIcms: calc.cstIcms,
            aliquotaIcms: new Prisma.Decimal(calc.aliquotaIcms ?? 0),
            baseIcms: new Prisma.Decimal(calc.baseIcms ?? 0),
            valorIcms: new Prisma.Decimal(calc.valorIcms ?? 0),
            cstPis: calc.cstPis,
            aliquotaPis: new Prisma.Decimal(calc.aliquotaPis ?? 0),
            basePis: new Prisma.Decimal(calc.basePis ?? 0),
            valorPis: new Prisma.Decimal(calc.valorPis ?? 0),
            cstCofins: calc.cstCofins,
            aliquotaCofins: new Prisma.Decimal(calc.aliquotaCofins ?? 0),
            baseCofins: new Prisma.Decimal(calc.baseCofins ?? 0),
            valorCofins: new Prisma.Decimal(calc.valorCofins ?? 0),
            cstIpi: calc.cstIpi ?? null,
            aliquotaIpi: new Prisma.Decimal(calc.aliquotaIpi ?? 0),
            baseIpi: new Prisma.Decimal(calc.baseIpi ?? 0),
            valorIpi: new Prisma.Decimal(calc.valorIpi ?? 0),
          },
        });
      }
    });

    return this.buscarPorId(tenantId, notaId);
  }

  /**
   * Armazena o XML e protocolo de uma nota autorizada.
   *
   * Escopado por { id, tenantId } (updateMany) para garantir isolamento
   * multi-tenant nas escritas.
   */
  async armazenarAutorizacao(
    tenantId: string,
    notaId: string,
    xmlRetorno: string,
    protocolo: string,
  ) {
    await this.prisma.notaFiscal.updateMany({
      where: { id: notaId, tenantId },
      data: {
        status: 'AUTORIZADA' as any,
        xmlRetorno,
        protocolo,
      },
    });

    return this.buscarPorId(tenantId, notaId);
  }

  /**
   * Busca uma nota fiscal pela chave de acesso.
   */
  async buscarPorChaveAcesso(tenantId: string, chaveAcesso: string) {
    return this.prisma.notaFiscal.findFirst({
      where: { tenantId, chaveAcesso },
      include: { itens: true, eventos: true },
    });
  }

  /**
   * Registra um evento fiscal (cancelamento, CC-e, inutilização).
   */
  async registrarEvento(
    tenantId: string,
    notaId: string,
    tipo: string,
    sequencia: number,
    justificativa: string,
  ) {
    return this.prisma.eventoFiscal.create({
      data: {
        tenantId,
        notaFiscalId: notaId,
        tipo: tipo as any,
        sequencia,
        dataEvento: new Date(),
        justificativa,
        status: 'PENDENTE' as any,
      },
    });
  }

  /**
   * Atualiza status de um evento.
   *
   * Escopado por { id, tenantId } (updateMany) para garantir isolamento
   * multi-tenant.
   */
  async atualizarEvento(
    tenantId: string,
    eventoId: string,
    status: string,
    xmlRetorno?: string,
    protocolo?: string,
  ) {
    await this.prisma.eventoFiscal.updateMany({
      where: { id: eventoId, tenantId },
      data: {
        status: status as any,
        xmlRetorno,
        protocolo,
      },
    });

    return this.prisma.eventoFiscal.findFirst({
      where: { id: eventoId, tenantId },
    });
  }

  /**
   * Obtém o próximo número de nota fiscal de forma ATÔMICA, por
   * tenant/modelo/série, sem risco de duplicidade sob concorrência.
   *
   * Estratégia:
   *  1. `UPDATE sequencias_numeracao SET proximo_numero = proximo_numero + 1
   *     WHERE (tenant, modelo, serie) RETURNING (proximo_numero - 1)`.
   *     O RETURNING devolve o número que ESTA chamada consome; o incremento e
   *     a leitura acontecem numa única instrução, então dois requests
   *     paralelos nunca recebem o mesmo número (o segundo espera o lock de
   *     linha do primeiro).
   *  2. Se a linha ainda não existe, semeia a sequência a partir do
   *     `proximoNumero...` da ConfiguracaoFiscal (compatibilidade com o
   *     contador legado) via INSERT ... ON CONFLICT DO NOTHING, e repete o
   *     passo 1.
   *
   * Tudo dentro de uma transação para consistência com a criação da nota
   * quando chamado por `criarComNumero`.
   *
   * @returns O número inteiro a ser usado nesta emissão.
   */
  async obterProximoNumero(
    tenantId: string,
    serie: string,
    tipo: 'NFE' | 'NFCE',
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const db = tx ?? this.prisma;
    const modelo = tipoParaModelo(tipo);

    // Passo 1: tenta incrementar atomicamente uma sequência já existente.
    const numero = await this.incrementarSequencia(db, tenantId, modelo, serie);
    if (numero !== null) {
      return numero;
    }

    // Passo 2: sequência inexistente → semeia a partir do contador legado da
    // configuração e tenta novamente. O ON CONFLICT DO NOTHING torna a
    // semeadura segura sob concorrência (se outro request semeou primeiro,
    // apenas seguimos para o incremento).
    const config = await db.configuracaoFiscal.findUnique({ where: { tenantId } });
    if (!config) {
      throw new Error('Configuração fiscal não encontrada para o tenant');
    }
    const inicio = tipo === 'NFE' ? config.proximoNumeroNfe : config.proximoNumeroNfce;

    await db.$executeRaw`
      INSERT INTO "sequencias_numeracao"
        ("id", "tenant_id", "modelo", "serie", "proximo_numero", "criado_em", "atualizado_em")
      VALUES
        (gen_random_uuid(), ${tenantId}::uuid, ${modelo}::"ModeloDocumento", ${serie}, ${inicio}, now(), now())
      ON CONFLICT ("tenant_id", "modelo", "serie") DO NOTHING
    `;

    const numeroAposSeed = await this.incrementarSequencia(db, tenantId, modelo, serie);
    if (numeroAposSeed === null) {
      // Não deveria acontecer: acabamos de garantir a existência da linha.
      throw new Error('Falha ao reservar número de nota fiscal (sequência ausente após semeadura)');
    }
    return numeroAposSeed;
  }

  /**
   * Incremento atômico da sequência. Retorna o número consumido por esta
   * chamada, ou null se a linha (tenant, modelo, serie) ainda não existir.
   */
  private async incrementarSequencia(
    db: Prisma.TransactionClient | PrismaService,
    tenantId: string,
    modelo: ModeloDocumento,
    serie: string,
  ): Promise<number | null> {
    const linhas = await db.$queryRaw<Array<{ numero: number }>>`
      UPDATE "sequencias_numeracao"
      SET "proximo_numero" = "proximo_numero" + 1,
          "atualizado_em" = now()
      WHERE "tenant_id" = ${tenantId}::uuid
        AND "modelo" = ${modelo}::"ModeloDocumento"
        AND "serie" = ${serie}
      RETURNING ("proximo_numero" - 1) AS "numero"
    `;

    if (!linhas || linhas.length === 0) {
      return null;
    }
    // Postgres pode retornar bigint/number; normaliza para Number.
    return Number(linhas[0].numero);
  }

  /**
   * Busca itens de uma nota fiscal.
   */
  async buscarItens(notaId: string) {
    return this.prisma.itemNotaFiscal.findMany({
      where: { notaFiscalId: notaId },
    });
  }

  /**
   * Busca eventos de uma nota fiscal.
   */
  async buscarEventos(notaId: string) {
    return this.prisma.eventoFiscal.findMany({
      where: { notaFiscalId: notaId },
      orderBy: { sequencia: 'asc' },
    });
  }
}
