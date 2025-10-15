
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
  children: React.ReactNode;
}

export const DashboardCard = ({ title, icon, to, className, children }: DashboardCardProps) => {
  return (
    <Link to={to}>
      <Card className={cn("h-full transition-all hover:shadow-md", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          <div className="opacity-70">{icon}</div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Link>
  );
};
