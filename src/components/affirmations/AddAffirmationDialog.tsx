
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon } from 'lucide-react';

interface AddAffirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (text: string, type: 'morning' | 'evening') => void;
}

export const AddAffirmationDialog: React.FC<AddAffirmationDialogProps> = ({
  open,
  onOpenChange,
  onAdd
}) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<'morning' | 'evening'>('morning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), type);
      setText('');
      setType('morning');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Afirmasi Sendiri</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Jenis Afirmasi</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as 'morning' | 'evening')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="morning" id="morning" />
                <Label htmlFor="morning" className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-orange-500" />
                  Afirmasi Pagi
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evening" id="evening" />
                <Label htmlFor="evening" className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-purple-500" />
                  Afirmasi Malam
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text">Teks Afirmasi</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan afirmasi positif Anda..."
              maxLength={1000}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              {text.length}/1000 karakter
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={!text.trim()}>
              Tambah Afirmasi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
