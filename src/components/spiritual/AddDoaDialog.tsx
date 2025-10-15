import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddDoaDialogProps {
  onAdd: (doa: {
    title: string;
    arabic: string;
    transliteration: string;
    translation: string;
    category: string;
  }) => void;
}

export const AddDoaDialog = ({ onAdd }: AddDoaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [arabic, setArabic] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [translation, setTranslation] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !arabic || !transliteration || !translation) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }

    onAdd({
      title,
      arabic,
      transliteration,
      translation,
      category: 'custom'
    });

    toast({
      title: "Berhasil",
      description: "Doa berhasil ditambahkan"
    });

    // Reset form
    setTitle('');
    setArabic('');
    setTransliteration('');
    setTranslation('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Doa Custom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Doa Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Doa</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Doa Pagi Hari"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="arabic">Teks Arab</Label>
            <Textarea
              id="arabic"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              placeholder="اَللّٰهُمَّ بِكَ اَصْبَحْنَا..."
              className="font-arabic text-right text-lg"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transliteration">Transliterasi</Label>
            <Textarea
              id="transliteration"
              value={transliteration}
              onChange={(e) => setTransliteration(e.target.value)}
              placeholder="Allāhumma bika aṣbaḥnā..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="translation">Terjemahan</Label>
            <Textarea
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Ya Allah, dengan rahmat dan pertolongan-Mu..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              Tambah
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
