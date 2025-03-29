
import { useEffect, useState } from "react";
import { FloodAlert } from "@/types";
import { getAlerts } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bell, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AlertsTimeline = () => {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // Call getAlerts without arguments
        const data = await getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const formatAlertTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getAlertBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-border bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-red-400" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground/60" />
            <p>No recent alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="relative pl-6 pb-4 last:pb-0 last:before:hidden before:absolute before:left-2 before:top-2 before:h-full before:w-px before:bg-border">
                <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-primary"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-card-foreground">{alert.title}</h4>
                  <Badge className={`text-white ml-2 ${getAlertBadgeColor(alert.severity)}`}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{alert.message}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatAlertTime(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsTimeline;
