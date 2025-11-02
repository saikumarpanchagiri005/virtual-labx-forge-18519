import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, Star, Clock, Link as LinkIcon } from "lucide-react";
import { Lab } from "@/data/labs";
import { cn } from "@/lib/utils";

interface LabCardProps {
  lab: Lab;
  onToggleBookmark: (labId: string) => void;
  onToggleDownload: (labId: string) => void;
  onRatingClick: (labId: string) => void;
  onLabClick: (labId: string) => void;
  isFlipped?: boolean;
}

const LabCard = ({
  lab,
  onToggleBookmark,
  onToggleDownload,
  onRatingClick,
  onLabClick,
  isFlipped = false,
}: LabCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('vibrate' in navigator) navigator.vibrate(50);
    onToggleBookmark(lab.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('vibrate' in navigator) navigator.vibrate(50);
    onToggleDownload(lab.id);
  };

  const handleRating = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('vibrate' in navigator) navigator.vibrate(50);
    onRatingClick(lab.id);
  };

  const difficultyColors = {
    beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
    intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:scale-105 hover:ring-2 hover:ring-primary/50",
        "bg-card border border-border",
        isFlipped && "animate-vlx-scale"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onLabClick(lab.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onLabClick(lab.id)}
      aria-label={`Lab Card: ${lab.title}, ${lab.rating.toFixed(1)} stars, ${lab.timeEstimate}`}
    >
      {/* Bookmark Star Burst Effect */}
      {lab.isBookmarked && (
        <div className="absolute -top-1 -right-1 z-20">
          <div className="relative">
            <Star className="w-6 h-6 fill-primary text-primary animate-vlx-bounce" />
            {/* Particle burst */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full opacity-0 animate-vlx-particle"
                  style={{
                    "--x-start": `${Math.cos((i * Math.PI) / 3) * 20}px`,
                    "--y-start": `${Math.sin((i * Math.PI) / 3) * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prerequisite Chain Link */}
      {lab.prerequisites.length > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <LinkIcon className="w-4 h-4 text-muted-foreground opacity-60" />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground mb-1">
              {lab.title}
            </h3>
            <Badge variant="secondary" className={cn("text-xs", difficultyColors[lab.difficulty])}>
              {lab.difficulty}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={handleBookmark}
            aria-label={lab.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                lab.isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {lab.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {/* Rating */}
            <button
              className="flex items-center gap-1 hover:text-primary transition-colors"
              onClick={handleRating}
              aria-label={`Rate this lab, current rating ${lab.rating.toFixed(1)}`}
            >
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{lab.rating.toFixed(1)}</span>
            </button>

            {/* Time */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{lab.timeEstimate}</span>
            </div>
          </div>

          {/* Download Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDownload}
            aria-label={lab.isDownloaded ? "Downloaded" : "Download lab"}
          >
            <Download
              className={cn(
                "h-3 w-3 transition-all",
                lab.isDownloaded ? "text-primary" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>

        {/* Hover Preview Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-popover border border-border rounded-lg shadow-lg z-30 pointer-events-none animate-vlx-fade-in">
            <p className="text-xs text-popover-foreground">{lab.description}</p>
            <div className="mt-2 h-16 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Lab Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Highlight Pulse */}
      <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 group-[.search-highlight]:opacity-100 group-[.search-highlight]:animate-pulse pointer-events-none" />
    </Card>
  );
};

export default LabCard;
