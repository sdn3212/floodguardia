
import { useEffect } from "react";
import Layout from "@/components/Layout";
import RiskIndicator from "@/components/RiskIndicator";
import SensorReadings from "@/components/SensorReadings";
import WeatherWidget from "@/components/WeatherWidget";
import AlertsTimeline from "@/components/AlertsTimeline";
import HistoricalDataChart from "@/components/HistoricalDataChart";
import FloodMap from "@/components/FloodMap";

const Index = () => {
  useEffect(() => {
    document.title = "FloodGuardia - Dashboard";
  }, []);
  
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RiskIndicator />
            </div>
            <WeatherWidget className="lg:col-span-2" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current Sensor Readings</h2>
            <SensorReadings />
          </div>
          
          <HistoricalDataChart />
          
          <FloodMap />
        </div>
        
        <div className="md:col-span-4">
          <AlertsTimeline />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
