
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, HelpCircle, BookOpen, Download } from "lucide-react";

const ResourcesWidget = () => {
  const resources = [
    {
      title: "Flood Preparedness Guide",
      type: "PDF",
      icon: <FileText className="h-4 w-4 text-red-500" />,
      size: "1.2 MB"
    },
    {
      title: "Emergency Contacts List",
      type: "PDF",
      icon: <FileText className="h-4 w-4 text-red-500" />,
      size: "0.8 MB"
    },
    {
      title: "Local Shelters Map",
      type: "PNG",
      icon: <FileText className="h-4 w-4 text-green-500" />,
      size: "2.4 MB"
    },
    {
      title: "Flood Insurance Guide",
      type: "PDF",
      icon: <FileText className="h-4 w-4 text-red-500" />,
      size: "1.5 MB"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          Resources & Guides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                {resource.icon}
                <span className="text-sm font-medium">{resource.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{resource.size}</span>
                <Download className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <a 
            href="#" 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            Request Additional Resources
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesWidget;
