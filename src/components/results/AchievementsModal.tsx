import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Medal, Award, Star } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "medal" | "award" | "star";
  earned: boolean;
}

interface AchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
}

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
  star: Star,
};

const AchievementsModal = ({
  open,
  onOpenChange,
  achievements,
}: AchievementsModalProps) => {
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements Earned
          </DialogTitle>
          <DialogDescription>
            You've earned {earnedCount} of {achievements.length} badges
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon];
            
            return (
              <div
                key={achievement.id}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300
                  ${
                    achievement.earned
                      ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/50"
                      : "bg-muted/30 border-border opacity-60"
                  }
                  animate-vlx-scale
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`
                      p-3 rounded-full
                      ${
                        achievement.earned
                          ? "bg-yellow-500/20"
                          : "bg-muted"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        h-6 w-6
                        ${
                          achievement.earned
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                        }
                      `}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {achievement.name}
                      {achievement.earned && (
                        <span className="ml-2 text-xs text-yellow-500">✓ Earned</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                
                {/* Spark particles for earned achievements */}
                {achievement.earned && (
                  <>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-2 right-2 w-1 h-1 rounded-full bg-yellow-400"
                        style={{
                          animation: `vlx-achievement-spark ${0.8 + i * 0.1}s ease-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add spark animation
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-achievement-spark {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(${Math.random() * 20 - 10}px, ${-20 - Math.random() * 20}px) scale(0);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default AchievementsModal;
