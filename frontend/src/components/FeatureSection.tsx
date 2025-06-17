
import { Calendar, MapPin, CloudSun, Utensils } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-eventPurple" />,
      title: "Find the Perfect Event",
      description: "Browse and filter events by city, category, or date. Whether it's music, sports, or comedy, find what moves you.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-eventPurple" />,
      title: "Interactive Venue Maps",
      description: "View detailed venue maps and directions to help you plan your arrival and find the best seats.",
    },
    {
      icon: <CloudSun className="h-8 w-8 text-eventPurple" />,
      title: "Weather Forecasts",
      description: "Check the weather forecast for your event date so you can dress appropriately and be prepared.",
    },
    {
      icon: <Utensils className="h-8 w-8 text-eventPurple" />,
      title: "Nearby Restaurants",
      description: "Discover restaurant recommendations near venues to complete your outing with the perfect meal.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need in One Place</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Event Explorer combines event discovery with all the planning tools you need to make your experience unforgettable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
