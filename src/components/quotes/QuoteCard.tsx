import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote as QuoteIcon, Sparkles } from 'lucide-react';
import { Quote } from '@/hooks/useQuotes';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20 hover:shadow-lg transition-shadow">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
      <CardContent className="pt-6 relative">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <QuoteIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <blockquote className="text-base font-medium leading-relaxed italic">
              "{quote.text}"
            </blockquote>
            <div className="flex items-center justify-between pt-2 border-t border-primary/10">
              <div>
                <p className="text-sm font-semibold text-foreground">{quote.author}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs text-muted-foreground capitalize">{quote.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
