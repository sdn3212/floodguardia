
import { useEffect, useState } from "react";
import { RiskLevel } from "@/types";
import { RISK_LEVEL_COLORS, RISK_LEVEL_DESCRIPTIONS, RISK_LEVEL_TEXT_COLORS } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFloodPrediction } from "@/utils/api";
import { Waves } from "lucide-react";

interface RiskIndicatorProps {
  className?: string;
}

const RiskIndicator = ({ className }: RiskIndicatorProps) => {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true);
      try {
        const prediction = await getFloodPrediction();
        setRiskLevel(prediction.riskLevel);
        setDescription(prediction.description);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrediction();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrediction, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={cn("rounded-lg overflow-hidden border", className)}>
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Current Flood Risk</h2>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </div>
        
        <div 
          className={cn(
            "relative flex items-center justify-center p-6 rounded-lg bg-opacity-10 transition-colors",
            RISK_LEVEL_COLORS[riskLevel],
            "bg-opacity-10"
          )}
        >
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
            <div className={cn(
              "absolute h-24 w-24 rounded-full",
              RISK_LEVEL_COLORS[riskLevel],
              "opacity-10"
            )}></div>
            <div className={cn(
              "absolute h-36 w-36 rounded-full animate-ripple",
              RISK_LEVEL_COLORS[riskLevel],
              "opacity-5"
            )}></div>
          </div>
          
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center mb-3">
              <Waves className={cn("h-8 w-8 mr-2", RISK_LEVEL_TEXT_COLORS[riskLevel])} />
              <span className={cn(
                "text-3xl font-bold uppercase", 
                RISK_LEVEL_TEXT_COLORS[riskLevel]
              )}>
                {riskLevel}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{RISK_LEVEL_DESCRIPTIONS[riskLevel]}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="w-full">View Details</Button>
          <Button className="w-full">Alert Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default RiskIndicator;
