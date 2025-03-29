import { FloodAlert } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
        isRead: false
      },
      {
        id: "2",
        message: "High flood risk in coastal regions due to storm surge",
        riskLevel: "high",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: true
      },
      {
        id: "3",
        message: "Critical flood risk in low-lying areas near the river",
        riskLevel: "critical",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        isRead: false
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockAlerts;
  } catch (error) {
    console.error("Error fetching flood alerts:", error);
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
