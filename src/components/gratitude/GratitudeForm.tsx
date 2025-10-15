
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Plus, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { MoodType } from '@/types/gratitude';

interface GratitudeFormProps {
  onSubmit: (date: string, entries: string[], mood: MoodType, notes?: string) => void;
}

const MOODS: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'senang', label: 'Senang', emoji: '😊' },
  { value: 'tenang', label: 'Tenang', emoji: '😌' },
  { value: 'bersemangat', label: 'Bersemangat', emoji: '🤩' },
  { value: 'syukur', label: 'Syukur', emoji: '🙏' },
  { value: 'cemas', label: 'Cemas', emoji: '😰' },
  { value: 'lelah', label: 'Lelah', emoji: '😴' },
  { value: 'sedih', label: 'Sedih', emoji: '😢' },
  { value: 'marah', label: 'Marah', emoji: '😠' },
  { value: 'bingung', label: 'Bingung', emoji: '🤔' },
  { value: 'optimis', label: 'Optimis', emoji: '✨' }
];

export const GratitudeForm = ({ onSubmit }: GratitudeFormProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [entries, setEntries] = useState<string[]>(['']);
  const [mood, setMood] = useState<MoodType | ''>('');
  const [notes, setNotes] = useState('');

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addEntry = () => {
    if (entries.length < 99) {
      setEntries([...entries, '']);
    }
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filledEntries = entries.filter(entry => entry.trim() !== '');
    
    if (filledEntries.length === 0) {
      alert('Minimal harus ada 1 hal yang disyukuri');
      return;
    }
    
    if (!mood) {
      alert('Pilih perasaan saat ini');
      return;
    }

    // Use current date and time as ISO string
    const dateTimeString = new Date().toISOString();
    onSubmit(dateTimeString, filledEntries, mood as MoodType, notes || undefined);
    
    // Reset form
    setEntries(['']);
    setMood('');
    setNotes('');
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <CardTitle>Catat Momen Syukur</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Setiap momen berharga untuk disyukuri
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time Display */}
          <div className="space-y-2">
            <Label>Tanggal & Waktu</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-secondary/20">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">
                  {format(currentTime, 'HH:mm:ss', { locale: id })}
                </span>
              </div>
            </div>
          </div>

          {/* Gratitude Entries */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Hal yang Disyukuri ({entries.length}/99)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEntry}
                disabled={entries.length >= 99}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {entries.map((entry, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Hal yang disyukuri ${index + 1}`}
                    value={entry}
                    onChange={(e) => updateEntry(index, e.target.value)}
                    className="flex-1"
                  />
                  {entries.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeEntry(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-2">
            <Label>Perasaan Saat Ini</Label>
            <Select value={mood} onValueChange={(value) => setMood(value as MoodType)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih perasaan..." />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map((moodOption) => (
                  <SelectItem key={moodOption.value} value={moodOption.value}>
                    <span className="flex items-center gap-2">
                      <span>{moodOption.emoji}</span>
                      <span>{moodOption.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label>Catatan Tambahan (Opsional)</Label>
            <Textarea
              placeholder="Tuliskan refleksi atau catatan tambahan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Simpan Jurnal Syukur
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
