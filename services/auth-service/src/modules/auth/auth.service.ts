/**
 * Serviço de Autenticação.
 *
 * Lógica central de auth:
 * - Hash e verificação de senhas (bcrypt)
 * - Geração de tokens JWT (access + refresh)
 * - Rotação de refresh tokens
 * - Registro de tenant + admin
 * - Publicação de eventos de auth no Kafka
 */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { Prisma } from '../../../generated/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrarDto } from '../../dtos/auth/registrar.dto';
import { LoginDto } from '../../dtos/auth/login.dto';
import { RefreshTokenDto } from '../../dtos/auth/refresh-token.dto';
import { TrocarSenhaDto } from '../../dtos/auth/trocar-senha.dto';

/** Payload codificado no JWT */
interface JwtPayload {
  sub: string;        // ID do usuário
  tenantId: string;   // ID do tenant (empresa)
  email: string;      // Email do usuário
  cargo: string;      // Cargo/role no sistema
}

@Injectable()
export class AuthService {
  /** Número de rounds para hash bcrypt (custo computacional) */
  private readonly BCRYPT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registra uma nova empresa e seu administrador.
   *
   * Fluxo:
   * 1. Verifica se email e CNPJ já não existem
   * 2. Cria o tenant (empresa)
   * 3. Cria o usuário admin vinculado ao tenant
   * 4. Gera tokens de acesso
   * 5. Publica evento TENANT_CRIADO no Kafka
   *
   * @returns Tokens de acesso + dados do tenant e usuário
   */
  async registrar(dto: RegistrarDto) {
    // Verifica se email já está em uso
    const emailExistente = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (emailExistente) {
      throw new ConflictException('Este email já está cadastrado no sistema');
    }

    // Verifica se CNPJ já está em uso
    if (dto.cnpj) {
      const cnpjExistente = await this.prisma.tenant.findFirst({
        where: { cnpj: dto.cnpj },
      });

      if (cnpjExistente) {
        throw new ConflictException('Este CNPJ já está cadastrado no sistema');
      }
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(dto.senha, this.BCRYPT_ROUNDS);

    // Cria tenant e usuário admin em uma transação atômica
    const resultado = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Cria o tenant (empresa)
      const tenant = await tx.tenant.create({
        data: {
          nome: dto.nomeEmpresa,
          cnpj: dto.cnpj,
          email: dto.email,
          telefone: dto.telefone,
          plano: 'starter', // Plano inicial padrão
          status: 'ativo',
        },
      });

      // Cria o usuário admin do tenant
      const usuario = await tx.usuario.create({
        data: {
          tenantId: tenant.id,
          nome: dto.nome,
          email: dto.email,
          senhaHash,
          cargo: 'admin',     // Administrador do tenant
          status: 'ativo',
          emailVerificado: false,
        },
      });

      return { tenant, usuario };
    });

    // Gera tokens de acesso
    const tokens = await this.gerarTokens({
      sub: resultado.usuario.id,
      tenantId: resultado.tenant.id,
      email: resultado.usuario.email,
      cargo: resultado.usuario.cargo,
    });

    // TODO: Publicar evento TENANT_CRIADO no Kafka
    // TODO: Enviar email de verificação

