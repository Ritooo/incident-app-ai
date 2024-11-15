'use client';

import { useIncidentStore, type Incident as IncidentType } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import {
  Code2,
  Database,
  Network,
  Shield,
  Laptop,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface IncidentProps {
  incident: IncidentType;
}

const categoryIcons = {
  frontend: Laptop,
  backend: Code2,
  database: Database,
  network: Network,
  security: Shield,
};

const priorityColors = {
  low: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-red-500/10 text-red-500',
  critical: 'bg-destructive/10 text-destructive',
};

const statusIcons = {
  open: AlertTriangle,
  'in-progress': Clock,
  resolved: CheckCircle2,
};

export function Incident({ incident }: IncidentProps) {
  const setSelectedIncidentId = useIncidentStore((state) => state.setSelectedIncidentId);
  const selectedIncidentId = useIncidentStore((state) => state.selectedIncidentId);
  const Icon = categoryIcons[incident.category];
  const StatusIcon = statusIcons[incident.status];

  return (
    <button
      onClick={() => setSelectedIncidentId(incident.id)}
      className={cn(
        'w-full text-left',
        'bg-card p-4 rounded-lg shadow-sm transition-all',
        'hover:shadow-md',
        'animate-in fade-in-50 duration-100',
        selectedIncidentId === incident.id && 'ring-2 ring-primary'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div className="flex-1 min-w-0 space-y-1">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{incident.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {incident.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={cn('ml-2', priorityColors[incident.priority])}
            >
              {incident.priority}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {incident.status}
            </Badge>
          </div>
          <div className="flex gap-2 items-center text-xs text-muted-foreground">
            <span>{format(new Date(incident.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </button>
  );
}