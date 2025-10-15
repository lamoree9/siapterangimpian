
import { useState, useEffect } from 'react';
import { Problem, ProblemSolution, ProblemStats, ProblemCategory, EmotionType, ProblemStatus } from '@/types/problem';

const STORAGE_KEY = 'problems';

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProblems(JSON.parse(stored));
    }
  }, []);

  const saveProblems = (newProblems: Problem[]) => {
    setProblems(newProblems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProblems));
  };

  const addProblem = (problemData: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProblem: Problem = {
      ...problemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProblems([...problems, newProblem]);
  };

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    const updatedProblems = problems.map(problem =>
      problem.id === id
        ? { ...problem, ...updates, updatedAt: new Date().toISOString() }
        : problem
    );
    saveProblems(updatedProblems);
  };

  const deleteProblem = (id: string) => {
    const updatedProblems = problems.filter(problem => problem.id !== id);
    saveProblems(updatedProblems);
  };

  const addSolution = (problemId: string, solution: Omit<ProblemSolution, 'id' | 'order'>) => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    const newSolution: ProblemSolution = {
      ...solution,
      id: Date.now().toString(),
      order: problem.solutions.length,
    };

    updateProblem(problemId, {
      solutions: [...problem.solutions, newSolution]
    });
  };

  const toggleSolution = (problemId: string, solutionId: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    const updatedSolutions = problem.solutions.map(solution =>
      solution.id === solutionId
        ? {
            ...solution,
            completed: !solution.completed,
            completedAt: !solution.completed ? new Date().toISOString() : undefined
          }
        : solution
    );

    updateProblem(problemId, { solutions: updatedSolutions });
  };

  const getStats = (): ProblemStats => {
    const totalProblems = problems.length;
    const activeProblems = problems.filter(p => p.status === 'active').length;
    const resolvedProblems = problems.filter(p => p.status === 'resolved').length;
    
    const averageDifficulty = problems.length > 0
      ? problems.reduce((sum, p) => sum + p.difficulty, 0) / problems.length
      : 0;

    const categoryDistribution = problems.reduce((acc, problem) => {
      const existing = acc.find(item => item.category === problem.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ category: problem.category, count: 1 });
      }
      return acc;
    }, [] as { category: ProblemCategory; count: number }[]);

    const emotionCounts = problems.reduce((acc, problem) => {
      problem.emotions.forEach(emotion => {
        const existing = acc.find(item => item.emotion === emotion);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ emotion, count: 1 });
        }
      });
      return acc;
    }, [] as { emotion: EmotionType; count: number }[]);

    const mostCommonEmotions = emotionCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Weekly insights
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newProblems = problems.filter(p => 
      new Date(p.createdAt) >= oneWeekAgo
    ).length;

    const resolvedThisWeek = problems.filter(p => 
      p.completionDate && new Date(p.completionDate) >= oneWeekAgo
    ).length;

    const weeklyCategories = problems
      .filter(p => new Date(p.createdAt) >= oneWeekAgo)
      .reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const mostActiveCategory = Object.entries(weeklyCategories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    return {
      totalProblems,
      activeProblems,
      resolvedProblems,
      averageDifficulty,
      categoryDistribution,
      mostCommonEmotions,
      weeklyInsights: {
        newProblems,
        resolvedProblems: resolvedThisWeek,
        mostActiveCategory,
      }
    };
  };

  return {
    problems,
    addProblem,
    updateProblem,
    deleteProblem,
    addSolution,
    toggleSolution,
    getStats,
  };
};
