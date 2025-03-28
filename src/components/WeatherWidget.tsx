
import { useEffect, useState } from "react";
import { WeatherData } from "@/types";
import { getCurrentWeather } from "@/utils/api";
import { 
  Card, 
  CardContent, 
  CardHeader
} from "@/components/ui/card";
import { 
  Cloud, 
  CloudRain, 
  Droplets, 
  MapPin, 
  Sun, 
  Thermometer, 
  Wind
} from "lucide-react";

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const data = await getCurrentWeather();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-10 w-10 text-gray-400" />;
    
    const icon = weather.icon;
    
    if (icon.includes('01')) {
      return <Sun className="h-10 w-10 text-yellow-500" />;
    } else if (icon.includes('02') || icon.includes('03') || icon.includes('04')) {
      return <Cloud className="h-10 w-10 text-gray-400" />;
    } else if (icon.includes('09') || icon.includes('10') || icon.includes('11')) {
      return <CloudRain className="h-10 w-10 text-blue-500" />;
    } else {
      return <Cloud className="h-10 w-10 text-gray-400" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!weather) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500">Unable to load weather data</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Current Weather</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {getWeatherIcon()}
          </div>
          <div>
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-3xl font-bold">{weather.temperature}°C</span>
            </div>
            <p className="text-gray-500 capitalize">{weather.description}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{weather.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Wind className="h-4 w-4 mr-1" />
            <span className="text-sm">{weather.windSpeed} m/s</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Droplets className="h-4 w-4 mr-1" />
            <span className="text-sm">{weather.humidity}%</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CloudRain className="h-4 w-4 mr-1" />
            <span className="text-sm">{weather.rainfall} mm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
