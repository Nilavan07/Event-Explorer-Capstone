
interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }
}
