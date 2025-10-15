
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define interfaces for different types of entries
interface BaseEntry {
  id: string;
  createdAt: Date | string;
}

interface TaskEntry extends BaseEntry {
  type: 'task';
  text: string;
  completed: boolean;
  completedAt: Date | string | null;
  priority: 'high' | 'medium' | 'low';
}

interface ExpenseEntry extends BaseEntry {
  type: 'expense';
  amount: number;
  category: string;
  description: string;
}

interface JournalEntry extends BaseEntry {
  type: 'journal';
  content: string;
  mood?: string;
}

interface HabitEntry extends BaseEntry {
  type: 'habit';
  name: string;
  completed: boolean;
}

type HistoryEntry = TaskEntry | ExpenseEntry | JournalEntry | HabitEntry;

type FilterPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('weekly');
  const [filteredEntries, setFilteredEntries] = useState<HistoryEntry[]>([]);
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Load all entries from localStorage
  useEffect(() => {
    const loadEntries = () => {
      const allEntries: HistoryEntry[] = [];
      
      // Load tasks
      try {
        const tasksJson = localStorage.getItem('daily-tasks');
        if (tasksJson) {
          const tasks = JSON.parse(tasksJson);
          const taskEntries: TaskEntry[] = tasks.map((task: any) => ({
            ...task,
            type: 'task',
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt ? new Date(task.completedAt) : null
          }));
          allEntries.push(...taskEntries);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
      
      // Load expenses (placeholder for future implementation)
      try {
        const expensesJson = localStorage.getItem('expenses');
        if (expensesJson) {
          const expenses = JSON.parse(expensesJson);
          const expenseEntries: ExpenseEntry[] = expenses.map((expense: any) => ({
            ...expense,
            type: 'expense',
            createdAt: new Date(expense.createdAt)
          }));
          allEntries.push(...expenseEntries);
        }
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
      
      // Load journals (placeholder for future implementation)
      try {
        const journalsJson = localStorage.getItem('journals');
        if (journalsJson) {
          const journals = JSON.parse(journalsJson);
          const journalEntries: JournalEntry[] = journals.map((journal: any) => ({
            ...journal,
            type: 'journal',
            createdAt: new Date(journal.createdAt)
          }));
          allEntries.push(...journalEntries);
        }
      } catch (error) {
        console.error("Error loading journals:", error);
      }
      
      // Load habits (placeholder for future implementation)
      try {
        const habitsJson = localStorage.getItem('habits');
        if (habitsJson) {
          const habits = JSON.parse(habitsJson);
          const habitEntries: HabitEntry[] = habits.map((habit: any) => ({
            ...habit,
            type: 'habit',
            createdAt: new Date(habit.createdAt)
          }));
          allEntries.push(...habitEntries);
        }
      } catch (error) {
        console.error("Error loading habits:", error);
      }
      
      return allEntries;
    };
    
    const loadedEntries = loadEntries();
    setEntries(loadedEntries);
  }, []);
  
  // Filter entries based on selected period
  useEffect(() => {
    const filterEntries = () => {
      if (!entries.length) return [];
      
      return entries.filter(entry => {
        const createdAt = entry.createdAt instanceof Date 
          ? entry.createdAt 
          : new Date(entry.createdAt);
        
        switch (filterPeriod) {
          case 'daily':
            return isToday(createdAt);
          case 'weekly':
            return isThisWeek(createdAt, { weekStartsOn: 1 });
          case 'monthly':
            return isThisMonth(createdAt);
          case 'custom':
            if (customDateRange.from && customDateRange.to) {
              return createdAt >= customDateRange.from && createdAt <= customDateRange.to;
            }
            return true;
          default:
            return true;
        }
      });
    };
    
    const filtered = filterEntries();
    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    setFilteredEntries(filtered);
  }, [entries, filterPeriod, customDateRange]);
  
  // Group entries by date for accordion display
  const groupedEntries: Record<string, HistoryEntry[]> = {};
  
  filteredEntries.forEach(entry => {
    const date = entry.createdAt instanceof Date 
      ? entry.createdAt 
      : new Date(entry.createdAt);
    
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!groupedEntries[dateKey]) {
      groupedEntries[dateKey] = [];
    }
    
    groupedEntries[dateKey].push(entry);
  });
  
  // Sorted date keys (newest first)
  const sortedDateKeys = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Format entry for display
  const getEntryDescription = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'task':
        return `${entry.completed ? '✓ ' : ''}${entry.text}`;
      case 'expense':
        return `Rp ${entry.amount.toLocaleString()} - ${entry.category}: ${entry.description}`;
      case 'journal':
        return entry.content.length > 50 ? `${entry.content.substring(0, 50)}...` : entry.content;
      case 'habit':
        return `${entry.completed ? '✓ ' : ''}${entry.name}`;
      default:
        return 'Unknown entry';
    }
  };
  
  // Get entry details
  const getEntryDetails = (entry: HistoryEntry) => {
    switch (entry.type) {
      case 'task':
        return (
          <div className="space-y-2">
            <p><strong>Status:</strong> {entry.completed ? 'Selesai' : 'Belum selesai'}</p>
            {entry.completedAt && <p><strong>Selesai pada:</strong> {format(new Date(entry.completedAt), 'dd MMM yyyy HH:mm', { locale: id })}</p>}
            <p><strong>Prioritas:</strong> {
              entry.priority === 'high' ? 'Penting' :
              entry.priority === 'medium' ? 'Sedang' : 'Rendah'
            }</p>
          </div>
        );
      case 'expense':
        return (
          <div className="space-y-2">
            <p><strong>Jumlah:</strong> Rp {entry.amount.toLocaleString()}</p>
            <p><strong>Kategori:</strong> {entry.category}</p>
            <p><strong>Keterangan:</strong> {entry.description}</p>
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-2">
            <p><strong>Konten:</strong> {entry.content}</p>
            {entry.mood && <p><strong>Mood:</strong> {entry.mood}</p>}
          </div>
        );
      case 'habit':
        return (
          <div className="space-y-2">
            <p><strong>Status:</strong> {entry.completed ? 'Selesai' : 'Belum selesai'}</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Get entry type in Indonesian
  const getEntryTypeLabel = (type: string) => {
    switch (type) {
      case 'task':
        return 'Tugas';
      case 'expense':
        return 'Pengeluaran';
      case 'journal':
        return 'Jurnal';
      case 'habit':
        return 'Kebiasaan';
      default:
        return type;
    }
  };
  
  // Get badge color based on entry type
  const getEntryBadgeClass = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'expense':
        return 'bg-red-100 text-red-800';
      case 'journal':
        return 'bg-purple-100 text-purple-800';
      case 'habit':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Aktivitas</h1>
          <p className="text-muted-foreground">
            Lihat history aktivitas dari semua modul aplikasi Terang Impian.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 pb-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="mr-2">Filter:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filterPeriod === 'daily' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilterPeriod('daily')}
            >
              Hari Ini
            </Button>
            <Button 
              variant={filterPeriod === 'weekly' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilterPeriod('weekly')}
            >
              Minggu Ini
            </Button>
            <Button 
              variant={filterPeriod === 'monthly' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilterPeriod('monthly')}
            >
              Bulan Ini
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={filterPeriod === 'custom' ? 'default' : 'outline'} 
                  size="sm"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Rentang Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">Dari Tanggal</Label>
                    <CalendarComponent
                      mode="single"
                      selected={customDateRange.from}
                      onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date || undefined }))}
                      initialFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Sampai Tanggal</Label>
                    <CalendarComponent
                      mode="single"
                      selected={customDateRange.to}
                      onSelect={(date) => setCustomDateRange(prev => ({ ...prev, to: date || undefined }))}
                      initialFocus
                    />
                  </div>
                  <Button 
                    onClick={() => setFilterPeriod('custom')}
                    disabled={!customDateRange.from || !customDateRange.to}
                    className="w-full"
                  >
                    Terapkan Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {sortedDateKeys.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {sortedDateKeys.map((dateKey) => (
              <AccordionItem value={dateKey} key={dateKey} className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(new Date(dateKey), 'EEEE, d MMMM yyyy', { locale: id })}
                    </span>
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {groupedEntries[dateKey].length} aktivitas
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <ul className="space-y-3 mt-1">
                    {groupedEntries[dateKey].map((entry) => {
                      const entryDate = entry.createdAt instanceof Date 
                        ? entry.createdAt 
                        : new Date(entry.createdAt);
                        
                      return (
                        <li key={`${entry.type}-${entry.id}`} className="border rounded-md p-3">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {format(entryDate, 'HH:mm')}
                                </span>
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getEntryBadgeClass(entry.type)}`}>
                                  {getEntryTypeLabel(entry.type)}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium">{getEntryDescription(entry)}</h4>
                            </div>
                            
                            <div className="border-t pt-2 text-sm text-muted-foreground">
                              {getEntryDetails(entry)}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center p-8 border rounded-lg border-dashed">
            <p className="text-muted-foreground">Tidak ada aktivitas yang ditemukan untuk periode waktu yang dipilih.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default History;
