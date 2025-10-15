import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'short-term' | 'long-term';
  progress: number;
  deadline: string;
  status: 'active' | 'completed';
}

const GoalSetting = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Belajar React Advanced',
      description: 'Menguasai hooks, context API, dan performance optimization',
      category: 'short-term',
      progress: 60,
      deadline: '2025-12-31',
      status: 'active'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'short-term' as 'short-term' | 'long-term',
    deadline: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addGoal = () => {
    if (newGoal.title && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        progress: 0,
        deadline: newGoal.deadline,
        status: 'active'
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', description: '', category: 'short-term', deadline: '' });
      setIsDialogOpen(false);
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress, status: progress === 100 ? 'completed' : 'active' } : goal
    ));
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="w-8 h-8" />
              Goal Setting
            </h1>
            <p className="text-muted-foreground mt-1">
              Tetapkan dan lacak tujuan jangka pendek dan panjang Anda
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tambah Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Goal Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Judul Goal</Label>
                  <Input
                    placeholder="Misal: Belajar React"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    placeholder="Detail tentang goal ini..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={newGoal.category} onValueChange={(value: 'short-term' | 'long-term') => setNewGoal({ ...newGoal, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-term">Jangka Pendek</SelectItem>
                      <SelectItem value="long-term">Jangka Panjang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <Button onClick={addGoal} className="w-full">
                  Simpan Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                  <p className="text-2xl font-bold">{goals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tercapai</p>
                  <p className="text-2xl font-bold">{completedGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dalam Progress</p>
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Goals Aktif</h2>
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Belum ada goal aktif. Mulai dengan menambah goal baru!
              </CardContent>
            </Card>
          ) : (
            activeGoals.map(goal => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Circle className="w-4 h-4" />
                        {goal.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    <Badge variant={goal.category === 'short-term' ? 'default' : 'secondary'}>
                      {goal.category === 'short-term' ? 'Jangka Pendek' : 'Jangka Panjang'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Deadline: {new Date(goal.deadline).toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(goal.id, Math.min(goal.progress + 10, 100))}
                      >
                        +10%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProgress(goal.id, Math.max(goal.progress - 10, 0))}
                      >
                        -10%
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {completedGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Goals Tercapai</h2>
            {completedGoals.map(goal => (
              <Card key={goal.id} className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    {goal.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default GoalSetting;
