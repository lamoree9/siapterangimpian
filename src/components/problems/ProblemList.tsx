
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Problem } from '@/types/problem';
import { Calendar, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onDeleteProblem: (id: string) => void;
}

const CATEGORY_ICONS = {
  emosi: '💭',
  finansial: '💰',
  relasi: '👥',
  ibadah: '🕌',
  kesehatan: '🏥',
  karier: '💼',
  keluarga: '👨‍👩‍👧‍👦',
  pendidikan: '🎓',
  other: '⭐',
};

const STATUS_CONFIG = {
  active: { color: 'bg-red-500', icon: AlertCircle, label: 'Belum Diatasi' },
  progress: { color: 'bg-yellow-500', icon: Clock, label: 'Dalam Progres' },
  resolved: { color: 'bg-green-500', icon: CheckCircle2, label: 'Tuntas' },
};

export const ProblemList = ({ problems, onSelectProblem, onDeleteProblem }: ProblemListProps) => {
  if (problems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <AlertCircle className="mx-auto h-12 w-12 mb-4" />
          <p>Belum ada masalah yang tercatat.</p>
          <p className="text-sm">Mulai identifikasi masalah untuk penyelesaian yang lebih terarah!</p>
        </CardContent>
      </Card>
    );
  }

  const calculateProgress = (problem: Problem) => {
    if (problem.solutions.length === 0) return 0;
    const completed = problem.solutions.filter(s => s.completed).length;
    return Math.round((completed / problem.solutions.length) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {problems.map((problem) => {
        const statusConfig = STATUS_CONFIG[problem.status];
        const StatusIcon = statusConfig.icon;
        const progress = calculateProgress(problem);

        return (
          <Card key={problem.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{CATEGORY_ICONS[problem.category]}</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{problem.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-3 h-3 rounded-full ${statusConfig.color}`} />
                      <span className="text-sm text-muted-foreground">{statusConfig.label}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProblem(problem.id);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent onClick={() => onSelectProblem(problem)}>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {problem.description}
                </p>
                
                {problem.solutions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress Solusi</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(problem.startDate).toLocaleDateString('id-ID')}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Level {problem.difficulty}/5
                  </Badge>
                  {problem.emotions.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {problem.emotions.length} emosi
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {problem.solutions.length} solusi
                  </Badge>
                </div>

                {problem.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {problem.emotions.slice(0, 3).map(emotion => (
                      <Badge key={emotion} variant="secondary" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                    {problem.emotions.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{problem.emotions.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
