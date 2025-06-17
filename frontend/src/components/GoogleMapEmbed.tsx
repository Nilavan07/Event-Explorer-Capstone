import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Navigation, MapPin, Route, Hotel, UtensilsCrossed } from "lucide-react";
import { GoogleMapsService, NearbyPlace } from '@/services/googleMapsService';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapEmbedProps {
  latitude: number;
  longitude: number;
  googleMapsApiKey: string;
  eventName: string;
}

interface DirectionStep {
  instruction: string;
  distance: string;
  duration: string;
}

const GoogleMapEmbed = ({ latitude, longitude, googleMapsApiKey, eventName }: GoogleMapEmbedProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const directionsService = useRef<any>(null);
  const directionsRenderer = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showingDirections, setShowingDirections] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [directionSteps, setDirectionSteps] = useState<DirectionStep[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyPlace[]>([]);
  const [nearbyHotels, setNearbyHotels] = useState<NearbyPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('event');

  const googleMapsService = new GoogleMapsService(googleMapsApiKey);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: eventName,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      directionsService.current = new window.google.maps.DirectionsService();
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4285f4',
          strokeWeight: 4,
        },
      });

      mapInstance.current = map;
    };

    loadGoogleMaps();

    return () => {
      mapInstance.current = null;
    };
  }, [latitude, longitude, googleMapsApiKey, eventName]);

  const loadNearbyPlaces = async () => {
    setLoadingPlaces(true);
    try {
      const [restaurants, hotels] = await Promise.all([
        googleMapsService.getNearbyPlaces(latitude, longitude, 'restaurant'),
        googleMapsService.getNearbyPlaces(latitude, longitude, 'lodging')
      ]);
      
      setNearbyRestaurants(restaurants);
      setNearbyHotels(hotels);
    } catch (error) {
      console.error('Error loading nearby places:', error);
    } finally {
      setLoadingPlaces(false);
    }
  };

  useEffect(() => {
    loadNearbyPlaces();
  }, [latitude, longitude]);

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);
        showDirections(userPos, { lat: latitude, lng: longitude });
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your current location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please enable location services.';
            break;
        }
        alert(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  const showDirections = (userPos: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    if (!directionsService.current || !directionsRenderer.current || !mapInstance.current) {
      console.error('Google Maps services not initialized');
      alert('Map services are not ready. Please try again in a moment.');
      return;
    }

    const request = {
      origin: new window.google.maps.LatLng(userPos.lat, userPos.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      provideRouteAlternatives: false,
    };

    directionsService.current.route(request, (result: any, status: any) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.current.setDirections(result);
        directionsRenderer.current.setMap(mapInstance.current);
        setShowingDirections(true);
        
        const route = result.routes[0];
        const leg = route.legs[0];
        
        setRouteInfo({
          distance: leg.distance.text,
          duration: leg.duration.text
        });
        
        const steps: DirectionStep[] = leg.steps.map((step: any) => ({
          instruction: step.instructions.replace(/<[^>]*>/g, ''),
          distance: step.distance.text,
          duration: step.duration.text
        }));
        
        setDirectionSteps(steps);
        
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(userPos);
        bounds.extend(destination);
        mapInstance.current.fitBounds(bounds);
      } else {
        console.error('Directions request failed:', status);
        alert('Could not calculate directions. Please try again.');
      }
    });
  };

  const getDirectionsToPlace = (place: NearbyPlace) => {
    if (!userLocation) {
      // If user location is not available, get it first
      setLoadingLocation(true);
      
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        setLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          showDirections(userPos, { lat: place.geometry.location.lat, lng: place.geometry.location.lng });
          setSelectedDestination(place.name);
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enable location permissions and try again.');
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    } else {
      showDirections(userLocation, { lat: place.geometry.location.lat, lng: place.geometry.location.lng });
      setSelectedDestination(place.name);
    }
  };

  const clearDirections = () => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null);
      setShowingDirections(false);
      setDirectionSteps([]);
      setRouteInfo(null);
      setSelectedDestination('event');
      
      if (mapInstance.current) {
        mapInstance.current.setCenter({ lat: latitude, lng: longitude });
        mapInstance.current.setZoom(15);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={getCurrentLocation}
          disabled={loadingLocation}
          variant="outline"
          size="sm"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {loadingLocation ? 'Getting Location...' : 'Get Directions to Event'}
        </Button>
        
        {showingDirections && (
          <Button
            onClick={clearDirections}
            variant="outline"
            size="sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Show Event Only
          </Button>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border"
        style={{ minHeight: '250px' }}
      />
      
      {showingDirections && userLocation && routeInfo && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-800 mb-2">
              Route to {selectedDestination === 'event' ? eventName : selectedDestination}
            </p>
            <div className="flex gap-4 text-sm">
              <span className="font-medium">Distance: {routeInfo.distance}</span>
              <span className="font-medium">Duration: {routeInfo.duration}</span>
            </div>
          </div>
          
          {directionSteps.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Route className="h-4 w-4 mr-2" />
                Turn-by-Turn Directions
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {directionSteps.map((step, index) => (
                  <div key={index} className="flex gap-3 p-2 bg-gray-50 rounded">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{step.instruction}</p>
                      <p className="text-xs text-gray-500">{step.distance} • {step.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <UtensilsCrossed className="h-4 w-4 mr-2" />
          Nearby Restaurants
        </h4>
        {loadingPlaces ? (
          <p className="text-gray-500 text-sm">Loading restaurants...</p>
        ) : (
          <div className="space-y-2">
            {nearbyRestaurants.map((restaurant) => (
              <div key={restaurant.place_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">{restaurant.name}</p>
                  <p className="text-xs text-gray-500">{restaurant.vicinity}</p>
                  {restaurant.rating && (
                    <p className="text-xs text-yellow-600">★ {restaurant.rating}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => getDirectionsToPlace(restaurant)}
                  disabled={loadingLocation}
                  className="shrink-0"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  {loadingLocation ? 'Loading...' : 'Directions'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Hotel className="h-4 w-4 mr-2" />
          Nearby Hotels
        </h4>
        {loadingPlaces ? (
          <p className="text-gray-500 text-sm">Loading hotels...</p>
        ) : (
          <div className="space-y-2">
            {nearbyHotels.map((hotel) => (
              <div key={hotel.place_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-sm">{hotel.name}</p>
                  <p className="text-xs text-gray-500">{hotel.vicinity}</p>
                  {hotel.rating && (
                    <p className="text-xs text-yellow-600">★ {hotel.rating}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => getDirectionsToPlace(hotel)}
                  disabled={loadingLocation}
                  className="shrink-0"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  {loadingLocation ? 'Loading...' : 'Directions'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapEmbed;
