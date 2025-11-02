import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trophy, Clock, Coins, Share2, Mic, Sparkles, Settings, TrendingUp, X, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  labId: string;
  reward: number;
  deadline: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Active" | "Completed";
}

const mockChallenges: Challenge[] = [
  { id: "ch-001", title: "Fast Circuit", description: "Complete Circuit Basics in under 10 minutes", labId: "ece-001", reward: 50, deadline: "03/11/2025", difficulty: "Medium", status: "Active" },
  { id: "ch-002", title: "Perfect Score", description: "Score 100/100 in Mechanics Lab", labId: "mech-002", reward: 100, deadline: "04/11/2025", difficulty: "Hard", status: "Active" },
  { id: "ch-003", title: "Safety First", description: "Complete Chemistry lab with zero violations", labId: "chem-003", reward: 30, deadline: "05/11/2025", difficulty: "Easy", status: "Active" },
  { id: "ch-004", title: "Logic Master", description: "Build 5 logic circuits without errors", labId: "ece-004", reward: 75, deadline: "06/11/2025", difficulty: "Hard", status: "Active" },
  { id: "ch-005", title: "Quick Hands", description: "Complete Structural Analysis in 15 minutes", labId: "civil-005", reward: 60, deadline: "07/11/2025", difficulty: "Medium", status: "Active" },
  { id: "ch-006", title: "Synthesis Pro", description: "Achieve 90%+ yield in Organic Chemistry", labId: "chem-006", reward: 80, deadline: "08/11/2025", difficulty: "Hard", status: "Active" },
  { id: "ch-007", title: "Heat Seeker", description: "Minimize heat loss in Thermodynamics", labId: "mech-007", reward: 40, deadline: "09/11/2025", difficulty: "Medium", status: "Active" },
  { id: "ch-008", title: "Code Warrior", description: "Optimize microprocessor code for speed", labId: "ece-008", reward: 90, deadline: "10/11/2025", difficulty: "Hard", status: "Active" },
  { id: "ch-009", title: "Survey Champion", description: "Complete surveying with 100% accuracy", labId: "civil-009", reward: 55, deadline: "11/11/2025", difficulty: "Medium", status: "Completed" },
  { id: "ch-010", title: "Crystal Clear", description: "Perfect crystal formation in Inorganic Chemistry", labId: "chem-010", reward: 70, deadline: "12/11/2025", difficulty: "Hard", status: "Completed" },
];

