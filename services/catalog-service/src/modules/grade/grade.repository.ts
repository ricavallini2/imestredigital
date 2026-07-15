/**
 * Repositório de Grades de Tamanhos (multi-tenancy).
 *
 * Todas as queries incluem filtro por tenantId para garantir isolamento total
 * entre empresas. A grade é POR TENANT: o unique é ([tenantId, nome]).
 *
 * Os tamanhos são sempre retornados ordenados por `ordem` (a sequência de
 * varejo nem sempre é ordenável — ex: PP, P, M, G, GG).
 */

import { Injectable } from '@nestjs/common'
import { Prisma } from '../../../generated/client'

import { PrismaService } from '../prisma/prisma.service'
import { ListarGradesDto } from '../../dtos/grade/listar-grades.dto'

/** Include padrão: tamanhos sempre ordenados por `ordem`. */
const INCLUDE_GRADE = {
  tamanhos: { orderBy: { ordem: 'asc' } },
} satisfies Prisma.GradeInclude

/** Tamanho normalizado (valor + posição na lista) usado nas operações de escrita. */
export interface TamanhoOrdenado {
  valor: string
  ordem: number
}

@Injectable()
export class GradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria a grade e seus tamanhos numa única operação aninhada. */
  async criar(
    tenantId: string,
    dados: { nome: string; descricao?: string; ativa: boolean; tamanhos: TamanhoOrdenado[] },
  ) {
    return this.prisma.grade.create({
      data: {
        tenantId,
        nome: dados.nome,
        descricao: dados.descricao ?? null,
        ativa: dados.ativa,
        tamanhos: {
          create: dados.tamanhos.map((t) => ({ valor: t.valor, ordem: t.ordem })),
        },
      },
      include: INCLUDE_GRADE,
    })
  }

  /** Lista grades do tenant com paginação e filtros (envelope canônico). */
  async listar(tenantId: string, filtros: ListarGradesDto) {
    const { pagina = 1, itensPorPagina = 20, busca, ativa } = filtros
    const skip = (pagina - 1) * itensPorPagina

    const where: Prisma.GradeWhereInput = { tenantId }

    if (busca) {
      where.nome = { contains: busca, mode: 'insensitive' }
    }

    if (typeof ativa === 'boolean') where.ativa = ativa

    const [dados, total] = await Promise.all([
      this.prisma.grade.findMany({
        where,
        skip,
        take: itensPorPagina,
        include: INCLUDE_GRADE,
        orderBy: { nome: 'asc' },
      }),
      this.prisma.grade.count({ where }),
    ])

    // Envelope paginado canônico: { dados, total, pagina, limite, totalPaginas }
    return {
      dados,
      total,
      pagina,
      limite: itensPorPagina,
      totalPaginas: Math.ceil(total / itensPorPagina),
    }
  }

  /** Busca grade por ID dentro do tenant (com tamanhos ordenados). */
  async buscarPorId(tenantId: string, id: string) {
    return this.prisma.grade.findFirst({
      where: { id, tenantId },
      include: INCLUDE_GRADE,
    })
  }

  /** Busca grade por nome dentro do tenant (verificação de unicidade). */
  async buscarPorNome(tenantId: string, nome: string) {
    return this.prisma.grade.findFirst({
      where: { tenantId, nome },
    })
  }

  /**
   * Atualiza os metadados da grade (nome/descricao/ativa) e, quando `tamanhos`
   * é fornecido, faz a SUBSTITUIÇÃO INTELIGENTE dentro de uma transação:
   *  - preserva os tamanhos cujo `valor` permanece (atualiza apenas a `ordem`);
   *  - remove os que saíram da lista;
   *  - cria os novos;
   * garantindo que o unique ([gradeId, valor]) nunca seja violado.
   *
   * @param novosTamanhos quando `undefined`, os tamanhos não são tocados.
   */
  async atualizar(
    tenantId: string,
    id: string,
    dados: Partial<{ nome: string; descricao: string | null; ativa: boolean }>,
    novosTamanhos?: TamanhoOrdenado[],
  ) {
    await this.prisma.$transaction(async (tx) => {
      // 1. Metadados (escopado por tenant para não vazar entre empresas).
      if (Object.keys(dados).length > 0) {
        await tx.grade.updateMany({
          where: { id, tenantId },
          data: dados,
        })
      }

      // 2. Substituição inteligente dos tamanhos (apenas se enviados).
      if (novosTamanhos) {
        const atuais = await tx.gradeTamanho.findMany({ where: { gradeId: id } })
        const atuaisPorValor = new Map(atuais.map((t) => [t.valor, t]))
        const valoresNovos = new Set(novosTamanhos.map((t) => t.valor))

        // Remove os que não estão mais presentes.
        const idsRemover = atuais.filter((t) => !valoresNovos.has(t.valor)).map((t) => t.id)
        if (idsRemover.length > 0) {
          await tx.gradeTamanho.deleteMany({ where: { id: { in: idsRemover } } })
        }

        // Upsert por valor: atualiza a ordem dos que ficam, cria os novos.
        for (const t of novosTamanhos) {
          const existente = atuaisPorValor.get(t.valor)
          if (existente) {
            if (existente.ordem !== t.ordem) {
              await tx.gradeTamanho.update({
                where: { id: existente.id },
                data: { ordem: t.ordem },
              })
            }
          } else {
            await tx.gradeTamanho.create({
              data: { gradeId: id, valor: t.valor, ordem: t.ordem },
            })
          }
        }
      }
    })

    return this.buscarPorId(tenantId, id)
  }

  /** Soft delete: marca a grade como inativa. */
  async desativar(tenantId: string, id: string) {
    return this.prisma.grade.updateMany({
      where: { id, tenantId },
      data: { ativa: false },
    })
  }
}
