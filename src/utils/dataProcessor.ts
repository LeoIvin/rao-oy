import { DataRow, ProfitabilityData, KPIMetrics, ForecastPoint } from "@/types/data";

export const calculateProfitability = (data: DataRow[]): ProfitabilityData[] => {
  const grouped = data.reduce((acc, row) => {
    if (!acc[row.sku]) {
      acc[row.sku] = {
        sku: row.sku,
        totalRevenue: 0,
        totalQuantity: 0,
        prices: [],
      };
    }
    acc[row.sku].totalRevenue += row.total;
    acc[row.sku].totalQuantity += row.quantity;
    acc[row.sku].prices.push(row.price);
    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped).map((item: any) => ({
    sku: item.sku,
    totalRevenue: item.totalRevenue,
    totalQuantity: item.totalQuantity,
    avgPrice: item.prices.reduce((a: number, b: number) => a + b, 0) / item.prices.length,
  }));
};

export const calculateKPIs = (data: DataRow[]): KPIMetrics => {
  const totalRevenue = data.reduce((sum, row) => sum + row.total, 0);
  const totalOrders = data.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
  };
};

export const calculateMovingAverage = (values: number[], window: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const subset = values.slice(start, i + 1);
    const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
    result.push(avg);
  }
  return result;
};

export const generateForecast = (data: DataRow[], sku: string, window: number = 7): ForecastPoint[] => {
  const skuData = data
    .filter((row) => row.sku === sku)
    .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

  if (skuData.length === 0) return [];

  const dates = skuData.map((row) => row.created);
  const quantities = skuData.map((row) => row.quantity);
  const movingAvg = calculateMovingAverage(quantities, window);

  const result: ForecastPoint[] = skuData.map((row, i) => ({
    date: row.created,
    actual: row.quantity,
    forecast: movingAvg[i],
  }));

  // Add forecast for next periods
  const lastMA = movingAvg[movingAvg.length - 1];
  const lastDate = new Date(dates[dates.length - 1]);
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + i);
    result.push({
      date: nextDate.toISOString().split("T")[0],
      forecast: lastMA,
    });
  }

  return result;
};
