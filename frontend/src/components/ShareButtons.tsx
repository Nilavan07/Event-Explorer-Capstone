import { Facebook, MessageCircle, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  eventTitle: string;
  eventUrl?: string;
  eventImage?: string;
}

const ShareButtons = ({ eventTitle, eventUrl, eventImage }: ShareButtonsProps) => {
  const currentUrl = eventUrl || window.location.href;
  const { toast } = useToast();
  
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(`Check out this amazing event: ${eventTitle}`)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const text = `Check out this amazing event: ${eventTitle}\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = `Check out this amazing event: ${eventTitle}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={shareToFacebook}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        onClick={shareToWhatsApp}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button
        onClick={shareToLinkedIn}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button
        onClick={shareToTwitter}
        variant="outline"
        size="sm"
        className="flex-1"
      >
        <Twitter className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShareButtons;