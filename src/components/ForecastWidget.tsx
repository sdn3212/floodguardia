
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Cloud, CloudDrizzle, CloudRain, Droplets, Sun, Thermometer } from "lucide-react";
import { getForecastData } from "@/utils/api";
import { ForecastData } from "@/types";
import { format } from "date-fns";

interface ForecastWidgetProps {
  className?: string;
}

const ForecastWidget = ({ className }: ForecastWidgetProps) => {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      try {
        const data = await getForecastData();
        setForecast(data);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
    
    // Refresh every 3 hours
    const interval = setInterval(fetchForecast, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, 'EEE, MMM d');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case 'rain':
      case 'showers':
      case 'light rain':
      case 'heavy rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'drizzle':
        return <CloudDrizzle className="h-6 w-6 text-blue-400" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} bg-gradient-to-br from-card to-card/95 shadow-md`}>
      <CardHeader className="pb-2 border-b border-muted/30">
        <CardTitle className="flex items-center text-card-foreground">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          3-Day Forecast
          <span className="ml-auto text-xs text-muted-foreground">powered by Meteoblue</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          {forecast.length > 0 ? (
            forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium text-card-foreground">{formatDate(day.date)}</span>
                <div className="flex flex-col items-center">
                  {getWeatherIcon(day.condition)}
                  <div className="flex items-center mt-1">
                    <Thermometer className="h-3 w-3 mr-1 text-primary" />
                    <span className="text-sm text-card-foreground">{Math.round(day.tempHigh)}°/{Math.round(day.tempLow)}°</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Droplets className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-xs text-card-foreground">{Math.round(day.precipitation)}mm</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground py-4">
              No forecast data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWidget;
