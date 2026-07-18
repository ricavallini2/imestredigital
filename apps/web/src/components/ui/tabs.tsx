'use client';

/**
 * Abas com CONTEÚDO embutido (variante do padrão que também gerencia o corpo).
 *
 * A navegação é delegada ao componente `Abas` para que o visual seja EXATAMENTE
 * o mesmo das telas que controlam o conteúdo por fora (Produto, Cliente, etc.) —
 * uma única fonte da verdade do estilo de abas do ERP.
 */

import { ReactNode, useState } from 'react';
import { Abas } from './abas';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-4">
      <Abas
        abas={tabs.map((t) => ({ id: t.id, label: t.label, icone: t.icon }))}
        ativa={activeTab}
        onChange={handleTabChange}
      />
      <div className="animate-fade-in">{activeTabContent?.content}</div>
    </div>
  );
}
