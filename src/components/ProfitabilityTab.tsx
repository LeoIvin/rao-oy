import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { KPICard } from "./KPICard";
import { DataRow, KPIMetrics, ProfitabilityData } from "@/types/data";
import { calculateKPIs, calculateProfitability } from "@/utils/dataProcessor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface ProfitabilityTabProps {
  data: DataRow[];
}

export const ProfitabilityTab = ({ data }: ProfitabilityTabProps) => {
  const kpis: KPIMetrics = calculateKPIs(data);
  const profitability: ProfitabilityData[] = calculateProfitability(data);
  const totalProfit = profitability.reduce((sum, item) => sum + item.totalProfit, 0);
  const totalCost = profitability.reduce((sum, item) => sum + item.totalCost, 0);
  const overallMargin = kpis.totalRevenue > 0 ? (totalProfit / kpis.totalRevenue) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={DollarSign}
        />
        <KPICard
          title="Total Profit"
          value={formatCurrency(totalProfit)}
          icon={TrendingUp}
        />
        <KPICard
          title="Total Cost"
          value={formatCurrency(totalCost)}
          icon={ShoppingCart}
        />
        <KPICard
          title="Profit Margin"
          value={`${overallMargin.toFixed(1)}%`}
          icon={TrendingUp}
        />
      </div>

      <Card className="p-6 shadow-elegant">
        <h3 className="text-lg font-semibold mb-4">Profitability by SKU</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitability
                .sort((a, b) => b.totalProfit - a.totalProfit)
                .map((item) => (
                <TableRow key={item.sku} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-accent">
                    {formatCurrency(item.totalProfit)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(item.totalCost)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={item.profitMargin > 30 ? "text-accent" : ""}>
                      {item.profitMargin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.totalQuantity.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
