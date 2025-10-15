
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskActions } from "@/components/tasks/TaskActions";
import { TaskEditDialog } from "@/components/tasks/TaskEditDialog";
import { TaskDeleteDialog } from "@/components/tasks/TaskDeleteDialog";

const DailyPlanner = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    increasePriority,
    decreasePriority,
    reorderTasks
  } = useTasks();
  
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (text: string, priority: 'high' | 'medium' | 'low') => {
    if (!editingTask) return;

    updateTask(editingTask.id, { text, priority });
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteDialog = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!taskToDelete) return;
    
    deleteTask(taskToDelete);
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // AI Action placeholders
  const generateDailyPlan = () => {
    toast.info("Fitur AI akan segera hadir!");
  };

  const prioritizeTasks = () => {
    toast.info("Fitur AI akan segera hadir!");
  };

  const evaluateDay = () => {
    toast.info("Fitur AI akan segera hadir!");
  };

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = today.toLocaleDateString('id-ID', options);

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Rencana Harian</h1>
          <p className="text-muted-foreground">
            Atur dan kelola tugas harian kamu berdasarkan prioritas.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{formattedDate}</span>
          </div>
          
          <TaskActions 
            onGeneratePlan={generateDailyPlan}
            onPrioritize={prioritizeTasks}
            onEvaluate={evaluateDay}
          />
        </div>
        
        <Card>
          <CardContent className="p-4">
            <TaskForm onAddTask={addTask} />
          </CardContent>
        </Card>
        
        <TaskFilter filter={filter} setFilter={setFilter} />

        <TaskList 
          tasks={tasks}
          filter={filter}
          onToggle={toggleTaskCompletion}
          onDelete={handleDeleteDialog}
          onEdit={handleEditTask}
          onIncreasePriority={increasePriority}
          onDecreasePriority={decreasePriority}
          onReorder={reorderTasks}
        />

        <TaskStats 
          completedCount={completedTasksCount}
          totalCount={totalTasksCount} 
        />
      </div>
      
      {/* Dialogs */}
      <TaskEditDialog 
        task={editingTask}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />
      
      <TaskDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
};

export default DailyPlanner;
