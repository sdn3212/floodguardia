
import { MapLocation, RiskLevel } from "@/types";

export const RISK_LEVEL_COLORS: Record<RiskLevel, string> = {
  low: 'bg-flood-low',
  medium: 'bg-flood-medium',
  high: 'bg-flood-high',
  critical: 'bg-flood-critical'
};

export const RISK_LEVEL_TEXT_COLORS: Record<RiskLevel, string> = {
  low: 'text-flood-low',
  medium: 'text-flood-medium',
  high: 'text-flood-high',
  critical: 'text-flood-critical'
};

export const RISK_LEVEL_DESCRIPTIONS: Record<RiskLevel, string> = {
  low: 'No immediate flood risk. Normal monitoring in effect.',
  medium: 'Potential flood conditions developing. Stay alert for updates.',
  high: 'Significant flood risk detected. Prepare for possible evacuation.',
  critical: 'Imminent flooding expected. Evacuate to higher ground immediately.'
};

export const API_KEYS = {
  GEMINI: "AIzaSyDKrdqNEPxy7660KlVTTNOyqp71p9stbzE",
  OPENWEATHERMAP: "22eefce6473b2558318670f52c295b67",
  MAPTILER: "LJwsgPqESAjRNnYh1cjw",
  METEOBLUE: "NGcpaq3HRD4f6SE1"
};

export const DEFAULT_MAP_LOCATION: [number, number] = [-73.935242, 40.730610]; // NYC
export const DEFAULT_MAP_ZOOM = 12;

export const MOCK_FLOOD_LOCATIONS: MapLocation[] = [
  {
    id: '1',
    name: 'Downtown',
    coordinates: [-73.935242, 40.730610],
    riskLevel: 'high'
  },
  {
    id: '2',
    name: 'Riverside Park',
    coordinates: [-73.965242, 40.750610],
    riskLevel: 'critical'
  },
  {
    id: '3',
    name: 'Central District',
    coordinates: [-73.915242, 40.710610],
    riskLevel: 'medium'
  },
  {
    id: '4',
    name: 'East Side',
    coordinates: [-73.905242, 40.740610],
    riskLevel: 'low'
  },
  {
    id: '5',
    name: 'West End',
    coordinates: [-73.955242, 40.720610],
    riskLevel: 'medium'
  }
];

export const SENSORS_MOCK_DATA = {
  waterLevel: { min: 0, max: 10, unit: 'm' },
  rainfall: { min: 0, max: 50, unit: 'mm/h' },
  temperature: { min: 0, max: 40, unit: '°C' },
  humidity: { min: 20, max: 100, unit: '%' },
  soilMoisture: { min: 0, max: 100, unit: '%' }
};
