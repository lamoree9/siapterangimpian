
import React, { useRef, useEffect } from "react";
import Sortable from "sortablejs";
import { TaskItem } from "@/components/tasks/TaskItem";
import { Task } from "@/types/task";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onIncreasePriority: (id: string) => void;
  onDecreasePriority: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
  filter: 'all' | 'completed' | 'active';
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onIncreasePriority,
  onDecreasePriority,
  onReorder,
  filter
}) => {
  const taskListRef = useRef<HTMLDivElement>(null);
  const sortableRef = useRef<Sortable | null>(null);

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  // Sort tasks by priority and creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Setup SortableJS for drag and drop
  useEffect(() => {
    if (taskListRef.current) {
      sortableRef.current = Sortable.create(taskListRef.current, {
        animation: 150,
        handle: '.p-4', // Use the task item's padding as the handle
        onEnd: (evt) => {
          const taskId = evt.item.getAttribute('data-id');
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          
          if (taskId && oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            const reorderedTasks = [...tasks];
            const [movedTask] = reorderedTasks.splice(oldIndex, 1);
            reorderedTasks.splice(newIndex, 0, movedTask);
            
            onReorder(reorderedTasks);
            toast.success("Urutan tugas berhasil diperbarui");
          }
        }
      });
    }
    
    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [filter, tasks, onReorder]);

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg border-dashed">
        <p className="text-muted-foreground">Belum ada tugas. Tambahkan tugas baru untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={taskListRef}>
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onIncreasePriority={onIncreasePriority}
          onDecreasePriority={onDecreasePriority}
        />
      ))}
    </div>
  );
};
