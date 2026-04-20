/**
 * Repositório de Regra Fiscal
 */

import { Injectable } from '@nestjs/common';
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

    return {
      regras,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Atualiza uma regra fiscal.
   */
  async atualizar(tenantId: string, regraId: string, dados: Partial<CriarRegraFiscalDto>) {
    return this.prisma.regraFiscal.update({
      where: { id: regraId },
      data: dados as any,
    });
  }

  /**
   * Remove uma regra fiscal (marca como inativa).
   */
  async remover(tenantId: string, regraId: string) {
    return this.prisma.regraFiscal.update({
      where: { id: regraId },
      data: { ativa: false },
    });
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
