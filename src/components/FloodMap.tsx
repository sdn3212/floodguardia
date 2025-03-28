
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_KEYS, DEFAULT_MAP_LOCATION, DEFAULT_MAP_ZOOM, MOCK_FLOOD_LOCATIONS } from "@/config/constants";
import { MapLocation } from "@/types";

interface FloodMapProps {
  className?: string;
}

const FloodMap = ({ className }: FloodMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [locations] = useState<MapLocation[]>(MOCK_FLOOD_LOCATIONS);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map using MapTiler
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEYS.MAPTILER}`,
      center: DEFAULT_MAP_LOCATION,
      zoom: DEFAULT_MAP_ZOOM
    });
    
    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );
    
    map.current.on("load", () => {
      if (!map.current) return;
      
      // Add markers for each location
      locations.forEach(location => {
        // Create marker element
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.backgroundColor = getRiskColor(location.riskLevel);
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
        
        // Create ripple effect for high and critical risk
        if (location.riskLevel === "high" || location.riskLevel === "critical") {
          const ripple = document.createElement("div");
          ripple.className = "ripple";
          ripple.style.position = "absolute";
          ripple.style.borderRadius = "50%";
          ripple.style.backgroundColor = getRiskColor(location.riskLevel);
          ripple.style.width = "100%";
          ripple.style.height = "100%";
          ripple.style.opacity = "0.6";
          ripple.style.animation = "ripple 1.5s infinite";
          el.appendChild(ripple);
          el.style.position = "relative";
          el.style.overflow = "visible";
        }
        
        // Add popup
        const popup = new maplibregl.Popup({ offset: 25 })
          .setHTML(`
            <strong>${location.name}</strong>
            <p>Risk Level: <span style="color: ${getRiskColor(location.riskLevel)}; font-weight: bold; text-transform: uppercase;">${location.riskLevel}</span></p>
          `);
        
        // Add marker to map
        new maplibregl.Marker(el)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current);
      });
      
      // Add a blue layer for water - fixing the GeoJSON format to include properties
      map.current.addLayer({
        id: "water-layer",
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-73.945242, 40.740610],
                  [-73.935242, 40.730610],
                  [-73.925242, 40.735610],
                  [-73.935242, 40.745610],
                  [-73.945242, 40.740610]
                ]
              ]
            },
            properties: {} // Adding the required properties field
          }
        },
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.4
        }
      });
    });
    
    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations]);
  
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case "low":
        return "#3b82f6";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      case "critical":
        return "#7f1d1d";
      default:
        return "#3b82f6";
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Flood Risk Map</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div ref={mapContainer} className="h-[400px] w-full rounded-md overflow-hidden"></div>
      </CardContent>
    </Card>
  );
};

export default FloodMap;
