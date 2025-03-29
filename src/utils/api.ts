import { FloodAlert, RiskLevel, ForecastData, WeatherData, SensorData } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const getFloodAlerts = async (): Promise<FloodAlert[]> => {
  try {
    // Replace with a real API call in production
    console.log("Fetching flood alerts...");
    
    // Mock data for now
    const mockAlerts: FloodAlert[] = [
      {
        id: "1",
        message: "Moderate flood risk in downtown area",
        riskLevel: "medium",
        timestamp: new Date().toISOString(),
        isRead: false,
        location: "Downtown"
      },
      {
        id: "2",
        message: "High flood risk in coastal regions due to storm surge",
        riskLevel: "high",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: true,
        location: "Coastal Region"
      },
      {
        id: "3",
        message: "Critical flood risk in low-lying areas near the river",
        riskLevel: "critical",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        isRead: false,
        location: "Riverside"
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockAlerts;
  } catch (error) {
    console.error("Error fetching flood alerts:", error);
    return [];
  }
};

export const getFloodPrediction = async (): Promise<{ riskLevel: RiskLevel; description: string }> => {
  try {
    console.log("Fetching flood prediction...");
    
    // Mock data for now
    const riskLevels: RiskLevel[] = ["low", "medium", "high", "critical"];
    const randomIndex = Math.floor(Math.random() * riskLevels.length);
    const riskLevel = riskLevels[randomIndex];
    
    let description = "";
    switch (riskLevel) {
      case "low":
        description = "No significant flood risk in your area at this time.";
        break;
      case "medium":
        description = "Moderate flood risk due to recent rainfall. Stay informed.";
        break;
      case "high":
        description = "High flood risk in your area. Consider preparation measures.";
        break;
      case "critical":
        description = "Critical flood risk! Immediate action may be required.";
        break;
    }
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return { riskLevel, description };
  } catch (error) {
    console.error("Error fetching flood prediction:", error);
    return { riskLevel: "low", description: "Unable to fetch prediction data." };
  }
};

export const getCurrentSensorData = async (): Promise<SensorData[]> => {
  try {
    console.log("Fetching current sensor data...");
    
    // Mock sensor data
    const mockSensorData: SensorData[] = [
      {
        id: "sensor-1",
        timestamp: new Date().toISOString(),
        waterLevel: 2.3 + Math.random(),
        rainfall: 15 + Math.random() * 5,
        temperature: 22 + Math.random() * 3,
        humidity: 65 + Math.random() * 10,
        soilMoisture: 45 + Math.random() * 15,
        predictionRisk: "low"
      },
      {
        id: "sensor-2",
        timestamp: new Date().toISOString(),
        waterLevel: 4.7 + Math.random(),
        rainfall: 25 + Math.random() * 5,
        temperature: 23 + Math.random() * 3,
        humidity: 70 + Math.random() * 10,
        soilMoisture: 60 + Math.random() * 15,
        predictionRisk: "medium"
      },
      {
        id: "sensor-3",
        timestamp: new Date().toISOString(),
        waterLevel: 7.2 + Math.random(),
        rainfall: 45 + Math.random() * 5,
        temperature: 21 + Math.random() * 3,
        humidity: 85 + Math.random() * 10,
        soilMoisture: 75 + Math.random() * 15,
        predictionRisk: "high"
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return mockSensorData;
  } catch (error) {
    console.error("Error fetching current sensor data:", error);
    return [];
  }
};

export const getCurrentWeather = async (): Promise<WeatherData> => {
  try {
    console.log("Fetching current weather...");
    
    // Mock weather data
    const mockWeatherData: WeatherData = {
      location: "San Francisco, CA",
      temperature: 18 + Math.random() * 8,
      description: "Partly Cloudy",
      humidity: 60 + Math.random() * 20,
      windSpeed: 8 + Math.random() * 7,
      icon: "clouds",
      rainfall: 5 + Math.random() * 20
    };
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockWeatherData;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

export const getForecastData = async (): Promise<ForecastData[]> => {
  try {
    console.log("Fetching forecast data...");
    
    // Mock forecast data for the next 5 days
    const mockForecastData: ForecastData[] = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      return {
        date: date.toISOString(),
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain"][Math.floor(Math.random() * 5)],
        tempHigh: 20 + Math.floor(Math.random() * 10),
        tempLow: 12 + Math.floor(Math.random() * 8),
        precipitation: Math.floor(Math.random() * 100),
        humidity: 50 + Math.floor(Math.random() * 50)
      };
    });
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockForecastData;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return [];
  }
};

export const getHistoricalSensorData = async (days: number = 30): Promise<SensorData[]> => {
  try {
    console.log(`Fetching historical sensor data for the past ${days} days...`);
    
    // Mock historical data
    const mockHistoricalData: SensorData[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Ensure we're creating a valid date string
      const validDate = date.toISOString();
      
      return {
        id: `sensor-hist-${i}`,
        timestamp: validDate,
        waterLevel: Math.random() * 10,
        rainfall: Math.random() * 50,
        temperature: 15 + Math.random() * 15,
        humidity: 40 + Math.random() * 60,
        soilMoisture: 30 + Math.random() * 70,
        predictionRisk: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as RiskLevel
      };
    });
    
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return mockHistoricalData;
  } catch (error) {
    console.error("Error fetching historical sensor data:", error);
    return [];
  }
};

export const markAlertAsRead = async (alertId: string): Promise<boolean> => {
  try {
    // Replace with a real API call in production
    console.log(`Marking alert ${alertId} as read...`);
    
    // Mock success for now
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error(`Error marking alert ${alertId} as read:`, error);
    return false;
  }
};

export const registerForNotifications = async (email: string, preferences: any): Promise<boolean> => {
  try {
    // Replace with a real API call in production
    console.log(`Registering ${email} for notifications with preferences:`, preferences);
    
    // Mock success for now
    await new Promise(resolve => setTimeout(resolve, 750));
    
    return true;
  } catch (error) {
    console.error(`Error registering ${email} for notifications:`, error);
    return false;
  }
};

export const fetchSensorReadings = async () => {
  try {
    // Replace with a real API call in production
    console.log("Fetching sensor readings...");
    
    // Mock sensor data for now
    const mockSensorData = {
      waterLevel: Math.random() * 10,
      temperature: 25 + Math.random() * 5,
      humidity: 60 + Math.random() * 15,
      batteryLevel: 80 + Math.random() * 20
    };
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return mockSensorData;
  } catch (error) {
    console.error("Error fetching sensor readings:", error);
    throw error;
  }
};

export const fetchHistoricalData = async () => {
  try {
    // Replace with a real API call in production
    console.log("Fetching historical data...");
    
    // Mock historical data for now
    const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString(),
      waterLevel: Math.random() * 10,
      temperature: 20 + Math.random() * 10,
      humidity: 50 + Math.random() * 30
    }));
    
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return mockHistoricalData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};

export const fetchGeminiAiResponse = async (prompt: string) => {
  try {
    // Replace with a real API call in production
    console.log(`Sending to Gemini AI: ${prompt}`);
    
    // Mock a response for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      response: "Based on the current sensor data and weather forecasts, there is a moderate risk of flooding in the next 24 hours. Consider monitoring water levels closely and prepare for possible evacuation if levels continue to rise.",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};

export const connectToHardware = async (deviceId: string, port: string) => {
  try {
    console.log(`Connecting to hardware device ${deviceId} on port ${port}`);
    // Mock connection process
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: "Device connected successfully" };
  } catch (error) {
    console.error("Failed to connect to hardware:", error);
    return { success: false, message: "Connection failed" };
  }
};

export const fetchWeatherForecast = async (location: string) => {
  try {
    console.log(`Fetching weather forecast for ${location}`);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    return {
      location: location,
      forecast: [
        {
          date: new Date().toISOString(),
          temperature: 22,
          precipitation: 15,
          humidity: 65,
          windSpeed: 12
        },
        {
          date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          temperature: 24,
          precipitation: 20,
          humidity: 70,
          windSpeed: 10
        },
        {
          date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
          temperature: 26,
          precipitation: 5,
          humidity: 55,
          windSpeed: 8
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
};

export const processMeteoBlueData = (data: any) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }
  
  const validatedData = data as Record<string, any>;
  
  try {
    const forecast = [];
    
    // Safely access properties with type checks
    const timestamps = validatedData.time_stamps;
    const rainfall = validatedData.rainfall;
    const temperature = validatedData.temperature;
    
    if (Array.isArray(timestamps) && Array.isArray(rainfall) && Array.isArray(temperature)) {
      for (let i = 0; i < timestamps.length; i++) {
        forecast.push({
          time: new Date(timestamps[i] as string),
          rain: rainfall[i],
          temp: temperature[i]
        });
      }
    }
    
    return forecast;
  } catch (error) {
    console.error("Error processing MeteoBlue data:", error);
    return [];
  }
};

export const sendContactForm = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending contact form:", error);
    throw error;
  }
};
