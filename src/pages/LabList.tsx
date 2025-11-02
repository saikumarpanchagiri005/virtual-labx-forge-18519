import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabsByBranch, Lab } from "@/data/labs";
import { branches } from "@/data/branches";
import LabCard from "@/components/lab/LabCard";
import RatingModal from "@/components/lab/RatingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Grid3x3,
  List,
  Mic,
  ArrowLeft,
  Heart,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LabList = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"alphabetical" | "popular" | "time">("alphabetical");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterMinRating, setFilterMinRating] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedLabForRating, setSelectedLabForRating] = useState<Lab | null>(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [robotSorting, setRobotSorting] = useState(false);

  const branch = branches.find((b) => b.id === branchId);

  // Load labs and persist state from localStorage
  useEffect(() => {
    if (branchId) {
      const branchLabs = getLabsByBranch(branchId);
      const savedState = localStorage.getItem(`labs-state-${branchId}`);
      
      if (savedState) {
        const { bookmarks, downloads } = JSON.parse(savedState);
        setLabs(
          branchLabs.map((lab) => ({
            ...lab,
            isBookmarked: bookmarks.includes(lab.id),
            isDownloaded: downloads.includes(lab.id),
          }))
        );
      } else {
        setLabs(branchLabs);
      }

      // Load view preference
      const savedView = localStorage.getItem("lab-view-mode");
      if (savedView === "list" || savedView === "grid") {
        setViewMode(savedView);
      }
    }
  }, [branchId]);

  // Save state to localStorage
  useEffect(() => {
    if (branchId && labs.length > 0) {
      const bookmarks = labs.filter((l) => l.isBookmarked).map((l) => l.id);
      const downloads = labs.filter((l) => l.isDownloaded).map((l) => l.id);
      localStorage.setItem(`labs-state-${branchId}`, JSON.stringify({ bookmarks, downloads }));
    }
  }, [labs, branchId]);

  // Autocomplete logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const suggestions = labs
        .filter((lab) => lab.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
        .map((lab) => lab.title);
      setAutocompleteSuggestions(suggestions);
      setShowAutocomplete(suggestions.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }, [searchQuery, labs]);

  // Filter and sort labs
  const filteredLabs = useMemo(() => {
    return labs
      .filter((lab) => {
        const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = filterDifficulty === "all" || lab.difficulty === filterDifficulty;
        const matchesRating =
          filterMinRating === "all" ||
          lab.rating >= parseFloat(filterMinRating);
        const matchesFavorites = !showFavoritesOnly || lab.isBookmarked;
        return matchesSearch && matchesDifficulty && matchesRating && matchesFavorites;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "alphabetical":
            return a.title.localeCompare(b.title);
          case "popular":
            return b.rating - a.rating;
          case "time": {
            const timeA = parseInt(a.timeEstimate);
            const timeB = parseInt(b.timeEstimate);
            return timeA - timeB;
          }
          default:
            return 0;
        }
      });
  }, [labs, searchQuery, sortBy, filterDifficulty, filterMinRating, showFavoritesOnly]);

  const handleToggleBookmark = (labId: string) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.id === labId ? { ...lab, isBookmarked: !lab.isBookmarked } : lab
      )
    );
    const lab = labs.find((l) => l.id === labId);
    if (lab) {
      toast.success(lab.isBookmarked ? "Removed from favorites" : "Added to favorites");
    }
  };

  const handleToggleDownload = (labId: string) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.id === labId ? { ...lab, isDownloaded: !lab.isDownloaded } : lab
      )
    );
    const lab = labs.find((l) => l.id === labId);
    if (lab && !lab.isDownloaded) {
      toast.success("Lab cached for offline use!");
    }
  };

  const handleRatingClick = (labId: string) => {
    const lab = labs.find((l) => l.id === labId);
    if (lab) {
      setSelectedLabForRating(lab);
      setRatingModalOpen(true);
    }
  };

  const handleRatingSubmit = (rating: number) => {
    if (selectedLabForRating) {
      setLabs((prev) =>
        prev.map((lab) =>
          lab.id === selectedLabForRating.id ? { ...lab, rating } : lab
        )
      );
      toast.success("Rating submitted!");
    }
  };

  const handleLabClick = (labId: string) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    navigate(`/lab-entrance/${labId}`);
  };

  const handleViewToggle = () => {
    const newMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newMode);
    localStorage.setItem("lab-view-mode", newMode);
  };

  const handleSortChange = (value: string) => {
    setRobotSorting(true);
    setSortBy(value as any);
    setTimeout(() => setRobotSorting(false), 2000);
  };

  const handleVoiceSearch = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    toast.info("Voice search activated—type for now");
  };

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Branch not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background vlx-grid-bg">
      <div className="container max-w-7xl py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between vlx-fade-in">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/branch-selector")}
              aria-label="Back to branch selector"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">{branch.icon}</span>
                {branch.shortName} Labs
              </h1>
              <p className="text-sm text-muted-foreground">{branch.name}</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:flex">
            {filteredLabs.length} labs
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="relative vlx-slide-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Search labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
            aria-label="Search labs"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={handleVoiceSearch}
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Autocomplete Dropdown */}
          {showAutocomplete && (
            <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto animate-vlx-fade-in">
              {autocompleteSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowAutocomplete(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 vlx-slide-up">
          {/* View Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewToggle}
            aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4 mr-2" />
            ) : (
              <Grid3x3 className="h-4 w-4 mr-2" />
            )}
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>

          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]" aria-label="Sort labs">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="time">Time Estimate</SelectItem>
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by difficulty">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          {/* Rating Filter */}
          <Select value={filterMinRating} onValueChange={setFilterMinRating}>
            <SelectTrigger className="w-[140px]" aria-label="Filter by minimum rating">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>

          {/* Favorites Toggle */}
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(showFavoritesOnly && "ring-2 ring-primary shadow-lg shadow-primary/20")}
            aria-label="Toggle favorites filter"
          >
            <Heart className={cn("h-4 w-4 mr-2", showFavoritesOnly && "fill-current")} />
            Favorites
          </Button>
        </div>

        {/* Robot Sorting Animation */}
        {robotSorting && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-vlx-fade-in">
            <div className="animate-vlx-walk">
              <svg width="30" height="40" viewBox="0 0 30 40" className="opacity-70">
                <rect x="10" y="5" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" rx="2"/>
                <circle cx="13" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="17" cy="10" r="1.5" fill="currentColor"/>
                <rect x="12" y="17" width="6" height="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="12" y1="25" x2="10" y2="35" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="18" y1="25" x2="20" y2="35" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="12" y1="20" x2="7" y2="22" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="18" y1="20" x2="23" y2="22" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="25" cy="22" r="2" fill="hsl(var(--primary))" opacity="0.6"/>
              </svg>
            </div>
            <span>Robot assistant sorting labs...</span>
          </div>
        )}

        {/* Lab Cards Grid/List */}
        <div
          className={cn(
            "transition-all duration-300",
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          )}
        >
          {filteredLabs.map((lab, index) => (
            <div
              key={lab.id}
              className={cn(
                "vlx-fade-in",
                searchQuery && "search-highlight"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <LabCard
                lab={lab}
                onToggleBookmark={handleToggleBookmark}
                onToggleDownload={handleToggleDownload}
                onRatingClick={handleRatingClick}
                onLabClick={handleLabClick}
                isFlipped={index < 20}
              />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredLabs.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="flex justify-center">
              <svg width="60" height="80" viewBox="0 0 60 80" className="opacity-50">
                <rect x="20" y="10" width="20" height="24" fill="none" stroke="currentColor" strokeWidth="2" rx="4"/>
                <circle cx="26" cy="20" r="3" fill="currentColor"/>
                <circle cx="34" cy="20" r="3" fill="currentColor"/>
                <path d="M 26 28 Q 30 25 34 28" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="24" y="34" width="12" height="16" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="24" y1="50" x2="20" y2="70" stroke="currentColor" strokeWidth="2"/>
                <line x1="36" y1="50" x2="40" y2="70" stroke="currentColor" strokeWidth="2"/>
                <line x1="24" y1="40" x2="14" y2="44" stroke="currentColor" strokeWidth="2"/>
                <line x1="36" y1="40" x2="46" y2="44" stroke="currentColor" strokeWidth="2"/>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 30 40; -10 30 40; 10 30 40; 0 30 40"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No labs found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterDifficulty("all");
                setFilterMinRating("all");
                setShowFavoritesOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedLabForRating && (
        <RatingModal
          isOpen={ratingModalOpen}
          labTitle={selectedLabForRating.title}
          currentRating={selectedLabForRating.rating}
          onClose={() => {
            setRatingModalOpen(false);
            setSelectedLabForRating(null);
          }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default LabList;
