import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative h-[60vh] flex items-center">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-eventPurple-dark/90 to-eventPurple-light/50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Events That Move You
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Find concerts, festivals, sports, and more — then plan your perfect
            experience with venue details, weather, and nearby restaurants.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-white text-eventPurple hover:bg-gray-100 border-none text-lg px-8 py-6">
              Explore Events
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              How It Works
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
