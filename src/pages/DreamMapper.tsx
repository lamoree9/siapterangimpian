
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDreams } from "@/hooks/useDreams";
import { DreamForm } from "@/components/dreams/DreamForm";
import { DreamGrid } from "@/components/dreams/DreamGrid";
import { DreamDetail } from "@/components/dreams/DreamDetail";
import { DreamStatsComponent } from "@/components/dreams/DreamStatsComponent";
import { useToast } from "@/hooks/use-toast";
import { Dream } from "@/types/dream";
import { LayoutGrid, Plus, BarChart3 } from "lucide-react";

const DreamMapper = () => {
  const { 
    dreams, 
    addDream, 
    updateDream, 
    deleteDream, 
    addStep, 
    toggleStep, 
    getStats 
  } = useDreams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  const handleAddDream = (dreamData: Parameters<typeof addDream>[0]) => {
    addDream(dreamData);
    toast({
      title: "Impian Ditambahkan",
      description: `"${dreamData.name}" berhasil ditambahkan ke peta impian`,
    });
    setActiveTab("overview");
  };

  const handleDeleteDream = (id: string) => {
    const dream = dreams.find(d => d.id === id);
    deleteDream(id);
    toast({
      title: "Impian Dihapus",
      description: `"${dream?.name}" berhasil dihapus`,
      variant: "destructive",
    });
  };

  const handleSelectDream = (dream: Dream) => {
    setSelectedDream(dream);
    setActiveTab("detail");
  };

  const handleUpdateDream = (id: string, updates: Partial<Dream>) => {
    updateDream(id, updates);
    // Update selected dream if it's currently being viewed
    if (selectedDream && selectedDream.id === id) {
      setSelectedDream({ ...selectedDream, ...updates });
    }
    toast({
      title: "Impian Diperbarui",
      description: "Perubahan berhasil disimpan",
    });
  };

  const handleAddStep = (dreamId: string, step: Parameters<typeof addStep>[1]) => {
    addStep(dreamId, step);
    // Update selected dream if it's currently being viewed
    if (selectedDream && selectedDream.id === dreamId) {
      const updatedDream = dreams.find(d => d.id === dreamId);
      if (updatedDream) setSelectedDream(updatedDream);
    }
    toast({
      title: "Langkah Ditambahkan",
      description: "Langkah baru berhasil ditambahkan",
    });
  };

  const handleToggleStep = (dreamId: string, stepId: string) => {
    const dream = dreams.find(d => d.id === dreamId);
    const step = dream?.steps.find(s => s.id === stepId);
    
    toggleStep(dreamId, stepId);
    
    // Update selected dream if it's currently being viewed
    if (selectedDream && selectedDream.id === dreamId) {
      const updatedDream = dreams.find(d => d.id === dreamId);
      if (updatedDream) setSelectedDream(updatedDream);
    }

    if (step) {
      toast({
        title: !step.completed ? "Langkah Selesai!" : "Langkah Dibatalkan",
        description: !step.completed 
          ? `"${step.title}" berhasil diselesaikan! 🎉`
          : `"${step.title}" dibatalkan`,
        variant: step.completed ? "destructive" : "default",
      });
    }
  };

  const stats = getStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Peta Impian</h1>
          <p className="text-muted-foreground">
            Petakan impian dan target hidup kamu, lalu ubah menjadi langkah-langkah kecil yang bisa ditindaklanjuti.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Peta Impian
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedDream}>
              Detail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalDreams}</div>
                <p className="text-sm text-muted-foreground">Total Impian</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedSteps}</div>
                <p className="text-sm text-muted-foreground">Langkah Selesai</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalSteps}</div>
                <p className="text-sm text-muted-foreground">Total Langkah</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(stats.averageProgress)}%
                </div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
              </div>
            </div>
            
            <DreamGrid
              dreams={dreams}
              onDeleteDream={handleDeleteDream}
              onSelectDream={handleSelectDream}
            />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <DreamForm onSubmit={handleAddDream} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <DreamStatsComponent stats={stats} />
          </TabsContent>

          <TabsContent value="detail" className="space-y-6">
            {selectedDream && (
              <DreamDetail
                dream={selectedDream}
                onUpdateDream={handleUpdateDream}
                onAddStep={handleAddStep}
                onToggleStep={handleToggleStep}
                onBack={() => {
                  setSelectedDream(null);
                  setActiveTab("overview");
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DreamMapper;
