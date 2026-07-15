'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * Rota legada. A configuração fiscal foi consolidada em
 * `/dashboard/fiscal/configuracoes` (integrada ao fiscal-service real).
 * Mantemos este redirect para não quebrar links/bookmarks antigos.
 */
export default function ConfiguracaoFiscalRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/fiscal/configuracoes')
  }, [router])

  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-marca-500" />
    </div>
  )
}
