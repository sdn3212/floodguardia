
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Droplets, Thermometer, Wind, Cloud, ArrowUpCircle, Calendar } from "lucide-react";
import { getMeteoblueData } from "@/utils/api";
import { MeteoblueForecast } from "@/types";
import { format } from "date-fns";

const MeteoblueWidget = () => {
  const [forecast, setForecast] = useState<MeteoblueForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeteoblueData = async () => {
      setIsLoading(true);
      try {
        const data = await getMeteoblueData();
        setForecast(data);
      } catch (error) {
        console.error("Error fetching Meteoblue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeteoblueData();
    
    // Refresh every 3 hours
    const interval = setInterval(fetchMeteoblueData, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    try {
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, 'EEE, MMM d');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getWindDirectionArrow = (direction: number = 0) => {
    // Calculate rotation style
    const rotation = direction || 0;
    return (
      <ArrowUpCircle 
        className="h-4 w-4 text-blue-400" 
        style={{ transform: `rotate(${rotation}deg)` }} 
      />
    );
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
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/95 shadow-md overflow-hidden">
      <CardHeader className="pb-2 border-b border-muted/30">
        <CardTitle className="flex items-center text-card-foreground">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Detailed Weather Forecast
          <span className="ml-auto text-xs text-muted-foreground">powered by Meteoblue</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {forecast.length > 0 ? (
            forecast.map((day, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-card-foreground">{formatDate(day.time)}</span>
                  <span className="text-sm text-muted-foreground">{day.description}</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center text-card-foreground">
                    <Thermometer className="h-4 w-4 mr-2 text-primary" />
                    <span>{Math.round(day.temperature)}°C</span>
                  </div>
                  <div className="flex items-center text-card-foreground">
                    <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{Math.round(day.humidity)}%</span>
                  </div>
                  <div className="flex items-center text-card-foreground">
                    <CloudRain className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{Math.round(day.precipitation)} mm</span>
                  </div>
                  <div className="flex items-center text-card-foreground">
                    <Wind className="h-4 w-4 mr-2 text-blue-400" />
                    <span>{Math.round(day.windspeed)} m/s</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Cloud className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No forecast data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeteoblueWidget;
