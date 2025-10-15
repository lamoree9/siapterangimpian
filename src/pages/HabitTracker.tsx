
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHabits } from "@/hooks/useHabits";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitList } from "@/components/habits/HabitList";
import { HabitHistory } from "@/components/habits/HabitHistory";
import { HabitStatsComponent } from "@/components/habits/HabitStats";
import { useToast } from "@/hooks/use-toast";

const HabitTracker = () => {
  const { 
    habits, 
    completions, 
    addHabit, 
    deleteHabit, 
    toggleCompletion, 
    getHabitsForDate, 
    getStreak, 
    getConsistencyPercentage, 
    getStats 
  } = useHabits();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("today");

  const handleAddHabit = (habitData: Parameters<typeof addHabit>[0]) => {
    addHabit(habitData);
    toast({
      title: "Kebiasaan Ditambahkan",
      description: `"${habitData.name}" berhasil ditambahkan ke daftar kebiasaan`,
    });
    setActiveTab("today");
  };

  const handleDeleteHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    deleteHabit(id);
    toast({
      title: "Kebiasaan Dihapus",
      description: `"${habit?.name}" berhasil dihapus`,
      variant: "destructive",
    });
  };

  const handleToggleCompletion = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id === habitId);
    const todayHabits = getHabitsForDate(today);
    const habitToday = todayHabits.find(h => h.id === habitId);
    
    toggleCompletion(habitId, today);
    
    if (habit) {
      toast({
        title: habitToday?.completed ? "Kebiasaan Dibatalkan" : "Kebiasaan Selesai!",
        description: habitToday?.completed 
          ? `"${habit.name}" dibatalkan untuk hari ini`
          : `"${habit.name}" berhasil diselesaikan! 🎉`,
        variant: habitToday?.completed ? "destructive" : "default",
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = getHabitsForDate(today);
  const stats = getStats();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Kebiasaan Harian</h1>
          <p className="text-muted-foreground">
            Catat, lacak, dan jaga rutinitas harian untuk membentuk kebiasaan positif.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Hari Ini</TabsTrigger>
            <TabsTrigger value="add">Tambah</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.todayCompleted}</div>
                <p className="text-sm text-muted-foreground">Selesai</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-muted-foreground">{stats.todayTotal}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalStreaks}</div>
                <p className="text-sm text-muted-foreground">Streak</p>
              </div>
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.todayTotal > 0 ? Math.round((stats.todayCompleted / stats.todayTotal) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>
            
            <HabitList
              habits={todayHabits}
              onToggleCompletion={handleToggleCompletion}
              onDeleteHabit={handleDeleteHabit}
              getStreak={getStreak}
              getConsistency={getConsistencyPercentage}
            />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <HabitForm onSubmit={handleAddHabit} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HabitHistory
              habits={habits}
              completions={completions}
              getHabitsForDate={getHabitsForDate}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <HabitStatsComponent stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default HabitTracker;
