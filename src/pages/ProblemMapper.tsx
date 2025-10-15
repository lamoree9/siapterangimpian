
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProblems } from "@/hooks/useProblems";
import { ProblemForm } from "@/components/problems/ProblemForm";
import { ProblemList } from "@/components/problems/ProblemList";
import { ProblemDetail } from "@/components/problems/ProblemDetail";
import { ProblemStatsComponent } from "@/components/problems/ProblemStatsComponent";
import { useToast } from "@/hooks/use-toast";
import { Problem } from "@/types/problem";
import { Brain, Plus, BarChart3, AlertCircle } from "lucide-react";

const ProblemMapper = () => {
  const { 
    problems, 
    addProblem, 
    updateProblem, 
    deleteProblem, 
    addSolution, 
    toggleSolution, 
    getStats 
  } = useProblems();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const handleAddProblem = (problemData: Parameters<typeof addProblem>[0]) => {
    addProblem(problemData);
    toast({
      title: "Masalah Ditambahkan",
      description: `"${problemData.name}" berhasil ditambahkan ke peta masalah`,
    });
    setActiveTab("overview");
  };

  const handleDeleteProblem = (id: string) => {
    const problem = problems.find(p => p.id === id);
    deleteProblem(id);
    toast({
      title: "Masalah Dihapus",
      description: `"${problem?.name}" berhasil dihapus`,
      variant: "destructive",
    });
  };

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setActiveTab("detail");
  };

  const handleUpdateProblem = (id: string, updates: Partial<Problem>) => {
    updateProblem(id, updates);
    // Update selected problem if it's currently being viewed
    if (selectedProblem && selectedProblem.id === id) {
      setSelectedProblem({ ...selectedProblem, ...updates });
    }
    toast({
      title: "Masalah Diperbarui",
      description: "Perubahan berhasil disimpan",
    });
  };

  const handleAddSolution = (problemId: string, solution: Parameters<typeof addSolution>[1]) => {
    addSolution(problemId, solution);
    // Update selected problem if it's currently being viewed
    if (selectedProblem && selectedProblem.id === problemId) {
      const updatedProblem = problems.find(p => p.id === problemId);
      if (updatedProblem) setSelectedProblem(updatedProblem);
    }
    toast({
      title: "Solusi Ditambahkan",
      description: "Solusi baru berhasil ditambahkan",
    });
  };

  const handleToggleSolution = (problemId: string, solutionId: string) => {
    const problem = problems.find(p => p.id === problemId);
    const solution = problem?.solutions.find(s => s.id === solutionId);
    
    toggleSolution(problemId, solutionId);
    
    // Update selected problem if it's currently being viewed
    if (selectedProblem && selectedProblem.id === problemId) {
      const updatedProblem = problems.find(p => p.id === problemId);
      if (updatedProblem) setSelectedProblem(updatedProblem);
    }

    if (solution) {
      toast({
        title: !solution.completed ? "Solusi Selesai!" : "Solusi Dibatalkan",
        description: !solution.completed 
          ? `"${solution.title}" berhasil diselesaikan! 🎉`
          : `"${solution.title}" dibatalkan`,
        variant: solution.completed ? "destructive" : "default",
      });
    }
  };

  const stats = getStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Peta Masalah</h1>
          <p className="text-muted-foreground">
            Identifikasi, pahami, dan selesaikan masalah secara strategis dan terintegrasi secara emosional maupun spiritual.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Peta Masalah
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="detail" disabled={!selectedProblem}>
              Detail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalProblems}</div>
                <p className="text-sm text-muted-foreground">Total Masalah</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.activeProblems}</div>
                <p className="text-sm text-muted-foreground">Belum Diatasi</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.resolvedProblems}</div>
                <p className="text-sm text-muted-foreground">Sudah Tuntas</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.averageDifficulty.toFixed(1)}
                </div>
                <p className="text-sm text-muted-foreground">Avg Kesulitan</p>
              </div>
            </div>
            
            <ProblemList
              problems={problems}
              onSelectProblem={handleSelectProblem}
              onDeleteProblem={handleDeleteProblem}
            />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <ProblemForm onSubmit={handleAddProblem} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <ProblemStatsComponent stats={stats} />
          </TabsContent>

          <TabsContent value="detail" className="space-y-6">
            {selectedProblem && (
              <ProblemDetail
                problem={selectedProblem}
                onUpdateProblem={handleUpdateProblem}
                onAddSolution={handleAddSolution}
                onToggleSolution={handleToggleSolution}
                onBack={() => {
                  setSelectedProblem(null);
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

export default ProblemMapper;
