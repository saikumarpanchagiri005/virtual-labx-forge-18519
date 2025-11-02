import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Lightbulb } from "lucide-react";

interface MentorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const hints = [
  {
    title: "Start with Low Values",
    description: "Begin experiments with the minimum parameter values and gradually increase to observe changes safely.",
    icon: "⚡",
  },
  {
    title: "Check Connections",
    description: "Ensure all tools are properly placed on the canvas before adjusting parameters.",
    icon: "🔗",
  },
  {
    title: "Use Eco Mode",
    description: "Enable sustainability mode to reduce energy consumption during long experiments.",
    icon: "🌱",
  },
];

const MentorModal = ({ open, onOpenChange }: MentorModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            AI Mentor Assistance
          </DialogTitle>
          <DialogDescription>
            Expert guidance for your experiment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Robot pointing animation */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center animate-vlx-bounce">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              
              {/* Laser pointer effect */}
              <div
                className="absolute top-1/2 -right-12 w-12 h-0.5 bg-primary/50"
                style={{
                  animation: "vlx-laser-point 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Hints */}
          <div className="space-y-3">
            {hints.map((hint, index) => (
              <div
                key={index}
                className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 animate-vlx-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{hint.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {hint.title}
                      <Lightbulb className="h-3 w-3 text-yellow-500" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hint.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Got it!
            </Button>
            <Button
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Apply Tips
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add laser point animation
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-laser-point {
    0%, 100% {
      opacity: 0.3;
      transform: scaleX(0.5);
    }
    50% {
      opacity: 1;
      transform: scaleX(1);
    }
  }
`;
document.head.appendChild(style);

export default MentorModal;
