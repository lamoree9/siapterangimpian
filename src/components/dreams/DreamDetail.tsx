
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Plus, ArrowLeft } from 'lucide-react';
import { Dream } from '@/types/dream';

interface DreamDetailProps {
  dream: Dream;
  onUpdateDream: (id: string, updates: Partial<Dream>) => void;
  onAddStep: (dreamId: string, step: { title: string; description?: string; completed: boolean; targetDate?: string }) => void;
  onToggleStep: (dreamId: string, stepId: string) => void;
  onBack: () => void;
}

export const DreamDetail = ({ dream, onUpdateDream, onAddStep, onToggleStep, onBack }: DreamDetailProps) => {
  const [newStep, setNewStep] = useState('');
  const [reflection, setReflection] = useState(dream.reflection || '');

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.trim()) return;

    onAddStep(dream.id, {
      title: newStep.trim(),
      completed: false,
    });
    setNewStep('');
  };

  const handleUpdateReflection = () => {
    onUpdateDream(dream.id, { reflection });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const completedSteps = dream.steps.filter(step => step.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">{dream.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Dream Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Impian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dream.imageUrl && (
                <img
                  src={dream.imageUrl}
                  alt={dream.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              
              <div>
                <Label className="text-sm font-medium">Alasan & Motivasi</Label>
                <p className="mt-1 text-sm text-muted-foreground">{dream.reason}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dream.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Target: {new Date(dream.deadline).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
                {dream.estimatedFund && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Dana: {formatCurrency(dream.estimatedFund)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Steps Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Langkah-langkah ({completedSteps}/{dream.steps.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress Keseluruhan</span>
                  <span>{dream.progress}%</span>
                </div>
                <Progress value={dream.progress} className="h-3" />
              </div>

              <form onSubmit={handleAddStep} className="flex gap-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Tambah langkah baru..."
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </form>

              <div className="space-y-3">
                {dream.steps
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        step.completed ? 'bg-green-50 border-green-200' : 'bg-background'
                      }`}
                    >
                      <Checkbox
                        checked={step.completed}
                        onCheckedChange={() => onToggleStep(dream.id, step.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {step.title}
                        </p>
                        {step.completedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Selesai: {new Date(step.completedAt).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{dream.progress}%</div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedSteps}</div>
                  <p className="text-xs text-muted-foreground">Langkah Selesai</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold">{dream.steps.length - completedSteps}</div>
                <p className="text-xs text-muted-foreground">Langkah Tersisa</p>
              </div>
            </CardContent>
          </Card>

          {/* Reflection */}
          <Card>
            <CardHeader>
              <CardTitle>Refleksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Tulis refleksi tentang perjalanan menuju impian ini..."
                rows={4}
              />
              <Button
                onClick={handleUpdateReflection}
                size="sm"
                className="w-full"
                disabled={reflection === dream.reflection}
              >
                Simpan Refleksi
              </Button>
            </CardContent>
          </Card>

          {/* Dream Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Dibuat: {new Date(dream.createdAt).toLocaleDateString('id-ID')}
              </div>
              <div className="text-xs text-muted-foreground">
                Terakhir update: {new Date(dream.updatedAt).toLocaleDateString('id-ID')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
