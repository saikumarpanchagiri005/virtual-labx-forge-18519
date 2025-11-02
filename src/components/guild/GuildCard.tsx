import { useState } from "react";
import { Users, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Guild } from "@/data/guilds";

interface GuildCardProps {
  guild: Guild;
  onJoin: (guildId: string) => void;
  onDetails: (guild: Guild) => void;
  delay: number;
}

const GuildCard = ({ guild, onJoin, onDetails, delay }: GuildCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    onJoin(guild.id);
  };

  const handleDetails = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    onDetails(guild);
  };

  return (
    <Card
      onClick={handleDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 relative overflow-hidden h-[200px] flex flex-col",
        "hover:shadow-lg hover:scale-[1.02]",
        guild.isJoined && "border-primary/50 bg-primary/5",
        guild.isHot && "border-orange-500/30"
      )}
      style={{
        animation: `vlx-guild-zoom-in 0.3s ease-out ${delay}s both`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Guild: ${guild.name}, ${guild.members} members, ${guild.focus} focus`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDetails();
        }
      }}
    >
      {/* Hot/Featured Badges */}
      <div className="absolute top-2 right-2 flex gap-1">
        {guild.isHot && (
          <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 rounded-full px-2 py-1">
            <Flame className="h-3 w-3 text-orange-600 dark:text-orange-400 animate-vlx-flicker" />
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">Hot</span>
          </div>
        )}
        {guild.isFeatured && (
          <div
            className="flex items-center gap-1 bg-primary/10 border border-primary/30 rounded-full px-2 py-1"
            style={{
              animation: "vlx-badge-spin 0.5s ease-out",
            }}
          >
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
        )}
      </div>

      {/* Member Badge */}
      {guild.isJoined && (
        <div
          className="absolute top-2 left-2 bg-primary/20 border-2 border-primary rounded-full px-3 py-1"
          style={{
            animation: "vlx-member-spin 0.5s ease-out",
          }}
        >
          <span className="text-xs font-bold text-primary">Member</span>
        </div>
      )}

      {/* Guild Info */}
      <div className="flex-1">
        <h3 className="font-bold text-foreground mb-2 pr-8">{guild.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {guild.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{guild.members}</span>
          </div>
          <div className="px-2 py-1 bg-primary/10 rounded text-xs font-medium text-primary">
            {guild.focus}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {guild.activeLabs} active labs
        </p>
      </div>

      {/* Join Button */}
      <Button
        onClick={handleJoin}
        variant={guild.isJoined ? "secondary" : "default"}
        size="sm"
        className="w-full mt-3"
        disabled={guild.isJoined}
      >
        {guild.isJoined ? "Joined" : "Join Guild"}
      </Button>

      {/* Badge Build Animation on Hover */}
      {isHovered && !guild.isJoined && (
        <div
          className="absolute right-4 bottom-16"
          style={{
            animation: "vlx-hammer-build 0.4s ease-out",
          }}
        >
          <div className="w-8 h-8 text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
        </div>
      )}

      {/* Pulse Effect for Joined Guilds */}
      {guild.isJoined && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: "0 0 20px rgba(0, 123, 255, 0.2)",
            animation: "vlx-guild-pulse 2s ease-in-out infinite",
          }}
        />
      )}
    </Card>
  );
};

export default GuildCard;
