
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const ArduinoCode = () => {
  const [copied, setCopied] = useState(false);
  
  const arduinoCode = `
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Display setup
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API endpoint
const char* serverUrl = "http://your-backend-url.com/api/receive_sensor";

// Sensor pins
#define TRIGGER_PIN D1
#define ECHO_PIN D2
#define RAIN_SENSOR_DIGITAL D3
#define RAIN_SENSOR_ANALOG A0
#define DHT_PIN D4
#define SOIL_MOISTURE_PIN A1
#define BUZZER_PIN D5
#define DHT_TYPE DHT22  // DHT11 or DHT22

// Initialize sensors
DHT dht(DHT_PIN, DHT_TYPE);

// Thresholds for alerts
const float WATER_LEVEL_ALERT = 7.0;  // in meters
const int RAINFALL_ALERT = 30;        // in mm/h
const int SOIL_MOISTURE_ALERT = 80;   // in %

// Variables
unsigned long lastSendTime = 0;
const int sendInterval = 60000;  // send data every 60 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Flood Monitoring System");
  display.println("Initializing...");
  display.display();
  
  // Initialize pins
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RAIN_SENSOR_DIGITAL, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Initialize DHT sensor
  dht.begin();
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    display.print(".");
    display.display();
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi connected!");
  display.println("IP: " + WiFi.localIP().toString());
  display.display();
  delay(2000);
}

float readWaterLevel() {
  // Using ultrasonic sensor to measure water level
  digitalWrite(TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2;  // in cm
  
  // Convert to water level (assuming sensor is mounted at known height)
  // Adjust the calculation based on your installation
  float sensorHeight = 1000;  // 10 meters in cm
  float waterLevel = (sensorHeight - distance) / 100.0;  // convert to meters
  
  // Ensure water level is not negative
  if (waterLevel < 0) waterLevel = 0;
  
  return waterLevel;
}

int readRainfall() {
  // Using analog rain sensor (more accurate)
  int rainAnalogVal = analogRead(RAIN_SENSOR_ANALOG);
  
  // Map analog value to rainfall in mm/h (this needs calibration)
  // This is a simplified calculation - for actual deployment, perform proper calibration
  int rainfall = map(rainAnalogVal, 1023, 0, 0, 100);
  
  return rainfall;
}

float readTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    Serial.println("Failed to read temperature from DHT sensor!");
    return 0.0;
  }
  return temp;
}

float readHumidity() {
  float humidity = dht.readHumidity();
  if (isnan(humidity)) {
    Serial.println("Failed to read humidity from DHT sensor!");
    return 0.0;
  }
  return humidity;
}

int readSoilMoisture() {
  // Read soil moisture sensor
  int soilValue = analogRead(SOIL_MOISTURE_PIN);
  
  // Map the sensor value to percentage (calibrate for your soil sensor)
  int soilPercent = map(soilValue, 1023, 0, 0, 100);
  
  return soilPercent;
}

bool checkAlertConditions(float waterLevel, int rainfall, int soilMoisture) {
  return (waterLevel >= WATER_LEVEL_ALERT || 
          rainfall >= RAINFALL_ALERT || 
          soilMoisture >= SOIL_MOISTURE_ALERT);
}

void triggerAlert() {
  // Sound the buzzer with an alert pattern
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(300);
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  }
}

void sendData(float waterLevel, int rainfall, float temperature, float humidity, int soilMoisture) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    // Create JSON document
    StaticJsonDocument<200> doc;
    doc["waterLevel"] = waterLevel;
    doc["rainfall"] = rainfall;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["soilMoisture"] = soilMoisture;
    
    // Serialize JSON to string
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send the request
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println(response);
      
      // Check response for alert status
      StaticJsonDocument<200> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, response);
      
      if (!error) {
        if (responseDoc.containsKey("alert") && responseDoc["alert"].as<bool>()) {
          // Server reports alert condition
          triggerAlert();
        }
      }
    }
    else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }
    
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
}

void updateDisplay(float waterLevel, int rainfall, float temperature, float humidity, int soilMoisture) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("Flood Monitoring System");
  display.println("---------------------");
  display.print("Water: ");
  display.print(waterLevel);
  display.println(" m");
  display.print("Rain: ");
  display.print(rainfall);
  display.println(" mm/h");
  display.print("Temp: ");
  display.print(temperature);
  display.println(" C");
  display.print("Humidity: ");
  display.print(humidity);
  display.println(" %");
  display.print("Soil: ");
  display.print(soilMoisture);
  display.println(" %");
  
  if (checkAlertConditions(waterLevel, rainfall, soilMoisture)) {
    display.setTextSize(2);
    display.setCursor(0, 48);
    display.println("ALERT!");
    display.setTextSize(1);
  }
  
  display.display();
}

void loop() {
  // Read sensor values
  float waterLevel = readWaterLevel();
  int rainfall = readRainfall();
  float temperature = readTemperature();
  float humidity = readHumidity();
  int soilMoisture = readSoilMoisture();
  
  // Debug output
  Serial.println("Water Level: " + String(waterLevel) + " m");
  Serial.println("Rainfall: " + String(rainfall) + " mm/h");
  Serial.println("Temperature: " + String(temperature) + " C");
  Serial.println("Humidity: " + String(humidity) + " %");
  Serial.println("Soil Moisture: " + String(soilMoisture) + " %");
  Serial.println("---------------------");
  
  // Update display with current readings
  updateDisplay(waterLevel, rainfall, temperature, humidity, soilMoisture);
  
  // Check for alert conditions
  if (checkAlertConditions(waterLevel, rainfall, soilMoisture)) {
    triggerAlert();
  }
  
  // Send data to server at regular intervals
  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= sendInterval) {
    sendData(waterLevel, rainfall, temperature, humidity, soilMoisture);
    lastSendTime = currentTime;
  }
  
  delay(2000);  // Read sensors every 2 seconds
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(arduinoCode);
    setCopied(true);
    toast.success("Arduino code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Arduino IoT Code</CardTitle>
        <CardDescription>
          Code for ESP8266/ESP32 to collect sensor data and send it to the backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-2 right-2 z-10"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
            <pre><code>{arduinoCode}</code></pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArduinoCode;
