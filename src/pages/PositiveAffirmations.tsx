
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AffirmationDisplay } from '@/components/affirmations/AffirmationDisplay';
import { AddAffirmationDialog } from '@/components/affirmations/AddAffirmationDialog';
import { CustomAffirmationsList } from '@/components/affirmations/CustomAffirmationsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAffirmations } from '@/hooks/useAffirmations';
import { Sun, Moon, Sparkles, Plus } from 'lucide-react';

const PositiveAffirmations = () => {
  const {
    getCurrentTimeType,
    shouldShowAutomatic,
    markAsShown,
    getRandomAffirmation,
    addCustomAffirmation,
    editCustomAffirmation,
    deleteCustomAffirmation,
    customAffirmations
  } = useAffirmations();

  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [currentType, setCurrentType] = useState<'morning' | 'evening'>('morning');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    // Check if we should show automatic affirmation
    if (shouldShowAutomatic()) {
      const timeType = getCurrentTimeType();
      if (timeType) {
        setCurrentType(timeType);
        setCurrentAffirmation(getRandomAffirmation(timeType));
        setShowAffirmation(true);
        markAsShown();
      }
    }
  }, []);

  const showManualAffirmation = (type: 'morning' | 'evening') => {
    setCurrentType(type);
    setCurrentAffirmation(getRandomAffirmation(type));
    setShowAffirmation(true);
  };

  const closeAffirmation = () => {
    setShowAffirmation(false);
  };

  if (showAffirmation) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <AffirmationDisplay
            affirmation={currentAffirmation}
            type={currentType}
            onClose={closeAffirmation}
            isAutomatic={shouldShowAutomatic()}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Afirmasi Positif</h1>
          <p className="text-muted-foreground">
            Mulai dan akhiri harimu dengan kata-kata yang memberdayakan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Afirmasi Pagi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tampil otomatis setiap pagi (04:00 - 09:00) untuk memulai hari dengan energi positif.
              </p>
              <Button 
                onClick={() => showManualAffirmation('morning')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <Sun className="mr-2 h-4 w-4" />
                Tampilkan Afirmasi Pagi
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Afirmasi Malam</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tampil otomatis setiap malam (20:00 - 23:59) untuk mengakhiri hari dengan rasa syukur.
              </p>
              <Button 
                onClick={() => showManualAffirmation('evening')}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                <Moon className="mr-2 h-4 w-4" />
                Tampilkan Afirmasi Malam
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Afirmasi Custom</h2>
            <p className="text-sm text-muted-foreground">
              Tambahkan afirmasi positif Anda sendiri
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Afirmasi Sendiri
          </Button>
        </div>

        <CustomAffirmationsList
          affirmations={customAffirmations}
          onEdit={editCustomAffirmation}
          onDelete={deleteCustomAffirmation}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Tentang Afirmasi Positif</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Afirmasi positif adalah pernyataan yang membantu mengatasi pikiran negatif dan meningkatkan kepercayaan diri. 
              Dengan mengulang afirmasi secara konsisten, kita dapat memprogram ulang pola pikir untuk menjadi lebih positif dan produktif.
            </p>
            <div className="grid gap-2 text-sm">
              <div className="flex items-start gap-2">
                <Sun className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span><strong>Pagi:</strong> Mempersiapkan mindset positif untuk menghadapi hari</span>
              </div>
              <div className="flex items-start gap-2">
                <Moon className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span><strong>Malam:</strong> Merefleksikan hari dengan rasa syukur dan ketenangan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <AddAffirmationDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAdd={addCustomAffirmation}
        />
      </div>
    </AppLayout>
  );
};

export default PositiveAffirmations;
