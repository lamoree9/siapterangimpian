
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import { AssetForm } from "@/components/assets/AssetForm";
import { AssetSummary } from "@/components/assets/AssetSummary";
import { AssetList } from "@/components/assets/AssetList";
import { Asset } from "@/types/asset";

const AssetManager = () => {
  const { assets, addAsset, updateAsset, deleteAsset, getSummary } = useAssets();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddAsset = (data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    addAsset(data);
    setIsAddDialogOpen(false);
  };

  const handleEditAsset = (id: string, data: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateAsset(id, data);
  };

  const handleDeleteAsset = (id: string) => {
    deleteAsset(id);
  };

  const summary = getSummary();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Aset</h1>
            <p className="text-muted-foreground">
              Kelola dan pantau semua aset keuangan Anda.
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Aset
          </Button>
        </div>

        <AssetSummary summary={summary} />

        <AssetList
          assets={assets}
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Aset Baru</DialogTitle>
            </DialogHeader>
            <AssetForm
              onSubmit={handleAddAsset}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AssetManager;
