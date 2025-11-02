import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, User, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userScore: number;
  averageScore: number;
}

const CompareModal = ({
  open,
  onOpenChange,
  userScore,
  averageScore,
}: CompareModalProps) => {
  const [raceComplete, setRaceComplete] = useState(false);

  useEffect(() => {
    if (open) {
      setRaceComplete(false);
      setTimeout(() => setRaceComplete(true), 1500);
    }
  }, [open]);

  const userPercentage = (userScore / 100) * 100;
  const avgPercentage = (averageScore / 100) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg relative">
        {/* Custom close button with glow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-300 group"
          onClick={() => onOpenChange(false)}
          style={{
            boxShadow: "0 0 10px rgba(0, 123, 255, 0.3), 0 0 20px rgba(0, 123, 255, 0.15)",
          }}
          aria-label="Close compare modal"
        >
          <X className="h-4 w-4 text-primary group-hover:rotate-45 transition-transform duration-300" />
        </Button>
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Compare Results
          </DialogTitle>
          <DialogDescription>
            See how you stack up against the average
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Racing bars */}
          <div className="space-y-6">
            {/* User bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  Your Score
                </div>
                <span className="font-bold text-primary">{userScore}</span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
                  style={{
                    width: raceComplete ? `${userPercentage}%` : "0%",
                  }}
                />
                {/* Racing indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 right-2 text-xs font-bold text-white transition-all duration-1000 ease-out"
                  style={{
                    transform: `translateX(${raceComplete ? 0 : -100}%)`,
                  }}
                >
                  🚀
                </div>
              </div>
            </div>

            {/* Average bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Class Average
                </div>
                <span className="font-bold text-muted-foreground">
                  {averageScore}
                </span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-muted-foreground to-muted-foreground/80 transition-all duration-1000 ease-out"
                  style={{
                    width: raceComplete ? `${avgPercentage}%` : "0%",
                    transitionDelay: "0.2s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Comparison insight */}
          <div
            className={`
              p-4 rounded-lg border-2 animate-vlx-scale
              ${
                userScore >= averageScore
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-yellow-500/10 border-yellow-500/30"
              }
            `}
            style={{ animationDelay: "1.5s" }}
          >
            <p className="text-sm font-medium text-center">
              {userScore >= averageScore ? (
                <>
                  🎉 You're <span className="font-bold text-green-600">
                    {userScore - averageScore} points above
                  </span> the class average!
                </>
              ) : (
                <>
                  💪 You're <span className="font-bold text-yellow-600">
                    {averageScore - userScore} points below
                  </span> the average. Keep practicing!
                </>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal;
