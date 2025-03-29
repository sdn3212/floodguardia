
import { useEffect, useState } from "react";
import { WeatherData } from "@/types";
import { getCurrentWeather } from "@/utils/api";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Cloud, 
  CloudRain, 
  Droplets, 
  MapPin, 
  Sun, 
  Thermometer, 
  Wind,
  CloudSun,
  CloudFog
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
    
    const description = weather.description.toLowerCase();
    
    if (description.includes('sunny') || description.includes('clear')) {
      return <Sun className="h-10 w-10 text-yellow-500" />;
    } else if (description.includes('partly cloudy')) {
      return <CloudSun className="h-10 w-10 text-gray-400" />;
    } else if (description.includes('cloudy')) {
      return <Cloud className="h-10 w-10 text-gray-400" />;
    } else if (description.includes('rain') || description.includes('shower')) {
      return <CloudRain className="h-10 w-10 text-blue-500" />;
    } else if (description.includes('fog') || description.includes('mist')) {
      return <CloudFog className="h-10 w-10 text-gray-400" />;
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
          <p className="text-muted-foreground">Unable to load weather data</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full bg-gradient-to-br from-card to-card/95 shadow-md">
      <CardHeader className="pb-2 border-b border-muted/30">
        <CardTitle className="flex items-center">
          <span>Current Weather</span>
          <span className="ml-auto text-xs text-muted-foreground">powered by Meteoblue</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {getWeatherIcon()}
          </div>
          <div>
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-1 text-primary" />
              <span className="text-3xl font-bold text-card-foreground">{Math.round(weather.temperature)}°C</span>
            </div>
            <p className="text-card-foreground capitalize">{weather.description}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center text-card-foreground">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            <span className="text-sm">{weather.location}</span>
          </div>
          <div className="flex items-center text-card-foreground">
            <Wind className="h-4 w-4 mr-1 text-blue-400" />
            <span className="text-sm">{Math.round(weather.windSpeed)} m/s</span>
          </div>
          <div className="flex items-center text-card-foreground">
            <Droplets className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm">{Math.round(weather.humidity)}%</span>
          </div>
          <div className="flex items-center text-card-foreground">
            <CloudRain className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm">{Math.round(weather.rainfall)} mm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
