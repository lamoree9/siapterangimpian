
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIntentionCategories } from '@/hooks/useIntentionCategories';
import { Plus, X, Target } from 'lucide-react';
import { toast } from 'sonner';

interface AddIntentionFormProps {
  onAdd: (intention: string, category?: string) => void;
}

export const AddIntentionForm: React.FC<AddIntentionFormProps> = ({ onAdd }) => {
  const { categories, addCategory, removeCategory } = useIntentionCategories();
  const [intention, setIntention] = useState('');
  const [category, setCategory] = useState<string>('no-category');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) {
      toast.error('Masukkan niat Anda');
      return;
    }

    const categoryToSave = category === 'no-category' ? undefined : category;
    onAdd(intention.trim(), categoryToSave);
    setIntention('');
    setCategory('no-category');
    toast.success('Niat berhasil ditambahkan!');
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Masukkan nama kategori');
      return;
    }

    const categoryValue = addCategory(newCategoryName);
    setCategory(categoryValue);
    setNewCategoryName('');
    setShowAddCategory(false);
    toast.success('Kategori baru berhasil ditambahkan!');
  };

  const handleRemoveCategory = (categoryValue: string) => {
    removeCategory(categoryValue);
    if (category === categoryValue) {
      setCategory('no-category');
    }
    toast.success('Kategori berhasil dihapus!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tambah Niat Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Tulis niat Anda..."
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          <div className="space-y-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori (opsional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-category">Tanpa kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showAddCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Nama kategori baru"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button type="button" onClick={handleAddCategory} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddCategory(true)}
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kategori Baru
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Niat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
