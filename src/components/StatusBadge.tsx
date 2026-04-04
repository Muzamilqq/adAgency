import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'paused' | 'completed' | 'draft' | 'scheduled';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 text-white',
      label: 'Active',
    },
    paused: {
      variant: 'secondary' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      label: 'Paused',
    },
    completed: {
      variant: 'secondary' as const,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
      label: 'Completed',
    },
    draft: {
      variant: 'outline' as const,
      className: 'border-gray-400 text-gray-600',
      label: 'Draft',
    },
    scheduled: {
      variant: 'secondary' as const,
      className: 'bg-purple-500 hover:bg-purple-600 text-white',
      label: 'Scheduled',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
