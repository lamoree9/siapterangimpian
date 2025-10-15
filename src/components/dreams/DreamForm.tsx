
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DreamCategory } from '@/types/dream';

interface DreamFormProps {
  onSubmit: (dream: {
    name: string;
    category: DreamCategory;
    reason: string;
    deadline?: string;
    estimatedFund?: number;
    imageUrl?: string;
    steps: Array<{ title: string; description?: string; completed: boolean; targetDate?: string }>;
    connectedHabits: string[];
  }) => void;
}

const CATEGORIES = [
  { value: 'house', label: 'Rumah', icon: '🏠' },
  { value: 'car', label: 'Kendaraan', icon: '🚗' },
  { value: 'career', label: 'Karier', icon: '💼' },
  { value: 'worship', label: 'Ibadah', icon: '🕌' },
  { value: 'education', label: 'Pendidikan', icon: '🎓' },
  { value: 'health', label: 'Kesehatan', icon: '💪' },
  { value: 'travel', label: 'Perjalanan', icon: '✈️' },
  { value: 'business', label: 'Bisnis', icon: '📈' },
  { value: 'family', label: 'Keluarga', icon: '👨‍👩‍👧‍👦' },
  { value: 'other', label: 'Lainnya', icon: '⭐' },
] as const;

export const DreamForm = ({ onSubmit }: DreamFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '' as DreamCategory,
    reason: '',
    deadline: '',
    estimatedFund: '',
    imageUrl: '',
    steps: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category || !formData.reason.trim()) return;

    const steps = formData.steps
      .filter(step => step.trim())
      .map(title => ({
        title: title.trim(),
        completed: false,
      }));

    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      reason: formData.reason.trim(),
      deadline: formData.deadline || undefined,
      estimatedFund: formData.estimatedFund ? Number(formData.estimatedFund) : undefined,
      imageUrl: formData.imageUrl || undefined,
      steps,
      connectedHabits: [],
    });

    // Reset form
    setFormData({
      name: '',
      category: '' as DreamCategory,
      reason: '',
      deadline: '',
      estimatedFund: '',
      imageUrl: '',
      steps: ['']
    });
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Impian Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Impian</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Contoh: Membeli rumah impian"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value: DreamCategory) => 
              setFormData(prev => ({ ...prev, category: value }))
            } required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori impian" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Alasan & Motivasi</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Mengapa impian ini penting? Apa motivasi di baliknya?"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Target Deadline (Opsional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="estimatedFund">Estimasi Dana (Opsional)</Label>
              <Input
                id="estimatedFund"
                type="number"
                value={formData.estimatedFund}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedFund: e.target.value }))}
                placeholder="dalam Rupiah"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL Gambar Inspirasi (Opsional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label>Langkah-langkah Konkret</Label>
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Langkah ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.steps.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(index)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
                className="w-full"
              >
                + Tambah Langkah
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Tambah Impian
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
