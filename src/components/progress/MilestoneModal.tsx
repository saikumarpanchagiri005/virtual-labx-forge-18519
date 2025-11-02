import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Award, Sparkles } from "lucide-react";

interface MilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestones: string[];
}

const MilestoneModal = ({ open, onOpenChange, milestones }: MilestoneModalProps) => {
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (open) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 600);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Earned Milestones
          </DialogTitle>
          <DialogDescription>
            Your achievements in this branch
          </DialogDescription>
        </DialogHeader>

        {/* Robot celebrating */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <div
              className={`text-5xl transition-transform duration-600 ${
                spinning ? "rotate-360 scale-110" : "rotate-0"
              }`}
              style={{
                transform: spinning ? "rotate(360deg) scale(1.1)" : "rotate(0deg) scale(1)",
              }}
            >
              🤖
            </div>
            
            {/* Spark particles on spin */}
            {spinning && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-primary animate-vlx-pulse"
                    style={{
                      left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 40}%`,
                      top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 40}%`,
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Milestone badges */}
        <div className="space-y-3">
          {milestones.length > 0 ? (
            milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-lg animate-vlx-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Award className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
                    <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{milestone}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Unlocked
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No milestones earned yet.</p>
              <p className="text-xs mt-1">Keep completing labs to unlock badges!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneModal;
