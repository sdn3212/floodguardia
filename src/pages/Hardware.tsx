
import { useEffect } from "react";
import Layout from "@/components/Layout";
import HardwareConnect from "@/components/HardwareConnect";
import ArduinoCode from "@/components/ArduinoCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Hardware = () => {
  useEffect(() => {
    document.title = "Protex - Hardware Connection";
  }, []);
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Hardware Connection</h1>
        <p className="text-gray-400">
          Connect and monitor your flood sensor network, check device status, and use Gemini AI for real-time flood risk assessments.
        </p>
        
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect">Connect Hardware</TabsTrigger>
            <TabsTrigger value="code">Arduino Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="mt-4">
            <HardwareConnect />
          </TabsContent>
          
          <TabsContent value="code" className="mt-4">
            <ArduinoCode />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Hardware;
