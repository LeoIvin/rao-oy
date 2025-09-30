import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ExpiryAlertsTab = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="p-12 text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-warning/10 p-4">
            <AlertTriangle className="h-12 w-12 text-warning" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Expiry Alerts</h3>
        <p className="text-muted-foreground">
          This feature will be available once expiry date information is added to your data source.
        </p>
      </Card>
    </div>
  );
};
