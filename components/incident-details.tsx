'use client';

import { useIncidentStore, type Category, type Priority, type Status } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IncidentDetailsProps {
  id: string;
}

export function IncidentDetails({ id }: IncidentDetailsProps) {
  const incident = useIncidentStore((state) => 
    state.incidents.find((inc) => inc.id === id)
  );
  const { updateIncident, removeIncident, aiSolution, setAiSolution } = useIncidentStore();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(incident?.title || '');
  const [description, setDescription] = useState(incident?.description || '');
  const [category, setCategory] = useState<Category>(incident?.category || 'frontend');
  const [priority, setPriority] = useState<Priority>(incident?.priority || 'medium');
  const [status, setStatus] = useState<Status>(incident?.status || 'open');
  const [showSolution, setShowSolution] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (incident) {
      setTitle(incident.title);
      setDescription(incident.description);
      setCategory(incident.category);
      setPriority(incident.priority);
      setStatus(incident.status);
    }
  }, [incident]);

  if (!incident) return null;

  const handleUpdate = () => {
    updateIncident(id, {
      title,
      description,
      category,
      priority,
      status,
    });
    toast({
      title: 'Success',
      description: 'Incident updated successfully',
    });
  };

  const handleDelete = () => {
    removeIncident(id);
    toast({
      title: 'Success',
      description: 'Incident deleted successfully',
    });
  };

  const fetchAiSolution = async () => {
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Incident title"
          />
        </div>
        <div className="space-y-2">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident in detail..."
            className="min-h-[100px]"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={handleUpdate}>Update Incident</Button>
          <Button
            variant="outline"
            onClick={fetchAiSolution}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Get AI Solution
          </Button>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the incident.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}