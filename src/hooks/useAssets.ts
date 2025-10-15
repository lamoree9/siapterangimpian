
import { useState, useEffect } from 'react';
import { Asset, AssetTransaction, AssetSummary } from '@/types/asset';

const ASSETS_STORAGE_KEY = 'assets';
const ASSET_TRANSACTIONS_STORAGE_KEY = 'asset-transactions';

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<AssetTransaction[]>([]);

  useEffect(() => {
    const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
    const storedTransactions = localStorage.getItem(ASSET_TRANSACTIONS_STORAGE_KEY);
    
    if (storedAssets) {
      try {
        setAssets(JSON.parse(storedAssets));
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    }

    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (error) {
        console.error('Error loading asset transactions:', error);
      }
    }
  }, []);

  const saveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
  };

  const saveTransactions = (newTransactions: AssetTransaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem(ASSET_TRANSACTIONS_STORAGE_KEY, JSON.stringify(newTransactions));
  };

  const addAsset = (assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, assetData: Partial<Omit<Asset, 'id' | 'createdAt'>>) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id
        ? { ...asset, ...assetData, updatedAt: new Date().toISOString() }
        : asset
    );
    saveAssets(updatedAssets);
  };

  const deleteAsset = (id: string) => {
    const filteredAssets = assets.filter(asset => asset.id !== id);
    saveAssets(filteredAssets);
    
    // Also remove related transactions
    const filteredTransactions = transactions.filter(transaction => transaction.assetId !== id);
    saveTransactions(filteredTransactions);
  };

  const deductFromAsset = (paymentMethod: string, amount: number, description: string, expenseId?: string) => {
    const matchingAsset = assets.find(asset => 
      asset.name.toLowerCase() === paymentMethod.toLowerCase() ||
      (paymentMethod === 'cash' && asset.category === 'cash') ||
      (paymentMethod === 'e-wallet' && asset.category === 'e-wallet') ||
      (paymentMethod === 'transfer' && asset.category === 'bank-account')
    );

    if (matchingAsset && matchingAsset.balance >= amount) {
      // Update asset balance
      updateAsset(matchingAsset.id, {
        balance: matchingAsset.balance - amount
      });

      // Add transaction record
      const newTransaction: AssetTransaction = {
        id: Date.now().toString(),
        assetId: matchingAsset.id,
        type: 'expense',
        amount: amount,
        description: description,
        date: new Date().toISOString().split('T')[0],
        relatedExpenseId: expenseId,
        createdAt: new Date().toISOString(),
      };

      saveTransactions([...transactions, newTransaction]);
      return true;
    }
    return false;
  };

  const getSummary = (): AssetSummary => {
    const totalBalance = assets.reduce((sum, asset) => sum + asset.balance, 0);
    const totalAssets = assets.length;

    const topAsset = assets.reduce(
      (max, asset) => asset.balance > max.balance ? { name: asset.name, balance: asset.balance } : max,
      { name: '', balance: 0 }
    );

    return {
      totalBalance,
      totalAssets,
      topAsset
    };
  };

  return {
    assets,
    transactions,
    addAsset,
    updateAsset,
    deleteAsset,
    deductFromAsset,
    getSummary
  };
};
