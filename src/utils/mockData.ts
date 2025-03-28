
import { FloodAlert, RiskLevel, SensorData, WeatherData } from "@/types";
import { SENSORS_MOCK_DATA } from "@/config/constants";

const generateRandomValue = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

const getRiskLevelBasedOnData = (waterLevel: number, rainfall: number, soilMoisture: number): RiskLevel => {
  // Simple algorithm for risk assessment
  const waterLevelNormalized = waterLevel / SENSORS_MOCK_DATA.waterLevel.max;
  const rainfallNormalized = rainfall / SENSORS_MOCK_DATA.rainfall.max;
  const soilMoistureNormalized = soilMoisture / SENSORS_MOCK_DATA.soilMoisture.max;
  
  const combinedRisk = waterLevelNormalized * 0.4 + rainfallNormalized * 0.4 + soilMoistureNormalized * 0.2;
  
  if (combinedRisk > 0.75) return 'critical';
  if (combinedRisk > 0.5) return 'high';
  if (combinedRisk > 0.25) return 'medium';
  return 'low';
};

export const generateMockSensorData = (count: number = 1): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 3600000).toISOString(); // Go back in time
    const waterLevel = generateRandomValue(SENSORS_MOCK_DATA.waterLevel.min, SENSORS_MOCK_DATA.waterLevel.max);
    const rainfall = generateRandomValue(SENSORS_MOCK_DATA.rainfall.min, SENSORS_MOCK_DATA.rainfall.max);
    const temperature = generateRandomValue(SENSORS_MOCK_DATA.temperature.min, SENSORS_MOCK_DATA.temperature.max);
    const humidity = generateRandomValue(SENSORS_MOCK_DATA.humidity.min, SENSORS_MOCK_DATA.humidity.max);
    const soilMoisture = generateRandomValue(SENSORS_MOCK_DATA.soilMoisture.min, SENSORS_MOCK_DATA.soilMoisture.max);
    
    data.push({
      id: `sensor-${i}`,
      timestamp,
      waterLevel,
      rainfall,
      temperature,
      humidity,
      soilMoisture,
      predictionRisk: getRiskLevelBasedOnData(waterLevel, rainfall, soilMoisture)
    });
  }
  
  return data;
};

export const generateMockWeatherData = (): WeatherData => {
  const weather: WeatherData = {
    location: 'New York, NY',
    temperature: generateRandomValue(SENSORS_MOCK_DATA.temperature.min, SENSORS_MOCK_DATA.temperature.max),
    description: ['Cloudy', 'Rain', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Partly Cloudy'][Math.floor(Math.random() * 6)],
    humidity: generateRandomValue(SENSORS_MOCK_DATA.humidity.min, SENSORS_MOCK_DATA.humidity.max),
    windSpeed: generateRandomValue(0, 30),
    icon: ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d'][Math.floor(Math.random() * 8)],
    rainfall: generateRandomValue(SENSORS_MOCK_DATA.rainfall.min, SENSORS_MOCK_DATA.rainfall.max)
  };
  
  return weather;
};

export const generateMockAlerts = (count: number = 5): FloodAlert[] => {
  const alerts: FloodAlert[] = [];
  const now = new Date();
  const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
  const locations = ['Downtown', 'Riverside Park', 'Central District', 'East Side', 'West End'];
  
  for (let i = 0; i < count; i++) {
    const riskLevel = riskLevels[Math.floor(Math.random() * (count === 5 ? 4 : (i % 4)))];
    const location = locations[i % locations.length];
    const timestamp = new Date(now.getTime() - i * 3600000 * 2).toISOString();
    
    let message = '';
    switch (riskLevel) {
      case 'low':
        message = `Low flood risk detected in ${location}. Regular monitoring in place.`;
        break;
      case 'medium':
        message = `Medium flood risk alert for ${location}. Stay informed about changing conditions.`;
        break;
      case 'high':
        message = `High flood risk warning for ${location}. Prepare for possible evacuation.`;
        break;
      case 'critical':
        message = `CRITICAL FLOOD ALERT for ${location}. Immediate evacuation recommended.`;
        break;
    }
    
    alerts.push({
      id: `alert-${i}`,
      timestamp,
      riskLevel,
      message,
      location,
      isRead: Math.random() > 0.5
    });
  }
  
  return alerts;
};

export const generateHistoricalData = (days: number = 30): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 3600000);
    
    // Generate more realistic patterns over time
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
    const seasonalFactor = Math.sin((dayOfYear / 365) * Math.PI * 2) * 0.3 + 0.5; // Seasonal pattern
    
    const waterLevel = generateRandomValue(
      SENSORS_MOCK_DATA.waterLevel.min, 
      SENSORS_MOCK_DATA.waterLevel.max * seasonalFactor
    );
    
    const rainfall = generateRandomValue(
      SENSORS_MOCK_DATA.rainfall.min,
      SENSORS_MOCK_DATA.rainfall.max * seasonalFactor
    );
    
    const temperature = generateRandomValue(
      SENSORS_MOCK_DATA.temperature.min + (10 * seasonalFactor),
      SENSORS_MOCK_DATA.temperature.max * seasonalFactor
    );
    
    const humidity = generateRandomValue(
      SENSORS_MOCK_DATA.humidity.min + (20 * seasonalFactor),
      SENSORS_MOCK_DATA.humidity.max * 0.8
    );
    
    const soilMoisture = generateRandomValue(
      SENSORS_MOCK_DATA.soilMoisture.min + (10 * seasonalFactor),
      SENSORS_MOCK_DATA.soilMoisture.max * seasonalFactor
    );
    
    data.push({
      id: `historical-${i}`,
      timestamp: date.toISOString(),
      waterLevel,
      rainfall,
      temperature,
      humidity,
      soilMoisture,
      predictionRisk: getRiskLevelBasedOnData(waterLevel, rainfall, soilMoisture)
    });
  }
  
  return data.reverse(); // Most recent first
};
