
export interface Asset {
  id: string;
  name: string;
  category: 'cash' | 'e-wallet' | 'bank-account' | 'investment' | 'other';
  balance: number;
  initialBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetTransaction {
  id: string;
  assetId: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  description: string;
  date: string;
  relatedExpenseId?: string;
  createdAt: string;
}

export interface AssetSummary {
  totalBalance: number;
  totalAssets: number;
  topAsset: {
    name: string;
    balance: number;
  };
}
