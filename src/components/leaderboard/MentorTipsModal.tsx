import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lightbulb, Target, TrendingUp } from "lucide-react";

interface MentorTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MentorTipsModal = ({ open, onOpenChange }: MentorTipsModalProps) => {
  const tips = [
    {
      icon: Target,
      title: "Complete More Labs",
      description: "Focus on ECE labs to boost your score and climb the rankings faster.",
    },
    {
      icon: TrendingUp,
      title: "Consistency is Key",
      description: "Regular lab completion earns you steady progress and bonus multipliers.",
    },
    {
      icon: Lightbulb,
      title: "Challenge Yourself",
      description: "Try harder difficulty levels for extra points and faster advancement.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg animate-vlx-slide-up">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Mentor Tips
          </DialogTitle>
          <DialogDescription>
            AI-powered advice to help you climb the leaderboard
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div
                key={index}
                className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-vlx-fade-in"
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
