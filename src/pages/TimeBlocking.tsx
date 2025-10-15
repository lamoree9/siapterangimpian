import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  color: string;
}

const categories = [
  { value: 'work', label: 'Pekerjaan', color: 'bg-blue-500' },
  { value: 'study', label: 'Belajar', color: 'bg-purple-500' },
  { value: 'exercise', label: 'Olahraga', color: 'bg-green-500' },
  { value: 'personal', label: 'Personal', color: 'bg-orange-500' },
  { value: 'rest', label: 'Istirahat', color: 'bg-gray-500' }
];

const TimeBlocking = () => {
  const [blocks, setBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      title: 'Deep Work',
      startTime: '09:00',
      endTime: '11:00',
      category: 'work',
      color: 'bg-blue-500'
    }
  ]);

  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'work'
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addBlock = () => {
    if (newBlock.title && newBlock.startTime && newBlock.endTime) {
      const category = categories.find(c => c.value === newBlock.category);
      const block: TimeBlock = {
        id: Date.now().toString(),
        title: newBlock.title,
        startTime: newBlock.startTime,
        endTime: newBlock.endTime,
        category: newBlock.category,
        color: category?.color || 'bg-gray-500'
      };
      setBlocks([...blocks, block].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setNewBlock({ title: '', startTime: '', endTime: '', category: 'work' });
      setIsDialogOpen(false);
    }
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const getTotalHours = () => {
    return blocks.reduce((total, block) => {
      const start = new Date(`2000-01-01T${block.startTime}`);
      const end = new Date(`2000-01-01T${block.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Clock className="w-8 h-8" />
              Time Blocking
            </h1>
            <p className="text-muted-foreground mt-1">
              Rencanakan waktu Anda dengan metode time blocking
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Time Block</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Aktivitas</Label>
                  <Input
                    placeholder="Misal: Deep Work"
                    value={newBlock.title}
                    onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Waktu Mulai</Label>
                    <Input
                      type="time"
                      value={newBlock.startTime}
                      onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Waktu Selesai</Label>
                    <Input
                      type="time"
                      value={newBlock.endTime}
                      onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={newBlock.category} onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}>
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
                <Button onClick={addBlock} className="w-full">
                  Simpan Block
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Waktu Terencana</p>
                <p className="text-2xl font-bold">{getTotalHours().toFixed(1)} jam</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Jadwal Hari Ini</h2>
          {blocks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Belum ada time block. Mulai rencanakan waktu Anda!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {blocks.map(block => (
                <Card key={block.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-16 rounded ${block.color}`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{block.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {block.startTime} - {block.endTime}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {categories.find(c => c.value === block.category)?.label}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteBlock(block.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Tips Time Blocking</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Alokasikan waktu untuk deep work di pagi hari</li>
              <li>Sisipkan buffer time antar block</li>
              <li>Review dan adjust setiap akhir hari</li>
              <li>Jangan lupa jadwalkan istirahat</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TimeBlocking;
