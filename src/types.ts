
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

export interface ForecastData {
  date: string;
  condition: string;
  tempHigh: number;
  tempLow: number;
  precipitation: number;
  humidity: number;
}

export interface FloodAlert {
  id: string;
  timestamp: string;
  riskLevel: RiskLevel;
  message: string;
  location: string;
  isRead: boolean;
  title?: string;   // Added for compatibility
  severity?: string; // Added for compatibility
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

export interface MeteoblueData {
  time_stamps: string[];
  temperature: number[];
  precipitation: number[];
  humidity: number[];
  windspeed: number[];
  winddirection: number[];
  cloudcover: number[];
  pressure: number[];
  description: string[];
  icon: string[];
}

export interface MeteoblueForecast {
  time: Date;
  temperature: number;
  precipitation: number;
  humidity: number;
  windspeed: number;
  description: string;
  icon: string;
}
