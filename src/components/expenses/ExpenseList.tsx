
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2 } from 'lucide-react';
import { Expense } from '@/types/expense';
import { ExpenseForm } from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string, data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

const categoryLabels = {
  makan: 'Makan',
  transportasi: 'Transportasi',
  hiburan: 'Hiburan',
  belanja: 'Belanja',
  lainnya: 'Lainnya'
};

const paymentMethodLabels = {
  cash: 'Cash',
  'e-wallet': 'E-wallet',
  transfer: 'Transfer'
};

const categoryColors = {
  makan: 'bg-green-100 text-green-800',
  transportasi: 'bg-blue-100 text-blue-800',
  hiburan: 'bg-purple-100 text-purple-800',
  belanja: 'bg-pink-100 text-pink-800',
  lainnya: 'bg-gray-100 text-gray-800'
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      onEdit(editingExpense.id, data);
      setIsEditDialogOpen(false);
      setEditingExpense(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Belum ada data pengeluaran.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[expense.category]}>
                        {categoryLabels[expense.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        {expense.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {expense.notes}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {paymentMethodLabels[expense.paymentMethod]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pengeluaran</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              onSubmit={handleEditSubmit}
              onCancel={handleCancelEdit}
              initialData={editingExpense}
              title="Edit Pengeluaran"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
