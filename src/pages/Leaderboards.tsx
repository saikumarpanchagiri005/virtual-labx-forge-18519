import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trophy, RefreshCw, Settings, Mic, Lightbulb, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import RankCard from "@/components/leaderboard/RankCard";
import UserProfileModal from "@/components/leaderboard/UserProfileModal";
import MentorTipsModal from "@/components/leaderboard/MentorTipsModal";
import AccessibilityModal from "@/components/leaderboard/AccessibilityModal";
import {
  mockLeaderboardData,
  currentUser,
  filterOptions,
  sortOptions,
  LeaderboardEntry,
} from "@/data/leaderboards";

const Leaderboards = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { toast } = useToast();

  const [filter, setFilter] = useState(
    localStorage.getItem("leaderboard-filter") || branchId || "Global"
  );
  const [sort, setSort] = useState(
    localStorage.getItem("leaderboard-sort") || "Score"
  );
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showMedals, setShowMedals] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Trigger medal animations after mount
    setTimeout(() => setShowMedals(true), 100);
  }, []);

  useEffect(() => {
    localStorage.setItem("leaderboard-filter", filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem("leaderboard-sort", sort);
  }, [sort]);

  const filteredData = mockLeaderboardData.filter((entry) => {
    if (filter === "Global") return true;
    if (filter === "Challenge") return entry.isTopMover;
    return entry.branch === filter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sort) {
      case "Labs Completed":
        return b.labsCompleted - a.labsCompleted;
      case "Recent Activity":
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      default:
        return b.score - a.score;
    }
  });

  const handleRefresh = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    setIsRefreshing(true);
    toast({
      title: "Rankings Updated!",
      description: "Leaderboard data has been refreshed.",
    });
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUserClick = (user: LeaderboardEntry) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleYourRankClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    setSelectedUser(currentUser as LeaderboardEntry);
    setShowUserModal(true);
  };

  const handleVoiceRankings = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    toast({
      title: "Coming Soon!",
      description: "Voice rankings summary will be available soon.",
    });
  };

  const handleShareRank = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
    toast({
      title: "Rank Shared!",
      description: `Your rank #${currentUser.rank} has been shared.`,
    });
    localStorage.setItem("leaderboard-last-share", new Date().toISOString());
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Trophy Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15 L25 25 L15 27 L22.5 34 L21 44 L30 39 L39 44 L37.5 34 L45 27 L35 25 Z' fill='%23F0F0F0' stroke='none'/%3E%3C/svg%3E")`,
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
              <Trophy className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Leaderboards</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceRankings}
              aria-label="Voice rankings"
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
          className="fixed top-24 right-8 z-40 hidden md:block"
          style={{
            animation: "vlx-float 3s ease-in-out infinite",
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            {/* Scanning laser effect */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                animation: isRefreshing ? "vlx-laser-scan 0.5s ease-out infinite" : undefined,
                border: "2px solid transparent",
              }}
            />
          </div>
        </div>

        {/* Your Rank Badge */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={handleYourRankClick}
            className="group relative"
            aria-label={`Your rank is ${currentUser.rank}`}
          >
            <div
              className={`
                w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 
                border-4 border-primary flex items-center justify-center
                transition-all duration-300 hover:scale-110 cursor-pointer
                ${currentUser.rank <= 10 ? "animate-vlx-glow-pulse" : ""}
              `}
              style={{
                animation: "vlx-scale-badge 0.5s ease-out",
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">#{currentUser.rank}</div>
                <div className="text-xs text-muted-foreground">Your Rank</div>
              </div>
            </div>
            <Share2
              className="absolute -bottom-2 -right-2 h-6 w-6 p-1 bg-background border-2 border-primary rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleShareRank();
              }}
            />
          </button>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter leaderboard">
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
            <SelectTrigger className="w-full sm:w-48" aria-label="Sort leaderboard">
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

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="w-full sm:w-auto"
            aria-label="Refresh rankings"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Leaderboard Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto"
          role="list"
          aria-label="Leaderboard rankings"
          aria-live="polite"
        >
          {sortedData.length > 0 ? (
            sortedData.map((entry, index) => (
              <RankCard
                key={entry.rank}
                entry={entry}
                onClick={() => handleUserClick(entry)}
                delay={index * 0.05}
                showMedal={showMedals}
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
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Rankings Found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filters or start climbing the leaderboard!
                  </p>
                  <Button onClick={() => setFilter("Global")} variant="outline">
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <UserProfileModal
        open={showUserModal}
        onOpenChange={setShowUserModal}
        user={selectedUser}
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
  @keyframes vlx-slide-in-top {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes vlx-medal-spin {
    from {
      transform: rotate(-180deg) scale(0.5);
      opacity: 0;
    }
    to {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  @keyframes vlx-medal-shine {
    0%, 100% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes vlx-count-up {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes vlx-medal-pin {
    0% {
      opacity: 0;
      transform: translateX(50px) scale(0);
    }
    50% {
      transform: translateX(-10px) scale(1.2);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes vlx-glow-pulse {
    0%, 100% {
      box-shadow: 0 0 10px rgba(0, 123, 255, 0.1);
    }
    50% {
      box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
    }
  }

  @keyframes vlx-scale-badge {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
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

  @keyframes vlx-slide-in-right {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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

  @keyframes vlx-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  .leaderboard-high-contrast {
    --foreground: 0 0% 0%;
    --background: 0 0% 100%;
  }
`;
document.head.appendChild(style);

export default Leaderboards;
