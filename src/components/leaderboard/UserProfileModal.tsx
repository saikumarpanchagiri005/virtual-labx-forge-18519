import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LeaderboardEntry } from "@/data/leaderboards";
import { Trophy, Target, Calendar } from "lucide-react";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: LeaderboardEntry | null;
}

const UserProfileModal = ({ open, onOpenChange, user }: UserProfileModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-vlx-slide-in-right">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            User Profile
          </DialogTitle>
          <DialogDescription>
            Detailed statistics for {user.username}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Rank Badge */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-4 border-primary flex items-center justify-center"
                style={{
                  animation: "vlx-scale-in 0.3s ease-out",
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">#{user.rank}</div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
              </div>
              {/* Laser highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  animation: "vlx-laser-highlight 0.3s ease-out",
                  boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
                }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Score</span>
              </div>
              <p className="text-lg font-bold text-foreground">{user.score}</p>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Labs Done</span>
              </div>
              <p className="text-lg font-bold text-foreground">{user.labsCompleted}</p>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Last Active</span>
              </div>
              <p className="text-sm font-medium text-foreground">{user.lastActive}</p>
            </div>
          </div>

          {/* Branch Info */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary">Branch:</span> {user.branch}
            </p>
          </div>

          {/* Achievement Badge */}
          {user.rank <= 3 && (
            <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 animate-vlx-scale">
              <p className="text-sm font-semibold text-center text-yellow-700 dark:text-yellow-400">
                🏆 Top 3 Leader!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
