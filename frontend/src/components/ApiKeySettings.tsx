
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeySettingsProps {
  onApiKeysChange: (keys: { ticketmaster: string; googleMaps: string }) => void;
}

const ApiKeySettings = ({ onApiKeysChange }: ApiKeySettingsProps) => {
  const [ticketmasterKey, setTicketmasterKey] = useState("lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3");
  const [googleMapsKey, setGoogleMapsKey] = useState("AIzaSyC_QybJ8Rbg3wB0qzdmgD-1waWu_7P8WDI");
  const { toast } = useToast();

  useEffect(() => {
    // Load API keys from localStorage on component mount, or use defaults
    const savedTicketmasterKey = localStorage.getItem('ticketmaster_api_key') || "lvw06wBGLP57NHCVsqYHs6MXrVZPrTU3";
    const savedGoogleMapsKey = localStorage.getItem('google_maps_api_key') || "AIzaSyC_QybJ8Rbg3wB0qzdmgD-1waWu_7P8WDI";
    
    setTicketmasterKey(savedTicketmasterKey);
    setGoogleMapsKey(savedGoogleMapsKey);
    
    // Automatically initialize with the API keys
    onApiKeysChange({
      ticketmaster: savedTicketmasterKey,
      googleMaps: savedGoogleMapsKey
    });
  }, [onApiKeysChange]);

  const handleSaveKeys = () => {
    if (!ticketmasterKey || !googleMapsKey) {
      toast({
        title: "Missing API keys",
        description: "Please enter both Ticketmaster and Google Maps API keys",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('ticketmaster_api_key', ticketmasterKey);
    localStorage.setItem('google_maps_api_key', googleMapsKey);

    onApiKeysChange({
      ticketmaster: ticketmasterKey,
      googleMaps: googleMapsKey
    });

    toast({
      title: "API keys saved",
      description: "Your API keys have been saved locally and you can now search for events"
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          API Configuration
        </CardTitle>
        <CardDescription>
          API keys are pre-configured and ready to use. You can modify them if needed.
          Keys are stored locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ticketmaster-key">Ticketmaster API Key</Label>
          <Input
            id="ticketmaster-key"
            type="password"
            placeholder="Enter your Ticketmaster API key"
            value={ticketmasterKey}
            onChange={(e) => setTicketmasterKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Get your key from <a href="https://developer.ticketmaster.com/products-and-docs/apis/getting-started/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ticketmaster Developer Portal</a>
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="google-maps-key">Google Maps API Key</Label>
          <Input
            id="google-maps-key"
            type="password"
            placeholder="Enter your Google Maps API key"
            value={googleMapsKey}
            onChange={(e) => setGoogleMapsKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Get your key from <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
          </p>
        </div>

        <Button 
          onClick={handleSaveKeys}
          className="w-full bg-eventPurple hover:bg-eventPurple-dark"
        >
          Save API Keys
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiKeySettings;
