
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import HistoricalDataChart from "@/components/HistoricalDataChart";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { SensorData } from "@/types";
import { getHistoricalSensorData } from "@/utils/api";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileDown } from "lucide-react";

const Historical = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");
  
  useEffect(() => {
    document.title = "FloodGuardia - Historical Data";
    
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
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const downloadCSV = () => {
    // Create CSV content
    const headers = "Timestamp,Water Level (m),Rainfall (mm/h),Temperature (°C),Humidity (%),Soil Moisture (%),Risk Level\n";
    
    const csvContent = data.map(item => {
      return `${item.timestamp},${item.waterLevel},${item.rainfall},${item.temperature},${item.humidity},${item.soilMoisture},${item.predictionRisk}`;
    }).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `floodguardia_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Historical Flood Data</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="14">Last 14 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={downloadCSV} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Historical Sensor Data</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <HistoricalDataChart />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Data Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Water Level (m)</TableHead>
                        <TableHead>Rainfall (mm/h)</TableHead>
                        <TableHead>Temperature (°C)</TableHead>
                        <TableHead>Humidity (%)</TableHead>
                        <TableHead>Soil Moisture (%)</TableHead>
                        <TableHead>Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.slice(0, 10).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.timestamp)}</TableCell>
                          <TableCell>{item.waterLevel}</TableCell>
                          <TableCell>{item.rainfall}</TableCell>
                          <TableCell>{item.temperature}</TableCell>
                          <TableCell>{item.humidity}%</TableCell>
                          <TableCell>{item.soilMoisture}%</TableCell>
                          <TableCell className="uppercase font-medium">
                            {item.predictionRisk}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Full Dataset
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Historical;
