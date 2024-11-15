'use client';

import { useTodoStore, type Todo as TodoType } from '@/lib/store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Calendar,
  GraduationCap,
  Heart,
  Briefcase,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoProps {
  todo: TodoType;
}

const categoryIcons = {
  personal: Brain,
  work: Briefcase,
  health: Heart,
  learning: GraduationCap,
  other: MoreVertical,
};

const priorityColors = {
  low: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-red-500/10 text-red-500',
};

export function Todo({ todo }: TodoProps) {
  const { toggleTodo, removeTodo } = useTodoStore();
  const Icon = categoryIcons[todo.category];

  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-card p-4 rounded-lg shadow-sm transition-all',
        'hover:shadow-md hover:scale-[1.01]',
        'animate-in fade-in-50 duration-100'
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
      />
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn('text-sm truncate', {
              'line-through text-muted-foreground': todo.completed,
            })}
          >
            {todo.text}
          </p>
          <Badge
            variant="secondary"
            className={cn('ml-2', priorityColors[todo.priority])}
          >
            {todo.priority}
          </Badge>
        </div>
        <div className="flex gap-2 items-center text-xs text-muted-foreground">
          <span>{format(new Date(todo.createdAt), 'MMM d, yyyy')}</span>
          {todo.dueDate && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due {format(new Date(todo.dueDate), 'MMM d')}
              </span>
            </>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeTodo(todo.id)}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}