const LabChallenges = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [filterBy, setFilterBy] = useState("All");
  const [sortBy, setSortBy] = useState("Deadline");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);
  const [robotState, setRobotState] = useState<"idle" | "setting" | "tossing" | "scanning">("idle");

  useEffect(() => {
    setChallenges(mockChallenges);
    setFilteredChallenges(mockChallenges);
  }, []);

  useEffect(() => {
    let filtered = challenges;
    
    if (filterBy !== "All") {
      filtered = filtered.filter(c => c.status === filterBy);
    }

    if (sortBy === "Deadline") {
      filtered = [...filtered].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === "Reward") {
      filtered = [...filtered].sort((a, b) => b.reward - a.reward);
    } else if (sortBy === "Difficulty") {
      const diffOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
      filtered = [...filtered].sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    }

    setFilteredChallenges(filtered);
  }, [filterBy, sortBy, challenges]);

  const triggerHaptic = () => {
    if (navigator.vibrate && hapticIntensity > 0) {
      navigator.vibrate([50 * hapticIntensity]);
    }
  };

  const handleJoinChallenge = (labId: string) => {
    triggerHaptic();
    setRobotState("setting");
    toast({ title: "Challenge Accepted!", description: "Good luck!" });
    setTimeout(() => {
      setRobotState("idle");
      navigate(`/lab-entrance/${labId}`);
    }, 800);
  };

  const handleClaimReward = () => {
    triggerHaptic();
    setRobotState("tossing");
    toast({ title: "50 Coins Earned!", description: "Reward added to your balance" });
    setTimeout(() => setRobotState("idle"), 1000);
  };

  const handleFilterChange = (value: string) => {
    triggerHaptic();
    setFilterBy(value);
    setRobotState("scanning");
    setTimeout(() => setRobotState("idle"), 800);
  };

  const handleSortChange = (value: string) => {
    triggerHaptic();
    setSortBy(value);
  };

  const handleShare = () => {
    triggerHaptic();
    toast({ title: "Challenge Shared!", description: "Challenge link copied" });
  };

  const handleVoiceChallenges = () => {
    triggerHaptic();
    toast({ title: "Voice Challenges", description: "Voice challenges coming soon!" });
  };

  const handleMentorTips = () => {
    triggerHaptic();
    toast({ title: "Mentor Tips", description: "Opening challenge strategies..." });
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursDiff = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24 && hoursDiff > 0;
  };

  return (
    <div className="min-h-screen bg-background relative" style={{ fontSize: `${fontSize}px` }}>
      <div className="container max-w-6xl py-8 px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2 vlx-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold relative inline-block">
              Lab Challenges
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-[scale-in_0.3s_ease-out]" />
            </h1>
            <Button variant="ghost" size="icon" onClick={() => setShowAccessibility(true)} aria-label="Accessibility settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">Test your skills with time-bound challenges</p>
        </div>

        {/* Robot Assistant */}
        <div className={`fixed top-24 right-4 z-40 transition-transform duration-300 ${robotState === "setting" ? "animate-vlx-bounce" : ""}`}>
          <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center ${robotState === "tossing" ? "scale-110" : ""}`}>
            <Clock className={`h-6 w-6 text-primary ${robotState === "scanning" ? "animate-vlx-spin" : ""}`} />
          </div>
          {robotState === "tossing" && (
            <div className="absolute top-0 left-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-500 rounded-full"
                  style={{
                    animation: `coin-toss 0.5s ease-out ${i * 0.1}s`,
                    left: "50%",
                    top: "50%"
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-end vlx-slide-up">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="filter">Filter By</Label>
            <Select value={filterBy} onValueChange={handleFilterChange}>
              <SelectTrigger id="filter" aria-label="Filter challenges">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="sort">Sort By</Label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger id="sort" aria-label="Sort challenges">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deadline">Deadline</SelectItem>
                <SelectItem value="Reward">Reward</SelectItem>
                <SelectItem value="Difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 vlx-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button onClick={() => setShowLeaderboard(true)}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
          <Button variant="outline" onClick={() => setShowStreak(true)}>
            <Flame className="mr-2 h-4 w-4" />
            Challenge Streak
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Challenge
          </Button>
          <Button variant="outline" onClick={handleVoiceChallenges}>
            <Mic className="mr-2 h-4 w-4" />
            Voice Challenges
          </Button>
          <Button variant="outline" onClick={handleMentorTips}>
            <Sparkles className="mr-2 h-4 w-4" />
            Mentor Tips
          </Button>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => (
            <Card
              key={challenge.id}
              className={`p-6 hover:shadow-lg transition-all duration-300 vlx-scale-in ${
                challenge.status === "Active" ? "border-primary/40 animate-[pulse_3s_ease-in-out_infinite]" : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <Trophy className="h-12 w-12 text-primary animate-[spin_0.3s_ease-out]" />
                  {challenge.status === "Completed" && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={
                      challenge.difficulty === "Easy" ? "secondary" :
                      challenge.difficulty === "Medium" ? "default" : "destructive"
                    }>
                      {challenge.difficulty}
                    </Badge>
                    {isDeadlineSoon(challenge.deadline) && (
                      <Badge variant="destructive" className="animate-vlx-pulse">
                        <Clock className="mr-1 h-3 w-3" />
                        Ending Soon
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-primary">
                      <Coins className="h-4 w-4" />
                      <span className="font-semibold">{challenge.reward}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{challenge.deadline}</p>
                  </div>

                  {challenge.status === "Active" ? (
                    <Button className="w-full" onClick={() => handleJoinChallenge(challenge.labId)}>
                      Join Challenge
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" onClick={handleClaimReward}>
                      Claim Reward
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard Modal */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-md" aria-describedby="leaderboard-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Challenge Leaderboard
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowLeaderboard(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4" id="leaderboard-description">
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg animate-fade-in" style={{ animationDelay: `${rank * 0.1}s` }}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    rank === 1 ? "bg-yellow-500 text-white" :
                    rank === 2 ? "bg-gray-400 text-white" :
                    rank === 3 ? "bg-orange-600 text-white" : "bg-muted"
                  }`}>
                    {rank}
                  </div>
                  <span className="font-medium">Player {rank}</span>
                </div>
                <span className="font-semibold text-primary">{100 - rank * 10} pts</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Streak Modal */}
      <Dialog open={showStreak} onOpenChange={setShowStreak}>
        <DialogContent className="max-w-md" aria-describedby="streak-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Challenge Streak
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowStreak(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-6 py-4" id="streak-description">
            <div className="text-center">
              <div className="inline-block relative">
                <Flame className="h-24 w-24 text-orange-500 animate-[pulse_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-lg">7</span>
                </div>
              </div>
              <p className="text-lg font-semibold mt-4">Day Streak!</p>
              <p className="text-sm text-muted-foreground">Keep completing challenges daily</p>
            </div>
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

      <style>{`
        @keyframes coin-toss {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LabChallenges;
