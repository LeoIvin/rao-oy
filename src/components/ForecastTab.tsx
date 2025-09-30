import { useState, useMemo } from "react";
import { TrendingUp, Activity, Calendar } from "lucide-react";
import { DataRow } from "@/types/data";
import { generateForecast } from "@/utils/dataProcessor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  const forecastData = useMemo(() => 
    selectedSku ? generateForecast(data, selectedSku, 7) : [], 
    [data, selectedSku]
  );

  const stats = useMemo(() => {
    if (!forecastData.length) return null;
    
    const actualData = forecastData.filter(d => d.actual !== undefined);
    const forecastOnly = forecastData.filter(d => d.actual === undefined);
    
    const avgActual = actualData.length > 0 
      ? actualData.reduce((sum, d) => sum + (d.actual || 0), 0) / actualData.length 
      : 0;
    
    const avgForecast = forecastOnly.length > 0
      ? forecastOnly.reduce((sum, d) => sum + (d.forecast || 0), 0) / forecastOnly.length
      : 0;
    
    return {
      historicalPoints: actualData.length,
      forecastPoints: forecastOnly.length,
      avgActual: avgActual.toFixed(1),
      avgForecast: avgForecast.toFixed(1),
    };
  }, [forecastData]);

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 p-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Historical Data Points</p>
                  <p className="text-2xl font-bold">{stats.historicalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-accent/20 to-accent/10 p-3">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forecast Days</p>
                  <p className="text-2xl font-bold">{stats.forecastPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 p-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Daily Forecast</p>
                  <p className="text-2xl font-bold">{stats.avgForecast}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-0 shadow-elegant overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="h-6 w-6 text-primary" />
                Sales Forecast Analysis
              </CardTitle>
              <CardDescription className="mt-2">
                7-day moving average prediction with historical data comparison
              </CardDescription>
            </div>
            <div className="w-[220px]">
              <Select value={selectedSku} onValueChange={setSelectedSku}>
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select SKU" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSkus.map((sku) => (
                    <SelectItem key={sku} value={sku}>
                      SKU: {sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {forecastData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={450}>
                <LineChart 
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    label={{ 
                      value: 'Quantity', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: "hsl(var(--muted-foreground))" }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    labelFormatter={(value) => `Date: ${value}`}
                    formatter={(value: any, name: string) => [
                      `${Number(value).toFixed(1)} units`,
                      name === "actual" ? "Actual Sales" : "Predicted Sales"
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ 
                      fill: "hsl(var(--primary))", 
                      r: 5,
                      strokeWidth: 2,
                      stroke: "hsl(var(--card))"
                    }}
                    activeDot={{ r: 7 }}
                    name="Actual Sales"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    strokeDasharray="8 4"
                    dot={{ 
                      fill: "hsl(var(--accent))", 
                      r: 5,
                      strokeWidth: 2,
                      stroke: "hsl(var(--card))"
                    }}
                    activeDot={{ r: 7 }}
                    name="Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-primary rounded" />
                  <span>Historical actual sales data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-accent rounded border-dashed" 
                       style={{ borderTop: "2px dashed hsl(var(--accent))", background: "transparent" }} />
                  <span>Predicted future sales (7-day moving average)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[450px] flex flex-col items-center justify-center text-muted-foreground">
              <TrendingUp className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No data available for selected SKU</p>
              <p className="text-sm">Please select a different SKU or upload more data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
