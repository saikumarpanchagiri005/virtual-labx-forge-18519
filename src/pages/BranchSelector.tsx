import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { branches as initialBranches } from "@/data/branches";
import BranchCard from "@/components/branch/BranchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Shuffle, Zap, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const BranchSelector = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState(initialBranches);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"alphabetical" | "difficulty" | "progress">("alphabetical");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [scanningIndex, setScanningIndex] = useState(0);

  // Explorer scanning animation
  useEffect(() => {
    const unlockedBranches = branches.filter((b) => !b.isLocked);
    const interval = setInterval(() => {
      setScanningIndex((prev) => (prev + 1) % unlockedBranches.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [branches]);

  // Calculate global mastery
  const totalLabs = branches.reduce((sum, b) => sum + b.labsTotal, 0);
  const unlockedLabs = branches.reduce((sum, b) => sum + b.labsUnlocked, 0);
  const masteryPercent = ((unlockedLabs / totalLabs) * 100).toFixed(1);

  // Filter and sort branches
  const filteredBranches = branches
    .filter((branch) => {
      const matchesSearch =
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.shortName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = filterDifficulty === "all" || branch.difficulty === filterDifficulty;
      const matchesFavorites = !showFavoritesOnly || branch.isFavorite;
      return matchesSearch && matchesDifficulty && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "difficulty": {
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        case "progress":
          return (b.labsUnlocked / b.labsTotal) - (a.labsUnlocked / a.labsTotal);
        default:
          return 0;
      }
    });

  const handleBranchSelect = (branch: typeof branches[0]) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    toast.success(`Entering ${branch.name}`);
    // Navigate to Lab List with branch ID
    navigate(`/lab-list/${branch.id}`);
  };

  const handleToggleFavorite = (branchId: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === branchId ? { ...b, isFavorite: !b.isFavorite } : b))
    );
    const branch = branches.find((b) => b.id === branchId);
    if (branch) {
      toast.info(branch.isFavorite ? "Removed from favorites" : "Added to favorites");
    }
  };

  const handleRandomBranch = () => {
    const unlocked = branches.filter((b) => !b.isLocked);
    const random = unlocked[Math.floor(Math.random() * unlocked.length)];
    handleBranchSelect(random);
  };

  const handleVoiceSearch = () => {
    toast.info("Voice search feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background">
      <div className="container max-w-7xl py-8 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 vlx-fade-in">
          <h1 className="text-3xl font-bold">Select Your Branch</h1>
          <p className="text-muted-foreground">Choose a scientific discipline to explore</p>
          <Badge variant="secondary" className="mt-2">
            Global Mastery: {masteryPercent}%
          </Badge>
        </div>

        {/* Controls */}
        <div className="space-y-4 vlx-slide-up">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-32"
              aria-label="Search branches"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleVoiceSearch}
              aria-label="Voice search"
            >
              <Zap className="h-4 w-4 mr-1" />
              Voice
            </Button>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-3">
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[180px]" aria-label="Sort branches">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-[180px]" aria-label="Filter by difficulty">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              aria-label="Toggle favorites filter"
            >
              Favorites Only
            </Button>

            <Button variant="outline" size="sm" onClick={handleRandomBranch} aria-label="Random branch">
              <Shuffle className="mr-2 h-4 w-4" />
              Random
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTutorial(!showTutorial)}
              aria-label="Toggle tutorial"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Tutorial
            </Button>
          </div>
        </div>

        {/* Tutorial Overlay */}
        {showTutorial && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 vlx-fade-in">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              How to Use Branch Selector
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Click any unlocked branch to explore its labs</li>
              <li>• Use the heart icon to bookmark your favorite branches</li>
              <li>• Locked branches unlock as you progress through levels</li>
              <li>• View detailed stats by clicking "View Stats" on any card</li>
              <li>• Use filters to find branches by difficulty or favorites</li>
            </ul>
          </div>
        )}

        {/* Central Globe with Orbiting Branches Visualization */}
        <div className="relative h-32 flex items-center justify-center">
          {/* Central Globe */}
          <div className="relative z-10">
            <svg width="120" height="120" viewBox="0 0 120 120" className="animate-vlx-spin">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <circle cx="60" cy="60" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
              {/* Globe meridians */}
              <ellipse cx="60" cy="60" rx="40" ry="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
              <ellipse cx="60" cy="60" rx="15" ry="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>

          {/* Explorer Silhouette */}
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 animate-pulse">
            <svg width="40" height="60" viewBox="0 0 40 60" className="opacity-70">
              {/* Explorer with magnifying glass */}
              <ellipse cx="20" cy="15" rx="8" ry="10" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
              <line x1="20" y1="25" x2="20" y2="45" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
              <line x1="20" y1="30" x2="10" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
              <line x1="20" y1="30" x2="30" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
              <line x1="20" y1="45" x2="15" y2="58" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
              <line x1="20" y1="45" x2="25" y2="58" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
              {/* Magnifying glass */}
              <circle cx="32" cy="38" r="4" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
              <line x1="35" y1="41" x2="38" y2="44" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBranches.map((branch, index) => (
            <div
              key={branch.id}
              className={`
                transition-all duration-300
                ${index === scanningIndex && !branch.isLocked ? "ring-2 ring-primary ring-offset-2" : ""}
              `}
            >
              <BranchCard
                branch={branch}
                onSelect={handleBranchSelect}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>

        {filteredBranches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No branches found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchSelector;
