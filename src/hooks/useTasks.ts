
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('daily-tasks');
    if (!savedTasks) return [];
    
    // Parse tasks and ensure dates are properly converted to Date objects
    try {
      const parsed = JSON.parse(savedTasks);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : null
      }));
    } catch (error) {
      console.error("Error parsing tasks from localStorage:", error);
      return [];
    }
  });

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem('daily-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
    toast.success("Tugas baru ditambahkan");
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
    toast.success("Tugas berhasil diperbarui");
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.info("Tugas dihapus");
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const completed = !task.completed;
          return { 
            ...task, 
            completed, 
            completedAt: completed ? new Date() : null 
          };
        }
        return task;
      })
    );
    
    // Find the task that was toggled to show appropriate toast
    const task = tasks.find(task => task.id === id);
    if (task) {
      if (!task.completed) {
        toast.success("Tugas ditandai selesai");
      } else {
        toast.info("Tugas ditandai belum selesai");
      }
    }
  };

  const increasePriority = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          if (task.priority === 'low') return { ...task, priority: 'medium' };
          if (task.priority === 'medium') return { ...task, priority: 'high' };
        }
        return task;
      })
    );
    
    toast.info("Prioritas tugas ditingkatkan");
  };

  const decreasePriority = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          if (task.priority === 'high') return { ...task, priority: 'medium' };
          if (task.priority === 'medium') return { ...task, priority: 'low' };
        }
        return task;
      })
    );
    
    toast.info("Prioritas tugas diturunkan");
  };

  const reorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    increasePriority,
    decreasePriority,
    reorderTasks
  };
}
