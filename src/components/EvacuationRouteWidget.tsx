
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Map, Route } from "lucide-react";

const EvacuationRouteWidget = () => {
  const evacuationRoutes = [
    {
      name: "Primary Route - East",
      description: "Via Highland Avenue to Shelter Point",
      distance: "2.3 miles",
      estimatedTime: "12 min"
    },
    {
      name: "Secondary Route - North",
      description: "Via Riverside Drive to High Ground Community Center",
      distance: "3.5 miles",
      estimatedTime: "18 min"
    },
    {
      name: "Emergency Route - West",
      description: "Via Mountain Pass to Valley Evacuation Center",
      distance: "4.1 miles",
      estimatedTime: "25 min"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5 text-blue-500" />
          Evacuation Routes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {evacuationRoutes.map((route, index) => (
            <div key={index} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-blue-700">{route.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{route.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {route.distance}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {route.estimatedTime}
                  </span>
                </div>
              </div>
              <button className="mt-2 w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View on Map
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvacuationRouteWidget;
