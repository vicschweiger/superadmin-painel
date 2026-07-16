import React from 'react';
import { BadgeCheck, BadgeAlert, BadgeX } from 'lucide-react';
import type { PaymentStatus } from '../../types/company.ts';

interface StatusBadgeProps {
  status: PaymentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    active: { text: 'Ativo', icon: <BadgeCheck size={14} />, classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    pending: { text: 'Pendente', icon: <BadgeAlert size={14} />, classes: 'bg-amber-50 text-amber-700 border border-amber-200' },
    suspended: { text: 'Suspenso', icon: <BadgeX size={14} />, classes: 'bg-rose-50 text-rose-700 border border-rose-200' },
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold shadow-sm transition-colors ${config.classes}`}>
      {config.icon}
      {config.text}
    </span>
  );
};