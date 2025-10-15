
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onIncreasePriority: (id: string) => void;
  onDecreasePriority: (id: string) => void;
}

export const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onIncreasePriority,
  onDecreasePriority
}: TaskItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Penting';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return 'Sedang';
    }
  };

  const getFormattedDate = (date: Date | undefined | null) => {
    if (!date) return '';
    return format(new Date(date), 'HH:mm');
  };

  return (
    <div
      className={`p-4 border rounded-lg flex items-start justify-between transition-all duration-200 ${
        task.completed ? "bg-muted/50" : "bg-card"
      }`}
      data-id={task.id}
    >
      <div className="flex items-start gap-3 flex-1">
        <button onClick={() => onToggle(task.id)} className="mt-1">
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <div className="space-y-1 flex-1">
          <p className={`${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.text}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
            <span>Dibuat: {getFormattedDate(task.createdAt)}</span>
            {task.completedAt && (
              <span>Selesai: {getFormattedDate(task.completedAt)}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {!task.completed && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
              title="Edit tugas"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {task.priority !== 'high' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onIncreasePriority(task.id)}
                className="h-8 w-8"
                title="Tingkatkan prioritas"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
            {task.priority !== 'low' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDecreasePriority(task.id)}
                className="h-8 w-8"
                title="Turunkan prioritas"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Hapus tugas"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
