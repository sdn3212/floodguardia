
import { addDays, format, subDays } from "date-fns";
import { FloodAlert, ForecastData, RiskLevel, SensorData, WeatherData } from "@/types";
import { SENSORS_MOCK_DATA } from "@/config/constants";

// Helper function to generate random values within a range
export const randomInRange = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Helper to generate random dates
export const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock sensor data
export const generateMockSensorData = (count: number): SensorData[] => {
  const data: SensorData[] = [];
  
  for (let i = 0; i < count; i++) {
    const waterLevel = randomInRange(SENSORS_MOCK_DATA.waterLevel.min, SENSORS_MOCK_DATA.waterLevel.max);
    const rainfall = randomInRange(SENSORS_MOCK_DATA.rainfall.min, SENSORS_MOCK_DATA.rainfall.max);
    const temperature = randomInRange(SENSORS_MOCK_DATA.temperature.min, SENSORS_MOCK_DATA.temperature.max);
    const humidity = randomInRange(SENSORS_MOCK_DATA.humidity.min, SENSORS_MOCK_DATA.humidity.max);
    const soilMoisture = randomInRange(SENSORS_MOCK_DATA.soilMoisture.min, SENSORS_MOCK_DATA.soilMoisture.max);
    
    // Determine risk level based on sensor values
    let risk: RiskLevel = 'low';
    if (waterLevel > 7 || rainfall > 30) {
      risk = 'critical';
    } else if (waterLevel > 5 || rainfall > 20) {
      risk = 'high';
    } else if (waterLevel > 3 || rainfall > 10) {
      risk = 'medium';
    }
    
    data.push({
      id: `sensor-${Date.now()}-${i}`,
      timestamp: new Date().toISOString(),
      waterLevel,
      rainfall,
      temperature,
      humidity,
      soilMoisture,
      predictionRisk: risk
    });
  }
  
  return data;
};

// Generate mock historical data
export const generateHistoricalData = (days: number): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  const startDate = subDays(now, days);
  
  for (let i = 0; i <= days; i++) {
    const date = addDays(startDate, i);
    
    // Generate multiple readings per day
    for (let j = 0; j < 4; j++) {
      const hour = j * 6; // Readings every 6 hours
      date.setHours(hour, 0, 0, 0);
      
      const waterLevel = randomInRange(SENSORS_MOCK_DATA.waterLevel.min, SENSORS_MOCK_DATA.waterLevel.max / 2); // Less extreme values for historical data
      const rainfall = randomInRange(SENSORS_MOCK_DATA.rainfall.min, SENSORS_MOCK_DATA.rainfall.max / 2);
      const temperature = randomInRange(SENSORS_MOCK_DATA.temperature.min, SENSORS_MOCK_DATA.temperature.max);
      const humidity = randomInRange(SENSORS_MOCK_DATA.humidity.min, SENSORS_MOCK_DATA.humidity.max);
      const soilMoisture = randomInRange(SENSORS_MOCK_DATA.soilMoisture.min, SENSORS_MOCK_DATA.soilMoisture.max);
      
      // Determine risk level based on sensor values
      let risk: RiskLevel = 'low';
      if (waterLevel > 7 || rainfall > 30) {
        risk = 'critical';
      } else if (waterLevel > 5 || rainfall > 20) {
        risk = 'high';
      } else if (waterLevel > 3 || rainfall > 10) {
        risk = 'medium';
      }
      
      data.push({
        id: `sensor-${date.getTime()}-${j}`,
        timestamp: date.toISOString(),
        waterLevel,
        rainfall,
        temperature,
        humidity,
        soilMoisture,
        predictionRisk: risk
      });
    }
  }
  
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Generate mock weather data
export const generateMockWeatherData = (): WeatherData => {
  const temp = randomInRange(0, 35);
  const conditions = ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'mist'];
  const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '50d'];
  
  return {
    location: 'New York',
    temperature: temp,
    description: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: randomInRange(30, 95),
    windSpeed: randomInRange(0, 20),
    icon: icons[Math.floor(Math.random() * icons.length)],
    rainfall: temp > 25 ? 0 : randomInRange(0, 15)
  };
};

// Generate mock forecast data
export const generateMockForecastData = (days: number): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Showers', 'Drizzle'];
  
  for (let i = 1; i <= days; i++) {
    const date = addDays(now, i);
    const formattedDate = format(date, 'EEE, MMM d');
    
    data.push({
      date: formattedDate,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      tempHigh: randomInRange(18, 32),
      tempLow: randomInRange(10, 18),
      precipitation: randomInRange(0, 20),
      humidity: randomInRange(40, 90)
    });
  }
  
  return data;
};

// Generate mock flood alerts
export const generateMockAlerts = (count: number): FloodAlert[] => {
  const alerts: FloodAlert[] = [];
  const now = new Date();
  const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
  const locations = ['Downtown', 'Riverside', 'Midtown', 'Harbor District', 'North End'];
  
  for (let i = 0; i < count; i++) {
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const date = randomDate(subDays(now, 2), now);
    
    let message = '';
    switch (riskLevel) {
      case 'low':
        message = `Minor water level increase detected in ${location}. No action required.`;
        break;
      case 'medium':
        message = `Rising water levels in ${location}. Monitor local conditions.`;
        break;
      case 'high':
        message = `Significant flood risk in ${location}. Prepare for possible evacuation.`;
        break;
      case 'critical':
        message = `IMMEDIATE ACTION REQUIRED: Severe flooding expected in ${location}. Evacuate to higher ground.`;
        break;
    }
    
    alerts.push({
      id: `alert-${date.getTime()}-${i}`,
      timestamp: date.toISOString(),
      riskLevel,
      message,
      location,
      isRead: Math.random() > 0.3 // 70% chance of being read
    });
  }
  
  // Sort by date descending (newest first)
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
