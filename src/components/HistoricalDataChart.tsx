
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { SensorData } from "@/types";
import { getHistoricalSensorData } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistoricalDataChart = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const historicalData = await getHistoricalSensorData(parseInt(timeRange));
        setData(historicalData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);
  
  const formatDate = (timestamp: string) => {
    try {
      // Validate timestamp before creating Date object
      if (!timestamp || isNaN(Date.parse(timestamp))) {
        return "Invalid Date";
      }
      
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error, timestamp);
      return "Invalid Date";
    }
  };
  
  const formatTooltipDate = (timestamp: string) => {
    try {
      // Validate timestamp before creating Date object
      if (!timestamp || isNaN(Date.parse(timestamp))) {
        return "Invalid Date";
      }
      
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting tooltip date:', error, timestamp);
      return "Invalid Date";
    }
  };
  
  const prepareChartData = () => {
    return data
      .filter(item => item && item.timestamp && !isNaN(Date.parse(item.timestamp)))
      .map(item => ({
        ...item,
        date: formatDate(item.timestamp)
      }));
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-card border border-border p-3 rounded shadow-xl">
          <p className="font-medium text-card-foreground">{formatTooltipDate(data.timestamp)}</p>
          <div className="mt-2 space-y-1">
            <p className="text-blue-400">Water Level: {data.waterLevel} m</p>
            <p className="text-indigo-400">Rainfall: {data.rainfall} mm/h</p>
            <p className="text-orange-400">Temperature: {data.temperature} °C</p>
            <p className="text-teal-400">Humidity: {data.humidity} %</p>
            <p className="text-green-400">Soil Moisture: {data.soilMoisture} %</p>
          </div>
          <p className="mt-2 font-medium text-card-foreground">
            Risk: <span className="uppercase">{data.predictionRisk}</span>
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full border-border bg-gradient-to-br from-card to-card/80">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
        <CardTitle className="text-card-foreground">Historical Data</CardTitle>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[140px] bg-secondary text-secondary-foreground">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground">
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="14">Last 14 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-2 pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={prepareChartData()}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={40}
                wrapperStyle={{ paddingTop: '15px' }}
                formatter={(value) => <span className="text-card-foreground">{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="waterLevel" 
                name="Water Level (m)"
                stroke="#60a5fa" 
                activeDot={{ r: 6 }} 
                dot={{ r: 3 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="rainfall" 
                name="Rainfall (mm/h)"
                stroke="#a5b4fc" 
                activeDot={{ r: 6 }} 
                dot={{ r: 3 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="soilMoisture" 
                name="Soil Moisture (%)"
                stroke="#6ee7b7" 
                activeDot={{ r: 6 }} 
                dot={{ r: 3 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalDataChart;
