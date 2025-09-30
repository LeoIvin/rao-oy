import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/FileUploader";
import { ProfitabilityTab } from "@/components/ProfitabilityTab";
import { ExpiryAlertsTab } from "@/components/ExpiryAlertsTab";
import { ForecastTab } from "@/components/ForecastTab";
import { DataRow } from "@/types/data";

const Index = () => {
  const [data, setData] = useState<DataRow[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Data-driven insights for your business
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {data.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-12">
            <FileUploader onDataLoaded={setData} />
          </div>
        ) : (
          <Tabs defaultValue="profitability" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="profitability">Profitability</TabsTrigger>
              <TabsTrigger value="expiry">Expiry Alerts</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="profitability" className="space-y-6">
              <ProfitabilityTab data={data} />
            </TabsContent>

            <TabsContent value="expiry">
              <ExpiryAlertsTab />
            </TabsContent>

            <TabsContent value="forecast">
              <ForecastTab data={data} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
