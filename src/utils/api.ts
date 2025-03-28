
import { FloodAlert, RiskLevel, SensorData, WeatherData } from "@/types";
import { API_KEYS } from "@/config/constants";
import { generateHistoricalData, generateMockAlerts, generateMockSensorData, generateMockWeatherData } from "./mockData";

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
