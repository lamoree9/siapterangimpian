import { useState, useEffect } from 'react';
import { Expense, ExpenseFilters, ExpenseSummary } from '@/types/expense';
import { useAssets } from './useAssets';

const STORAGE_KEY = 'expenses';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { deductFromAsset } = useAssets();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading expenses:', error);
      }
    }
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    // Try to deduct from matching asset
    const deducted = deductFromAsset(
      expenseData.paymentMethod, 
      expenseData.amount, 
      expenseData.description,
      newExpense.id
    );
    
    if (!deducted) {
      console.log(`No matching asset found for payment method: ${expenseData.paymentMethod}`);
    }
    
    saveExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === id
        ? { ...expense, ...expenseData }
        : expense
    );
    saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(filteredExpenses);
  };

  const getFilteredExpenses = (filters: ExpenseFilters) => {
    return expenses.filter(expense => {
      if (filters.category && expense.category !== filters.category) {
        return false;
      }
      if (filters.dateFrom && expense.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && expense.date > filters.dateTo) {
        return false;
      }
      return true;
    });
  };

  const getMonthlySummary = (): ExpenseSummary => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(currentMonth)
    );

    const totalAmount = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const totalTransactions = monthlyExpenses.length;

    // Hitung kategori terbesar
    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).reduce(
      (max, [category, amount]) => 
        amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );

    return {
      totalAmount,
      totalTransactions,
      topCategory
    };
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    getMonthlySummary
  };
};
