/**
 * Repositório de Regra Fiscal
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarRegraFiscalDto } from '../../dtos/regra-fiscal.dto';

@Injectable()
export class RegraFiscalRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma regra fiscal.
   */
  async criar(tenantId: string, dados: CriarRegraFiscalDto) {
    return this.prisma.regraFiscal.create({
      data: {
        tenantId,
        ...dados,
      } as any,
    });
  }

  /**
   * Obtém uma regra fiscal por ID.
   */
  async obterPorId(tenantId: string, regraId: string) {
    return this.prisma.regraFiscal.findFirst({
      where: {
        id: regraId,
        tenantId,
      },
    });
  }

  /**
   * Lista regras fiscais.
   */
  async listar(tenantId: string, pagina: number = 1, limite: number = 20) {
    const skip = (pagina - 1) * limite;

    const [regras, total] = await Promise.all([
      this.prisma.regraFiscal.findMany({
        where: { tenantId, ativa: true },
        skip,
        take: limite,
        orderBy: { ncm: 'asc' },
      }),
      this.prisma.regraFiscal.count({
        where: { tenantId, ativa: true },
      }),
    ]);

    // Envelope paginado canônico: { dados, total, pagina, limite, totalPaginas }
    return {
      dados: regras,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Atualiza uma regra fiscal.
   *
   * Usa updateMany com filtro por tenantId (defesa em profundidade: garante
   * que uma regra de outro tenant nunca seja alterada, mesmo que o id vaze).
   * count === 0 significa que a regra não existe para este tenant → NotFound.
   */
  async atualizar(tenantId: string, regraId: string, dados: Partial<CriarRegraFiscalDto>) {
    const { count } = await this.prisma.regraFiscal.updateMany({
      where: { id: regraId, tenantId },
      data: dados as any,
    });

    if (count === 0) {
      throw new NotFoundException('Regra fiscal não encontrada');
    }

    return this.obterPorId(tenantId, regraId);
  }

  /**
   * Remove uma regra fiscal (marca como inativa).
   *
   * Usa updateMany com filtro por tenantId (defesa em profundidade).
   * count === 0 significa que a regra não existe para este tenant → NotFound.
   */
  async remover(tenantId: string, regraId: string) {
    const { count } = await this.prisma.regraFiscal.updateMany({
      where: { id: regraId, tenantId },
      data: { ativa: false },
    });

    if (count === 0) {
      throw new NotFoundException('Regra fiscal não encontrada');
    }

    return this.obterPorId(tenantId, regraId);
  }

  /**
   * Busca a regra fiscal mais específica/aplicável.
   * Prioridade: UF Origem + UF Destino + Regime > UF Destino + Regime > NCM + Regime > NCM
   */
  async buscarRegraAplicavel(
    tenantId: string,
    ncm: string,
    ufOrigem?: string,
    ufDestino?: string,
    regimeTributario?: string,
  ) {
    // Tenta encontrar a regra mais específica primeiro
    let regra = await this.prisma.regraFiscal.findFirst({
      where: {
        tenantId,
        ativa: true,
        ncm,
        ufOrigem: ufOrigem || undefined,
        ufDestino: ufDestino || undefined,
        regimeTributario: (regimeTributario || undefined) as any,
      },
    });

    // Se não encontrar, tenta sem UF Origem
    if (!regra && ufDestino && regimeTributario) {
      regra = await this.prisma.regraFiscal.findFirst({
        where: {
          tenantId,
          ativa: true,
          ncm,
          ufDestino,
          regimeTributario: regimeTributario as any,
        },
      });
    }

    // Se não encontrar, tenta apenas com Regime
    if (!regra && regimeTributario) {
      regra = await this.prisma.regraFiscal.findFirst({
        where: {
          tenantId,
          ativa: true,
          ncm,
          regimeTributario: regimeTributario as any,
        },
      });
    }

    // Se não encontrar, tenta com apenas NCM
    if (!regra) {
      regra = await this.prisma.regraFiscal.findFirst({
        where: {
          tenantId,
          ativa: true,
          ncm,
        },
      });
    }

    return regra || null;
  }
}
