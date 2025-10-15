
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FrequencyType } from '@/types/habit';

interface HabitFormProps {
  onSubmit: (habit: {
    name: string;
    frequency: FrequencyType;
    days: number[];
    idealTime?: string;
    notes?: string;
    category: string;
    color: string;
  }) => void;
}

const CATEGORIES = [
  { value: 'health', label: 'Kesehatan', color: '#22c55e' },
  { value: 'productivity', label: 'Produktivitas', color: '#3b82f6' },
  { value: 'learning', label: 'Pembelajaran', color: '#8b5cf6' },
  { value: 'fitness', label: 'Olahraga', color: '#ef4444' },
  { value: 'mindfulness', label: 'Mindfulness', color: '#f59e0b' },
  { value: 'social', label: 'Sosial', color: '#06b6d4' },
  { value: 'hobby', label: 'Hobi', color: '#ec4899' },
  { value: 'other', label: 'Lainnya', color: '#6b7280' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Minggu' },
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
];

export const HabitForm = ({ onSubmit }: HabitFormProps) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [idealTime, setIdealTime] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;

    let days = selectedDays;
    if (frequency === 'daily') {
      days = [0, 1, 2, 3, 4, 5, 6]; // All days
    }

    const selectedCategory = CATEGORIES.find(c => c.value === category);
    
    onSubmit({
      name: name.trim(),
      frequency,
      days,
      idealTime: idealTime || undefined,
      notes: notes.trim() || undefined,
      category,
      color: selectedCategory?.color || '#6b7280',
    });

    // Reset form
    setName('');
    setFrequency('daily');
    setSelectedDays([]);
    setIdealTime('');
    setNotes('');
    setCategory('');
  };

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Kebiasaan Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Kebiasaan</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Minum air 8 gelas"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency">Frekuensi</Label>
            <Select value={frequency} onValueChange={(value: FrequencyType) => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(frequency === 'weekly' || frequency === 'custom') && (
            <div>
              <Label>Hari</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <Label htmlFor={`day-${day.value}`} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="idealTime">Waktu Ideal (Opsional)</Label>
            <Input
              id="idealTime"
              type="time"
              value={idealTime}
              onChange={(e) => setIdealTime(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan atau motivasi..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Tambah Kebiasaan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
