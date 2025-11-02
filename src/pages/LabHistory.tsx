import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { History, Filter, Star, X, Info, Share2, Mic, Sparkles, TrendingUp, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LabHistoryEntry {
  labId: string;
  title: string;
  branch: string;
  date: string;
  score: number;
  outcome: "Passed" | "Failed";
  notes: string;
}

const mockHistory: LabHistoryEntry[] = [
  { labId: "ece-001", title: "Circuit Basics", branch: "ECE", date: "01/11/2025", score: 85, outcome: "Passed", notes: "Great results" },
  { labId: "mech-002", title: "Mechanics Lab", branch: "Mechanical", date: "29/10/2025", score: 92, outcome: "Passed", notes: "" },
  { labId: "chem-003", title: "Chemical Reactions", branch: "Chemistry", date: "28/10/2025", score: 67, outcome: "Failed", notes: "Need review" },
  { labId: "ece-004", title: "Digital Logic", branch: "ECE", date: "27/10/2025", score: 88, outcome: "Passed", notes: "" },
  { labId: "civil-005", title: "Structural Analysis", branch: "Civil", date: "26/10/2025", score: 95, outcome: "Passed", notes: "Excellent" },
  { labId: "chem-006", title: "Organic Chemistry", branch: "Chemistry", date: "25/10/2025", score: 72, outcome: "Passed", notes: "" },
  { labId: "mech-007", title: "Thermodynamics", branch: "Mechanical", date: "24/10/2025", score: 58, outcome: "Failed", notes: "" },
  { labId: "ece-008", title: "Microprocessors", branch: "ECE", date: "23/10/2025", score: 90, outcome: "Passed", notes: "" },
  { labId: "civil-009", title: "Surveying", branch: "Civil", date: "22/10/2025", score: 83, outcome: "Passed", notes: "" },
  { labId: "chem-010", title: "Inorganic Chemistry", branch: "Chemistry", date: "21/10/2025", score: 78, outcome: "Passed", notes: "" },
  { labId: "mech-011", title: "Fluid Mechanics", branch: "Mechanical", date: "20/10/2025", score: 86, outcome: "Passed", notes: "" },
  { labId: "ece-012", title: "Power Systems", branch: "ECE", date: "19/10/2025", score: 91, outcome: "Passed", notes: "" },
  { labId: "civil-013", title: "Concrete Tech", branch: "Civil", date: "18/10/2025", score: 81, outcome: "Passed", notes: "" },
  { labId: "chem-014", title: "Physical Chemistry", branch: "Chemistry", date: "17/10/2025", score: 65, outcome: "Failed", notes: "" },
  { labId: "mech-015", title: "Machine Design", branch: "Mechanical", date: "16/10/2025", score: 89, outcome: "Passed", notes: "" },
  { labId: "ece-016", title: "Control Systems", branch: "ECE", date: "15/10/2025", score: 94, outcome: "Passed", notes: "" },
  { labId: "civil-017", title: "Transportation", branch: "Civil", date: "14/10/2025", score: 77, outcome: "Passed", notes: "" },
  { labId: "chem-018", title: "Analytical Chemistry", branch: "Chemistry", date: "13/10/2025", score: 82, outcome: "Passed", notes: "" },
  { labId: "mech-019", title: "Manufacturing", branch: "Mechanical", date: "12/10/2025", score: 87, outcome: "Passed", notes: "" },
  { labId: "ece-020", title: "Communication Systems", branch: "ECE", date: "11/10/2025", score: 93, outcome: "Passed", notes: "" },
];

const LabHistory = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [history, setHistory] = useState<LabHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<LabHistoryEntry[]>([]);
  const [filterBy, setFilterBy] = useState(branchId || "All");
  const [sortBy, setSortBy] = useState("Date");
  const [selectedLab, setSelectedLab] = useState<LabHistoryEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showHighlightReel, setShowHighlightReel] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);
  const [robotState, setRobotState] = useState<"idle" | "scanning" | "reviewing" | "organizing">("idle");
  const [showCapsule, setShowCapsule] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setHistory(mockHistory);
    setFilteredHistory(mockHistory);
    
    // Time capsule animation on first load
    const hasSeenCapsule = localStorage.getItem("hasSeenLabHistoryCapsule");
    if (!hasSeenCapsule) {
      setTimeout(() => {
        setShowCapsule(false);
        localStorage.setItem("hasSeenLabHistoryCapsule", "true");
      }, 2000);
    } else {
      setShowCapsule(false);
    }
  }, []);

  useEffect(() => {
    let filtered = history;
    
    if (filterBy !== "All") {
      if (filterBy === "Passed" || filterBy === "Failed") {
        filtered = filtered.filter(h => h.outcome === filterBy);
      } else {
        filtered = filtered.filter(h => h.branch === filterBy);
      }
    }

    // Sort
    if (sortBy === "Date") {
      filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "Score") {
      filtered = [...filtered].sort((a, b) => b.score - a.score);
    } else if (sortBy === "Branch") {
      filtered = [...filtered].sort((a, b) => a.branch.localeCompare(b.branch));
    }

    setFilteredHistory(filtered);
  }, [filterBy, sortBy, history]);

  const triggerHaptic = () => {
    if (navigator.vibrate && hapticIntensity > 0) {
      navigator.vibrate([50 * hapticIntensity]);
    }
  };

  const handleRetry = (labId: string) => {
    triggerHaptic();
    setRobotState("idle");
    toast({ title: "Launching Lab...", description: "Get ready to experiment!" });
    setTimeout(() => navigate(`/lab-entrance/${labId}`), 500);
  };

  const handleFilterChange = (value: string) => {
    triggerHaptic();
    setFilterBy(value);
    setRobotState("scanning");
    setTimeout(() => setRobotState("idle"), 1000);
  };

  const handleSortChange = (value: string) => {
    triggerHaptic();
    setSortBy(value);
    setRobotState("organizing");
    setTimeout(() => setRobotState("idle"), 800);
  };

  const handleClearFilters = () => {
    triggerHaptic();
    setFilterBy("All");
    setSortBy("Date");
    setRobotState("organizing");
    toast({ title: "Filters Cleared!", description: "Showing all lab history" });
    setTimeout(() => setRobotState("idle"), 800);
  };

  const handleDetails = (lab: LabHistoryEntry) => {
    triggerHaptic();
    setSelectedLab(lab);
    setShowDetails(true);
    setRobotState("reviewing");
  };

  const handleShare = () => {
    triggerHaptic();
    toast({ title: "History Shared!", description: "Your lab journey has been shared" });
  };

  const handleVoiceHistory = () => {
    triggerHaptic();
    toast({ title: "Voice History", description: "Voice history summary coming soon!" });
  };

  const handleMentorReview = () => {
    triggerHaptic();
    toast({ title: "Mentor Review", description: "Opening mentor insights..." });
  };

  const branches = ["All", "Passed", "Failed", ...Array.from(new Set(mockHistory.map(h => h.branch)))];
  const highlightReelLabs = mockHistory.filter(h => h.score > 80).slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative" style={{ fontSize: `${fontSize}px` }}>
      {/* Time Capsule Animation */}
      {showCapsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="relative animate-scale-in">
            <div className="w-24 h-32 bg-gradient-to-br from-primary/30 to-primary/60 rounded-full border-2 border-primary animate-vlx-bounce" />
            <div className="absolute inset-0 flex items-center justify-center">
              <History className="h-12 w-12 text-primary animate-vlx-spin" />
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-6xl py-8 px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2 vlx-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold relative inline-block">
              Your Lab History
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-[scale-in_0.3s_ease-out]" />
            </h1>
            <Button variant="ghost" size="icon" onClick={() => setShowAccessibility(true)} aria-label="Accessibility settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">Review your experimental journey</p>
        </div>

        {/* Robot Assistant */}
        <div className={`fixed bottom-24 left-4 z-40 transition-transform duration-300 ${robotState === "organizing" ? "animate-vlx-bounce" : ""}`}>
          <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center ${robotState === "scanning" ? "scale-110" : ""}`}>
            <Sparkles className={`h-6 w-6 text-primary ${robotState === "scanning" ? "animate-vlx-spin" : ""}`} />
          </div>
          {robotState === "reviewing" && hoveredCard && (
            <div className="absolute -top-12 left-full ml-2 px-3 py-2 bg-card border border-primary/30 rounded-lg text-xs whitespace-nowrap animate-fade-in">
              Reviewing: {hoveredCard}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-end vlx-slide-up">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="filter" className="text-sm">Filter By</Label>
            <Select value={filterBy} onValueChange={handleFilterChange}>
              <SelectTrigger id="filter" className="w-full" aria-label="Filter lab history">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="sort" className="text-sm">Sort By</Label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger id="sort" className="w-full" aria-label="Sort lab history">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Date">Date (Recent First)</SelectItem>
                <SelectItem value="Score">Score (Highest First)</SelectItem>
                <SelectItem value="Branch">Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleClearFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 vlx-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button onClick={() => setShowHighlightReel(true)}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Highlight Reel
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share History
          </Button>
          <Button variant="outline" onClick={handleVoiceHistory}>
            <Mic className="mr-2 h-4 w-4" />
            Voice History
          </Button>
          <Button variant="outline" onClick={handleMentorReview}>
            <Sparkles className="mr-2 h-4 w-4" />
            Mentor Review
          </Button>
        </div>

        {/* History Grid */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 vlx-fade-in">
            <div className="mb-6">
              <div className="inline-block w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center animate-vlx-bounce">
                <History className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground mb-6">Complete labs to build your history</p>
            <Button onClick={() => navigate("/labs")}>Explore Labs</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((lab, index) => (
              <Card
                key={`${lab.labId}-${index}`}
                className="p-6 hover:shadow-lg transition-all duration-300 vlx-slide-up cursor-pointer relative"
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => {
                  setHoveredCard(lab.title);
                  setRobotState("reviewing");
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  setRobotState("idle");
                }}
                onClick={() => handleDetails(lab)}
              >
                {hoveredCard === lab.title && (
                  <div className="absolute inset-0 border-2 border-primary/40 rounded-lg animate-fade-in pointer-events-none" />
                )}
                
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {lab.branch === "ECE" && <circle cx="50" cy="50" r="30" stroke="currentColor" fill="none" strokeWidth="2" />}
                        {lab.branch === "Mechanical" && <rect x="30" y="30" width="40" height="40" stroke="currentColor" fill="none" strokeWidth="2" />}
                        {lab.branch === "Chemistry" && <path d="M50,20 L50,80 M30,50 L70,50" stroke="currentColor" fill="none" strokeWidth="2" />}
                        {lab.branch === "Civil" && <polygon points="50,20 80,80 20,80" stroke="currentColor" fill="none" strokeWidth="2" />}
                      </svg>
                    </div>
                    <History className="h-12 w-12 text-primary relative z-10" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{lab.title}</h3>
                      {lab.score > 80 && (
                        <Star className="h-5 w-5 text-yellow-500 animate-[spin_0.3s_ease-out]" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{lab.branch}</Badge>
                      <Badge variant={lab.outcome === "Passed" ? "default" : "destructive"} className={lab.outcome === "Failed" ? "animate-vlx-pulse" : ""}>
                        {lab.outcome}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lab.date}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-2xl font-bold text-primary">{lab.score}/100</div>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRetry(lab.labId); }}>
                        Retry
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md" aria-describedby="details-description">
          <DialogHeader>
            <DialogTitle>Lab Details</DialogTitle>
          </DialogHeader>
          {selectedLab && (
            <div className="space-y-4" id="details-description">
              <div>
                <h4 className="font-semibold mb-1">{selectedLab.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedLab.branch}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{selectedLab.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="font-semibold text-primary text-2xl">{selectedLab.score}/100</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outcome</p>
                <Badge variant={selectedLab.outcome === "Passed" ? "default" : "destructive"}>
                  {selectedLab.outcome}
                </Badge>
              </div>
              {selectedLab.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedLab.notes}</p>
                </div>
              )}
              <div className="pt-2">
                <Button className="w-full" onClick={() => { setShowDetails(false); handleRetry(selectedLab.labId); }}>
                  Retry Lab
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Highlight Reel Modal */}
      <Dialog open={showHighlightReel} onOpenChange={setShowHighlightReel}>
        <DialogContent className="max-w-2xl" aria-describedby="highlight-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Highlight Reel
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowHighlightReel(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4" id="highlight-description">
            <p className="text-sm text-muted-foreground">Your top-scoring labs</p>
            {highlightReelLabs.map((lab, index) => (
              <Card key={lab.labId} className="p-4 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{lab.title}</h4>
                    <p className="text-sm text-muted-foreground">{lab.branch} • {lab.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{lab.score}</div>
                    <Star className="h-5 w-5 text-yellow-500 ml-auto" fill="currentColor" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Accessibility Modal */}
      <Dialog open={showAccessibility} onOpenChange={setShowAccessibility}>
        <DialogContent className="max-w-md" aria-describedby="accessibility-description">
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6" id="accessibility-description">
            <div className="space-y-2">
              <Label>Font Size: {fontSize}pt</Label>
              <Slider
                min={14}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={(v) => setFontSize(v[0])}
                aria-label="Adjust font size"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">High Contrast</Label>
              <Switch
                id="contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
            <div className="space-y-2">
              <Label>Haptic Intensity: {hapticIntensity === 0 ? "Off" : hapticIntensity === 1 ? "Low" : "High"}</Label>
              <Slider
                min={0}
                max={2}
                step={1}
                value={[hapticIntensity]}
                onValueChange={(v) => setHapticIntensity(v[0])}
                aria-label="Adjust haptic feedback intensity"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabHistory;
