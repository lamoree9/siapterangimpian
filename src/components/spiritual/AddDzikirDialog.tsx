import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddDzikirDialogProps {
  onAdd: (dzikir: {
    arabic: string;
    transliteration: string;
    translation: string;
    target: number;
    category: string;
  }) => void;
}

export const AddDzikirDialog = ({ onAdd }: AddDzikirDialogProps) => {
  const [open, setOpen] = useState(false);
  const [arabic, setArabic] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [translation, setTranslation] = useState('');
  const [target, setTarget] = useState('33');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!arabic || !transliteration || !translation || !target) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }

    onAdd({
      arabic,
      transliteration,
      translation,
      target: parseInt(target),
      category: 'custom'
    });

    toast({
      title: "Berhasil",
      description: "Dzikir berhasil ditambahkan"
    });

    // Reset form
    setArabic('');
    setTransliteration('');
    setTranslation('');
    setTarget('33');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Dzikir Custom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Dzikir Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="arabic">Teks Arab</Label>
            <Textarea
              id="arabic"
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              placeholder="سُبْحَانَ اللّٰهِ"
              className="font-arabic text-right text-xl"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transliteration">Transliterasi</Label>
            <Input
              id="transliteration"
              value={transliteration}
              onChange={(e) => setTransliteration(e.target.value)}
              placeholder="Subhanallah"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="translation">Terjemahan</Label>
            <Input
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Maha Suci Allah"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target">Target Hitungan</Label>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="33"
              min="1"
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
