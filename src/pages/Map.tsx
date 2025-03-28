
import { useEffect } from "react";
import Layout from "@/components/Layout";
import FloodMap from "@/components/FloodMap";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskLevel } from "@/types";
import { RISK_LEVEL_COLORS, RISK_LEVEL_TEXT_COLORS } from "@/config/constants";
import { cn } from "@/lib/utils";
import { AlertTriangle, CloudRain, Download, MapPin } from "lucide-react";

const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];

const Map = () => {
  useEffect(() => {
    document.title = "FloodGuardia - Flood Risk Map";
  }, []);
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <FloodMap className="h-[calc(100vh-160px)]" />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flood Risk Zones</CardTitle>
              <CardDescription>
                Current flood risk levels by area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskLevels.map(level => (
                  <div 
                    key={level}
                    className="flex items-center p-3 rounded-md bg-gray-50"
                  >
                    <div className={cn("w-3 h-3 rounded-full mr-3", RISK_LEVEL_COLORS[level])} />
                    <div className="flex-1">
                      <p className={cn("font-medium capitalize", RISK_LEVEL_TEXT_COLORS[level])}>
                        {level}
                      </p>
                      <p className="text-sm text-gray-500">
                        {level === 'low' && '1 area'}
                        {level === 'medium' && '2 areas'}
                        {level === 'high' && '1 area'}
                        {level === 'critical' && '1 area'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Emergency notifications in effect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-md bg-red-50 border border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">
                      Flash Flood Warning
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Riverside Park area - evacuate immediately to higher ground
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Issued at: 08:45 AM, June 10, 2023
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-md bg-yellow-50 border border-yellow-200">
                  <CloudRain className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Heavy Rainfall Advisory
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Downtown area - expect 50mm of rain in the next 6 hours
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Issued at: 07:30 AM, June 10, 2023
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Show Safe Zones
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Map Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Map Data
              </Button>
              <Button variant="outline" className="w-full">
                Share Current Map
              </Button>
              <Button variant="outline" className="w-full">
                View Evacuation Routes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
