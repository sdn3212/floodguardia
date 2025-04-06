
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ArrowDown, ArrowUp, Waves } from "lucide-react";

const WaterLevelTrendsWidget = () => {
  const trendData = [
    { time: '6AM', level: 1.2, safe: 1.5 },
    { time: '9AM', level: 1.3, safe: 1.5 },
    { time: '12PM', level: 1.5, safe: 1.5 },
    { time: '3PM', level: 1.8, safe: 1.5 },
    { time: '6PM', level: 1.7, safe: 1.5 },
    { time: '9PM', level: 1.6, safe: 1.5 },
    { time: '12AM', level: 1.9, safe: 1.5 },
  ];

  const currentTrend = trendData[trendData.length - 1].level > trendData[trendData.length - 2].level
    ? { 
        direction: "rising", 
        icon: <ArrowUp className="h-5 w-5 text-blue-900 animate-pulse" />,
        bgClass: "bg-blue-50",
        textClass: "text-blue-900"
      }
    : { 
        direction: "falling", 
        icon: <ArrowDown className="h-5 w-5 text-green-500 animate-pulse" />,
        bgClass: "bg-green-50",
        textClass: "text-green-700"
      };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded-md text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">Water Level: {payload[0].value} m</p>
          <p className="text-gray-500">Safe Level: {payload[1].value} m</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-blue-500" />
          Water Level Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">Current</span>
            <div className="text-xl font-bold">{trendData[trendData.length - 1].level}m</div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 ${currentTrend.bgClass} rounded-full`}>
            <span>{currentTrend.icon}</span>
            <span className={`text-sm font-medium ${currentTrend.textClass} capitalize`}>
              {currentTrend.direction}
            </span>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 3]} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke="#3b82f6" 
                fill="#93c5fd" 
                fillOpacity={0.6}
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="safe" 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Actual Level</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-red-400 rounded-full"></div>
            <span>Safe Level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterLevelTrendsWidget;
