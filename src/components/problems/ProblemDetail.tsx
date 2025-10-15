
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Problem, ProblemSolution } from '@/types/problem';
import { ArrowLeft, Plus, CheckCircle2, Clock, AlertCircle, Heart, Brain, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProblemDetailProps {
  problem: Problem;
  onUpdateProblem: (id: string, updates: Partial<Problem>) => void;
  onAddSolution: (problemId: string, solution: Omit<ProblemSolution, 'id' | 'order'>) => void;
  onToggleSolution: (problemId: string, solutionId: string) => void;
  onBack: () => void;
}

const STATUS_CONFIG = {
  active: { color: 'bg-red-500', icon: AlertCircle, label: 'Belum Diatasi' },
  progress: { color: 'bg-yellow-500', icon: Clock, label: 'Dalam Progres' },
  resolved: { color: 'bg-green-500', icon: CheckCircle2, label: 'Tuntas' },
};

const SPIRITUAL_QUOTES = [
  {
    text: "Dan barangsiapa yang bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar.",
    source: "QS. At-Talaq: 2",
    category: "keluar"
  },
  {
    text: "Dan sesungguhnya sesudah kesulitan itu ada kemudahan.",
    source: "QS. Ash-Sharh: 6",
    category: "kesulitan"
  },
  {
    text: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    source: "QS. Al-Baqarah: 286",
    category: "beban"
  }
];

export const ProblemDetail = ({ 
  problem, 
  onUpdateProblem, 
  onAddSolution, 
  onToggleSolution, 
  onBack 
}: ProblemDetailProps) => {
  const [newSolution, setNewSolution] = useState({ title: '', description: '' });
  const [showSolutionForm, setShowSolutionForm] = useState(false);

  const statusConfig = STATUS_CONFIG[problem.status];
  const StatusIcon = statusConfig.icon;

  const handleAddSolution = () => {
    if (!newSolution.title.trim()) return;
    
    onAddSolution(problem.id, {
      title: newSolution.title,
      description: newSolution.description,
      completed: false,
    });
    
    setNewSolution({ title: '', description: '' });
    setShowSolutionForm(false);
  };

  const calculateProgress = () => {
    if (problem.solutions.length === 0) return 0;
    const completed = problem.solutions.filter(s => s.completed).length;
    return Math.round((completed / problem.solutions.length) * 100);
  };

  const handleStatusChange = (newStatus: string) => {
    const updates: Partial<Problem> = { status: newStatus as any };
    if (newStatus === 'resolved') {
      updates.completionDate = new Date().toISOString().split('T')[0];
    }
    onUpdateProblem(problem.id, updates);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${statusConfig.color}`} />
          <StatusIcon className="w-5 h-5" />
          <h1 className="text-2xl font-bold">{problem.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Detail Masalah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={problem.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Belum Diatasi</SelectItem>
                      <SelectItem value="progress">Dalam Progres</SelectItem>
                      <SelectItem value="resolved">Tuntas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tingkat Kesulitan</Label>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className={`w-4 h-4 rounded-full ${
                          level <= problem.difficulty ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm">{problem.difficulty}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Deskripsi</Label>
                <p className="text-sm text-muted-foreground mt-1">{problem.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Mulai: {new Date(problem.startDate).toLocaleDateString('id-ID')}
                </Badge>
                {problem.completionDate && (
                  <Badge variant="outline" className="bg-green-50">
                    Selesai: {new Date(problem.completionDate).toLocaleDateString('id-ID')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emotional Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Respons Emosional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {problem.emotions.map(emotion => (
                  <Badge key={emotion} variant="secondary">
                    {emotion}
                  </Badge>
                ))}
              </div>
              {problem.emotionalReflection && (
                <div>
                  <Label className="text-sm font-medium">Refleksi</Label>
                  <p className="text-sm text-muted-foreground mt-1">{problem.emotionalReflection}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Root Cause Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Analisis Akar Masalah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Dari Diri Sendiri</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {problem.causeTriangle.self || 'Belum dianalisis'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dari Orang Lain</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {problem.causeTriangle.others || 'Belum dianalisis'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dari Lingkungan</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {problem.causeTriangle.environment || 'Belum dianalisis'}
                  </p>
                </div>
              </div>

              {problem.whyAnalysis.some(why => why.trim()) && (
                <div>
                  <Label className="text-sm font-medium">5 Why's Analysis</Label>
                  <div className="space-y-1 mt-2">
                    {problem.whyAnalysis.map((why, index) => 
                      why.trim() && (
                        <div key={index} className="text-sm">
                          <span className="font-medium">Why #{index + 1}:</span> {why}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Solusi & Tindakan ({calculateProgress()}%)
                </div>
                <Button onClick={() => setShowSolutionForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Solusi
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showSolutionForm && (
                <div className="p-4 border rounded-lg space-y-3">
                  <Input
                    placeholder="Judul solusi..."
                    value={newSolution.title}
                    onChange={(e) => setNewSolution(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Deskripsi langkah konkret..."
                    value={newSolution.description}
                    onChange={(e) => setNewSolution(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddSolution}>Tambah</Button>
                    <Button variant="outline" onClick={() => setShowSolutionForm(false)}>
                      Batal
                    </Button>
                  </div>
                </div>
              )}

              {problem.solutions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Belum ada solusi. Tambahkan langkah konkret untuk menyelesaikan masalah.
                </p>
              ) : (
                problem.solutions.map(solution => (
                  <div key={solution.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={solution.completed}
                      onCheckedChange={() => onToggleSolution(problem.id, solution.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${solution.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {solution.title}
                      </h4>
                      {solution.description && (
                        <p className={`text-sm mt-1 ${solution.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {solution.description}
                        </p>
                      )}
                      {solution.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Selesai: {new Date(solution.completedAt).toLocaleDateString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Spiritual Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Amalan Spiritual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {problem.spiritualPractices.length > 0 ? (
                <div className="space-y-2">
                  {problem.spiritualPractices.map((practice, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {practice}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Belum ada amalan spiritual</p>
              )}
            </CardContent>
          </Card>

          {/* Spiritual Quotes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inspirasi Spiritual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SPIRITUAL_QUOTES.map((quote, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">"{quote.text}"</p>
                    <p className="text-xs text-green-600">— {quote.source}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lessons */}
          {problem.lessons && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pelajaran</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{problem.lessons}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
