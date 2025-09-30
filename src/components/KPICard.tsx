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
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
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
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};
