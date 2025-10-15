
import React from "react";
import { Button } from "@/components/ui/button";
import { Wand, Star, Zap } from "lucide-react";

interface TaskActionsProps {
  onGeneratePlan: () => void;
  onPrioritize: () => void;
  onEvaluate: () => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  onGeneratePlan,
  onPrioritize,
  onEvaluate
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={onGeneratePlan}>
        <Wand className="mr-2 h-4 w-4" />
        Buat Rencana
      </Button>
      <Button variant="outline" onClick={onPrioritize}>
        <Star className="mr-2 h-4 w-4" />
        Prioritaskan
      </Button>
      <Button variant="outline" onClick={onEvaluate}>
        <Zap className="mr-2 h-4 w-4" />
        Evaluasi
      </Button>
    </div>
  );
};
