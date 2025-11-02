import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Filter,
  Target,
  Share2,
  Mic,
  Accessibility,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import ProgressCard from "@/components/progress/ProgressCard";
import GoalModal from "@/components/progress/GoalModal";
import MilestoneModal from "@/components/progress/MilestoneModal";
import TimelineModal from "@/components/progress/TimelineModal";
import MentorInsightsModal from "@/components/progress/MentorInsightsModal";
import {
  mockProgressData,
  calculateOverallMastery,
  ProgressData,
  Goal,
} from "@/data/progressData";

const LabProgressTracker = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State
  const [progressData, setProgressData] = useState<ProgressData[]>(mockProgressData);
  const [filteredData, setFilteredData] = useState<ProgressData[]>(mockProgressData);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("progress");
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineData, setTimelineData] = useState({ completed: 0, total: 0 });
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  // Accessibility settings
  const [fontSize, setFontSize] = useState([16]);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState([1]);

  // Load data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setGlobalProgress(calculateOverallMastery(mockProgressData));
    }, 500);

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("vlx-accessibility");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize([settings.fontSize || 16]);
      setHighContrast(settings.highContrast || false);
      setHapticIntensity([settings.hapticIntensity || 1]);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...progressData];

    // Apply branch filter if coming from a specific branch
    if (branchId) {
      filtered = filtered.filter((p) => p.branchId === branchId);
    }

    // Apply filter
    if (filter === "favorites") {
      filtered = filtered.filter((p) => p.isFavorite);
    } else if (filter !== "all") {
      filtered = filtered.filter((p) => p.branchId === filter);
    }

    // Apply sorting
    if (sortBy === "progress") {
      filtered.sort((a, b) => b.completionPercentage - a.completionPercentage);
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "recent") {
      // Mock recency - just reverse order
      filtered.reverse();
    }

    setFilteredData(filtered);
  }, [filter, sortBy, progressData, branchId]);

  // Apply accessibility settings
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize[0]}px`;
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Save settings
    localStorage.setItem(
      "vlx-accessibility",
      JSON.stringify({
        fontSize: fontSize[0],
        highContrast,
        hapticIntensity: hapticIntensity[0],
      })
    );
  }, [fontSize, highContrast, hapticIntensity]);

  // Handlers
  const handleSaveGoal = (goal: Omit<Goal, "id" | "currentProgress" | "isCompleted">) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...goal,
      currentProgress: 0,
      isCompleted: false,
    };

    // Save to localStorage
    const savedGoals = localStorage.getItem("vlx-goals");
    const goals = savedGoals ? JSON.parse(savedGoals) : [];
    goals.push(newGoal);
    localStorage.setItem("vlx-goals", JSON.stringify(goals));
  };

  const handleMilestoneClick = (milestones: string[]) => {
    setSelectedMilestones(milestones);
    setShowMilestoneModal(true);
  };

  const handleTimelineClick = () => {
    const totalCompleted = progressData.reduce((sum, p) => sum + p.labsCompleted, 0);
    const totalLabs = progressData.reduce((sum, p) => sum + p.labsTotal, 0);
    setTimelineData({ completed: totalCompleted, total: totalLabs });
    setShowTimelineModal(true);
  };

  const handleShareProgress = () => {
    if (navigator.vibrate && hapticIntensity[0] > 0) {
      navigator.vibrate(50 * hapticIntensity[0]);
    }

    toast({
      title: "Progress Shared! 🎉",
      description: "Your progress has been shared successfully.",
    });
  };

  const handleVoiceProgress = () => {
    if (navigator.vibrate && hapticIntensity[0] > 0) {
      navigator.vibrate(50 * hapticIntensity[0]);
    }

    toast({
      title: "Voice feature coming soon! 🎤",
      description: "Voice progress summary will be available in a future update.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-vlx-pulse">🤖</div>
          <p className="text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          hsl(var(--border)) 0px,
          transparent 1px,
          transparent 10px,
          hsl(var(--border)) 11px
        )`,
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Lab Progress Tracker</h1>
                <p className="text-sm text-muted-foreground">Monitor your learning journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAccessibility(true)}
                aria-label="Accessibility settings"
              >
                <Accessibility className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Global Progress Bar */}
          <div className="mb-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Overall Mastery</span>
              </div>
              <span className="text-2xl font-bold text-primary">{globalProgress}%</span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/70 animate-vlx-scale shadow-lg"
                style={{
                  width: `${globalProgress}%`,
                  boxShadow: "0 0 10px rgba(0, 123, 255, 0.5)",
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]" aria-label="Filter branches">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                  <SelectItem value="ece">ECE</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="computer">Computer Science</SelectItem>
                  <SelectItem value="robotics">Robotics</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" aria-label="Sort by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="progress">Progress (High-Low)</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGoalModal(true)}
                className="hover:bg-primary/10"
              >
                <Target className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTimelineClick}
                className="hover:bg-primary/10"
              >
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMentorModal(true)}
                className="hover:bg-primary/10"
              >
                💡 Insights
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceProgress}
                className="hover:bg-primary/10"
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareProgress}
                className="hover:bg-primary/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Robot Assistant */}
      <div className="fixed top-24 right-8 z-30 pointer-events-none">
        <div className="relative">
          <div className="text-5xl animate-vlx-pulse">🤖</div>
          {globalProgress < 20 && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-2 text-xs whitespace-nowrap shadow-lg pointer-events-auto animate-vlx-scale">
              👍 Start Here!
            </div>
          )}
        </div>
      </div>

      {/* Progress Cards */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {filteredData.length > 0 ? (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
            role="list"
            aria-label="Progress cards"
          >
            {filteredData.map((progress, index) => (
              <ProgressCard
                key={progress.branchId}
                progress={progress}
                index={index}
                onMilestoneClick={handleMilestoneClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg text-muted-foreground mb-2">No progress data found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoalModal
        open={showGoalModal}
        onOpenChange={setShowGoalModal}
        onSaveGoal={handleSaveGoal}
      />

      <MilestoneModal
        open={showMilestoneModal}
        onOpenChange={setShowMilestoneModal}
        milestones={selectedMilestones}
      />

      <TimelineModal
        open={showTimelineModal}
        onOpenChange={setShowTimelineModal}
        labsCompleted={timelineData.completed}
        labsTotal={timelineData.total}
      />

      <MentorInsightsModal
        open={showMentorModal}
        onOpenChange={setShowMentorModal}
      />

      {/* Accessibility Modal */}
      <Dialog open={showAccessibility} onOpenChange={setShowAccessibility}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              Accessibility Settings
            </DialogTitle>
            <DialogDescription>
              Customize your viewing experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="font-size">
                Font Size: {fontSize[0]}pt
              </Label>
              <Slider
                id="font-size"
                value={fontSize}
                onValueChange={setFontSize}
                min={14}
                max={20}
                step={1}
                aria-label="Font size slider"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="haptic">
                Haptic Intensity: {hapticIntensity[0] === 0 ? "Off" : hapticIntensity[0] === 1 ? "Low" : "High"}
              </Label>
              <Slider
                id="haptic"
                value={hapticIntensity}
                onValueChange={setHapticIntensity}
                min={0}
                max={2}
                step={1}
                aria-label="Haptic feedback intensity"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabProgressTracker;
