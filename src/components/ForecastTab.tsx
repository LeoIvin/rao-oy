import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { DataRow } from "@/types/data";
import { generateForecast } from "@/utils/dataProcessor";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ForecastTabProps {
  data: DataRow[];
}

export const ForecastTab = ({ data }: ForecastTabProps) => {
  const uniqueSkus = [...new Set(data.map((row) => row.sku))];
  const [selectedSku, setSelectedSku] = useState<string>(uniqueSkus[0] || "");

  const forecastData = selectedSku ? generateForecast(data, selectedSku, 7) : [];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales Forecast
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              7-day moving average forecast
            </p>
          </div>
          <div className="w-[200px]">
            <Select value={selectedSku} onValueChange={setSelectedSku}>
              <SelectTrigger>
                <SelectValue placeholder="Select SKU" />
              </SelectTrigger>
              <SelectContent>
                {uniqueSkus.map((sku) => (
                  <SelectItem key={sku} value={sku}>
                    {sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {forecastData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                name="Actual Sales"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--accent))", r: 4 }}
                name="Forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No data available for selected SKU
          </div>
        )}
      </Card>
    </div>
  );
};
