
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/types/asset';

interface AssetFormData {
  name: string;
  category: 'cash' | 'e-wallet' | 'bank-account' | 'investment' | 'other';
  balance: number;
}

interface AssetFormProps {
  onSubmit: (data: AssetFormData & { initialBalance: number }) => void;
  onCancel: () => void;
  initialData?: Asset;
  title?: string;
}

const assetCategories = [
  { value: 'cash', label: 'Cash' },
  { value: 'e-wallet', label: 'E-Wallet' },
  { value: 'bank-account', label: 'Rekening Bank' },
  { value: 'investment', label: 'Investasi' },
  { value: 'other', label: 'Lainnya' }
];

export const AssetForm = ({ onSubmit, onCancel, initialData, title = "Tambah Aset" }: AssetFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AssetFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      category: initialData.category,
      balance: initialData.balance
    } : {
      balance: 0
    }
  });

  const selectedCategory = watch('category');

  const handleFormSubmit = (data: AssetFormData) => {
    onSubmit({
      ...data,
      initialBalance: initialData ? initialData.initialBalance : data.balance
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Aset</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nama aset harus diisi' })}
              placeholder="Contoh: Cash, GoPay, BCA, dll"
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={selectedCategory} onValueChange={(value) => setValue('category', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori aset" />
              </SelectTrigger>
              <SelectContent>
                {assetCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <Label htmlFor="balance">Saldo {initialData ? 'Saat Ini' : 'Awal'} (Rp)</Label>
            <Input
              id="balance"
              type="number"
              {...register('balance', { 
                required: 'Saldo harus diisi',
                min: { value: 0, message: 'Saldo tidak boleh negatif' }
              })}
              placeholder="0"
            />
            {errors.balance && <p className="text-sm text-destructive mt-1">{errors.balance.message}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? 'Update' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
