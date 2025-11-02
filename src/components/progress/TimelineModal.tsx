import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labsCompleted: number;
  labsTotal: number;
}

const TimelineModal = ({ open, onOpenChange, labsCompleted, labsTotal }: TimelineModalProps) => {
  const [animatedDots, setAnimatedDots] = useState(0);

  useEffect(() => {
    if (open) {
      setAnimatedDots(0);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setAnimatedDots(count);
        if (count >= labsCompleted) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [open, labsCompleted]);

  // Create timeline dots
  const timelineDots = Array.from({ length: labsTotal }, (_, i) => ({
    index: i,
    isCompleted: i < labsCompleted,
    shouldAnimate: i < animatedDots,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Progress Timeline
          </DialogTitle>
          <DialogDescription>
            Your lab completion journey ({labsCompleted}/{labsTotal} labs)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="relative py-8">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-muted" />
            
            {/* Animated progress line */}
            <div
              className="absolute left-8 top-0 w-1 bg-gradient-to-b from-primary to-primary/70 transition-all duration-500 ease-out"
              style={{
                height: `${(animatedDots / labsTotal) * 100}%`,
              }}
            />

            {/* Timeline dots */}
            <div className="space-y-6">
              {timelineDots.map((dot) => (
                <div
                  key={dot.index}
                  className="relative flex items-center gap-4 ml-4"
                >
                  {/* Dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      dot.shouldAnimate
                        ? "border-primary bg-primary scale-110"
                        : dot.isCompleted
                        ? "border-primary bg-primary"
                        : "border-muted bg-card"
                    }`}
                  >
                    {dot.isCompleted ? (
                      <CheckCircle2
                        className={`h-4 w-4 text-white transition-opacity duration-300 ${
                          dot.shouldAnimate ? "opacity-100" : "opacity-70"
                        }`}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`flex-1 transition-all duration-300 ${
                      dot.shouldAnimate ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-60"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        dot.isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Lab {dot.index + 1}
                    </p>
                    {dot.isCompleted && (
                      <p className="text-xs text-primary">Completed</p>
                    )}
                  </div>

                  {/* Glow effect on animated dots */}
                  {dot.shouldAnimate && (
                    <div
                      className="absolute left-0 w-8 h-8 rounded-full animate-timeline-dot-glow"
                      style={{ 
                        background: 'radial-gradient(circle, rgba(0, 123, 255, 0.4) 0%, rgba(0, 123, 255, 0) 70%)',
                        animationDuration: "1s" 
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="text-sm text-muted-foreground">Overall Progress</div>
          <div className="text-lg font-bold text-primary">
            {Math.round((labsCompleted / labsTotal) * 100)}%
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineModal;
