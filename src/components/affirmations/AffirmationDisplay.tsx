
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface AffirmationDisplayProps {
  affirmation: string;
  type: 'morning' | 'evening';
  onClose?: () => void;
  isAutomatic?: boolean;
}

export const AffirmationDisplay: React.FC<AffirmationDisplayProps> = ({
  affirmation,
  type,
  onClose,
  isAutomatic = false
}) => {
  const Icon = type === 'morning' ? Sun : Moon;
  const timeText = type === 'morning' ? 'Pagi' : 'Malam';
  const bgGradient = type === 'morning' 
    ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200'
    : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200';

  return (
    <Card className={`max-w-md mx-auto ${bgGradient}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon className={`h-6 w-6 ${type === 'morning' ? 'text-orange-500' : 'text-purple-500'}`} />
          <CardTitle className="text-lg">Afirmasi {timeText}</CardTitle>
          <Sparkles className={`h-5 w-5 ${type === 'morning' ? 'text-yellow-500' : 'text-indigo-500'}`} />
        </div>
        {isAutomatic && (
          <p className="text-sm text-muted-foreground">
            Selamat {timeText.toLowerCase()}! ✨
          </p>
        )}
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <blockquote className="text-lg font-medium italic leading-relaxed">
          "{affirmation}"
        </blockquote>
        {onClose && (
          <Button onClick={onClose} variant="outline" className="w-full">
            Terima kasih
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
