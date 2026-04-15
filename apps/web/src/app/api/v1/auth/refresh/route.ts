import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-trocar-em-producao-abc123xyz';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;

    const accessToken = jwt.sign(
      { sub: decoded.sub, tenantId: decoded.tenantId, email: decoded.email, cargo: decoded.cargo },
      JWT_SECRET,
      { expiresIn: '1h' },
    );
    const newRefreshToken = jwt.sign({ sub: decoded.sub, type: 'refresh' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return NextResponse.json({ accessToken, refreshToken: newRefreshToken, expiresIn: 3600 });
  } catch {
    return NextResponse.json({ message: 'Refresh token inválido', statusCode: 401 }, { status: 401 });
  }
}
