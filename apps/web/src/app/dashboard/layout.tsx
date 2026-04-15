/**
 * Layout do Dashboard (área autenticada).
 * Usa DashboardShell para gerenciar responsividade mobile.
 */

import { DashboardShell } from '@/components/layout/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
