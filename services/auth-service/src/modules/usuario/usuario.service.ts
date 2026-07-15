/**
 * Serviço de Usuários.
 * Lógica de negócio para CRUD de usuários dentro de um tenant.
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service';
import { CriarUsuarioDto } from '../../dtos/usuario/criar-usuario.dto';
import { CargoUsuario } from '../../../generated/client';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lista todos os usuários (exceto removidos) de um tenant */
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
    // Verifica se o email já existe DENTRO deste tenant.
    // A unicidade no banco é @@unique([tenantId, email]); o mesmo email
    // pode existir em tenants diferentes, então a checagem é escopada.
    const existente = await this.prisma.usuario.findFirst({
      where: { tenantId, email: dto.email },
    });

    if (existente) {
      throw new ConflictException('Este email já está cadastrado nesta empresa');
    }

    // Gera senha temporária
    const senhaTemporaria = Math.random().toString(36).slice(-10);
    const senhaHash = await bcrypt.hash(senhaTemporaria, 12);

    // Normaliza o cargo para UPPERCASE (fonte da verdade = enum Prisma).
    // O DTO aceita valores lowercase vindos do frontend.
    const cargo = (dto.cargo || 'operador').toUpperCase();

    const usuario = await this.prisma.usuario.create({
      data: {
        tenantId,
        nome: dto.nome,
        email: dto.email,
        senhaHash,
        cargo: cargo as CargoUsuario,
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

    // O where do update inclui tenantId (via updateMany) para garantir
    // isolamento entre tenants mesmo que o id seja adivinhado.
    await this.prisma.usuario.updateMany({
      where: { id: usuarioId, tenantId },
      data: { status: 'INATIVO' },
    });

    // Revoga todos os tokens do usuário
    await this.prisma.refreshToken.updateMany({
      where: { usuarioId, revogado: false },
      data: { revogado: true, revogadoEm: new Date() },
    });
  }
}
