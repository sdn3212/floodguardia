
import { FloodAlert, ForecastData, RiskLevel, SensorData, WeatherData } from "@/types";
import { API_KEYS } from "@/config/constants";
import { generateHistoricalData, generateMockAlerts, generateMockForecastData, generateMockSensorData, generateMockWeatherData } from "./mockData";

// Mock API functions that would normally connect to a backend

export const getCurrentSensorData = async (): Promise<SensorData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockSensorData(1)[0];
};

export const getHistoricalSensorData = async (days: number = 7): Promise<SensorData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return generateHistoricalData(days);
};

export const getCurrentWeather = async (location: string = 'New York,US'): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEYS.OPENWEATHERMAP}`
    );
    
    if (!response.ok) {
      console.error('Weather API error:', await response.text());
      return generateMockWeatherData(); // Fallback to mock data
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp * 10) / 10,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
      rainfall: data.rain ? data.rain['1h'] || 0 : 0
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return generateMockWeatherData(); // Fallback to mock data
  }
};

export const getForecastData = async (location: string = 'New York,US'): Promise<ForecastData[]> => {
  try {
    // Attempt to fetch from meteoblue API
    const response = await fetch(
      `https://my.meteoblue.com/packages/basic-1h?apikey=${API_KEYS.METEOBLUE}&lat=40.7128&lon=-74.0060&format=json`
    );
    
    if (!response.ok) {
      console.error('Meteoblue API error:', await response.text());
      return generateMockForecastData(3); // Fallback to mock data
    }
    
    const data = await response.json();
    
    // Process and transform the data
    // Check if data.data_1h exists before trying to access it
    if (!data.data_1h) {
      console.error('Unexpected Meteoblue API response format:', data);
      return generateMockForecastData(3);
    }
    
    // Group data by day to create daily forecasts
    const dailyData: Record<string, any> = {};
    
    // Get the first 3 days of data
    const uniqueDays = [...new Set(data.data_1h.time.map((time: string) => time.split(' ')[0]))].slice(0, 3);
    
    uniqueDays.forEach(day => {
      const dayData = {
        temperatures: [] as number[],
        precipitation: 0,
        humidity: [] as number[],
        condition: ''
      };
      
      // Find all data points for this day
      data.data_1h.time.forEach((time: string, index: number) => {
        if (time.startsWith(day)) {
          if (data.data_1h.temperature) {
            dayData.temperatures.push(data.data_1h.temperature[index]);
          }
          
          if (data.data_1h.precipitation) {
            dayData.precipitation += data.data_1h.precipitation[index] || 0;
          }
          
          if (data.data_1h.relativehumidity) {
            dayData.humidity.push(data.data_1h.relativehumidity[index]);
          }
        }
      });
      
      // Determine weather condition based on precipitation
      if (dayData.precipitation > 10) {
        dayData.condition = 'Heavy Rain';
      } else if (dayData.precipitation > 5) {
        dayData.condition = 'Moderate Rain';
      } else if (dayData.precipitation > 0) {
        dayData.condition = 'Light Rain';
      } else {
        dayData.condition = 'Clear';
      }
      
      dailyData[day] = dayData;
    });
    
    // Convert to ForecastData array
    const forecast = uniqueDays.map(day => {
      const dayData = dailyData[day];
      const tempHigh = Math.max(...dayData.temperatures);
      const tempLow = Math.min(...dayData.temperatures);
      const avgHumidity = dayData.humidity.length 
        ? Math.round(dayData.humidity.reduce((a: number, b: number) => a + b, 0) / dayData.humidity.length) 
        : 0;
      
      return {
        date: new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        condition: dayData.condition,
        tempHigh: Math.round(tempHigh),
        tempLow: Math.round(tempLow),
        precipitation: Math.round(dayData.precipitation * 10) / 10,
        humidity: avgHumidity
      };
    });
    
    return forecast;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return generateMockForecastData(3);
  }
};

export const getFloodAlerts = async (count: number = 5): Promise<FloodAlert[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return generateMockAlerts(count);
};

