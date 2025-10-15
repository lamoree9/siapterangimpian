
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFilters as ExpenseFiltersType, Expense } from "@/types/expense";

const ExpenseTracker = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, getFilteredExpenses, getMonthlySummary } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ExpenseFiltersType>({});

  const handleAddExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    addExpense(data);
    setIsAddDialogOpen(false);
  };

  const handleEditExpense = (id: string, data: Omit<Expense, 'id' | 'createdAt'>) => {
    updateExpense(id, data);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) {
      deleteExpense(id);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const filteredExpenses = getFilteredExpenses(filters);
  const summary = getMonthlySummary();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Catatan Pengeluaran</h1>
            <p className="text-muted-foreground">
              Catat dan pantau pengeluaran harian Anda.
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengeluaran
          </Button>
        </div>

        <ExpenseSummary summary={summary} />

        <ExpenseFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              onSubmit={handleAddExpense}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ExpenseTracker;
