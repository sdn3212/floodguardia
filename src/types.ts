
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SensorData {
  id: string;
  timestamp: string;
  waterLevel: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  predictionRisk: RiskLevel;
}

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  rainfall: number;
}

export interface FloodAlert {
  id: string;
  timestamp: string;
  riskLevel: RiskLevel;
  message: string;
  location: string;
  isRead: boolean;
}

export interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  riskLevel: RiskLevel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    pushNotification: boolean;
  };
}
