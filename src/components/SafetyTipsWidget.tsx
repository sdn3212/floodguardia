
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, LifeBuoy } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface SafetyTipsWidgetProps {
  className?: string;
}

const SafetyTipsWidget = ({ className }: SafetyTipsWidgetProps) => {
  const [open, setOpen] = useState(false);
  
  const safetyTips = [
    {
      title: "Before a Flood",
      tips: [
        "Prepare an emergency kit with essential supplies",
        "Know evacuation routes from your neighborhood",
        "Move valuable items to higher levels in your home"
      ]
    },
    {
      title: "During a Flood",
      tips: [
        "Avoid walking or driving through flood waters",
        "Move to higher ground if instructed",
        "Monitor local news for emergency instructions"
      ]
    },
    {
      title: "After a Flood",
      tips: [
        "Return home only when authorities indicate it's safe",
        "Clean and disinfect everything that got wet",
        "Document any property damage for insurance purposes"
      ]
    }
  ];

  return (
    <Card className={`border-border bg-gradient-to-br from-card to-card/80 ${className}`}>
      <CardHeader className="pb-2 border-b border-border/50">
        <CardTitle className="flex items-center text-card-foreground">
          <LifeBuoy className="h-5 w-5 mr-2 text-blue-400" />
          Flood Safety Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {safetyTips.map((section, index) => (
            <Collapsible 
              key={index} 
              open={index === 0 ? true : open} 
              onOpenChange={index === 0 ? undefined : setOpen}
              className="border border-border rounded-md overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium bg-secondary/50 hover:bg-secondary text-card-foreground">
                {section.title}
                <Info className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 bg-card/50">
                <ul className="list-disc pl-5 space-y-1">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-card-foreground">{tip}</li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyTipsWidget;
