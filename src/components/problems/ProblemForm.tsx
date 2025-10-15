
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Problem, ProblemCategory, EmotionType } from '@/types/problem';
import { Calendar, Plus, Heart, Brain } from 'lucide-react';

interface ProblemFormProps {
  onSubmit: (problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CATEGORIES: { value: ProblemCategory; label: string; icon: string }[] = [
  { value: 'emosi', label: 'Emosi', icon: '💭' },
  { value: 'finansial', label: 'Finansial', icon: '💰' },
  { value: 'relasi', label: 'Relasi', icon: '👥' },
  { value: 'ibadah', label: 'Ibadah', icon: '🕌' },
  { value: 'kesehatan', label: 'Kesehatan', icon: '🏥' },
  { value: 'karier', label: 'Karier', icon: '💼' },
  { value: 'keluarga', label: 'Keluarga', icon: '👨‍👩‍👧‍👦' },
  { value: 'pendidikan', label: 'Pendidikan', icon: '🎓' },
  { value: 'other', label: 'Lainnya', icon: '⭐' },
];

const EMOTIONS: { value: EmotionType; label: string }[] = [
  { value: 'marah', label: 'Marah' },
  { value: 'sedih', label: 'Sedih' },
  { value: 'kecewa', label: 'Kecewa' },
  { value: 'takut', label: 'Takut' },
  { value: 'bingung', label: 'Bingung' },
  { value: 'frustrasi', label: 'Frustrasi' },
  { value: 'cemas', label: 'Cemas' },
  { value: 'stress', label: 'Stress' },
  { value: 'putus_asa', label: 'Putus Asa' },
];

export const ProblemForm = ({ onSubmit }: ProblemFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as ProblemCategory,
    description: '',
    difficulty: 1,
    startDate: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    rootCauses: [''],
    whyAnalysis: ['', '', '', '', ''],
    causeTriangle: {
      self: '',
      others: '',
      environment: '',
    },
    emotions: [] as EmotionType[],
    emotionalReflection: '',
    solutions: [],
    spiritualPractices: [''],
    lessons: '',
    progressNotes: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSubmit({
      ...formData,
      rootCauses: formData.rootCauses.filter(cause => cause.trim()),
      whyAnalysis: formData.whyAnalysis.filter(why => why.trim()),
      spiritualPractices: formData.spiritualPractices.filter(practice => practice.trim()),
    });

    // Reset form
    setFormData({
      name: '',
      category: 'other',
      description: '',
      difficulty: 1,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      rootCauses: [''],
      whyAnalysis: ['', '', '', '', ''],
      causeTriangle: {
        self: '',
        others: '',
        environment: '',
      },
      emotions: [],
      emotionalReflection: '',
      solutions: [],
      spiritualPractices: [''],
      lessons: '',
      progressNotes: [],
    });
  };

  const toggleEmotion = (emotion: EmotionType) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const updateArrayField = (field: 'rootCauses' | 'whyAnalysis' | 'spiritualPractices', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'rootCauses' | 'spiritualPractices') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Tambah Masalah Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Masalah *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Sulit mengatur waktu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value: ProblemCategory) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai Terasa</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Tingkat Kesulitan (1-5)</Label>
                <Select value={formData.difficulty.toString()} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, difficulty: parseInt(value) }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        {level} {level === 1 ? '(Mudah)' : level === 5 ? '(Sangat Sulit)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Masalah</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Jelaskan masalah secara detail..."
                rows={3}
              />
            </div>

            {/* Emotional Response */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <Label className="text-lg font-semibold">Respons Emosional</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Emosi yang Dirasakan</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map(emotion => (
                    <Badge
                      key={emotion.value}
                      variant={formData.emotions.includes(emotion.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEmotion(emotion.value)}
                    >
                      {emotion.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emotionalReflection">Refleksi Emosional</Label>
                <Textarea
                  id="emotionalReflection"
                  value={formData.emotionalReflection}
                  onChange={(e) => setFormData(prev => ({ ...prev, emotionalReflection: e.target.value }))}
                  placeholder="Bagaimana perasaan Anda tentang masalah ini?"
                  rows={2}
                />
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Analisis Akar Masalah</Label>
              
              <div className="space-y-2">
                <Label>Segitiga Penyebab</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="causeSelf">Dari Diri Sendiri</Label>
                    <Textarea
                      id="causeSelf"
                      value={formData.causeTriangle.self}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        causeTriangle: { ...prev.causeTriangle, self: e.target.value }
                      }))}
                      placeholder="Apa kontribusi saya?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="causeOthers">Dari Orang Lain</Label>
                    <Textarea
                      id="causeOthers"
                      value={formData.causeTriangle.others}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        causeTriangle: { ...prev.causeTriangle, others: e.target.value }
                      }))}
                      placeholder="Bagaimana peran orang lain?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="causeEnvironment">Dari Lingkungan</Label>
                    <Textarea
                      id="causeEnvironment"
                      value={formData.causeTriangle.environment}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        causeTriangle: { ...prev.causeTriangle, environment: e.target.value }
                      }))}
                      placeholder="Faktor eksternal apa?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>5 Why's Analysis</Label>
                {formData.whyAnalysis.map((why, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`why-${index}`}>Why #{index + 1}</Label>
                    <Input
                      id={`why-${index}`}
                      value={why}
                      onChange={(e) => updateArrayField('whyAnalysis', index, e.target.value)}
                      placeholder={index === 0 ? "Mengapa masalah ini terjadi?" : "Mengapa hal sebelumnya terjadi?"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Spiritual Practices */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Amalan Spiritual</Label>
              {formData.spiritualPractices.map((practice, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={practice}
                    onChange={(e) => updateArrayField('spiritualPractices', index, e.target.value)}
                    placeholder="Contoh: Istighfar, Shalat Tahajud, Zikir penenang"
                  />
                  {index === formData.spiritualPractices.length - 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => addArrayField('spiritualPractices')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Tambah Masalah
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
