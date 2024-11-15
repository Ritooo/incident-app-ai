'use client';

import { useEffect } from 'react';
import { useTodoStore, type Category } from '@/lib/store';
import { Todo } from '@/components/todo';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TodoList() {
  const {
    todos,
    aiSuggestion,
    setAiSuggestion,
    addTodo,
    selectedCategory,
    setSelectedCategory,
  } = useTodoStore();
  const { toast } = useToast();

  const fetchAiSuggestion = async () => {
    try {
      const category = selectedCategory !== 'all' ? selectedCategory : null;
      const response = await fetch(
        `/api/suggest${category ? `?category=${category}` : ''}`
      );
      const data = await response.json();
      if (data.suggestion) {
        setAiSuggestion(data.suggestion);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI suggestion',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!aiSuggestion) {
      fetchAiSuggestion();
    }
  }, [aiSuggestion, selectedCategory]);

  const handleAddAiSuggestion = () => {
    if (aiSuggestion) {
      addTodo({
        text: aiSuggestion,
        completed: false,
        category: (selectedCategory !== 'all'
          ? selectedCategory
          : 'personal') as Category,
        priority: 'medium',
      });
      setAiSuggestion(null);
      toast({
        title: 'Success',
        description: 'AI suggestion added to your todos!',
      });
    }
  };

  const filteredTodos = todos.filter(
    (todo) => selectedCategory === 'all' || todo.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as Category | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAiSuggestion(null)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          New Suggestion
        </Button>
      </div>

      {aiSuggestion && (
        <div className="bg-primary/5 p-4 rounded-lg space-y-2 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">AI Suggested Task</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAiSuggestion}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Add to List
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{aiSuggestion}</p>
        </div>
      )}

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
        {filteredTodos.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No tasks yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}