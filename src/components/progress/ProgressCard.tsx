import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";
import { ProgressData } from "@/data/progressData";
import { useNavigate } from "react-router-dom";

interface ProgressCardProps {
  progress: ProgressData;
  index: number;
  onMilestoneClick: (milestones: string[]) => void;
}

const ProgressCard = ({ progress, index, onMilestoneClick }: ProgressCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  // Animate bar on mount
  useState(() => {
    setTimeout(() => setBarWidth(progress.completionPercentage), 100 + index * 100);
  });

  const handleCardClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Scale animation is handled by CSS
    setTimeout(() => {
      navigate(`/lab-list/${progress.branchId}`);
    }, 300);
  };

  return (
    <Card
      className="relative p-4 cursor-pointer transition-all duration-300 hover:shadow-lg group animate-vlx-scale overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-label={`${progress.name}: ${progress.labsCompleted} of ${progress.labsTotal} labs completed`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick();
      }}
    >
      {/* Laser scanning effect on hover */}
      {isHovered && (
        <div
          className="absolute top-0 left-0 w-1 h-full bg-primary/50 animate-pulse"
          style={{
            animation: "laser-scan 0.3s ease-out forwards",
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={progress.shortName}>
            {progress.icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground truncate max-w-[150px]">
              {progress.shortName}
            </h3>
            <p className="text-xs text-muted-foreground">{progress.recentActivity}</p>
          </div>
        </div>
        {progress.isFavorite && (
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-label="Favorite" />
        )}
      </div>

      {/* Progress stats */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-primary">
            {progress.labsCompleted}/{progress.labsTotal}
          </span>
        </div>
        
        {/* Progress bar with animation */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
            style={{ width: `${barWidth}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium text-primary">{progress.completionPercentage}%</span>
          <TrendingUp className="h-3 w-3 text-primary" />
        </div>
      </div>

      {/* Milestones */}
      {progress.milestones.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMilestoneClick(progress.milestones);
            }}
            className="text-xs"
            aria-label={`View ${progress.milestones.length} milestones`}
          >
            <Badge variant="secondary" className="text-xs hover:bg-primary/10 transition-colors">
              🏆 {progress.milestones.length} {progress.milestones.length === 1 ? "Badge" : "Badges"}
            </Badge>
          </button>
        </div>
      )}

      {/* Robot scanning particles (hover effect) */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary animate-vlx-pulse"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-0"
        }`}
        style={{
          background: "radial-gradient(circle at center, hsl(211, 100%, 49.8%), transparent 70%)",
        }}
      />
    </Card>
  );
};

export default ProgressCard;

// Add laser scan keyframe to index.css
const style = document.createElement("style");
style.textContent = `
  @keyframes laser-scan {
    0% { left: 0; }
    100% { left: 100%; }
  }
`;
document.head.appendChild(style);
