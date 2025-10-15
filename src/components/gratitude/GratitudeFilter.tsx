import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Filter, X, Search, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GratitudeFilterProps {
  searchTerm: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  selectedMood: string;
  onSearchChange: (value: string) => void;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onMoodChange: (value: string) => void;
  onReset: () => void;
}

const MOODS = [
  { value: 'all', label: 'Semua Perasaan', emoji: '🌈' },
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

export const GratitudeFilter = ({
  searchTerm,
  dateFrom,
  dateTo,
  selectedMood,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onMoodChange,
  onReset
}: GratitudeFilterProps) => {
  const hasActiveFilters = searchTerm || dateFrom || dateTo || selectedMood !== 'all';

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Filter Jurnal</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Cari Kata Kunci
          </Label>
          <Input
            placeholder="Cari dalam jurnal syukur..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date From */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Dari Tanggal
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background/50",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={onDateFromChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Sampai Tanggal
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background/50",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={onDateToChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Mood Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Perasaan
            </Label>
            <Select value={selectedMood} onValueChange={onMoodChange}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Pilih perasaan..." />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <span className="flex items-center gap-2">
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
