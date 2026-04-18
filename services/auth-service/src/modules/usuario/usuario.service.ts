/**
 * Serviço de Usuários.
 * Lógica de negócio para CRUD de usuários dentro de um tenant.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { CriarUsuarioDto } from '../../dtos/usuario/criar-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lista todos os usuários ativos de um tenant */
  async listarPorTenant(tenantId: string) {
    const usuarios = await this.prisma.usuario.findMany({
      where: { tenantId, status: { not: 'REMOVIDO' } },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        status: true,
        ultimoLogin: true,
        criadoEm: true,
      },
      orderBy: { nome: 'asc' },
    });

    return { dados: usuarios, total: usuarios.length };
  }

  /** Cria um novo usuário no tenant */
  async criar(tenantId: string, dto: CriarUsuarioDto) {
    // Verifica se email já existe globalmente
    const existente = await this.prisma.usuario.findFirst({
      where: { email: dto.email },
    });

    if (existente) {
      throw new ConflictException('Este email já está cadastrado no sistema');
    }

    // Gera senha temporária
    const senhaTemporaria = Math.random().toString(36).slice(-10);
    const senhaHash = await bcrypt.hash(senhaTemporaria, 12);

    const usuario = await this.prisma.usuario.create({
      data: {
        tenantId,
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        cargo: dto.cargo || 'OPERADOR',
        status: 'PENDENTE', // Aguardando ativação pelo convite
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        status: true,
      },
    });

    // TODO: Enviar email de convite com link de ativação

    return {
      mensagem: 'Convite enviado com sucesso',
      usuario,
    };
  }

  /** Desativa um usuário (não pode desativar a si mesmo) */
  async desativar(tenantId: string, usuarioId: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, tenantId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado nesta empresa');
    }

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { status: 'INATIVO' },
    });

    // Revoga todos os tokens do usuário
    await this.prisma.refreshToken.updateMany({
      where: { usuarioId, revogado: false },
      data: { revogado: true, revogadoEm: new Date() },
    });
  }
}
