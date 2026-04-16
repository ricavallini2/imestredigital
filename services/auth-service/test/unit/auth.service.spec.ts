/**
 * Testes unitários do Auth Service.
 *
 * Testa:
 * - Validação de credenciais
 * - Hash e verificação de senhas
 * - Geração de tokens JWT
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Dados mock reutilizáveis
const TENANT_MOCK = {
  id: 'tenant-uuid-001',
  nome: 'Empresa Teste',
  cnpj: '12345678000190',
  email: 'teste@exemplo.com',
  plano: 'starter',
  status: 'ativo',
};

const USUARIO_MOCK = {
  id: 'usuario-uuid-001',
  tenantId: TENANT_MOCK.id,
  nome: 'Teste',
  email: 'teste@exemplo.com',
  senhaHash: '$2b$12$hashfake',
  cargo: 'admin',
  status: 'ativo',
  emailVerificado: false,
  ultimoLogin: null,
  tenant: TENANT_MOCK,
};

const REFRESH_TOKEN_MOCK = {
  id: 'refresh-uuid-001',
  token: 'uuid-refresh-token',
  usuarioId: USUARIO_MOCK.id,
  revogado: false,
  expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
  usuario: { ...USUARIO_MOCK },
};

describe('AuthService (Unit)', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            tenant: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access-token-mock'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((_key: string, defaultValue?: unknown) => defaultValue),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════
  // REGISTRAR
  // ═══════════════════════════════════════════
  describe('registrar', () => {
    const registrarDto = {
      nome: 'Teste',
      email: 'teste@exemplo.com',
      senha: 'Senha@123',
      nomeEmpresa: 'Empresa Teste',
      cnpj: '12345678000190',
    };

    it('deve registrar um novo tenant com sucesso', async () => {
      // Arrange
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.tenant, 'findFirst').mockResolvedValueOnce(null);
      (prisma.$transaction as jest.Mock).mockImplementationOnce(
        async (fn: (tx: any) => Promise<any>) =>
          fn({
            tenant: { create: jest.fn().mockResolvedValue(TENANT_MOCK) },
            usuario: { create: jest.fn().mockResolvedValue(USUARIO_MOCK) },
          }),
      );
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValueOnce({
        id: 'rt-001',
        token: 'refresh-token',
        usuarioId: USUARIO_MOCK.id,
        expiraEm: new Date(),
        revogado: false,
        criadoEm: new Date(),
        revogadoEm: null,
      } as any);

      // Act
      const resultado = await service.registrar(registrarDto);

      // Assert
      expect(resultado).toHaveProperty('mensagem', 'Empresa registrada com sucesso!');
      expect(resultado).toHaveProperty('accessToken');
      expect(resultado).toHaveProperty('refreshToken');
      expect(resultado.tenant).toMatchObject({ nome: TENANT_MOCK.nome });
      expect(resultado.usuario).toMatchObject({ email: USUARIO_MOCK.email, cargo: 'admin' });
    });

    it('deve lançar ConflictException se email já existe', async () => {
      // Arrange
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce(USUARIO_MOCK as any);

      // Act & Assert
      await expect(service.registrar(registrarDto)).rejects.toThrow('Este email já está cadastrado');
    });

    it('deve lançar ConflictException se CNPJ já existe', async () => {
      // Arrange
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.tenant, 'findFirst').mockResolvedValueOnce(TENANT_MOCK as any);

      // Act & Assert
      await expect(service.registrar(registrarDto)).rejects.toThrow('Este CNPJ já está cadastrado');
    });
  });

  // ═══════════════════════════════════════════
  // LOGIN
  // ═══════════════════════════════════════════
  describe('login', () => {
    const loginDto = { email: 'teste@exemplo.com', senha: 'Senha@123' };

    it('deve fazer login com credenciais válidas', async () => {
      // Arrange
      const senhaHash = await bcrypt.hash('Senha@123', 12);
      const usuarioComHash = { ...USUARIO_MOCK, senhaHash };
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce(usuarioComHash as any);
      jest.spyOn(prisma.usuario, 'update').mockResolvedValueOnce(usuarioComHash as any);
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValueOnce({
        id: 'rt-001',
        token: 'refresh-token',
        usuarioId: USUARIO_MOCK.id,
        expiraEm: new Date(),
        revogado: false,
        criadoEm: new Date(),
        revogadoEm: null,
      } as any);

      // Act
      const resultado = await service.login(loginDto);

      // Assert
      expect(resultado).toHaveProperty('accessToken');
      expect(resultado).toHaveProperty('refreshToken');
      expect(resultado.usuario).toMatchObject({ email: loginDto.email });
      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ ultimoLogin: expect.any(Date) }) }),
      );
    });

    it('deve lançar UnauthorizedException com email inexistente', async () => {
      // Arrange
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('deve lançar UnauthorizedException com senha incorreta', async () => {
      // Arrange
      const senhaHash = await bcrypt.hash('OutraSenha@123', 12);
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce({
        ...USUARIO_MOCK,
        senhaHash,
      } as any);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('deve lançar UnauthorizedException se usuário está inativo', async () => {
      // Arrange
      const senhaHash = await bcrypt.hash('Senha@123', 12);
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce({
        ...USUARIO_MOCK,
        senhaHash,
        status: 'inativo',
      } as any);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow('conta está desativada');
    });

    it('deve lançar UnauthorizedException se tenant está suspenso', async () => {
      // Arrange
      const senhaHash = await bcrypt.hash('Senha@123', 12);
      jest.spyOn(prisma.usuario, 'findUnique').mockResolvedValueOnce({
        ...USUARIO_MOCK,
        senhaHash,
        tenant: { ...TENANT_MOCK, status: 'suspenso' },
      } as any);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow('empresa está com acesso suspenso');
    });
  });

  // ═══════════════════════════════════════════
  // REFRESH TOKEN
  // ═══════════════════════════════════════════
  describe('refresh', () => {
    const refreshDto = { refreshToken: 'uuid-refresh-token' };

    it('deve renovar token com refresh token válido', async () => {
      // Arrange
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValueOnce(REFRESH_TOKEN_MOCK as any);
      jest.spyOn(prisma.refreshToken, 'update').mockResolvedValueOnce({
        ...REFRESH_TOKEN_MOCK,
        revogado: true,
      } as any);
      jest.spyOn(prisma.refreshToken, 'create').mockResolvedValueOnce({
        id: 'rt-002',
        token: 'novo-refresh-token',
        usuarioId: USUARIO_MOCK.id,
        expiraEm: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revogado: false,
        criadoEm: new Date(),
        revogadoEm: null,
      } as any);

      // Act
      const resultado = await service.refresh(refreshDto);

      // Assert
      expect(resultado).toHaveProperty('accessToken');
      expect(resultado).toHaveProperty('refreshToken');
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ revogado: true }) }),
      );
    });

    it('deve lançar UnauthorizedException com refresh token inválido', async () => {
      // Arrange
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.refresh(refreshDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.refresh(refreshDto)).rejects.toThrow('Refresh token inválido');
    });

    it('deve lançar UnauthorizedException com refresh token já revogado', async () => {
      // Arrange
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValueOnce({
        ...REFRESH_TOKEN_MOCK,
        revogado: true,
      } as any);

      // Act & Assert
      await expect(service.refresh(refreshDto)).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException com refresh token expirado', async () => {
      // Arrange
      jest.spyOn(prisma.refreshToken, 'findUnique').mockResolvedValueOnce({
        ...REFRESH_TOKEN_MOCK,
        expiraEm: new Date(Date.now() - 1000), // expirado no passado
      } as any);

      // Act & Assert
      await expect(service.refresh(refreshDto)).rejects.toThrow('Refresh token expirado');
    });
  });
});
