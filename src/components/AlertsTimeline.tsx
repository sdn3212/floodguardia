
import { useEffect, useState } from "react";
import { FloodAlert } from "@/types";
import { getFloodAlerts, markAlertAsRead } from "@/utils/api";
import { cn } from "@/lib/utils";
import { RISK_LEVEL_COLORS } from "@/config/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellOff } from "lucide-react";

const AlertsTimeline = () => {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const data = await getFloodAlerts(10);
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);
  
  const handleAlertRead = async (alertId: string) => {
    const success = await markAlertAsRead(alertId);
    if (success) {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-gray-200 mt-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <BellOff className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4">No flood alerts at this time</p>
          <Button variant="outline">Notification Settings</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={cn(
                "flex space-x-3 p-3 rounded-md transition-colors cursor-pointer hover:bg-gray-50",
                !alert.isRead && "bg-blue-50"
              )}
              onClick={() => handleAlertRead(alert.id)}
            >
              <div className={cn("w-2 h-2 rounded-full mt-2", RISK_LEVEL_COLORS[alert.riskLevel])} />
              <div className="flex-1">
                <p className={cn(
                  "text-sm",
                  !alert.isRead && "font-medium"
                )}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(alert.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsTimeline;
