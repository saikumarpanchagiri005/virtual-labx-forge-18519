import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MentorInsightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MentorInsightsModal = ({ open, onOpenChange }: MentorInsightsModalProps) => {
  const [laserHighlight, setLaserHighlight] = useState(0);

  useEffect(() => {
    if (open) {
      const interval = setInterval(() => {
        setLaserHighlight((prev) => (prev + 1) % 3);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [open]);

  const insights = [
    {
      icon: TrendingUp,
      title: "Focus on Mechanics",
      description: "You're making great progress! Consider tackling the Mechanics labs next to maintain momentum.",
      type: "Recommendation",
    },
    {
      icon: Target,
      title: "Complete Circuit Analysis",
      description: "Finishing the Circuit Analysis series will unlock advanced ECE milestones.",
      type: "Goal",
    },
    {
      icon: Lightbulb,
      title: "Review Thermodynamics",
      description: "Your completion rate in Thermodynamics is lower. Review earlier labs to strengthen your foundation.",
      type: "Insight",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Mentor Insights
          </DialogTitle>
          <DialogDescription>
            Personalized recommendations to enhance your learning
          </DialogDescription>
        </DialogHeader>

        {/* Robot with laser */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <div className="text-4xl">🤖</div>
            <div
              className="absolute top-1/2 right-0 w-8 h-0.5 bg-primary transition-all duration-300"
              style={{
                transform: `translateY(${laserHighlight * 12 - 12}px)`,
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`relative p-4 border-2 rounded-lg transition-all duration-300 animate-vlx-scale ${
                  laserHighlight === index
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-card"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Laser dot */}
                {laserHighlight === index && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-vlx-pulse" />
                )}

                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        {insight.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            💡 These insights are generated based on your progress patterns
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorInsightsModal;
