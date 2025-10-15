
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Asset } from '@/types/asset';
import { AssetForm } from './AssetForm';

interface AssetListProps {
  assets: Asset[];
  onEdit: (id: string, data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const getCategoryLabel = (category: string) => {
  const labels = {
    'cash': 'Cash',
    'e-wallet': 'E-Wallet',
    'bank-account': 'Rekening Bank',
    'investment': 'Investasi',
    'other': 'Lainnya'
  };
  return labels[category as keyof typeof labels] || category;
};

const getCategoryColor = (category: string) => {
  const colors = {
    'cash': 'bg-green-100 text-green-800',
    'e-wallet': 'bg-blue-100 text-blue-800',
    'bank-account': 'bg-purple-100 text-purple-800',
    'investment': 'bg-yellow-100 text-yellow-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const AssetList = ({ assets, onEdit, onDelete }: AssetListProps) => {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
  };

  const handleEditSubmit = (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAsset) {
      onEdit(editingAsset.id, data);
      setEditingAsset(null);
    }
  };

  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Belum ada aset yang ditambahkan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Aset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{asset.name}</h3>
                    <Badge className={getCategoryColor(asset.category)}>
                      {getCategoryLabel(asset.category)}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(asset.balance)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Saldo awal: {formatCurrency(asset.initialBalance)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(asset)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
                        onDelete(asset.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Aset</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <AssetForm
              initialData={editingAsset}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingAsset(null)}
              title="Edit Aset"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
