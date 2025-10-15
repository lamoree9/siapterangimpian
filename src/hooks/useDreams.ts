
import { useState, useEffect } from 'react';
import { Dream, DreamStep, DreamStats, DreamCategory } from '@/types/dream';

export const useDreams = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    const savedDreams = localStorage.getItem('dreams');
    if (savedDreams) {
      setDreams(JSON.parse(savedDreams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dreams', JSON.stringify(dreams));
  }, [dreams]);

  const addDream = (dreamData: Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => {
    const newDream: Dream = {
      ...dreamData,
      id: Date.now().toString(),
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDreams(prev => [...prev, newDream]);
  };

  const updateDream = (id: string, updates: Partial<Dream>) => {
    setDreams(prev => prev.map(dream => 
      dream.id === id 
        ? { ...dream, ...updates, updatedAt: new Date().toISOString() }
        : dream
    ));
  };

  const deleteDream = (id: string) => {
    setDreams(prev => prev.filter(dream => dream.id !== id));
  };

  const addStep = (dreamId: string, step: Omit<DreamStep, 'id' | 'order'>) => {
    setDreams(prev => prev.map(dream => {
      if (dream.id === dreamId) {
        const newStep: DreamStep = {
          ...step,
          id: Date.now().toString(),
          order: dream.steps.length,
        };
        const updatedSteps = [...dream.steps, newStep];
        const progress = calculateProgress(updatedSteps);
        return {
          ...dream,
          steps: updatedSteps,
          progress,
          updatedAt: new Date().toISOString(),
        };
      }
      return dream;
    }));
  };

  const toggleStep = (dreamId: string, stepId: string) => {
    setDreams(prev => prev.map(dream => {
      if (dream.id === dreamId) {
        const updatedSteps = dream.steps.map(step => 
          step.id === stepId 
            ? { 
                ...step, 
                completed: !step.completed,
                completedAt: !step.completed ? new Date().toISOString() : undefined
              }
            : step
        );
        const progress = calculateProgress(updatedSteps);
        return {
          ...dream,
          steps: updatedSteps,
          progress,
          updatedAt: new Date().toISOString(),
        };
      }
      return dream;
    }));
  };

  const calculateProgress = (steps: DreamStep[]): number => {
    if (steps.length === 0) return 0;
    const completed = steps.filter(step => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  const getStats = (): DreamStats => {
    const totalSteps = dreams.reduce((sum, dream) => sum + dream.steps.length, 0);
    const completedSteps = dreams.reduce((sum, dream) => 
      sum + dream.steps.filter(step => step.completed).length, 0
    );

    const categoryCounts = dreams.reduce((acc, dream) => {
      const existing = acc.find(item => item.category === dream.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ category: dream.category, count: 1 });
      }
      return acc;
    }, [] as { category: DreamCategory; count: number }[]);

    const upcomingDeadlines = dreams
      .filter(dream => dream.deadline)
      .map(dream => ({
        dreamId: dream.id,
        dreamName: dream.name,
        deadline: dream.deadline!,
      }))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);

    const recentlyUpdated = dreams
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(dream => ({
        dreamId: dream.id,
        dreamName: dream.name,
        updatedAt: dream.updatedAt,
      }));

    const averageProgress = dreams.length > 0 
      ? dreams.reduce((sum, dream) => sum + dream.progress, 0) / dreams.length
      : 0;

    return {
      totalDreams: dreams.length,
      completedSteps,
      totalSteps,
      averageProgress,
      categoryCounts,
      upcomingDeadlines,
      recentlyUpdated,
    };
  };

  return {
    dreams,
    addDream,
    updateDream,
    deleteDream,
    addStep,
    toggleStep,
    getStats,
  };
};
