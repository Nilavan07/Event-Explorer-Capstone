
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally send this to your backend
    console.log("Subscribing email:", email);
    
    // Show success message
    toast({
      title: "Subscription Successful!",
      description: "You've been added to our newsletter list.",
    });
    
    // Reset form
    setEmail("");
  };

  return (
    <div className="gradient-bg py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss an Event
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Subscribe to our newsletter for personalized event recommendations and special offers.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white/90 border-none text-gray-800 flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="secondary" className="bg-white text-eventPurple hover:bg-gray-100 px-8">
              Subscribe
            </Button>
          </form>
          
          <p className="text-white/70 text-sm mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