export const getFloodPrediction = async (): Promise<{riskLevel: RiskLevel, description: string}> => {
  // Get current sensor data
  const currentData = await getCurrentSensorData();
  
  try {
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
            text: `Based on the following sensor data, what is the flood risk? Water level: ${currentData.waterLevel}m, Rainfall: ${currentData.rainfall}mm/h, Temperature: ${currentData.temperature}°C, Humidity: ${currentData.humidity}%, Soil Moisture: ${currentData.soilMoisture}%. Respond with only one of these risk levels: "low", "medium", "high", or "critical" followed by a brief explanation separated by a pipe character (|).`
          }]
        }]
      })
    });
    
    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return {
        riskLevel: currentData.predictionRisk,
        description: `Based on the current water level of ${currentData.waterLevel}m and rainfall of ${currentData.rainfall}mm/h, combined with soil saturation at ${currentData.soilMoisture}%, the current flood risk is ${currentData.predictionRisk.toUpperCase()}.`
      };
    }
    
    const data = await response.json();
    const predictionText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the response - format should be "risk_level|explanation"
    const [predictedRisk, explanation] = predictionText.split('|').map(part => part.trim());
    
    // Validate and normalize risk level
    let riskLevel: RiskLevel = 'low';
    if (['low', 'medium', 'high', 'critical'].includes(predictedRisk.toLowerCase())) {
      riskLevel = predictedRisk.toLowerCase() as RiskLevel;
    }
    
    return {
      riskLevel,
      description: explanation || `Based on sensor data analysis, the current flood risk is ${riskLevel.toUpperCase()}.`
    };
  } catch (error) {
    console.error('Error getting flood prediction:', error);
    return {
      riskLevel: currentData.predictionRisk,
      description: `Based on sensor data analysis, the current flood risk is ${currentData.predictionRisk.toUpperCase()}.`
    };
  }
};

export const markAlertAsRead = async (alertId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  // In a real app, this would update the database
  return true;
};

export const registerForNotifications = async (email: string, preferences: {
  email: boolean, 
  sms: boolean, 
  pushNotification: boolean
}): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  // In a real app, this would update the database
  return true;
};

// New API function to get evacuation routes
export const getEvacuationRoutes = async () => {
  // In a real app, this would fetch from a database or API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "route-1",
      name: "Primary Route - East",
      startPoint: "Your Location",
      endPoint: "Shelter Point",
      distance: "2.3 miles",
      estimatedTime: "12 min",
      isSafe: true
    },
    {
      id: "route-2",
      name: "Secondary Route - North",
      startPoint: "Your Location",
      endPoint: "High Ground Community Center",
      distance: "3.5 miles",
      estimatedTime: "18 min",
      isSafe: true
    },
    {
      id: "route-3",
      name: "Emergency Route - West",
      startPoint: "Your Location",
      endPoint: "Valley Evacuation Center",
      distance: "4.1 miles",
      estimatedTime: "25 min",
      isSafe: false
    }
  ];
};

// Hardware connectivity API functions
export const connectToHardware = async (ipAddress: string, port: string): Promise<boolean> => {
  // In a real app, this would establish a connection to the hardware gateway
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

export const getConnectedDevices = async (): Promise<any[]> => {
  // In a real app, this would fetch the list of connected devices from the hardware gateway
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: "ws001", name: "Water Level Sensor #1", type: "ultrasonic", status: "online", lastReading: "6.2m", battery: 87 },
    { id: "rf001", name: "Rainfall Sensor #1", type: "tipping bucket", status: "online", lastReading: "15.8mm/h", battery: 92 },
    { id: "th001", name: "Temperature/Humidity #1", type: "DHT22", status: "online", lastReading: "18.5°C / 37%", battery: 78 },
    { id: "sm001", name: "Soil Moisture #1", type: "capacitive", status: "online", lastReading: "22.4%", battery: 65 }
  ];
};

export const sendCommandToDevice = async (deviceId: string, command: string): Promise<boolean> => {
  // In a real app, this would send a command to a specific device
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const updateFirmware = async (deviceId: string): Promise<boolean> => {
  // In a real app, this would update the firmware of a specific device
  await new Promise(resolve => setTimeout(resolve, 3000));
  return true;
};
