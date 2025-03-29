
import { useEffect } from "react";
import Layout from "@/components/Layout";
import RiskIndicator from "@/components/RiskIndicator";
import SensorReadings from "@/components/SensorReadings";
import WeatherWidget from "@/components/WeatherWidget";
import AlertsTimeline from "@/components/AlertsTimeline";
import HistoricalDataChart from "@/components/HistoricalDataChart";
import FloodMap from "@/components/FloodMap";
import ForecastWidget from "@/components/ForecastWidget";
import EmergencyContactsWidget from "@/components/EmergencyContactsWidget";
import SafetyTipsWidget from "@/components/SafetyTipsWidget";
import ResourcesWidget from "@/components/ResourcesWidget";
import EvacuationRouteWidget from "@/components/EvacuationRouteWidget";
import WaterLevelTrendsWidget from "@/components/WaterLevelTrendsWidget";
import MeteoblueWidget from "@/components/MeteoblueWidget";

const Index = () => {
  useEffect(() => {
    document.title = "Protex - Dashboard";
  }, []);
  
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RiskIndicator />
            </div>
            <div className="lg:col-span-2">
              <WeatherWidget />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-card-foreground">Current Sensor Readings</h2>
            <SensorReadings />
          </div>
          
          <HistoricalDataChart />
          
          <FloodMap />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MeteoblueWidget />
            <WaterLevelTrendsWidget />
          </div>
          
          <EvacuationRouteWidget />
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <AlertsTimeline />
          <ForecastWidget />
          <ResourcesWidget />
          <div className="grid grid-cols-1 gap-6">
            <EmergencyContactsWidget />
            <SafetyTipsWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
