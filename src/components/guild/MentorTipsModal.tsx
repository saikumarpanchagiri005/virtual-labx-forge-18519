import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lightbulb, Users, Target, Sparkles } from "lucide-react";

interface MentorTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MentorTipsModal = ({ open, onOpenChange }: MentorTipsModalProps) => {
  const tips = [
    {
      icon: Users,
      title: "Join an Active Guild",
      description: "Look for guilds with the 'Hot' badge for the most active collaboration.",
    },
    {
      icon: Target,
      title: "Match Your Focus",
      description: "Join guilds that align with your branch (e.g., ECE) for targeted learning.",
    },
    {
      icon: Sparkles,
      title: "Create Your Own",
      description: "Don't see the right fit? Start your own guild and invite friends!",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg animate-vlx-slide-up">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Guild Tips
          </DialogTitle>
          <DialogDescription>
            AI-powered advice to help you find the perfect guild
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="p-4 bg-primary/5 rounded-lg border border-primary/20 relative animate-vlx-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Laser highlight effect */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    animation: `vlx-laser-scan 0.3s ease-out ${index * 0.1}s`,
                    opacity: 0,
                  }}
                />
                
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorTipsModal;
