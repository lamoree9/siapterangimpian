
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Task } from "@/types/task";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTaskText = (text: string): boolean => {
    if (!text.trim()) {
      setValidationError("Tugas tidak boleh kosong");
      return false;
    }
    
    if (text.length > 100) {
      setValidationError("Tugas tidak boleh lebih dari 100 karakter");
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateTaskText(newTaskText)) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
      createdAt: new Date(),
      completedAt: null
    };
    
    onAddTask(newTask);
    setNewTaskText("");
    setNewTaskPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="task">
          Tambah Tugas Baru
        </Label>
        <div className="flex space-x-2">
          <Input
            id="task"
            value={newTaskText}
            onChange={(e) => {
              setNewTaskText(e.target.value);
              if (validationError) validateTaskText(e.target.value);
            }}
            placeholder="Masukkan tugas baru..."
            className={`flex-1 ${validationError ? 'border-destructive' : ''}`}
            maxLength={100}
          />
          <Button type="submit">
            Tambah
          </Button>
        </div>
        {validationError && (
          <div className="text-sm text-destructive flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {validationError}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Label className="text-sm mr-2 flex items-center">Prioritas:</Label>
        <div className="flex flex-wrap gap-2">
          <Button 
            type="button"
            size="sm" 
            variant={newTaskPriority === 'high' ? 'default' : 'outline'}
            className={newTaskPriority === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
            onClick={() => setNewTaskPriority('high')}
          >
            Penting
          </Button>
          <Button 
            type="button"
            size="sm" 
            variant={newTaskPriority === 'medium' ? 'default' : 'outline'}
            className={newTaskPriority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            onClick={() => setNewTaskPriority('medium')}
          >
            Sedang
          </Button>
          <Button 
            type="button"
            size="sm" 
            variant={newTaskPriority === 'low' ? 'default' : 'outline'}
            className={newTaskPriority === 'low' ? 'bg-green-500 hover:bg-green-600' : ''}
            onClick={() => setNewTaskPriority('low')}
          >
            Rendah
          </Button>
        </div>
      </div>
    </form>
  );
};
