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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={kpis.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <KPICard
          title="Avg. Order Value"
          value={formatCurrency(kpis.avgOrderValue)}
          icon={TrendingUp}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profitability by SKU</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Total Quantity</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitability.map((item) => (
                <TableRow key={item.sku} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell className="text-right font-semibold text-accent">
                    {formatCurrency(item.totalRevenue)}
                  </TableCell>
                  <TableCell className="text-right">{item.totalQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.avgPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
