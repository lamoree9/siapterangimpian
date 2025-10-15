
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Task } from "@/types/task";

interface TaskEditDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, priority: 'high' | 'medium' | 'low') => void;
}

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  isOpen,
  onClose,
  onSave
}) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update state when task changes
  React.useEffect(() => {
    if (task) {
      setText(task.text);
      setPriority(task.priority);
    }
  }, [task]);

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

  const handleSave = () => {
    if (!validateTaskText(text)) return;
    onSave(text, priority);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setValidationError(null);
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tugas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-task-text">Teks Tugas</Label>
            <Input
              id="edit-task-text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (validationError) validateTaskText(e.target.value);
              }}
              className={validationError ? 'border-destructive' : ''}
              maxLength={100}
            />
            {validationError && (
              <div className="text-sm text-destructive flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {validationError}
              </div>
            )}
          </div>
          
          <div>
            <Label>Prioritas</Label>
            <div className="flex gap-2 mt-2">
              <Button 
                type="button"
                size="sm" 
                variant={priority === 'high' ? 'default' : 'outline'}
                className={priority === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
                onClick={() => setPriority('high')}
              >
                Penting
              </Button>
              <Button 
                type="button"
                size="sm" 
                variant={priority === 'medium' ? 'default' : 'outline'}
                className={priority === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                onClick={() => setPriority('medium')}
              >
                Sedang
              </Button>
              <Button 
                type="button"
                size="sm" 
                variant={priority === 'low' ? 'default' : 'outline'}
                className={priority === 'low' ? 'bg-green-500 hover:bg-green-600' : ''}
                onClick={() => setPriority('low')}
              >
                Rendah
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
