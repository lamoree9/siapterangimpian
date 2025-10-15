
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, Coins } from 'lucide-react';
import { AssetSummary as AssetSummaryType } from '@/types/asset';

interface AssetSummaryProps {
  summary: AssetSummaryType;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const AssetSummary = ({ summary }: AssetSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Saldo</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.totalBalance)}
          </div>
          <p className="text-xs text-muted-foreground">Semua aset</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalAssets}</div>
          <p className="text-xs text-muted-foreground">Aset aktif</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aset Terbesar</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.topAsset.name ? (
              <>
                <Badge variant="secondary">
                  {summary.topAsset.name}
                </Badge>
                <div className="text-lg font-semibold">
                  {formatCurrency(summary.topAsset.balance)}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada aset</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
