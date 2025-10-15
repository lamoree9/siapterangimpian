
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock } from 'lucide-react';
import { GratitudeEntry } from '@/types/gratitude';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { GratitudeFilter } from './GratitudeFilter';

interface GratitudeHistoryProps {
  entries: GratitudeEntry[];
  onDelete: (id: string) => void;
}

const MOOD_EMOJIS: Record<string, string> = {
  senang: '😊',
  tenang: '😌',
  bersemangat: '🤩',
  syukur: '🙏',
  cemas: '😰',
  lelah: '😴',
  sedih: '😢',
  marah: '😠',
  bingung: '🤔',
  optimis: '✨'
};

const MOOD_LABELS: Record<string, string> = {
  senang: 'Senang',
  tenang: 'Tenang',
  bersemangat: 'Bersemangat',
  syukur: 'Syukur',
  cemas: 'Cemas',
  lelah: 'Lelah',
  sedih: 'Sedih',
  marah: 'Marah',
  bingung: 'Bingung',
  optimis: 'Optimis'
};

export const GratitudeHistory = ({ entries, onDelete }: GratitudeHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedMood, setSelectedMood] = useState('all');

  const handleReset = () => {
    setSearchTerm('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedMood('all');
  };

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.entries.some(e => e.toLowerCase().includes(searchLower)) ||
        entry.additionalNotes?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(entry => 
        new Date(entry.date) >= dateFrom
      );
    }
    if (dateTo) {
      const dateToEnd = new Date(dateTo);
      dateToEnd.setHours(23, 59, 59, 999);
      filtered = filtered.filter(entry => 
        new Date(entry.date) <= dateToEnd
      );
    }

    // Filter by mood
    if (selectedMood !== 'all') {
      filtered = filtered.filter(entry => entry.mood === selectedMood);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [entries, searchTerm, dateFrom, dateTo, selectedMood]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Belum ada jurnal syukur yang tercatat.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Mulai menulis hal-hal yang Anda syukuri hari ini!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Riwayat Jurnal Syukur</h3>
      
      <GratitudeFilter
        searchTerm={searchTerm}
        dateFrom={dateFrom}
        dateTo={dateTo}
        selectedMood={selectedMood}
        onSearchChange={setSearchTerm}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onMoodChange={setSelectedMood}
        onReset={handleReset}
      />

      {filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Tidak ada jurnal yang sesuai dengan filter.</p>
            <Button variant="link" onClick={handleReset} className="mt-2">
              Reset Filter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary/40">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    {format(new Date(entry.date), 'dd MMMM yyyy', { locale: id })}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(entry.date), 'HH:mm:ss', { locale: id })}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {MOOD_EMOJIS[entry.mood]} {MOOD_LABELS[entry.mood]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {entry.entries.length} hal disyukuri
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Gratitude Entries */}
                <div className="space-y-2">
                  {entry.entries.map((gratitudeEntry, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground mt-0.5 min-w-[20px]">
                        {index + 1}.
                      </span>
                      <p className="text-sm">{gratitudeEntry}</p>
                    </div>
                  ))}
                </div>
                
                {/* Additional Notes */}
                {entry.additionalNotes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Catatan:</p>
                    <p className="text-sm italic">{entry.additionalNotes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
};
