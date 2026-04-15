/**
 * Repositório de Nota Fiscal
 * Encapsula operações de banco de dados com Prisma.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarNotaFiscalDto } from '../../dtos/criar-nota-fiscal.dto';
import { FiltroNotaFiscalDto } from '../../dtos/filtro-nota-fiscal.dto';

@Injectable()
export class NotaFiscalRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova nota fiscal em rascunho.
   */
  async criar(tenantId: string, dados: CriarNotaFiscalDto, chaveAcesso: string) {
    const valorTotal = dados.itens.reduce((sum, item) => sum + item.valorTotal, 0);
    const valorProdutos = dados.itens.reduce((sum, item) => sum + item.valorTotal, 0);
    const valorDesconto = dados.itens.reduce((sum, item) => sum + item.valorDesconto, 0);

    return this.prisma.notaFiscal.create({
      data: {
        tenantId,
        tipo: dados.tipo,
        serie: dados.serie || '1',
        numero: dados.numero || 1,
        chaveAcesso,
        naturezaOperacao: dados.naturezaOperacao,
        dataEmissao: new Date(dados.dataEmissao),
        dataSaida: dados.dataSaida ? new Date(dados.dataSaida) : null,
        status: 'RASCUNHO',
        valorTotal: Math.round(valorTotal),
        valorProdutos: Math.round(valorProdutos),
        valorDesconto: Math.round(valorDesconto),
        valorFrete: dados.valorFrete || 0,
        valorSeguro: dados.valorSeguro || 0,
        valorOutros: dados.valorOutros || 0,
        destinatario: dados.destinatario,
        informacoesAdicionais: dados.informacoesAdicionais,
        pedidoId: dados.pedidoId,
        clienteId: dados.clienteId,
        itens: {
          create: dados.itens.map((item) => ({
            produtoId: item.produtoId,
            descricao: item.descricao,
            ncm: item.ncm,
            cfop: item.cfop,
            unidade: item.unidade,
            quantidade: Math.round(item.quantidade),
            valorUnitario: Math.round(item.valorUnitario),
            valorTotal: Math.round(item.valorTotal),
            valorDesconto: Math.round(item.valorDesconto),
            origemMercadoria: item.origemMercadoria,
            cstIcms: item.cstIcms,
            aliquotaIcms: Math.round(item.aliquotaIcms),
            cstPis: item.cstPis,
            aliquotaPis: Math.round(item.aliquotaPis),
            cstCofins: item.cstCofins,
            aliquotaCofins: Math.round(item.aliquotaCofins),
            cstIpi: item.cstIpi,
            aliquotaIpi: Math.round(item.aliquotaIpi),
          })),
        },
      },
      include: { itens: true, eventos: true },
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

    return {
      notas,
      total,
      pagina: filtros.pagina,
      limite: filtros.limite,
      totalPaginas: Math.ceil(total / filtros.limite),
    };
  }

  /**
   * Atualiza o status de uma nota fiscal.
   */
  async atualizarStatus(tenantId: string, notaId: string, novoStatus: string, dados?: any) {
    return this.prisma.notaFiscal.update({
      where: { id: notaId },
      data: {
        status: novoStatus,
        xmlEnvio: dados?.xmlEnvio,
        xmlRetorno: dados?.xmlRetorno,
        protocolo: dados?.protocolo,
        motivoRejeicao: dados?.motivoRejeicao,
      },
      include: { itens: true },
    });
  }

  /**
   * Armazena o XML e protocolo de uma nota autorizada.
   */
  async armazenarAutorizacao(
    tenantId: string,
    notaId: string,
    xmlRetorno: string,
    protocolo: string,
  ) {
    return this.prisma.notaFiscal.update({
      where: { id: notaId },
      data: {
        status: 'AUTORIZADA',
        xmlRetorno,
        protocolo,
      },
    });
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
        tipo,
        sequencia,
        dataEvento: new Date(),
        justificativa,
        status: 'PENDENTE',
      },
    });
  }

  /**
   * Atualiza status de um evento.
   */
  async atualizarEvento(
    eventoId: string,
    status: string,
    xmlRetorno?: string,
    protocolo?: string,
  ) {
    return this.prisma.eventoFiscal.update({
      where: { id: eventoId },
      data: {
        status,
        xmlRetorno,
        protocolo,
      },
    });
  }

  /**
   * Obtém próximo número de nota fiscal (incrementa).
   */
  async obterProximoNumero(tenantId: string, serie: string, tipo: 'NFE' | 'NFCE') {
    const config = await this.prisma.configuracaoFiscal.findUnique({
      where: { tenantId },
    });

    if (!config) {
      throw new Error('Configuração fiscal não encontrada para o tenant');
    }

    if (tipo === 'NFE') {
      const proximoNumero = config.proximoNumeroNfe;
      // Incrementa para próxima chamada
      await this.prisma.configuracaoFiscal.update({
        where: { tenantId },
        data: { proximoNumeroNfe: proximoNumero + 1 },
      });
      return proximoNumero;
    } else {
      const proximoNumero = config.proximoNumeroNfce;
      await this.prisma.configuracaoFiscal.update({
        where: { tenantId },
        data: { proximoNumeroNfce: proximoNumero + 1 },
      });
      return proximoNumero;
    }
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
