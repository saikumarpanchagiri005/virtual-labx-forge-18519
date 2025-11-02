import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Target, TrendingUp, Clock, X } from "lucide-react";
import { type Recommendation } from "@/data/recommendations";
import { Progress } from "@/components/ui/progress";

interface WhyRecommendedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendation: Recommendation;
}

const WhyRecommendedModal = ({
  open,
  onOpenChange,
  recommendation,
}: WhyRecommendedModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary animate-robot-point" />
            Why This Lab?
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
            onClick={() => onOpenChange(false)}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogDescription>
            Personalized recommendation for {recommendation.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Reason */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">🎯</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-primary">Perfect Match</h4>
                <p className="text-sm text-muted-foreground">
                  {recommendation.whyRecommended}
                </p>
              </div>
            </div>
          </div>

          {/* Relevance Score */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Relevance Score
              </span>
              <span className="font-semibold">
                {Math.round(recommendation.relevance * 100)}%
              </span>
            </div>
            <Progress value={recommendation.relevance * 100} className="h-2" />
          </div>

          {/* Key Benefits */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h4 className="font-semibold text-sm">Key Benefits:</h4>
            <div className="space-y-2">
              {recommendation.isGoalAligned && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span>Aligns with your learning goals</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Quick {recommendation.timeEstimate} session</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className={
                    recommendation.difficulty === "beginner"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : recommendation.difficulty === "intermediate"
                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }
                >
                  {recommendation.difficulty}
                </Badge>
                <span>difficulty level</span>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {recommendation.prerequisites && recommendation.prerequisites.length > 0 && (
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <h4 className="font-semibold text-sm">Prerequisites:</h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.prerequisites.map((prereq) => (
                  <Badge key={prereq} variant="outline">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Robot Assistant Animation */}
          <div className="relative pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute right-0 top-0">
              <div className="relative w-12 h-12 animate-robot-point">
                <div className="w-full h-full border-2 border-primary/60 rounded-lg bg-card">
                  <div className="flex justify-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
                {/* Pointing arm */}
                <div className="absolute left-0 top-1/2 w-8 h-0.5 bg-primary/60 origin-left animate-robot-arm" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhyRecommendedModal;
