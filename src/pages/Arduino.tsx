
import { useEffect } from "react";
import Layout from "@/components/Layout";
import ArduinoCode from "@/components/ArduinoCode";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Arduino = () => {
  useEffect(() => {
    document.title = "FloodGuardia - IoT Setup";
  }, []);
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">IoT System Setup</h1>
        
        <Tabs defaultValue="hardware">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hardware">Hardware Setup</TabsTrigger>
            <TabsTrigger value="code">Arduino Code</TabsTrigger>
            <TabsTrigger value="connection">Backend Connection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hardware" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Required Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Main Controller</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>ESP8266 or ESP32 Development Board</li>
                        <li>Micro USB Cable for Power/Programming</li>
                        <li>Breadboard for Prototyping</li>
                        <li>Jumper Wires (Male-to-Male, Male-to-Female)</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Sensors</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Ultrasonic Sensor HC-SR04 (Water Level)</li>
                        <li>Rain Sensor Module</li>
                        <li>DHT11/DHT22 Temperature & Humidity Sensor</li>
                        <li>Soil Moisture Sensor</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Output Devices</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>0.96" OLED Display (I2C Interface)</li>
                        <li>Buzzer Module (for Alerts)</li>
                        <li>LEDs (Red, Yellow, Green) for Visual Indicators</li>
                      </ul>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Power Supply</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Power Bank (for Portable Operation)</li>
                        <li>5V Power Adapter</li>
                        <li>Optional: Solar Panel with Charging Circuit</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Wiring Diagram</h3>
                    <div className="border p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`// Connect components to ESP8266/ESP32:

// Ultrasonic Sensor (Water Level)
TRIGGER_PIN -> D1
ECHO_PIN -> D2

// Rain Sensor
RAIN_SENSOR_DIGITAL -> D3
RAIN_SENSOR_ANALOG -> A0

// DHT Temperature & Humidity Sensor
DHT_PIN -> D4

// Soil Moisture Sensor
SOIL_MOISTURE_PIN -> A1

// Buzzer
BUZZER_PIN -> D5

// OLED Display
SDA -> D2 (default I2C pins may vary)
SCL -> D1 (default I2C pins may vary)

// LEDs (optional)
RED_LED -> D6
YELLOW_LED -> D7
GREEN_LED -> D8`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code" className="pt-4">
            <ArduinoCode />
          </TabsContent>
          
          <TabsContent value="connection" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Backend API Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-3">API Endpoints</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-mono text-sm mb-1">POST /api/receive_sensor</p>
                        <p className="text-gray-600 text-sm">Endpoint for IoT device to send sensor readings</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-mono text-sm mb-1">GET /api/prediction</p>
                        <p className="text-gray-600 text-sm">Get current flood prediction based on ML model</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="font-mono text-sm mb-1">GET /api/alerts</p>
                        <p className="text-gray-600 text-sm">Retrieve active flood alerts</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-3">JSON Payload Format</h3>
                    <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto">
{`// Example payload to be sent by IoT device:
{
  "waterLevel": 3.24,       // in meters
  "rainfall": 12.5,         // in mm/h
  "temperature": 28.3,      // in °C
  "humidity": 87.2,         // in %
  "soilMoisture": 65.4      // in %
}`}
                    </pre>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Setup Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Update the <code className="bg-gray-100 px-1 py-0.5 rounded">ssid</code> and <code className="bg-gray-100 px-1 py-0.5 rounded">password</code> variables in the Arduino code with your WiFi credentials.</li>
                      <li>Replace the <code className="bg-gray-100 px-1 py-0.5 rounded">serverUrl</code> variable with your actual backend API endpoint.</li>
                      <li>Upload the code to your ESP8266/ESP32 using the Arduino IDE.</li>
                      <li>Verify connectivity by checking the serial monitor for successful API responses.</li>
                      <li>Optional: Configure alert thresholds based on your specific deployment location.</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Arduino;
