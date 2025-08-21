import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  path: string;
  stats?: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
  };
  className?: string;
}

export const ModuleCard = ({ 
  icon, 
  title, 
  description, 
  path, 
  stats, 
  className 
}: ModuleCardProps) => {
  return (
    <Link to={path}>
      <Card className={cn(
        "p-6 hover:shadow-fadem transition-all duration-300 cursor-pointer group border-card-border bg-card hover:scale-105",
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-primary rounded-lg text-white group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {stats && (
            <div className="text-right">
              <p className="text-2xl font-bold text-fadem-black">{stats.value}</p>
              <p className="text-sm text-muted-foreground">{stats.label}</p>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-fadem-black mb-2 group-hover:text-fadem-red transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </Card>
    </Link>
  );
};