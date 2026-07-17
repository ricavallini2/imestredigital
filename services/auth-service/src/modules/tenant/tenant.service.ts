/**
 * Serviço de Tenants.
 * Lógica de negócio para gerenciamento de empresas.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/client';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarTenantDto } from '../../dtos/tenant/atualizar-tenant.dto';

/** Nó da ordem persistida do menu — só id e ordem dos filhos, nada de UI. */
interface NoOrdemMenu {
  id: string;
  filhos?: NoOrdemMenu[];
}

const MENU_PROFUNDIDADE_MAX = 5;
const MENU_NOS_MAX_POR_NIVEL = 100;

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  /** Busca um tenant pelo ID */
  async buscarPorId(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: { select: { usuarios: true } },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return tenant;
  }

  /** Atualiza dados de um tenant */
  async atualizar(id: string, dto: AtualizarTenantDto) {
    await this.buscarPorId(id); // Verifica existência

    return this.prisma.tenant.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Ordem do menu lateral do tenant (ou null se nunca configurada).
   * Guardada dentro do JSON `configuracoes.menuLateral`.
   */
  async obterMenu(id: string): Promise<{ ordem: NoOrdemMenu[] | null }> {
    const tenant = await this.buscarPorId(id);
    const cfg = this.configComoObjeto(tenant.configuracoes);
    const ordem = cfg.menuLateral;
    return { ordem: Array.isArray(ordem) ? (ordem as NoOrdemMenu[]) : null };
  }

  /**
   * Salva a ordem do menu (admin/gerente). Só persiste id + aninhamento —
   * sanitizado (profundidade e nós limitados) para nunca gravar payload arbitrário.
   * Faz merge no JSON `configuracoes` sem apagar outras chaves.
   */
  async salvarMenu(id: string, ordem: unknown): Promise<{ ordem: NoOrdemMenu[] }> {
    const tenant = await this.buscarPorId(id);
    const cfg = this.configComoObjeto(tenant.configuracoes);
    const limpa = this.sanitizarOrdem(ordem, 0);
    cfg.menuLateral = limpa;
    await this.prisma.tenant.update({
      where: { id },
      data: { configuracoes: cfg as Prisma.InputJsonValue },
    });
    return { ordem: limpa };
  }

  /** `configuracoes` como objeto mutável (nunca array/null → sempre {}). */
  private configComoObjeto(valor: unknown): Record<string, unknown> {
    return valor && typeof valor === 'object' && !Array.isArray(valor)
      ? { ...(valor as Record<string, unknown>) }
      : {};
  }

  /** Mantém só { id: string, filhos?: [...] }, recursivo, com limites rígidos. */
  private sanitizarOrdem(nos: unknown, profundidade: number): NoOrdemMenu[] {
    if (profundidade > MENU_PROFUNDIDADE_MAX || !Array.isArray(nos)) return [];
    const saida: NoOrdemMenu[] = [];
    for (const n of nos) {
      if (!n || typeof n !== 'object') continue;
      const id = (n as { id?: unknown }).id;
      if (typeof id !== 'string' || id.length === 0) continue;
      const no: NoOrdemMenu = { id: id.slice(0, 120) };
      const filhos = (n as { filhos?: unknown }).filhos;
      if (Array.isArray(filhos) && filhos.length > 0) {
        no.filhos = this.sanitizarOrdem(filhos, profundidade + 1);
      }
      saida.push(no);
      if (saida.length >= MENU_NOS_MAX_POR_NIVEL) break;
    }
    return saida;
  }
}
