import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Heart, Info } from "lucide-react";
import { Branch } from "@/data/branches";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface BranchCardProps {
  branch: Branch;
  onSelect: (branch: Branch) => void;
  onToggleFavorite: (branchId: string) => void;
}

const BranchCard = ({ branch, onSelect, onToggleFavorite }: BranchCardProps) => {
  const [showStats, setShowStats] = useState(false);
  const progressPercent = (branch.labsUnlocked / branch.labsTotal) * 100;

  const getDifficultyColor = () => {
    switch (branch.difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    }
  };

  return (
    <Card
      className={`
        relative p-4 border-2 transition-all duration-300 cursor-pointer
        ${branch.isLocked ? "opacity-50" : "hover:scale-105 hover:shadow-lg hover:border-primary"}
        ${!branch.isLocked && "animate-vlx-scale"}
      `}
      onClick={() => !branch.isLocked && onSelect(branch)}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(branch.id);
        }}
        className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label={branch.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-4 w-4 ${
            branch.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Lock Icon for locked branches */}
      {branch.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-20">
          <div className="text-center">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Unlock at Level 15</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Icon */}
        <div className="text-4xl text-center">{branch.icon}</div>

        {/* Title */}
        <div className="text-center">
          <h3 className="font-semibold text-lg">{branch.shortName}</h3>
          <p className="text-xs text-muted-foreground">{branch.name}</p>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {branch.labsUnlocked}/{branch.labsTotal}
            </span>
          </div>
          <Progress value={progressPercent} className="h-1" />
        </div>

        {/* Difficulty Badge */}
        <Badge variant="outline" className={`w-full justify-center ${getDifficultyColor()}`}>
          {branch.difficulty}
        </Badge>

        {/* Stats Modal Button */}
        <Dialog open={showStats} onOpenChange={setShowStats}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowStats(true);
              }}
            >
              <Info className="mr-2 h-3 w-3" />
              View Stats
            </Button>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{branch.icon}</span>
                {branch.name}
              </DialogTitle>
              <DialogDescription>{branch.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Labs</span>
                  <span className="font-medium">{branch.labsTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unlocked</span>
                  <span className="font-medium text-primary">{branch.labsUnlocked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">{branch.labsTotal - branch.labsUnlocked}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completion</p>
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {progressPercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default BranchCard;
