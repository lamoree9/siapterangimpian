
export interface Expense {
  id: string;
  date: string;
  category: string; // Changed from union type to string to allow custom categories
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'e-wallet' | 'transfer';
  notes?: string;
  createdAt: string;
}

export interface ExpenseFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ExpenseSummary {
  totalAmount: number;
  totalTransactions: number;
  topCategory: {
    category: string;
    amount: number;
  };
}
