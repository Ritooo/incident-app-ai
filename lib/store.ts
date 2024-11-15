import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Category = 'frontend' | 'backend' | 'database' | 'network' | 'security';
export type Status = 'open' | 'in-progress' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: Date;
  priority: Priority;
  category: Category;
  assignedTo?: string;
  resolvedAt?: Date;
}

interface IncidentState {
  incidents: Incident[];
  selectedIncidentId: string | null;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'status'>) => void;
  updateStatus: (id: string, status: Status) => void;
  removeIncident: (id: string) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  setSelectedIncidentId: (id: string | null) => void;
  aiSolution: string | null;
  setAiSolution: (solution: string | null) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (category: Category | 'all') => void;
}

export const useIncidentStore = create<IncidentState>()(
  persist(
    (set) => ({
      incidents: [],
      selectedIncidentId: null,
      aiSolution: null,
      selectedCategory: 'all',
      addIncident: (incident) =>
        set((state) => ({
          incidents: [
            {
              ...incident,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              status: 'open',
            },
            ...state.incidents,
          ],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id
              ? {
                  ...incident,
                  status,
                  resolvedAt: status === 'resolved' ? new Date() : undefined,
                }
              : incident
          ),
        })),
      removeIncident: (id) =>
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.id !== id),
          selectedIncidentId: state.selectedIncidentId === id ? null : state.selectedIncidentId,
        })),
      updateIncident: (id, updatedIncident) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id ? { ...incident, ...updatedIncident } : incident
          ),
        })),
      setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
      setAiSolution: (solution) => set({ aiSolution: solution }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: 'incident-storage',
    }
  )
);