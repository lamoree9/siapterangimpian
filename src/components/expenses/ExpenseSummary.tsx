
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, ShoppingBag } from 'lucide-react';
import { ExpenseSummary as ExpenseSummaryType } from '@/types/expense';
import { useCategories } from '@/hooks/useCategories';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryType;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const ExpenseSummary = ({ summary }: ExpenseSummaryProps) => {
  const { categories } = useCategories();

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(summary.totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">Bulan ini</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalTransactions}</div>
          <p className="text-xs text-muted-foreground">Transaksi</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kategori Terbesar</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.topCategory.category ? (
              <>
                <Badge variant="secondary">
                  {getCategoryLabel(summary.topCategory.category)}
                </Badge>
                <div className="text-lg font-semibold">
                  {formatCurrency(summary.topCategory.amount)}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada data</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
