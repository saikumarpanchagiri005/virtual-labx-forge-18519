import { useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/data/leaderboards";

interface RankCardProps {
  entry: LeaderboardEntry;
  onClick: () => void;
  delay: number;
  showMedal: boolean;
}

const RankCard = ({ entry, onClick, delay, showMedal }: RankCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-500";
      case 2: return "text-gray-400";
      case 3: return "text-amber-600";
      default: return "text-muted-foreground";
    }
  };

  const isTopThree = entry.rank <= 3;

  const handleClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    onClick();
  };

  return (
    <Card
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 relative overflow-hidden",
        "hover:shadow-lg hover:scale-[1.02]",
        isTopThree && "border-primary/30 shadow-md",
        entry.rank <= 10 && "animate-vlx-glow-pulse"
      )}
      style={{
        animation: `vlx-slide-in-top 0.3s ease-out ${delay}s both`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Rank ${entry.rank}: ${entry.username}, ${entry.score} points, ${entry.branch} branch`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Top Mover Badge */}
      {entry.isTopMover && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500/10 border border-green-500/30 rounded-full px-2 py-1 animate-vlx-bounce">
          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
            +{entry.rankChange}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Rank and Medal */}
        <div className="relative flex items-center justify-center w-12 h-12">
          {isTopThree ? (
            <div
              className="relative"
              style={{
                animation: showMedal ? "vlx-medal-spin 0.5s ease-out" : undefined,
              }}
            >
              <Trophy className={cn("h-8 w-8", getMedalColor(entry.rank))} />
              {showMedal && isHovered && (
                <div
                  className="absolute inset-0 animate-vlx-medal-shine pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border">
              <span
                className="text-sm font-bold text-foreground"
                style={{
                  animation: "vlx-count-up 0.5s ease-out",
                }}
              >
                {entry.rank}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{entry.username}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="font-medium text-primary">{entry.score} pts</span>
            <span>•</span>
            <span>{entry.branch}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {entry.labsCompleted} labs • Active {entry.lastActive}
          </p>
        </div>

        {/* Medal Pin Animation on Hover */}
        {isHovered && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{
              animation: "vlx-medal-pin 0.4s ease-out",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Glow Effect for Top 10 */}
      {entry.rank <= 10 && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: "0 0 20px rgba(0, 123, 255, 0.1)",
            animation: "vlx-glow-pulse 2s ease-in-out infinite",
          }}
        />
      )}
    </Card>
  );
};

export default RankCard;
