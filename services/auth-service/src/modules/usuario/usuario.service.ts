/**
 * Serviço de Usuários.
 * CRUD de usuários do tenant + matriz de permissões por módulo.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import {
  CriarUsuarioDto,
  AtualizarUsuarioDto,
  DefinirPermissoesDto,
} from '../../dtos/usuario/criar-usuario.dto';
import { CargoUsuario, StatusUsuario } from '../../../generated/client';
import { MODULOS, ACOES, templatePorCargo, CHAVES_MODULOS } from './permissoes.catalogo';

/** Campos públicos do usuário (nunca expõe senhaHash). */
const SELECT_USUARIO = {
  id: true,
  nome: true,
  email: true,
  cargo: true,
  status: true,
  podeLiberarVenda: true,
  ultimoLogin: true,
  criadoEm: true,
} as const;

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Catálogo de módulos + ações (a tela monta a matriz a partir daqui). */
  obterCatalogo() {
    return { modulos: MODULOS, acoes: ACOES };
  }

  /** Lista os usuários do tenant (exceto removidos). */
  async listarPorTenant(tenantId: string) {
    const usuarios = await this.prisma.usuario.findMany({
      where: { tenantId, status: { not: 'REMOVIDO' } },
      select: SELECT_USUARIO,
      orderBy: { nome: 'asc' },
    });

    return { dados: usuarios, total: usuarios.length };
  }

  /** Usuário do tenant com a matriz de permissões. */
  async obterPorId(tenantId: string, usuarioId: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, tenantId, status: { not: 'REMOVIDO' } },
      select: { ...SELECT_USUARIO, permissoes: true },
    });

    if (!usuario) throw new NotFoundException('Usuário não encontrado nesta empresa');

    return { ...usuario, permissoes: this.normalizarMatriz(usuario.permissoes) };
  }

  /** Dados + permissões do usuário logado (a UI usa para liberar/ocultar ações). */
  async obterMe(tenantId: string, usuarioId: string) {
    return this.obterPorId(tenantId, usuarioId);
  }

  /**
   * Completa a matriz com os módulos que ainda não têm linha no banco
   * (ex: módulo novo criado depois do usuário) — sempre negando por padrão.
   */
  private normalizarMatriz(
    persistidas: Array<{
      modulo: string;
      visualizar: boolean;
      incluir: boolean;
      editar: boolean;
      excluir: boolean;
    }>,
  ) {
    return CHAVES_MODULOS.map((modulo) => {
      const p = persistidas.find((x) => x.modulo === modulo);
      return {
        modulo,
        visualizar: p?.visualizar ?? false,
        incluir: p?.incluir ?? false,
        editar: p?.editar ?? false,
        excluir: p?.excluir ?? false,
      };
    });
  }

  /** Cria um usuário no tenant já com o template de permissões do cargo. */
  async criar(tenantId: string, dto: CriarUsuarioDto) {
    const email = dto.email.trim().toLowerCase();

    // Unicidade é por tenant (@@unique([tenantId, email])).
    const existente = await this.prisma.usuario.findFirst({ where: { tenantId, email } });
    if (existente) {
      throw new ConflictException('Este email já está cadastrado nesta empresa');
    }

    // Senha definida pelo admin ou gerada (devolvida UMA vez na resposta).
    const senhaGerada = dto.senha ? null : Math.random().toString(36).slice(-10) + 'A1';
    const senhaHash = await bcrypt.hash(dto.senha ?? senhaGerada!, 12);

    const cargo = (dto.cargo || 'funcionario').toUpperCase() as CargoUsuario;

    const usuario = await this.prisma.usuario.create({
      data: {
        tenantId,
        nome: dto.nome,
        email,
        senhaHash,
        cargo,
        // Senha já definida → usuário entra ativo (não há fluxo de convite por email ainda).
        status: 'ATIVO',
        podeLiberarVenda: dto.podeLiberarVenda ?? false,
        permissoes: { create: templatePorCargo(cargo) },
      },
      select: SELECT_USUARIO,
    });

    return { usuario, senhaGerada };
  }

  /** Atualiza dados do usuário; opcionalmente reaplica o template do novo cargo. */
  async atualizar(tenantId: string, usuarioId: string, dto: AtualizarUsuarioDto) {
    const atual = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, tenantId, status: { not: 'REMOVIDO' } },
    });
    if (!atual) throw new NotFoundException('Usuário não encontrado nesta empresa');

    const data: Record<string, unknown> = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.podeLiberarVenda !== undefined) data.podeLiberarVenda = dto.podeLiberarVenda;
    if (dto.status !== undefined) data.status = dto.status.toUpperCase() as StatusUsuario;
    if (dto.senha) data.senhaHash = await bcrypt.hash(dto.senha, 12);

    const novoCargo = dto.cargo ? (dto.cargo.toUpperCase() as CargoUsuario) : null;
    if (novoCargo) data.cargo = novoCargo;

    await this.prisma.usuario.update({ where: { id: usuarioId }, data });

    // Trocar o cargo NÃO mexe nas permissões, a menos que peçam explicitamente
    // (senão um ajuste fino feito pelo gerente seria perdido sem aviso).
    if (novoCargo && dto.reaplicarTemplateCargo) {
      await this.definirPermissoes(tenantId, usuarioId, {
        permissoes: templatePorCargo(novoCargo),
      });
    }

    // Senha trocada ou usuário desativado → derruba as sessões abertas.
    if (dto.senha || (dto.status && dto.status.toUpperCase() !== 'ATIVO')) {
      await this.revogarTokens(usuarioId);
    }

    return this.obterPorId(tenantId, usuarioId);
  }

  /** Substitui a matriz de permissões do usuário (upsert por módulo). */
  async definirPermissoes(tenantId: string, usuarioId: string, dto: DefinirPermissoesDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, tenantId, status: { not: 'REMOVIDO' } },
      select: { id: true },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado nesta empresa');

    const duplicados = dto.permissoes.length !== new Set(dto.permissoes.map((p) => p.modulo)).size;
    if (duplicados) throw new BadRequestException('Módulo repetido na matriz de permissões');

    await this.prisma.$transaction(
      dto.permissoes.map((p) =>
        this.prisma.permissaoUsuario.upsert({
          where: { usuarioId_modulo: { usuarioId, modulo: p.modulo } },
          create: {
            usuarioId,
            modulo: p.modulo,
            visualizar: p.visualizar,
            incluir: p.incluir,
            editar: p.editar,
            excluir: p.excluir,
          },
          update: {
            visualizar: p.visualizar,
            incluir: p.incluir,
            editar: p.editar,
            excluir: p.excluir,
          },
        }),
      ),
    );

    return this.obterPorId(tenantId, usuarioId);
  }

  /** Desativa um usuário (soft delete) e revoga suas sessões. */
  async desativar(tenantId: string, usuarioId: string, solicitanteId?: string) {
    if (solicitanteId && solicitanteId === usuarioId) {
      throw new BadRequestException('Você não pode desativar o próprio usuário');
    }

    const usuario = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, tenantId },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado nesta empresa');

    // updateMany com tenantId garante isolamento mesmo se o id for adivinhado.
    await this.prisma.usuario.updateMany({
      where: { id: usuarioId, tenantId },
      data: { status: 'INATIVO' },
    });

    await this.revogarTokens(usuarioId);
  }

  private async revogarTokens(usuarioId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { usuarioId, revogado: false },
      data: { revogado: true, revogadoEm: new Date() },
    });
  }
}
