import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Twitter, Facebook, Linkedin } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labTitle: string;
  score: number;
}

const ShareModal = ({ open, onOpenChange, labTitle, score }: ShareModalProps) => {
  const { toast } = useToast();

  const shareUrl = `${window.location.origin}/labs`;
  const shareText = `I just scored ${score}/100 on "${labTitle}" in VirtualLabX! 🔬`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    });
    
    onOpenChange(false);
  };

  const handleSharePlatform = (platform: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    toast({
      title: "Coming Soon!",
      description: `${platform} sharing will be available soon`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Results
          </DialogTitle>
          <DialogDescription>
            Let others know about your achievement!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preview card */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-primary/30 animate-vlx-scale">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">{shareText}</p>
              <p className="text-xs text-muted-foreground">{shareUrl}</p>
            </div>
          </div>

          {/* Share options */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => handleSharePlatform("Twitter")}
            >
              <Twitter className="h-4 w-4" />
              Share on Twitter
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => handleSharePlatform("Facebook")}
            >
              <Facebook className="h-4 w-4" />
              Share on Facebook
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => handleSharePlatform("LinkedIn")}
            >
              <Linkedin className="h-4 w-4" />
              Share on LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
