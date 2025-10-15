
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryComboBox } from './CategoryComboBox';
import { Expense } from '@/types/expense';

interface ExpenseFormData {
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'e-wallet' | 'transfer';
  notes?: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  initialData?: Expense;
  title?: string;
}

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'e-wallet', label: 'E-wallet' },
  { value: 'transfer', label: 'Transfer' }
];

export const ExpenseForm = ({ onSubmit, onCancel, initialData, title = "Tambah Pengeluaran" }: ExpenseFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ExpenseFormData>({
    defaultValues: initialData ? {
      date: initialData.date,
      category: initialData.category,
      description: initialData.description,
      amount: initialData.amount,
      paymentMethod: initialData.paymentMethod,
      notes: initialData.notes || ''
    } : {
      date: new Date().toISOString().split('T')[0]
    }
  });

  const selectedCategory = watch('category');
  const selectedPaymentMethod = watch('paymentMethod');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Tanggal harus diisi' })}
            />
            {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <CategoryComboBox
              value={selectedCategory}
              onValueChange={(value) => setValue('category', value)}
            />
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              {...register('description', { required: 'Deskripsi harus diisi' })}
              placeholder="Deskripsi pengeluaran"
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="amount">Nominal (Rp)</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount', { 
                required: 'Nominal harus diisi',
                min: { value: 1, message: 'Nominal harus lebih dari 0' }
              })}
              placeholder="0"
            />
            {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
            <Select value={selectedPaymentMethod} onValueChange={(value) => setValue('paymentMethod', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Catatan tambahan..."
              rows={3}
            />
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
