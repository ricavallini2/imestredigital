/**
 * Health check endpoint para Docker/Kubernetes/load balancer.
 *
 * Retorna 200 OK com status básico do frontend Next.js.
 * Não autenticado - isento do middleware via matcher (exclui /api/).
 */

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      servico: 'web',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 },
  )
}
