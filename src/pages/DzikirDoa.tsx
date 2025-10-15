import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Pause, RotateCcw, Plus, BookOpen, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSpiritual } from '@/hooks/useSpiritual';
import { AddDzikirDialog } from '@/components/spiritual/AddDzikirDialog';
import { AddDoaDialog } from '@/components/spiritual/AddDoaDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Dzikir {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  category: string;
}

interface Doa {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
}

const dzikirList: Dzikir[] = [
  {
    id: '1',
    arabic: 'سُبْحَانَ اللّٰهِ',
    transliteration: 'Subhanallah',
    translation: 'Maha Suci Allah',
    target: 33,
    category: 'dzikir-pagi'
  },
  {
    id: '2',
    arabic: 'اَلْحَمْدُ لِلّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Segala puji bagi Allah',
    target: 33,
    category: 'dzikir-pagi'
  },
  {
    id: '3',
    arabic: 'اَللّٰهُ اَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah Maha Besar',
    target: 33,
    category: 'dzikir-pagi'
  }
];

const doaList: Doa[] = [
  {
    id: '1',
    title: 'Doa Pagi Hari',
    arabic: 'اَللّٰهُمَّ بِكَ اَصْبَحْنَا وَبِكَ اَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوْتُ وَاِلَيْكَ النُّشُوْرُ',
    transliteration: 'Allāhumma bika aṣbaḥnā wa bika amsaynā wa bika naḥyā wa bika namūtu wa ilayka an-nusyūr',
    translation: 'Ya Allah, dengan rahmat dan pertolongan-Mu kami mengalami waktu pagi dan waktu petang, kami hidup dan kami mati dan kepada-Mu kami akan kembali.',
    category: 'harian'
  },
  {
    id: '2',
    title: 'Doa Sebelum Tidur',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ اَمُوْتُ وَاَحْيَا',
    transliteration: 'Bismika Allāhumma amūtu wa aḥyā',
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    category: 'harian'
  }
];

const DzikirDoa = () => {
  const { customDzikir, customDoa, addCustomDzikir, deleteCustomDzikir, addCustomDoa, deleteCustomDoa } = useSpiritual();
  const { toast } = useToast();
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'dzikir' | 'doa'; id: string } | null>(null);

  const incrementCounter = (id: string) => {
    setCounters(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const resetCounter = (id: string) => {
    setCounters(prev => ({
      ...prev,
      [id]: 0
    }));
    setIsRunning(prev => ({
      ...prev,
      [id]: false
    }));
  };

  const toggleTimer = (id: string) => {
    setIsRunning(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleDeleteClick = (type: 'dzikir' | 'doa', id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'dzikir') {
      deleteCustomDzikir(itemToDelete.id);
      toast({
        title: "Berhasil",
        description: "Dzikir berhasil dihapus"
      });
    } else {
      deleteCustomDoa(itemToDelete.id);
      toast({
        title: "Berhasil",
        description: "Doa berhasil dihapus"
      });
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const allDzikir = [...dzikirList, ...customDzikir];
  const allDoa = [...doaList, ...customDoa];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            Dzikir & Doa
          </h1>
          <p className="text-muted-foreground mt-1">
            Timer dzikir dan koleksi doa harian
          </p>
        </div>

        <Tabs defaultValue="dzikir" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dzikir">Counter Dzikir</TabsTrigger>
            <TabsTrigger value="doa">Koleksi Doa</TabsTrigger>
          </TabsList>

          <TabsContent value="dzikir" className="space-y-6">
            <AddDzikirDialog onAdd={addCustomDzikir} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Dzikir</p>
                      <p className="text-2xl font-bold">
                        {Object.values(counters).reduce((a, b) => a + b, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Sparkles className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dzikir Hari Ini</p>
                      <p className="text-2xl font-bold">
                        {Object.keys(counters).filter(id => (counters[id] || 0) > 0).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {allDzikir.map(dzikir => {
                const count = counters[dzikir.id] || 0;
                const progress = getProgress(count, dzikir.target);
                const isComplete = count >= dzikir.target;
                const isCustom = dzikir.category === 'custom';

                return (
                  <Card key={dzikir.id} className={`hover:shadow-md transition-shadow ${isComplete ? 'border-green-200 bg-green-50/50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-2xl font-arabic text-right flex-1">{dzikir.arabic}</div>
                            {isCustom && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteClick('dzikir', dzikir.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm font-medium">{dzikir.transliteration}</p>
                          <p className="text-sm text-muted-foreground">{dzikir.translation}</p>
                        </div>
                        {isComplete && (
                          <Badge className="bg-green-500">
                            Selesai
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          {count} / {dzikir.target}
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => incrementCounter(dzikir.id)}
                          className="flex-1"
                          size="lg"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Hitung
                        </Button>
                        <Button
                          onClick={() => resetCounter(dzikir.id)}
                          variant="outline"
                          size="lg"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Tips Berdzikir</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Berdzikir dengan khusyuk dan penuh konsentrasi</li>
                  <li>Pahami makna dari setiap dzikir yang dibaca</li>
                  <li>Rutin berdzikir setelah sholat</li>
                  <li>Bisa dilakukan kapan saja dan dimana saja</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doa" className="space-y-4">
            <AddDoaDialog onAdd={addCustomDoa} />
            
            {allDoa.map(doa => {
              const isCustom = doa.category === 'custom';
              
              return (
                <Card key={doa.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {doa.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{doa.category}</Badge>
                        {isCustom && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick('doa', doa.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                      <div className="text-xl font-arabic text-right leading-loose">
                        {doa.arabic}
                      </div>
                      <div className="text-sm font-medium italic">
                        {doa.transliteration}
                      </div>
                      <div className="text-sm text-muted-foreground border-t pt-2">
                        <span className="font-medium">Artinya: </span>
                        {doa.translation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Keutamaan Berdoa</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Doa adalah ibadah yang sangat dicintai Allah</li>
                  <li>Berdoa dengan penuh keyakinan dan tawakal</li>
                  <li>Pilih waktu-waktu mustajab seperti sepertiga malam terakhir</li>
                  <li>Awali dengan memuji Allah dan bershalawat kepada Nabi</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus {itemToDelete?.type === 'dzikir' ? 'dzikir' : 'doa'} ini? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default DzikirDoa;
