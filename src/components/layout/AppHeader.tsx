
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export const AppHeader = ({ onMenuToggle }: AppHeaderProps) => {
  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold bg-gradient-to-r from-terang-600 via-harian-600 to-impian-500 bg-clip-text text-transparent">
              Terang Impian
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
};
