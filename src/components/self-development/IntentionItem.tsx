
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DailyIntention } from '@/types/intention';
import { useIntentionCategories } from '@/hooks/useIntentionCategories';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

const ICON_MAP = {
  Heart: React.lazy(() => import('lucide-react').then(module => ({ default: module.Heart }))),
  Briefcase: React.lazy(() => import('lucide-react').then(module => ({ default: module.Briefcase }))),
  Activity: React.lazy(() => import('lucide-react').then(module => ({ default: module.Activity }))),
  Users: React.lazy(() => import('lucide-react').then(module => ({ default: module.Users }))),
  Star: React.lazy(() => import('lucide-react').then(module => ({ default: module.Star })))
};

interface IntentionItemProps {
  intention: DailyIntention;
  onUpdate: (id: string, updates: Partial<DailyIntention>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const IntentionItem: React.FC<IntentionItemProps> = ({
  intention,
  onUpdate,
  onDelete,
  onToggleComplete
}) => {
  const { categories } = useIntentionCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(intention.intention);
  const [editCategory, setEditCategory] = useState(intention.category || 'no-category');

  const handleSave = () => {
    if (!editText.trim()) {
      toast.error('Niat tidak boleh kosong');
      return;
    }
    
    const categoryToSave = editCategory === 'no-category' ? undefined : editCategory;
    onUpdate(intention.id, {
      intention: editText.trim(),
      category: categoryToSave
    });
    
    setIsEditing(false);
    toast.success('Niat berhasil diperbarui');
  };

  const handleCancel = () => {
    setEditText(intention.intention);
    setEditCategory(intention.category || 'no-category');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus niat ini?')) {
      onDelete(intention.id);
      toast.success('Niat berhasil dihapus');
    }
  };

  const categoryInfo = categories.find(cat => cat.value === intention.category);

  if (isEditing) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4 space-y-3">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[80px] resize-none"
            placeholder="Edit niat Anda..."
          />
          
          <Select value={editCategory} onValueChange={setEditCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori (opsional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-category">Tanpa kategori</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-all ${intention.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            onClick={() => onToggleComplete(intention.id)}
            variant={intention.completed ? "default" : "outline"}
            size="sm"
            className={`mt-1 ${intention.completed ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            <Check className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 space-y-2">
            <p className={`${intention.completed ? 'line-through text-muted-foreground' : ''}`}>
              {intention.intention}
            </p>
            
            {categoryInfo && (
              <Badge className={categoryInfo.color}>
                {categoryInfo.label}
              </Badge>
            )}
            
            <div className="text-xs text-muted-foreground">
              Dibuat: {new Date(intention.createdAt).toLocaleTimeString('id-ID')}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              disabled={intention.completed}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
