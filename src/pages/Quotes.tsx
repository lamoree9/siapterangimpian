import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { AddQuoteDialog } from '@/components/quotes/AddQuoteDialog';
import { CustomQuotesList } from '@/components/quotes/CustomQuotesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuotes, Quote } from '@/hooks/useQuotes';
import { Plus, RefreshCw, Sparkles } from 'lucide-react';

const Quotes = () => {
  const { quotes, addQuote, editQuote, deleteQuote, getDailyQuote, getRandomQuote } = useQuotes();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [displayedQuote, setDisplayedQuote] = useState<Quote>(() => getDailyQuote());

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingQuote(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quote & Motivasi</h1>
          <p className="text-muted-foreground">
            Kata-kata inspiratif untuk menemani perjalanan Anda
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quote Hari Ini</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDisplayedQuote(getRandomQuote())}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Quote Lainnya
            </Button>
          </div>
          <QuoteCard quote={displayedQuote} />
        </div>

        <div className="flex justify-between items-center pt-4">
          <div>
            <h2 className="text-xl font-semibold">Quote Custom</h2>
            <p className="text-sm text-muted-foreground">
              Koleksi quote dan motivasi pribadi Anda
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Quote
          </Button>
        </div>

        <CustomQuotesList
          quotes={quotes}
          onEdit={handleEdit}
          onDelete={deleteQuote}
        />

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Tentang Quote & Motivasi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Quote dan kata-kata motivasi dapat memberikan inspirasi, semangat, dan perspektif baru 
              dalam menghadapi tantangan sehari-hari. Simpan quote favorit Anda dan kembali membacanya 
              saat membutuhkan dorongan positif.
            </p>
            <div className="text-sm space-y-1">
              <p>✨ Quote hari ini berubah setiap hari secara otomatis</p>
              <p>✨ Tambahkan quote pribadi yang menginspirasi Anda</p>
              <p>✨ Kategorikan quote berdasarkan tema</p>
            </div>
          </CardContent>
        </Card>

        <AddQuoteDialog
          open={showAddDialog}
          onOpenChange={handleCloseDialog}
          onAdd={addQuote}
          onEdit={editQuote}
          editingQuote={editingQuote}
        />
      </div>
    </AppLayout>
  );
};

export default Quotes;
