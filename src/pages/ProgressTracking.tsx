import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Plus, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface TrackedItem {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

const categories = [
  { value: 'health', label: 'Kesehatan' },
  { value: 'career', label: 'Karir' },
  { value: 'finance', label: 'Keuangan' },
  { value: 'learning', label: 'Pembelajaran' },
  { value: 'personal', label: 'Personal' }
];

const ProgressTracking = () => {
  const [items, setItems] = useState<TrackedItem[]>([
    {
      id: '1',
      name: 'Berat Badan',
      category: 'health',
      currentValue: 70,
      targetValue: 65,
      unit: 'kg'
    },
    {
      id: '2',
      name: 'Tabungan',
      category: 'finance',
      currentValue: 15000000,
      targetValue: 50000000,
      unit: 'IDR'
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'health',
    currentValue: 0,
    targetValue: 0,
    unit: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addItem = () => {
    if (newItem.name && newItem.targetValue > 0) {
      const item: TrackedItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setItems([...items, item]);
      setNewItem({ name: '', category: 'health', currentValue: 0, targetValue: 0, unit: '' });
      setIsDialogOpen(false);
    }
  };

  const updateValue = (id: string, newValue: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, currentValue: newValue } : item
    ));
  };

  const getProgress = (item: TrackedItem) => {
    return Math.min((item.currentValue / item.targetValue) * 100, 100);
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'IDR') {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    }
    return `${value} ${unit}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="w-8 h-8" />
              Progress Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Pantau kemajuan dalam berbagai aspek kehidupan
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Item Tracking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Item</Label>
                  <Input
                    placeholder="Misal: Berat Badan"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nilai Saat Ini</Label>
                    <Input
                      type="number"
                      value={newItem.currentValue}
                      onChange={(e) => setNewItem({ ...newItem, currentValue: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target</Label>
                    <Input
                      type="number"
                      value={newItem.targetValue}
                      onChange={(e) => setNewItem({ ...newItem, targetValue: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Satuan</Label>
                  <Input
                    placeholder="Misal: kg, IDR, halaman"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  />
                </div>
                <Button onClick={addItem} className="w-full">
                  Simpan Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Item</p>
                  <p className="text-2xl font-bold">{items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata Progress</p>
                  <p className="text-2xl font-bold">
                    {items.length > 0 ? (items.reduce((acc, item) => acc + getProgress(item), 0) / items.length).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Item yang Dipantau</h2>
          {items.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Belum ada item yang dipantau. Mulai tambahkan item untuk tracking progress!
              </CardContent>
            </Card>
          ) : (
            items.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {categories.find(c => c.value === item.category)?.label}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{getProgress(item).toFixed(0)}%</span>
                    </div>
                    <Progress value={getProgress(item)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Saat ini: </span>
                      <span className="font-medium">{formatValue(item.currentValue, item.unit)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium">{formatValue(item.targetValue, item.unit)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Update nilai..."
                      onBlur={(e) => {
                        const value = Number(e.target.value);
                        if (value > 0) {
                          updateValue(item.id, value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProgressTracking;
