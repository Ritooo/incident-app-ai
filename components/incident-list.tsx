'use client';

import { useEffect } from 'react';
import { useIncidentStore, type Category } from '@/lib/store';
import { Incident } from '@/components/incident';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function IncidentList() {
  const {
    incidents,
    aiSolution,
    setAiSolution,
    selectedCategory,
    setSelectedCategory,
  } = useIncidentStore();
  const { toast } = useToast();
  const [showSolution, setShowSolution] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAiSolution = async (description: string, category: Category) => {
    try {
      const response = await fetch(
        `/api/suggest?category=${category}&description=${encodeURIComponent(
          description
        )}`
      );
      const data = await response.json();
      if (data.solution) {
        setAiSolution(data.solution);
        setShowSolution(true);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI solution',
        variant: 'destructive',
      });
    }
  };

  const filteredIncidents = incidents
    .filter(
      (incident) =>
        (selectedCategory === 'all' || incident.category === selectedCategory) &&
        (searchQuery === '' ||
          incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as Category | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Incident
            key={incident.id}
            incident={incident}
            onRequestSolution={() =>
              fetchAiSolution(incident.description, incident.category)
            }
          />
        ))}
        {filteredIncidents.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No incidents found.
          </p>
        )}
      </div>

      <Dialog open={showSolution} onOpenChange={setShowSolution}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI-Suggested Solution</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {aiSolution}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}