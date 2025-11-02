import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Shield, Search, Plus, UserPlus, Settings, Mic, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import GuildCard from "@/components/guild/GuildCard";
import CreateGuildModal from "@/components/guild/CreateGuildModal";
import GuildDetailsModal from "@/components/guild/GuildDetailsModal";
import MentorTipsModal from "@/components/guild/MentorTipsModal";
import AccessibilityModal from "@/components/guild/AccessibilityModal";
import {
  mockGuildData,
  filterOptions,
  sortOptions,
  Guild,
} from "@/data/guilds";

const Guilds = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { toast } = useToast();

  const [guilds, setGuilds] = useState<Guild[]>(mockGuildData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(
    localStorage.getItem("guilds-filter") || branchId || "All"
  );
  const [sort, setSort] = useState(
    localStorage.getItem("guilds-sort") || "Member Count"
  );
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);

  useEffect(() => {
    localStorage.setItem("guilds-filter", filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem("guilds-sort", sort);
  }, [sort]);

  const filteredGuilds = guilds.filter((guild) => {
    // Search filter
    if (searchQuery && !guild.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filter === "All") return true;
    if (filter === "Open") return !guild.isJoined;
    if (filter === "ECE-Focused") return guild.focus === "ECE";
    if (filter === "Mechanics-Focused") return guild.focus === "Mechanical";
    if (filter === "Chemical-Focused") return guild.focus === "Chemical";
    if (filter === "General") return guild.focus === "General";
    return true;
  });

  const sortedGuilds = [...filteredGuilds].sort((a, b) => {
    switch (sort) {
      case "Activity":
        return b.activeLabs - a.activeLabs;
      case "Name":
        return a.name.localeCompare(b.name);
      default:
        return b.members - a.members;
    }
  });

  const handleJoinGuild = (guildId: string) => {
    setGuilds(
      guilds.map((g) =>
        g.id === guildId ? { ...g, isJoined: true, members: g.members + 1 } : g
      )
    );
    toast({
      title: "Joined Guild!",
      description: "You're now part of the team. Let's collaborate!",
    });
    
    // Navigate to Lab Entrance (mock lab)
    setTimeout(() => {
      navigate("/lab-entrance/lab-001");
    }, 500);
  };

  const handleCreateGuild = (name: string, focus: string) => {
    const newGuild: Guild = {
      id: `guild-${Date.now()}`,
      name,
      members: 1,
      focus,
      activeLabs: 0,
      isJoined: true,
      description: "Newly created guild",
    };
    setGuilds([newGuild, ...guilds]);
    toast({
      title: "Guild Created!",
      description: `${name} is ready for members to join.`,
    });
  };

  const handleGuildDetails = (guild: Guild) => {
    setSelectedGuild(guild);
    setShowDetailsModal(true);
  };

  const handleInviteFriends = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    setShowEnvelope(true);
    setTimeout(() => setShowEnvelope(false), 500);
    toast({
      title: "Invite Sent!",
      description: "Your friends will receive an invitation to join VirtualLabX.",
    });
    localStorage.setItem("guilds-last-invite", new Date().toISOString());
  };

  const handleVoiceGuilds = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    toast({
      title: "Coming Soon!",
      description: "Voice guilds summary will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Badge Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10 L35 20 L45 20 L37 27 L40 37 L30 30 L20 37 L23 27 L15 20 L25 20 Z' fill='%23F0F0F0' stroke='none'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/multiplayer")}
              aria-label="Back to Multiplayer Hub"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Guilds</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceGuilds}
              aria-label="Voice guilds"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMentorModal(true)}
              aria-label="Mentor tips"
            >
              <Lightbulb className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAccessibilityModal(true)}
              aria-label="Accessibility settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 relative">
        {/* Robot Assistant */}
        <div
          className="fixed bottom-24 right-8 z-40 hidden md:block"
          style={{
            animation: "vlx-float 3s ease-in-out infinite",
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            
            {/* Envelope animation */}
            {showEnvelope && (
              <div
                className="absolute top-0 right-0"
                style={{
                  animation: "vlx-envelope-fly 0.5s ease-out",
                }}
              >
                <div className="w-6 h-6 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guilds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                style={{
                  animation: searchQuery ? "vlx-search-pulse 0.3s ease-out" : undefined,
                }}
                aria-label="Search guilds"
              />
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Create Guild
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48" aria-label="Filter guilds">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-48" aria-label="Sort guilds">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Guild Cards Grid */}
        <div
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          role="list"
          aria-label="Available guilds"
          aria-live="polite"
        >
          {sortedGuilds.length > 0 ? (
            sortedGuilds.map((guild, index) => (
              <GuildCard
                key={guild.id}
                guild={guild}
                onJoin={handleJoinGuild}
                onDetails={handleGuildDetails}
                delay={index * 0.05}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div
                className="inline-block animate-vlx-unfurl"
                style={{
                  transformOrigin: "top center",
                }}
              >
                <div className="p-8 bg-card border-2 border-dashed border-border rounded-lg">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Start a Guild
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No guilds found. Create your own and invite others to join!
                  </p>
                  <Button onClick={() => setShowCreateModal(true)} variant="outline">
                    Create Guild
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Friends Button */}
        <div className="flex justify-center">
          <Button onClick={handleInviteFriends} variant="outline" size="lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Friends
          </Button>
        </div>
      </main>

      {/* Modals */}
      <CreateGuildModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreate={handleCreateGuild}
      />
      <GuildDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        guild={selectedGuild}
      />
      <MentorTipsModal open={showMentorModal} onOpenChange={setShowMentorModal} />
      <AccessibilityModal
        open={showAccessibilityModal}
        onOpenChange={setShowAccessibilityModal}
      />
    </div>
  );
};

// Add animations
const style = document.createElement("style");
style.textContent = `
  @keyframes vlx-guild-zoom-in {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes vlx-flicker {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes vlx-badge-spin {
    from {
      transform: rotate(-180deg) scale(0.5);
      opacity: 0;
    }
    to {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  @keyframes vlx-member-spin {
    from {
      transform: rotate(360deg) scale(0);
      opacity: 0;
    }
    to {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  @keyframes vlx-hammer-build {
    0% {
      opacity: 0;
      transform: translateY(-20px) rotate(-45deg);
    }
    50% {
      transform: translateY(0) rotate(-15deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) rotate(0deg);
    }
  }

  @keyframes vlx-guild-pulse {
    0%, 100% {
      box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
    }
    50% {
      box-shadow: 0 0 20px rgba(0, 123, 255, 0.4);
    }
  }

  @keyframes vlx-particle-converge {
    from {
      opacity: 1;
      transform: translate(0, 0);
    }
    to {
      opacity: 0;
      transform: translate(calc(-1 * var(--x, 0px)), calc(-1 * var(--y, 0px))) scale(0);
    }
  }

  @keyframes vlx-badge-form {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes vlx-envelope-fly {
    0% {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(100px, -100px) scale(0.5);
    }
  }

  @keyframes vlx-float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes vlx-search-pulse {
    0% {
      border-color: transparent;
    }
    50% {
      border-color: hsl(var(--primary));
    }
    100% {
      border-color: transparent;
    }
  }

  @keyframes vlx-slide-up {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes vlx-unfurl {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes vlx-laser-scan {
    0% {
      border-color: transparent;
      box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
    }
    50% {
      border-color: rgba(0, 123, 255, 0.5);
      box-shadow: 0 0 20px 5px rgba(0, 123, 255, 0.3);
    }
    100% {
      border-color: transparent;
      box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
    }
  }

  @keyframes vlx-laser-highlight {
    0% {
      opacity: 0;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
    }
    100% {
      opacity: 0;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0);
    }
  }

  @keyframes vlx-scale-in {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes vlx-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes vlx-scale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  .guilds-high-contrast {
    --foreground: 0 0% 0%;
    --background: 0 0% 100%;
  }
`;
document.head.appendChild(style);

export default Guilds;
