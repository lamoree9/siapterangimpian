
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';

interface CategoryComboBoxProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const CategoryComboBox = ({ 
  value, 
  onValueChange, 
  label = "Kategori",
  placeholder = "Pilih atau ketik kategori baru..." 
}: CategoryComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { categories, addCategory } = useCategories();

  const selectedCategory = categories.find(cat => cat.value === value);

  const handleSelect = (categoryValue: string) => {
    onValueChange(categoryValue);
    setOpen(false);
    setInputValue('');
  };

  const handleCreateNew = () => {
    if (inputValue.trim()) {
      const newCategoryValue = addCategory(inputValue);
      onValueChange(newCategoryValue);
      setOpen(false);
      setInputValue('');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showCreateOption = inputValue.trim() && 
    !categories.some(cat => cat.label.toLowerCase() === inputValue.toLowerCase());

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategory ? selectedCategory.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            <Input
              placeholder="Cari atau ketik kategori baru..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="max-h-48 overflow-auto">
            {filteredCategories.map((category) => (
              <div
                key={category.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === category.value && "bg-accent"
                )}
                onClick={() => handleSelect(category.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.label}
              </div>
            ))}
            {showCreateOption && (
              <div
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-blue-600"
                onClick={handleCreateNew}
              >
                <Plus className="mr-2 h-4 w-4" />
                Buat "{inputValue}"
              </div>
            )}
            {filteredCategories.length === 0 && !showCreateOption && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Kategori tidak ditemukan
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
