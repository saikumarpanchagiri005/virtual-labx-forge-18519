import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Mic, Lightbulb, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { mockRecommendations, type Recommendation } from "@/data/recommendations";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const LabRecommendations = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecs, setFilteredRecs] = useState<Recommendation[]>([]);
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [goalAlignedOnly, setGoalAlignedOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showMentorInsights, setShowMentorInsights] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [isRobotAnimating, setIsRobotAnimating] = useState(false);

  // Load recommendations and apply filters
  useEffect(() => {
    const loadRecommendations = () => {
      let recs = [...mockRecommendations];

      // Apply branch filter if provided in route
      if (branchId) {
        recs = recs.filter(r => r.branch.toLowerCase() === branchId.toLowerCase());
      }

      // Load bookmarks from localStorage
      const bookmarks = JSON.parse(localStorage.getItem("lab-bookmarks") || "[]");
      recs = recs.map(rec => ({
        ...rec,
        isBookmarked: bookmarks.includes(rec.labId)
      }));

      setRecommendations(recs);
    };

    loadRecommendations();

    // Load preferences
    const savedFontSize = localStorage.getItem("vlx-font-size");
    const savedContrast = localStorage.getItem("vlx-high-contrast");
    const savedHaptic = localStorage.getItem("vlx-haptic-intensity");
    const savedGoalFilter = localStorage.getItem("vlx-goal-aligned-filter");

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedContrast) setHighContrast(savedContrast === "true");
    if (savedHaptic) setHapticIntensity(parseInt(savedHaptic));
    if (savedGoalFilter) setGoalAlignedOnly(savedGoalFilter === "true");
  }, [branchId]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...recommendations];

    // Filter by type
    if (filterBy === "favorites") {
      filtered = filtered.filter(r => r.isBookmarked);
    } else if (filterBy === "goal-aligned") {
      filtered = filtered.filter(r => r.isGoalAligned);
    } else if (filterBy !== "all") {
      filtered = filtered.filter(r => r.branch.toLowerCase() === filterBy.toLowerCase());
    }

    // Apply goal alignment filter
    if (goalAlignedOnly) {
      filtered = filtered.filter(r => r.isGoalAligned);
    }

    // Sort
    if (sortBy === "relevance") {
      filtered.sort((a, b) => b.relevance - a.relevance);
    } else if (sortBy === "difficulty") {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else if (sortBy === "time") {
      filtered.sort((a, b) => {
        const timeA = parseInt(a.timeEstimate);
        const timeB = parseInt(b.timeEstimate);
        return timeA - timeB;
      });
    }

    setFilteredRecs(filtered);
  }, [recommendations, filterBy, sortBy, goalAlignedOnly]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsRobotAnimating(true);

    // Robot scans grid
    setTimeout(() => {
      // Shuffle recommendations
      const shuffled = [...filteredRecs].sort(() => Math.random() - 0.5);
      setFilteredRecs(shuffled);
      setIsRefreshing(false);
      setIsRobotAnimating(false);
      
      toast({
        title: "New Labs Suggested!",
        description: "Recommendations refreshed based on your progress.",
      });

      triggerHaptic();
    }, 500);
  };

  const handleBookmarkToggle = (labId: string) => {
    const bookmarks = JSON.parse(localStorage.getItem("lab-bookmarks") || "[]");
    const newBookmarks = bookmarks.includes(labId)
      ? bookmarks.filter((id: string) => id !== labId)
      : [...bookmarks, labId];
    
    localStorage.setItem("lab-bookmarks", JSON.stringify(newBookmarks));
    
    setRecommendations(prev =>
      prev.map(rec =>
        rec.labId === labId ? { ...rec, isBookmarked: !rec.isBookmarked } : rec
      )
    );

    triggerHaptic();
  };

  const handleStartLab = (labId: string) => {
    triggerHaptic(2);
    navigate(`/lab-entrance/${labId}`);
  };

  const triggerHaptic = (intensity: number = hapticIntensity) => {
    if (intensity > 0 && navigator.vibrate) {
      navigator.vibrate([50 * intensity]);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    setIsRobotAnimating(true);
    setTimeout(() => setIsRobotAnimating(false), 500);
    triggerHaptic();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    triggerHaptic();
  };

  const handleGoalAlignmentToggle = (checked: boolean) => {
    setGoalAlignedOnly(checked);
    localStorage.setItem("vlx-goal-aligned-filter", checked.toString());
    triggerHaptic();
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
    localStorage.setItem("vlx-font-size", value[0].toString());
  };

  const handleContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem("vlx-high-contrast", checked.toString());
    document.documentElement.classList.toggle("high-contrast", checked);
  };

  const handleHapticChange = (value: number[]) => {
    setHapticIntensity(value[0]);
    localStorage.setItem("vlx-haptic-intensity", value[0].toString());
    if (value[0] > 0 && navigator.vibrate) {
      navigator.vibrate([50 * value[0]]);
    }
  };

  const uniqueBranches = Array.from(new Set(mockRecommendations.map(r => r.branch)));

  return (
    <div className="min-h-screen bg-background recommendations-page" style={{ fontSize: `${fontSize}px` }}>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-magnifying-glass-pattern" />
      </div>

      {/* Robot Assistant */}
      <div
        className={`fixed top-20 left-4 z-30 transition-all duration-400 ${
          isRobotAnimating ? "animate-robot-scan" : ""
        }`}
        style={{ transform: `translate(${robotPosition.x}px, ${robotPosition.y}px)` }}
      >
        <div className="relative w-12 h-12">
          {/* Robot body */}
          <div className="w-full h-full border-2 border-primary/60 rounded-lg bg-card/80 backdrop-blur-sm">
            {/* Eyes */}
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
            </div>
            {/* Antenna */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-3 bg-primary/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          {/* Spotlight when animating */}
          {isRobotAnimating && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
          )}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Lab Recommendations</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAccessibility(true)}
              aria-label="Accessibility settings"
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toast({ title: "Voice suggestions coming soon!" });
                triggerHaptic();
              }}
              aria-label="Voice recommendations"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowMentorInsights(true);
                triggerHaptic();
              }}
              aria-label="Mentor suggestions"
            >
              <Lightbulb className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 relative z-10">
        {/* Header with glow */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 animate-header-glow">
            Recommended Labs for You
          </h2>
          <p className="text-muted-foreground">
            {filteredRecs.length} personalized suggestions based on your progress
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card rounded-lg border">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="filter" className="text-sm mb-2 block">
              Filter By
            </Label>
            <Select value={filterBy} onValueChange={handleFilterChange}>
              <SelectTrigger id="filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
                <SelectItem value="goal-aligned">Goal-Aligned</SelectItem>
                {uniqueBranches.map(branch => (
                  <SelectItem key={branch} value={branch.toLowerCase()}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="sort" className="text-sm mb-2 block">
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="time">Time Estimate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Goal Alignment Toggle */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-card rounded-lg border">
          <Switch
            id="goal-aligned"
            checked={goalAlignedOnly}
            onCheckedChange={handleGoalAlignmentToggle}
          />
          <Label htmlFor="goal-aligned" className="text-sm cursor-pointer">
            Show only labs matching my goals
          </Label>
          {goalAlignedOnly && (
            <Badge variant="secondary" className="ml-auto">
              {filteredRecs.filter(r => r.isGoalAligned).length} matches
            </Badge>
          )}
        </div>

        {/* Recommendations Grid */}
        {filteredRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredRecs.map((rec, index) => (
              <div
                key={rec.labId}
                className="animate-card-enter"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <RecommendationCard
                  recommendation={rec}
                  onStart={handleStartLab}
                  onBookmarkToggle={handleBookmarkToggle}
                  hapticIntensity={hapticIntensity}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-24 h-24 mb-6 animate-no-results-banner">
              <div className="w-full h-full border-2 border-dashed border-primary/40 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              No labs match your current filters. Try adjusting your preferences or start with a beginner lab.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setFilterBy("all");
                  setGoalAlignedOnly(false);
                }}
                variant="outline"
              >
                Reset Filters
              </Button>
              <Button onClick={() => navigate("/lab-list/beginner")}>
                Browse Beginner Labs
              </Button>
            </div>
          </div>
        )}

        {/* Share Progress Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Progress Shared!",
                description: "Your lab recommendations have been shared.",
              });
              triggerHaptic();
            }}
          >
            Share My Progress
          </Button>
        </div>
      </main>

      {/* Accessibility Modal */}
      <Dialog open={showAccessibility} onOpenChange={setShowAccessibility}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
            <DialogDescription>
              Customize your viewing experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Font Size: {fontSize}pt</Label>
              <Slider
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                min={14}
                max={20}
                step={1}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">High Contrast Mode</Label>
              <Switch
                id="contrast"
                checked={highContrast}
                onCheckedChange={handleContrastToggle}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Haptic Feedback: {hapticIntensity === 0 ? "Off" : hapticIntensity === 1 ? "Low" : "High"}
              </Label>
              <Slider
                value={[hapticIntensity]}
                onValueChange={handleHapticChange}
                min={0}
                max={2}
                step={1}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mentor Insights Modal */}
      <Dialog open={showMentorInsights} onOpenChange={setShowMentorInsights}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Mentor Insights
            </DialogTitle>
            <DialogDescription>
              AI-powered learning recommendations
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-mentor-highlight">
                <h4 className="font-semibold mb-2 text-primary">Focus on ECE Fundamentals</h4>
                <p className="text-sm text-muted-foreground">
                  Your progress shows strong potential in electronics. Complete 2-3 more circuit labs to unlock advanced topics.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Diversify Your Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Consider exploring Mechanics or Computer Science to build cross-disciplinary skills.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Challenge Yourself</h4>
                <p className="text-sm text-muted-foreground">
                  You're ready for intermediate-level labs. Try "Digital Logic Design" next!
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabRecommendations;
