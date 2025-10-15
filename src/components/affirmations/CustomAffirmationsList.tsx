
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { Edit, Trash, Sun, Moon, Save, X } from 'lucide-react';

interface Affirmation {
  id: string;
  text: string;
  type: 'morning' | 'evening';
  createdAt: string;
}

interface CustomAffirmationsListProps {
  affirmations: Affirmation[];
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

export const CustomAffirmationsList: React.FC<CustomAffirmationsListProps> = ({
  affirmations,
  onEdit,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startEdit = (affirmation: Affirmation) => {
    setEditingId(affirmation.id);
    setEditText(affirmation.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onEdit(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (affirmations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Belum ada afirmasi yang ditambahkan. Klik "Tambah Afirmasi Sendiri" untuk memulai.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Afirmasi Anda ({affirmations.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {affirmations.map((affirmation) => (
            <div
              key={affirmation.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 ${
                    affirmation.type === 'morning'
                      ? 'border-orange-200 text-orange-700'
                      : 'border-purple-200 text-purple-700'
                  }`}
                >
                  {affirmation.type === 'morning' ? (
                    <Sun className="h-3 w-3" />
                  ) : (
                    <Moon className="h-3 w-3" />
                  )}
                  {affirmation.type === 'morning' ? 'Pagi' : 'Malam'}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(affirmation)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(affirmation.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {editingId === affirmation.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    maxLength={1000}
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {editText.length}/1000 karakter
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3 mr-1" />
                        Batal
                      </Button>
                      <Button size="sm" onClick={saveEdit} disabled={!editText.trim()}>
                        <Save className="h-3 w-3 mr-1" />
                        Simpan
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <blockquote className="text-sm italic leading-relaxed">
                  "{affirmation.text}"
                </blockquote>
              )}

              <p className="text-xs text-muted-foreground">
                Ditambahkan: {new Date(affirmation.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Afirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus afirmasi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
