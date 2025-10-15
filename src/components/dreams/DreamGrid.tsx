
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Target, Trash2 } from 'lucide-react';
import { Dream } from '@/types/dream';

interface DreamGridProps {
  dreams: Dream[];
  onDeleteDream: (id: string) => void;
  onSelectDream: (dream: Dream) => void;
}

const CATEGORY_ICONS = {
  house: '🏠',
  car: '🚗',
  career: '💼',
  worship: '🕌',
  education: '🎓',
  health: '💪',
  travel: '✈️',
  business: '📈',
  family: '👨‍👩‍👧‍👦',
  other: '⭐',
};

export const DreamGrid = ({ dreams, onDeleteDream, onSelectDream }: DreamGridProps) => {
  if (dreams.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Target className="mx-auto h-12 w-12 mb-4" />
          <p>Belum ada impian yang tercatat.</p>
          <p className="text-sm">Mulai petakan impian Anda untuk masa depan yang lebih terarah!</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dreams.map((dream) => (
        <Card key={dream.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{CATEGORY_ICONS[dream.category]}</span>
                <CardTitle className="text-lg line-clamp-2">{dream.name}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDream(dream.id);
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent onClick={() => onSelectDream(dream)}>
            {dream.imageUrl && (
              <div className="mb-4">
                <img
                  src={dream.imageUrl}
                  alt={dream.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dream.reason}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{dream.progress}%</span>
                </div>
                <Progress value={dream.progress} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-2">
                {dream.deadline && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(dream.deadline).toLocaleDateString('id-ID')}
                  </Badge>
                )}
                {dream.estimatedFund && (
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatCurrency(dream.estimatedFund)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {dream.steps.length} langkah
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
