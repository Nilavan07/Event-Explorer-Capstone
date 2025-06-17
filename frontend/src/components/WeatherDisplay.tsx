
import { CloudSun, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherDisplayProps {
  weather: {
    temp: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
}

const WeatherDisplay = ({ weather }: WeatherDisplayProps) => {
  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg flex items-center">
          <CloudSun className="h-5 w-5 mr-2 text-blue-600" />
          Weather Forecast
        </h3>
        <img 
          src={getWeatherIconUrl(weather.icon)} 
          alt={weather.condition}
          className="w-12 h-12"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 mr-2 text-red-500" />
          <span className="text-2xl font-bold text-blue-900">{weather.temp}°C</span>
        </div>
        
        <div className="text-right">
          <p className="font-medium text-blue-900 capitalize">{weather.condition}</p>
          <p className="text-sm text-blue-700 capitalize">{weather.description}</p>
        </div>
        
        <div className="flex items-center">
          <Droplets className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">Humidity: {weather.humidity}%</span>
        </div>
        
        <div className="flex items-center">
          <Wind className="h-4 w-4 mr-2 text-gray-600" />
          <span className="text-sm">Wind: {weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
