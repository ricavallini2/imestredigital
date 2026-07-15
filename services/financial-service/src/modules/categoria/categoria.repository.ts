/**
 * Repository para operações com Categorias Financeiras.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TipoCategoriaFinanceira } from '../../../generated/client';

interface CriarCategoriaInput {
  tenantId: string;
  nome: string;
  tipo: string;
  icone?: string;
  cor?: string;
  paiId?: string;
  ativa?: boolean;
}

@Injectable()
export class CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova categoria.
   */
  async criar(dados: CriarCategoriaInput) {
    return this.prisma.categoriaFinanceira.create({
      data: {
        tenantId: dados.tenantId,
        nome: dados.nome,
        tipo: dados.tipo as TipoCategoriaFinanceira,
        icone: dados.icone,
        cor: dados.cor,
        paiId: dados.paiId,
        ativa: dados.ativa !== false,
      },
    });
  }

  /**
   * Busca categoria por ID.
   */
  async buscarPorId(id: string, tenantId: string) {
    return this.prisma.categoriaFinanceira.findFirst({
      where: { id, tenantId },
      include: {
        filhos: true,
        pai: true,
      },
    });
  }

  /**
   * Lista categorias do tenant por tipo.
   */
  async listarPorTipo(tenantId: string, tipo: string, apenasAtivas: boolean = true) {
    const where: any = { tenantId, tipo };
    if (apenasAtivas) where.ativa = true;

    return this.prisma.categoriaFinanceira.findMany({
      where,
      include: {
        filhos: true,
        pai: true,
      },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Obtém árvore hierárquica de categorias.
   */
  async obterArvore(tenantId: string, tipo: string) {
    const categorias = await this.listarPorTipo(tenantId, tipo, true);

    // Filtrar apenas categorias pai (sem paiId)
    const pais = categorias.filter((c) => !c.paiId);

    return pais.map((pai) => ({
      ...pai,
      filhos: categorias.filter((c) => c.paiId === pai.id),
    }));
  }

  /**
   * Atualiza categoria.
   *
   * Usa updateMany com { id, tenantId } para impedir escrita
   * cross-tenant e retorna o registro já filtrado por tenant.
   */
  async atualizar(id: string, tenantId: string, dados: Partial<CriarCategoriaInput>) {
    const data: Prisma.CategoriaFinanceiraUpdateManyMutationInput = {
      atualizadoEm: new Date(),
    }

    if (dados.nome !== undefined) data.nome = dados.nome
    if (dados.tipo !== undefined) data.tipo = dados.tipo as TipoCategoriaFinanceira
    if (dados.icone !== undefined) data.icone = dados.icone
    if (dados.cor !== undefined) data.cor = dados.cor
    if (dados.ativa !== undefined) data.ativa = dados.ativa

    await this.prisma.categoriaFinanceira.updateMany({
      where: { id, tenantId },
      data,
    });

    return this.buscarPorId(id, tenantId);
  }

  /**
   * Desativa categoria.
   */
  async desativar(id: string, tenantId: string) {
    return this.atualizar(id, tenantId, { ativa: false });
  }

  /**
   * Busca categorias filhas.
   */
  async buscarFilhas(paiId: string) {
    return this.prisma.categoriaFinanceira.findMany({
      where: { paiId },
      orderBy: { nome: 'asc' },
    });
  }
}
