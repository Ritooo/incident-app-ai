'use client';

import { IncidentForm } from '@/components/incident-form';
import { IncidentList } from '@/components/incident-list';
import { IncidentDetails } from '@/components/incident-details';
import { AlertTriangle, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useIncidentStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="border-r">
        <div className="h-full p-4 bg-muted/20">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Incidents
            </h2>
            <p className="text-sm text-muted-foreground">
              Track and manage system issues
            </p>
          </div>
          <Separator className="my-4" />
          <IncidentList />
        </div>
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel defaultSize={75}>
        <MainContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MainContent() {
  const selectedIncidentId = useIncidentStore((state) => state.selectedIncidentId);
  const setSelectedIncidentId = useIncidentStore((state) => state.setSelectedIncidentId);

  return (
    <main className="h-full bg-background">
      <div className="container max-w-3xl mx-auto p-6 space-y-8">
        {selectedIncidentId ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Incident Details</h1>
              <Button
                variant="ghost"
                onClick={() => setSelectedIncidentId(null)}
                className="gap-2"
              >
                <Plus className="h-4 w-4 rotate-45" />
                Close
              </Button>
            </div>
            <IncidentDetails id={selectedIncidentId} />
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <h1 className="text-3xl font-bold tracking-tight">Report Incident</h1>
              </div>
              <p className="text-muted-foreground">
                Report and track system incidents with AI-powered solutions
              </p>
            </div>
            <div className="space-y-4">
              <IncidentForm />
            </div>
          </>
        )}
      </div>
    </main>
  );
}