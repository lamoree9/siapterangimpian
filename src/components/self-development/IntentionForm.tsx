
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntention } from '@/hooks/useIntention';
import { AddIntentionForm } from './AddIntentionForm';
import { IntentionItem } from './IntentionItem';
import { Calendar, TrendingUp } from 'lucide-react';

export const IntentionForm = () => {
  const { 
    addIntention, 
    updateIntention, 
    deleteIntention, 
    toggleIntentionComplete, 
    getIntentionsByDate, 
    getStats 
  } = useIntention();
  
  const today = new Date().toISOString().split('T')[0];
  const todayIntentions = getIntentionsByDate(today);
  const stats = getStats();

  const handleAddIntention = (intention: string, category?: string) => {
    addIntention(today, intention, category);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Niat Harian Anda</h3>
        <p className="text-sm text-muted-foreground">
          Kelola semua niat untuk hari ini dengan kategori yang jelas
        </p>
      </div>

      <AddIntentionForm onAdd={handleAddIntention} />

      {todayIntentions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Niat Hari Ini ({todayIntentions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayIntentions.map(intention => (
              <IntentionItem
                key={intention.id}
                intention={intention}
                onUpdate={updateIntention}
                onDelete={deleteIntention}
                onToggleComplete={toggleIntentionComplete}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {stats.totalIntentions > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statistik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalIntentions}</div>
                <div className="text-sm text-muted-foreground">Total Niat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedIntentions}</div>
                <div className="text-sm text-muted-foreground">Tercapai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {stats.weeklyIntentions.filter(w => w.hasIntention).length}
                </div>
                <div className="text-sm text-muted-foreground">Minggu Ini</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {stats.totalIntentions > 0 ? Math.round((stats.completedIntentions / stats.totalIntentions) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Tingkat Pencapaian</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
