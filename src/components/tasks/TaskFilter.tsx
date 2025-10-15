
import React from "react";
import { Button } from "@/components/ui/button";

interface TaskFilterProps {
  filter: 'all' | 'completed' | 'active';
  setFilter: (filter: 'all' | 'completed' | 'active') => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        variant={filter === 'all' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setFilter('all')}
      >
        Semua
      </Button>
      <Button 
        variant={filter === 'active' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setFilter('active')}
      >
        Aktif
      </Button>
      <Button 
        variant={filter === 'completed' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setFilter('completed')}
      >
        Selesai
      </Button>
    </div>
  );
};
