
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone } from "lucide-react";

interface EmergencyContactsWidgetProps {
  className?: string;
}

const EmergencyContactsWidget = ({ className }: EmergencyContactsWidgetProps) => {
  const emergencyContacts = [
    { name: "Emergency Services", number: "911" },
    { name: "Flood Control Center", number: "555-FLOOD" },
    { name: "Weather Emergency Line", number: "555-WEATHER" }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {emergencyContacts.map((contact, index) => (
            <li key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
              <span className="font-medium">{contact.name}</span>
              <span className="flex items-center text-blue-600">
                <Phone className="h-4 w-4 mr-1" />
                {contact.number}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsWidget;
