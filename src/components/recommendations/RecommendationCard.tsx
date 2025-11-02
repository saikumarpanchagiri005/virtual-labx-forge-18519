import { useState } from "react";
import { Heart, Clock, Star, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Recommendation, getThumbnailIcon } from "@/data/recommendations";
import * as Icons from "lucide-react";
import WhyRecommendedModal from "./WhyRecommendedModal";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onStart: (labId: string) => void;
  onBookmarkToggle: (labId: string) => void;
  hapticIntensity: number;
}

const RecommendationCard = ({
  recommendation,
  onStart,
  onBookmarkToggle,
  hapticIntensity,
}: RecommendationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [robotSpotlight, setRobotSpotlight] = useState(false);

  const iconName = getThumbnailIcon(recommendation.thumbnail);
  const IconComponent = (Icons as any)[iconName] || Icons.TestTube;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-muted";
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setRobotSpotlight(true);
    if (hapticIntensity > 0 && navigator.vibrate) {
      navigator.vibrate([20]);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => setRobotSpotlight(false), 400);
  };

  const handleStart = () => {
    if (hapticIntensity > 0 && navigator.vibrate) {
      navigator.vibrate([50 * hapticIntensity]);
    }
    onStart(recommendation.labId);
  };

  return (
    <>
      <Card
        className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden ${
          isHovered ? "border-primary" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="article"
        aria-label={`${recommendation.title}, ${recommendation.difficulty} difficulty, ${recommendation.timeEstimate}`}
      >
        {/* Robot Spotlight Effect */}
        {robotSpotlight && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-2xl animate-spotlight" />
          </div>
        )}

        {/* Goal-Aligned Badge */}
        {recommendation.isGoalAligned && (
          <div className="absolute top-2 left-2 z-20 animate-goal-badge-spin">
            <Badge variant="secondary" className="gap-1 bg-primary/90 text-white">
              <Star className="h-3 w-3 fill-current" />
              Goal Match
            </Badge>
          </div>
        )}

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-20 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(recommendation.labId);
          }}
          aria-label={recommendation.isBookmarked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              recommendation.isBookmarked
                ? "fill-primary text-primary animate-heart-pop"
                : "text-muted-foreground hover:text-primary"
            }`}
          />
        </Button>

        <CardHeader className="pb-3 pt-8">
          {/* Thumbnail Icon */}
          <div
            className="w-16 h-16 mb-3 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${recommendation.branchColor}15` }}
          >
            <IconComponent
              className="h-8 w-8"
              style={{ color: recommendation.branchColor }}
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
              {recommendation.title}
            </h3>
            <Badge
              variant="outline"
              style={{
                borderColor: recommendation.branchColor,
                color: recommendation.branchColor,
              }}
            >
              {recommendation.branch}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {recommendation.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={getDifficultyColor(recommendation.difficulty)}>
              {recommendation.difficulty}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {recommendation.timeEstimate}
            </Badge>
          </div>

          {recommendation.prerequisites && recommendation.prerequisites.length > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              Prerequisites: {recommendation.prerequisites.join(", ")}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-3">
          <Button
            onClick={handleStart}
            className="flex-1 gap-2"
            style={{
              background: `linear-gradient(135deg, ${recommendation.branchColor}dd, ${recommendation.branchColor}99)`,
            }}
          >
            Start Lab
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowWhy(true)}
            aria-label="Why is this recommended?"
          >
            <Info className="h-4 w-4" />
          </Button>
        </CardFooter>

        {/* Relevance Indicator */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300"
          style={{ width: `${recommendation.relevance * 100}%` }}
          aria-label={`Relevance score: ${Math.round(recommendation.relevance * 100)}%`}
        />
      </Card>

      <WhyRecommendedModal
        open={showWhy}
        onOpenChange={setShowWhy}
        recommendation={recommendation}
      />
    </>
  );
};

export default RecommendationCard;