    return {
      mensagem: 'Empresa registrada com sucesso!',
      tenant: {
        id: resultado.tenant.id,
        nome: resultado.tenant.nome,
        plano: resultado.tenant.plano,
      },
      usuario: {
        id: resultado.usuario.id,
        nome: resultado.usuario.nome,
        email: resultado.usuario.email,
        cargo: resultado.usuario.cargo,
      },
      ...tokens,
    };
  }

  /**
   * Autentica um usuário com email e senha.
   *
   * @returns access_token e refresh_token
   * @throws UnauthorizedException se credenciais forem inválidas
   */
  async login(dto: LoginDto) {
    // Busca usuário pelo email (incluindo dados do tenant)
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { tenant: true },
    });

    // Usuário não encontrado (mensagem genérica por segurança)
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Verifica se o usuário está ativo
    if (usuario.status !== 'ativo') {
      throw new UnauthorizedException('Sua conta está desativada. Entre em contato com o administrador.');
    }

    // Verifica se o tenant está ativo
    if (usuario.tenant.status !== 'ativo') {
      throw new UnauthorizedException('A empresa está com acesso suspenso. Entre em contato com o suporte.');
    }

    // Compara senha informada com o hash armazenado
    const senhaCorreta = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaCorreta) {
      // TODO: Incrementar contador de tentativas e bloquear após 5 falhas
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Atualiza último login
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() },
    });

    // Gera tokens
    const tokens = await this.gerarTokens({
      sub: usuario.id,
      tenantId: usuario.tenantId,
      email: usuario.email,
      cargo: usuario.cargo,
    });

    // TODO: Publicar evento USUARIO_LOGADO no Kafka

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        tenant: {
          id: usuario.tenant.id,
          nome: usuario.tenant.nome,
          plano: usuario.tenant.plano,
        },
      },
      ...tokens,
    };
  }

  /**
   * Renova o access_token usando um refresh_token válido.
   * Implementa rotação de tokens: o refresh_token antigo é invalidado
   * e um novo par (access + refresh) é emitido.
   */
  async refresh(dto: RefreshTokenDto) {
    // Busca o refresh token no banco
    const tokenRegistro = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { usuario: { include: { tenant: true } } },
    });

    // Token não encontrado ou já revogado
    if (!tokenRegistro || tokenRegistro.revogado) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Token expirado
    if (tokenRegistro.expiraEm < new Date()) {
      throw new UnauthorizedException('Refresh token expirado. Faça login novamente.');
    }

    // Revoga o token atual (rotação)
    await this.prisma.refreshToken.update({
      where: { id: tokenRegistro.id },
      data: { revogado: true, revogadoEm: new Date() },
    });

    // Gera novos tokens
    const tokens = await this.gerarTokens({
      sub: tokenRegistro.usuario.id,
      tenantId: tokenRegistro.usuario.tenantId,
      email: tokenRegistro.usuario.email,
      cargo: tokenRegistro.usuario.cargo,
    });

    return tokens;
  }

  /**
   * Retorna o perfil completo do usuário autenticado.
   */
  async obterPerfil(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        tenant: {
          select: {
            id: true,
            nome: true,
            cnpj: true,
            plano: true,
            status: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Remove dados sensíveis antes de retornar
    const { senhaHash, ...perfil } = usuario;
    return perfil;
  }

  /**
   * Troca a senha do usuário logado.
   * Exige a senha atual como confirmação de segurança.
   */
  async trocarSenha(usuarioId: string, dto: TrocarSenhaDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verifica senha atual
    const senhaAtualCorreta = await bcrypt.compare(dto.senhaAtual, usuario.senhaHash);
    if (!senhaAtualCorreta) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(dto.novaSenha, this.BCRYPT_ROUNDS);

    // Atualiza senha
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { senhaHash: novaSenhaHash },
    });

    // Revoga todos os refresh tokens (force re-login em outros dispositivos)
    await this.prisma.refreshToken.updateMany({
      where: { usuarioId, revogado: false },
      data: { revogado: true, revogadoEm: new Date() },
    });

    return { mensagem: 'Senha alterada com sucesso' };
  }

  // ═══════════════════════════════════════════════════════════
  // MÉTODOS PRIVADOS
  // ═══════════════════════════════════════════════════════════

  /**
   * Gera par de tokens (access + refresh).
   *
   * - access_token: JWT com duração curta (1h), usado em cada requisição
   * - refresh_token: UUID armazenado no banco, duração longa (7d)
   */
  private async gerarTokens(payload: JwtPayload) {
    // Access token (JWT assinado)
    const accessToken = this.jwtService.sign(payload);

    // Refresh token (UUID aleatório, armazenado no banco)
    const refreshToken = uuidv4();
    const diasRefresh = parseInt(
      this.configService.get('JWT_REFRESH_EXPIRATION', '7'),
      10,
    );

    // Salva refresh token no banco
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        usuarioId: payload.sub,
        expiraEm: new Date(Date.now() + diasRefresh * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
    };
  }
}
