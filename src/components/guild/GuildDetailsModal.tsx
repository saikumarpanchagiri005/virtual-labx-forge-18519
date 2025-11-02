import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Guild } from "@/data/guilds";
import { Users, Target, Flame, Shield } from "lucide-react";

interface GuildDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guild: Guild | null;
}

const GuildDetailsModal = ({ open, onOpenChange, guild }: GuildDetailsModalProps) => {
  if (!guild) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-vlx-slide-up">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Guild Details
          </DialogTitle>
          <DialogDescription>
            Statistics and information for {guild.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Guild Badge */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-4 border-primary flex items-center justify-center"
                style={{
                  animation: "vlx-scale-in 0.3s ease-out",
                }}
              >
                <Shield className="h-10 w-10 text-primary" />
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

          {/* Guild Name */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">{guild.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{guild.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Members</span>
              </div>
              <p className="text-lg font-bold text-foreground">{guild.members}</p>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Active Labs</span>
              </div>
              <p className="text-lg font-bold text-foreground">{guild.activeLabs}</p>
            </div>
          </div>

          {/* Focus Info */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-foreground">
              <span className="text-primary">Focus Area:</span> {guild.focus}
            </p>
          </div>

          {/* Special Badges */}
          {guild.isHot && (
            <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30 animate-vlx-scale">
              <p className="text-sm font-semibold text-center text-orange-700 dark:text-orange-400 flex items-center justify-center gap-2">
                <Flame className="h-4 w-4" />
                Highly Active Guild!
              </p>
            </div>
          )}

          {guild.isJoined && (
            <div className="p-3 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg border border-primary/30 animate-vlx-scale">
              <p className="text-sm font-semibold text-center text-primary">
                ✓ You are a member
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuildDetailsModal;
