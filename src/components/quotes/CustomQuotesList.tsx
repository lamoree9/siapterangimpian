import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Sparkles } from 'lucide-react';
import { Quote } from '@/hooks/useQuotes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomQuotesListProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
}

export const CustomQuotesList: React.FC<CustomQuotesListProps> = ({
  quotes,
  onEdit,
  onDelete
}) => {
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  if (quotes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>Belum ada quote custom. Tambahkan quote pertama Anda!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        {quotes.map((quote) => (
          <Card key={quote.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary/40">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <blockquote className="text-sm font-medium italic leading-relaxed">
                    "{quote.text}"
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">— {quote.author}</p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground capitalize">{quote.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(quote)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(quote.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Quote?</AlertDialogTitle>
            <AlertDialogDescription>
              Quote ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
