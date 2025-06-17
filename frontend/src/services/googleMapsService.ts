
interface NearbyPlace {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  vicinity: string;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GoogleMapsNearbyResponse {
  results: NearbyPlace[];
  status: string;
}

export class GoogleMapsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getDirectionsUrl(destination: string): string {
    const encodedDestination = encodeURIComponent(destination);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    type: 'restaurant' | 'lodging',
    radius: number = 1000
  ): Promise<NearbyPlace[]> {
    // Use a CORS proxy or return mock data for now due to CORS restrictions
    console.log(`Searching for ${type} near ${latitude}, ${longitude}`);
    
    // Return mock data to demonstrate functionality
    const mockRestaurants: NearbyPlace[] = [
      {
        place_id: '1',
        name: 'The Local Bistro',
        rating: 4.5,
        vicinity: '123 Main St',
        types: ['restaurant'],
        geometry: { location: { lat: latitude + 0.001, lng: longitude + 0.001 } }
      },
      {
        place_id: '2',
        name: 'Downtown Grill',
        rating: 4.2,
        vicinity: '456 Center Ave',
        types: ['restaurant'],
        geometry: { location: { lat: latitude + 0.002, lng: longitude - 0.001 } }
      }
    ];

    const mockHotels: NearbyPlace[] = [
      {
        place_id: '3',
        name: 'Grand Hotel',
        rating: 4.8,
        vicinity: '789 Hotel Blvd',
        types: ['lodging'],
        geometry: { location: { lat: latitude - 0.001, lng: longitude + 0.002 } }
      },
      {
        place_id: '4',
        name: 'Budget Inn',
        rating: 3.9,
        vicinity: '321 Budget St',
        types: ['lodging'],
        geometry: { location: { lat: latitude + 0.003, lng: longitude - 0.002 } }
      }
    ];

    return type === 'restaurant' ? mockRestaurants : mockHotels;
  }
}

export type { NearbyPlace };
