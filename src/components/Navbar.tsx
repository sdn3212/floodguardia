
import { useEffect, useState } from "react";
import { BellRing, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { FloodAlert } from "@/types";
import { getFloodAlerts, markAlertAsRead } from "@/utils/api";
import { RISK_LEVEL_COLORS } from "@/config/constants";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [alerts, setAlerts] = useState<FloodAlert[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getFloodAlerts();
      setAlerts(data);
    };
    
    fetchAlerts();
  }, []);

  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;
  
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

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-gray-700 fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center mr-2">
                <div className="h-4 w-4 bg-white rounded-full animate-pulse-slow"></div>
              </div>
              <span className="text-xl font-bold text-foreground">Protex</span>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="link" asChild>
              <a href="/">Dashboard</a>
            </Button>
            <Button variant="link" asChild>
              <a href="/map">Map</a>
            </Button>
            <Button variant="link" asChild>
              <a href="/historical">Historical Data</a>
            </Button>
            <Button variant="link" asChild>
              <a href="/arduino">IoT Setup</a>
            </Button>
            <Button variant="link" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <BellRing className="h-5 w-5" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {unreadAlertsCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-gray-700">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map(alert => (
                      <div 
                        key={alert.id}
                        className={cn(
                          "p-3 border-b border-gray-700 cursor-pointer hover:bg-muted transition-colors",
                          !alert.isRead && "bg-blue-900/20"
                        )}
                        onClick={() => handleAlertRead(alert.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className={cn("w-2 h-2 rounded-full mt-1.5", RISK_LEVEL_COLORS[alert.riskLevel])} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(alert.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No notifications</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative mr-2">
                  <BellRing className="h-5 w-5" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {unreadAlertsCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-gray-700">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map(alert => (
                      <div 
                        key={alert.id}
                        className={cn(
                          "p-3 border-b border-gray-700 cursor-pointer hover:bg-muted transition-colors",
                          !alert.isRead && "bg-blue-900/20"
                        )}
                        onClick={() => handleAlertRead(alert.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className={cn("w-2 h-2 rounded-full mt-1.5", RISK_LEVEL_COLORS[alert.riskLevel])} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(alert.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No notifications</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 px-4 space-y-1 sm:px-6 bg-background border-b border-gray-700">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/">Dashboard</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/map">Map</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/historical">Historical Data</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/arduino">IoT Setup</a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
