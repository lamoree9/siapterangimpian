import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGratitude } from "@/hooks/useGratitude";
import { GratitudeForm } from "@/components/gratitude/GratitudeForm";
import { GratitudeHistory } from "@/components/gratitude/GratitudeHistory";
import { GratitudeStatsComponent } from "@/components/gratitude/GratitudeStats";
import { MoodType } from "@/types/gratitude";
import { useToast } from "@/hooks/use-toast";

const GratitudeJournal = () => {
  const { entries, addEntry, deleteEntry, getStats, getEntryByDate } = useGratitude();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("form");
  const [statsDateFrom, setStatsDateFrom] = useState<Date | undefined>(undefined);
  const [statsDateTo, setStatsDateTo] = useState<Date | undefined>(undefined);

  const handleAddEntry = (date: string, gratitudeEntries: string[], mood: MoodType, notes?: string) => {
    addEntry(date, gratitudeEntries, mood, notes);
    toast({
      title: "Jurnal Syukur Disimpan",
      description: `${gratitudeEntries.length} hal syukur berhasil dicatat untuk tanggal ${date}`,
    });
    setActiveTab("history");
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    toast({
      title: "Jurnal Dihapus",
      description: "Jurnal syukur berhasil dihapus",
      variant: "destructive",
    });
  };

  const stats = getStats(statsDateFrom, statsDateTo);
  
  // Get today's entries for display
  const todayString = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date).toISOString().split('T')[0];
    return entryDate === todayString;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Jurnal Syukur</h1>
          <p className="text-muted-foreground">
            Catat momen syukur dan refleksi diri kamu setiap hari.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Tulis Jurnal</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            {/* Today's Entries Summary */}
            {todayEntries.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary">Jurnal Hari Ini</h3>
                  <span className="text-sm text-muted-foreground">
                    {todayEntries.length} kali dicatat
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Kamu sudah mencatat {todayEntries.reduce((sum, e) => sum + e.entries.length, 0)} hal yang disyukuri hari ini. Tambahkan lagi jika ada yang baru!
                </p>
              </div>
            )}
            
            <GratitudeForm onSubmit={handleAddEntry} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <GratitudeHistory
              entries={entries}
              onDelete={handleDeleteEntry}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <GratitudeStatsComponent 
              stats={stats}
              dateFrom={statsDateFrom}
              dateTo={statsDateTo}
              onDateFromChange={setStatsDateFrom}
              onDateToChange={setStatsDateTo}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default GratitudeJournal;
