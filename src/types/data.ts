export interface DataRow {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  created: string;
  total: number;
}

export interface ProfitabilityData {
  sku: string;
  totalRevenue: number;
  totalQuantity: number;
  avgPrice: number;
}

export interface KPIMetrics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast?: number;
}
