
import { useEffect, useState } from "react";
import { getFloodPrediction } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { RISK_LEVEL_COLORS, RISK_LEVEL_DESCRIPTIONS, RISK_LEVEL_TEXT_COLORS } from "@/config/constants";
import { RiskLevel } from "@/types";

interface RiskIndicatorProps {
  className?: string;
}

const RiskIndicator = ({ className }: RiskIndicatorProps) => {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRiskData = async () => {
      setIsLoading(true);
      try {
        const { riskLevel, description } = await getFloodPrediction();
        setRiskLevel(riskLevel);
        setDescription(description);
      } catch (error) {
        console.error("Error fetching risk data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRiskData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchRiskData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const getRiskIcon = () => {
    switch (riskLevel) {
      case "low":
        return <ShieldCheck className="h-12 w-12 text-flood-low" />;
      case "medium":
        return <Shield className="h-12 w-12 text-flood-medium" />;
      case "high":
        return <ShieldAlert className="h-12 w-12 text-flood-high" />;
      case "critical":
        return <ShieldX className="h-12 w-12 text-flood-critical" />;
      default:
        return <ShieldCheck className="h-12 w-12 text-flood-low" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-1"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Flood Risk Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">{getRiskIcon()}</div>
          <div>
            <div className={`text-lg font-bold uppercase mb-1 ${RISK_LEVEL_TEXT_COLORS[riskLevel]}`}>
              {riskLevel}
            </div>
            <p className="text-sm text-gray-600">{description || RISK_LEVEL_DESCRIPTIONS[riskLevel]}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskIndicator;
