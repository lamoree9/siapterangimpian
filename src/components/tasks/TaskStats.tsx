
import React from "react";
import { CheckCircle } from "lucide-react";

interface TaskStatsProps {
  completedCount: number;
  totalCount: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ completedCount, totalCount }) => {
  if (completedCount === 0) return null;
  
  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <div className="p-4 bg-gradient-to-br from-primary-50 to-background border border-primary-100 rounded-lg">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-primary-600" />
        <h3 className="font-medium">Pencapaian Hari Ini</h3>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Kamu telah menyelesaikan {completedCount} dari {totalCount} tugas hari ini ({completionPercentage}%). Terus semangat!
      </p>
    </div>
  );
};
