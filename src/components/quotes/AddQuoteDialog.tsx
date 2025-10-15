import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Quote } from '@/hooks/useQuotes';

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (text: string, author: string, category: string) => void;
  onEdit?: (id: string, text: string, author: string, category: string) => void;
  editingQuote?: Quote | null;
}

export const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  editingQuote
}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('motivasi');

  useEffect(() => {
    if (editingQuote) {
      setText(editingQuote.text);
      setAuthor(editingQuote.author);
      setCategory(editingQuote.category);
    } else {
      setText('');
      setAuthor('');
      setCategory('motivasi');
    }
  }, [editingQuote, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;

    if (editingQuote && onEdit) {
      onEdit(editingQuote.id, text.trim(), author.trim(), category);
    } else {
      onAdd(text.trim(), author.trim(), category);
    }

    setText('');
    setAuthor('');
    setCategory('motivasi');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingQuote ? 'Edit Quote' : 'Tambah Quote Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingQuote 
              ? 'Perbarui quote motivasi Anda'
              : 'Tambahkan quote atau motivasi yang menginspirasi Anda'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote-text">Quote / Motivasi</Label>
            <Textarea
              id="quote-text"
              placeholder="Tuliskan quote yang menginspirasi..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Penulis / Sumber</Label>
            <Input
              id="author"
              placeholder="Nama penulis atau sumber"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motivasi">Motivasi</SelectItem>
                <SelectItem value="inspirasi">Inspirasi</SelectItem>
                <SelectItem value="hikmah">Hikmah</SelectItem>
                <SelectItem value="spiritual">Spiritual</SelectItem>
                <SelectItem value="produktivitas">Produktivitas</SelectItem>
                <SelectItem value="kesuksesan">Kesuksesan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {editingQuote ? 'Simpan Perubahan' : 'Tambah Quote'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
