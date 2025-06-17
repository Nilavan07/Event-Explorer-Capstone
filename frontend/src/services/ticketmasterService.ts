interface TicketmasterEvent {
  id: string;
  name: string;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  _embedded?: {
    venues: Array<{
      name: string;
      city: {
        name: string;
      };
      state?: {
        name: string;
      };
      country: {
        name: string;
      };
      location?: {
        latitude: string;
        longitude: string;
      };
    }>;
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
  classifications?: Array<{
    segment: {
      name: string;
    };
  }>;
  url?: string;
}

interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export class TicketmasterService {
  private apiKey: string;
  private baseUrl = 'https://app.ticketmaster.com/discovery/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchEvents(params: {
    keyword?: string;
    city?: string;
    stateCode?: string;
    countryCode?: string;
    size?: number;
    page?: number;
  }): Promise<TicketmasterResponse> {
    const searchParams = new URLSearchParams({
      apikey: this.apiKey,
      size: (params.size || 20).toString(),
      page: (params.page || 0).toString(),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.city && { city: params.city }),
      ...(params.stateCode && { stateCode: params.stateCode }),
      ...(params.countryCode && { countryCode: params.countryCode || 'US' }),
    });

    const response = await fetch(`${this.baseUrl}/events.json?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }
    
    return response.json();
  }

  transformEventData(event: TicketmasterEvent) {
    const venue = event._embedded?.venues?.[0];
    const image = event.images?.find(img => img.width >= 400) || event.images?.[0];
    const price = event.priceRanges?.[0];
    const category = event.classifications?.[0]?.segment?.name || 'Event';

    return {
      id: event.id,
      title: event.name,
      date: event.dates.start.localDate + (event.dates.start.localTime ? ` ${event.dates.start.localTime}` : ''),
      imageUrl: image?.url || '/placeholder.svg',
      location: venue ? `${venue.name}, ${venue.city?.name || 'Unknown City'}${venue.state?.name ? `, ${venue.state.name}` : ''}` : 'Location TBD',
      category,
      price: price ? `$${price.min}-$${price.max}` : undefined,
      ticketUrl: event.url,
      venue: venue ? {
        name: venue.name,
        latitude: venue.location?.latitude ? parseFloat(venue.location.latitude) : undefined,
        longitude: venue.location?.longitude ? parseFloat(venue.location.longitude) : undefined,
      } : undefined,
    };
  }
}

export type { TicketmasterEvent };
