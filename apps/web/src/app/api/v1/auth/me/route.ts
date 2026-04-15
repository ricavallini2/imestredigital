import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-trocar-em-producao-abc123xyz';
const DEMO_TENANT_ID = '10000000-0000-0000-0000-000000000001';

const NOMES: Record<string, string> = {
  'u0000000-0000-0000-0000-000000000001': 'Admin Teste',
  'u0000000-0000-0000-0000-000000000002': 'Gerente Teste',
  'u0000000-0000-0000-0000-000000000003': 'Operador Teste',
  'u0000000-0000-0000-0000-000000000004': 'Visualizador Teste',
};

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization') ?? '';
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    return NextResponse.json({
      id: decoded.sub,
      nome: NOMES[decoded.sub as string] ?? 'Usuário Dev',
      email: decoded.email,
      cargo: decoded.cargo,
      tenantId: DEMO_TENANT_ID,
      status: 'ativo',
      emailVerificado: true,
      tenant: {
        id: DEMO_TENANT_ID,
        nome: 'Empresa Teste LTDA',
        cnpj: '12345678000190',
        plano: 'starter',
        status: 'ativo',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Não autorizado', statusCode: 401 }, { status: 401 });
  }
}
