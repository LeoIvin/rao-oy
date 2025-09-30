import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const KPICard = ({ title, value, icon: Icon, trend }: KPICardProps) => {
  return (
    <Card className="p-6 overflow-hidden border-0 shadow-elegant hover:shadow-glow transition-all duration-300 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">{value}</h3>
          {trend && (
            <p
              className={`text-sm font-medium ${
                trend.isPositive ? "text-accent" : "text-destructive"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last period
            </p>
          )}
        </div>
        <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 p-3 shadow-glow">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};
