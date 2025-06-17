
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
    }
    
    class Size {
      constructor(width: number, height: number);
    }
    
    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }
    
    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      title?: string;
      icon?: string | Icon | Symbol;
    }
    
    interface LatLng {
      lat(): number;
      lng(): number;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    interface Icon {
      url: string;
      scaledSize?: Size;
    }
    
    interface Symbol {
      path: string;
    }
  }
}

export {};
