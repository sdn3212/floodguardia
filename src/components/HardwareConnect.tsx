
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { WifiIcon, ServerIcon, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { API_KEYS } from "@/config/constants";

interface SensorDevice {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "error";
  lastReading?: string;
  battery?: number;
}

const HardwareConnect = () => {
  const [ipAddress, setIpAddress] = useState<string>("192.168.1.100");
  const [port, setPort] = useState<string>("8080");
  const [autoConnect, setAutoConnect] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedDevices, setConnectedDevices] = useState<SensorDevice[]>([
    { id: "ws001", name: "Water Level Sensor #1", type: "ultrasonic", status: "online", lastReading: "6.2m", battery: 87 },
    { id: "rf001", name: "Rainfall Sensor #1", type: "tipping bucket", status: "online", lastReading: "15.8mm/h", battery: 92 },
    { id: "th001", name: "Temperature/Humidity #1", type: "DHT22", status: "online", lastReading: "18.5°C / 37%", battery: 78 },
    { id: "sm001", name: "Soil Moisture #1", type: "capacitive", status: "online", lastReading: "22.4%", battery: 65 },
    { id: "ws002", name: "Water Level Sensor #2", type: "pressure", status: "offline" }
  ]);
  const [predictionStatus, setPredictionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [predictionResult, setPredictionResult] = useState<string>("");

  useEffect(() => {
    // Simulate initial connection state
    const timer = setTimeout(() => {
      setIsConnected(autoConnect);
      if (autoConnect) {
        toast.success("Connected to hardware gateway");
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [autoConnect]);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast.success("Successfully connected to hardware gateway");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.info("Disconnected from hardware gateway");
  };

  const refreshDevices = () => {
    toast.info("Refreshing connected devices...");
    
    // Simulate device refresh
    setTimeout(() => {
      // Randomly change one device status for demonstration
      const updatedDevices = [...connectedDevices];
      const randomIndex = Math.floor(Math.random() * updatedDevices.length);
      
      if (updatedDevices[randomIndex].status === "offline") {
        updatedDevices[randomIndex].status = "online";
        updatedDevices[randomIndex].lastReading = "Updated reading";
        updatedDevices[randomIndex].battery = 100;
        toast.success(`${updatedDevices[randomIndex].name} is now online`);
      } else if (Math.random() > 0.7) {
        updatedDevices[randomIndex].status = "error";
        toast.error(`${updatedDevices[randomIndex].name} reported an error`);
      } else {
        // Just update the timestamp
        toast.success("All devices refreshed");
      }
      
      setConnectedDevices(updatedDevices);
    }, 2000);
  };

  const runGeminiPrediction = async () => {
    setPredictionStatus("loading");
    
    try {
      // Find the latest sensor readings
      const waterLevelSensor = connectedDevices.find(d => d.id === "ws001");
      const rainfallSensor = connectedDevices.find(d => d.id === "rf001");
      const tempHumiditySensor = connectedDevices.find(d => d.id === "th001");
      const soilMoistureSensor = connectedDevices.find(d => d.id === "sm001");
      
      // Extract values from readings (simplified)
      const waterLevel = waterLevelSensor?.lastReading?.replace("m", "") || "0";
      const rainfall = rainfallSensor?.lastReading?.replace("mm/h", "") || "0";
      
      // Parse temperature and humidity from combined reading
      const tempHumidityParts = tempHumiditySensor?.lastReading?.split(" / ") || ["0°C", "0%"];
      const temperature = tempHumidityParts[0].replace("°C", "");
      const humidity = tempHumidityParts[1].replace("%", "");
      
      const soilMoisture = soilMoistureSensor?.lastReading?.replace("%", "") || "0";
      
      // Call Gemini API for prediction
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.GEMINI}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on the following sensor data, what is the flood risk? Water level: ${waterLevel}m, Rainfall: ${rainfall}mm/h, Temperature: ${temperature}°C, Humidity: ${humidity}%, Soil Moisture: ${soilMoisture}%. Respond with only one of these risk levels: "low", "medium", "high", or "critical" followed by a brief explanation separated by a pipe character (|).`
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      const predictionText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      setPredictionResult(predictionText);
      setPredictionStatus("success");
      toast.success("AI prediction completed successfully");
    } catch (error) {
      console.error("Error making prediction:", error);
      setPredictionStatus("error");
      setPredictionResult("Failed to generate prediction. Please try again later.");
      toast.error("Failed to generate AI prediction");
    }
  };

  const renderDeviceStatus = (status: "online" | "offline" | "error") => {
    switch (status) {
      case "online":
        return <span className="flex items-center text-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> Online</span>;
      case "offline":
        return <span className="flex items-center text-gray-500"><AlertTriangle className="w-4 h-4 mr-1" /> Offline</span>;
      case "error":
        return <span className="flex items-center text-red-600"><AlertTriangle className="w-4 h-4 mr-1" /> Error</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ServerIcon className="mr-2 h-5 w-5 text-blue-500" />
            Hardware Gateway Connection
          </CardTitle>
          <CardDescription>
            Connect to your flood monitoring sensors and devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="connection">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connection" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">Gateway IP Address</Label>
                  <Input 
                    id="ip-address" 
                    value={ipAddress} 
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port" 
                    value={port} 
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="8080" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-connect">Auto Connect on Startup</Label>
                  <p className="text-sm text-gray-500">Automatically connect to hardware gateway when the app starts</p>
                </div>
                <Switch 
                  id="auto-connect" 
                  checked={autoConnect}
                  onCheckedChange={setAutoConnect}
                />
              </div>
              
              <div className="border rounded-md p-4 mt-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                
                {isConnected ? (
                  <Button
                    variant="outline" 
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <WifiIcon className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="devices" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Connected Sensors</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshDevices}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <div key={device.id} className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-gray-500">Type: {device.type}</p>
                      {device.lastReading && device.status === "online" && (
                        <p className="text-sm font-medium mt-1">Latest: {device.lastReading}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      {renderDeviceStatus(device.status)}
                      {device.battery && device.status === "online" && (
                        <p className={`text-xs mt-1 ${device.battery < 20 ? 'text-red-500' : device.battery < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                          Battery: {device.battery}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {connectedDevices.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No devices connected
                  </div>
                )}
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-3">AI Prediction with Gemini</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Generate a real-time flood risk assessment using Gemini AI based on current sensor readings.
                  </p>
                  
                  <Button 
                    onClick={runGeminiPrediction}
                    disabled={predictionStatus === "loading" || !isConnected}
                    className="w-full md:w-auto"
                  >
                    {predictionStatus === "loading" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating Prediction...
                      </>
                    ) : (
                      "Generate AI Prediction"
                    )}
                  </Button>
                  
                  {predictionResult && (
                    <div className={`mt-4 p-4 rounded-md ${predictionStatus === "error" ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`}>
                      <h4 className="font-medium mb-2">Prediction Result:</h4>
                      <p>{predictionResult}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HardwareConnect;
