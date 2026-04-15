/**
 * Rota de login para desenvolvimento local.
 * Funciona sem o auth-service (sem PostgreSQL/Docker).
 *
 * Credenciais de dev:
 *   teste@teste.com        / Senha123  (admin)
 *   gerente@teste.com      / Senha123  (gerente)
 *   operador@teste.com     / Senha123  (operador)
 *   visualizador@teste.com / Senha123  (visualizador)
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-trocar-em-producao-abc123xyz';
const DEMO_TENANT_ID = '10000000-0000-0000-0000-000000000001';

const DEV_USERS: Record<string, { id: string; nome: string; cargo: string; senha: string }> = {
  'teste@teste.com': {
    id: 'u0000000-0000-0000-0000-000000000001',
    nome: 'Admin Teste',
    cargo: 'admin',
    senha: 'Senha123',
  },
  'gerente@teste.com': {
    id: 'u0000000-0000-0000-0000-000000000002',
    nome: 'Gerente Teste',
    cargo: 'gerente',
    senha: 'Senha123',
  },
  'operador@teste.com': {
    id: 'u0000000-0000-0000-0000-000000000003',
    nome: 'Operador Teste',
    cargo: 'operador',
    senha: 'Senha123',
  },
  'visualizador@teste.com': {
    id: 'u0000000-0000-0000-0000-000000000004',
    nome: 'Visualizador Teste',
    cargo: 'visualizador',
    senha: 'Senha123',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, senha } = body as { email: string; senha: string };

    const usuario = DEV_USERS[email?.toLowerCase()];

    if (!usuario || usuario.senha !== senha) {
      return NextResponse.json(
        { message: 'Email ou senha incorretos', statusCode: 401 },
        { status: 401 },
      );
    }

    const payload = {
      sub: usuario.id,
      tenantId: DEMO_TENANT_ID,
      email,
      cargo: usuario.cargo,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: usuario.id, type: 'refresh' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresIn: 3600,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email,
        cargo: usuario.cargo,
        tenantId: DEMO_TENANT_ID,
        status: 'ativo',
        emailVerificado: true,
      },
      tenant: {
        id: DEMO_TENANT_ID,
        nome: 'Empresa Teste LTDA',
        cnpj: '12345678000190',
        plano: 'starter',
        status: 'ativo',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Erro interno', statusCode: 500 }, { status: 500 });
  }
}
