import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { getLabById } from "@/data/labs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  RotateCcw,
  Share2,
  Save,
  FileText,
  Mic,
  GraduationCap,
  Trophy,
  TrendingUp,
  Eye,
  EyeOff,
  Accessibility,
  Vibrate,
} from "lucide-react";
import ScoreCard from "@/components/results/ScoreCard";
import Graph from "@/components/results/Graph";
import RobotAssistant from "@/components/results/RobotAssistant";
import FeedbackModal from "@/components/results/FeedbackModal";
import ShareModal from "@/components/results/ShareModal";
import AchievementsModal from "@/components/results/AchievementsModal";
import CompareModal from "@/components/results/CompareModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock result data
interface ResultData {
  id: string;
  labId: string;
  labTitle: string;
  score: number;
  maxScore: number;
  accuracy: number;
  time: number;
  efficiency: number;
  feedback: string;
  improvements: string[];
  strengths: string[];
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: "trophy" | "medal" | "award" | "star";
    earned: boolean;
  }>;
  averageScore: number;
}

const ExperimentResults = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const lab = labId ? getLabById(labId) : null;

  // State
  const [robotState, setRobotState] = useState<
    "idle" | "analyzing" | "celebrate" | "sad" | "stamp" | "point"
  >("analyzing");
  const [showGraph, setShowGraph] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(50);

  // Mock result data
  const [result] = useState<ResultData>({
    id: "result-001",
    labId: labId || "ece-001",
    labTitle: lab?.title || "Circuit Basics",
    score: 85,
    maxScore: 100,
    accuracy: 90,
    time: 88,
    efficiency: 80,
    feedback:
      "Excellent work! Your circuit design was accurate and efficient. Consider optimizing your time management for even better results.",
    improvements: [
      "Reduce experiment completion time by planning steps ahead",
      "Double-check voltage settings before starting measurements",
    ],
    strengths: [
      "Accurate tool selection and placement",
      "Proper parameter configuration throughout experiment",
      "Excellent attention to safety protocols",
    ],
    badges: [
      {
        id: "first-circuit",
        name: "First Circuit",
        description: "Complete your first circuit experiment",
        icon: "trophy",
        earned: true,
      },
      {
        id: "speed-demon",
        name: "Speed Demon",
        description: "Complete an experiment in under 10 minutes",
        icon: "medal",
        earned: false,
      },
      {
        id: "perfectionist",
        name: "Perfectionist",
        description: "Score 100% on any experiment",
        icon: "star",
        earned: false,
      },
      {
        id: "high-scorer",
        name: "High Scorer",
        description: "Score above 80% on an experiment",
        icon: "award",
        earned: true,
      },
    ],
    averageScore: 72,
  });

  // Panel print animation
  const panelSpring = useSpring({
    from: { transform: "translateY(-100%)", opacity: 0 },
    to: { transform: "translateY(0%)", opacity: 1 },
    config: { duration: 500 },
  });

  // Save to localStorage
  useEffect(() => {
    const resultsHistory = JSON.parse(
      localStorage.getItem("vlx-results-history") || "[]"
    );
    resultsHistory.push({
      ...result,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(
      "vlx-results-history",
      JSON.stringify(resultsHistory.slice(-10))
    ); // Keep last 10
  }, [result]);

  // Robot state management
  const handleScoreReveal = () => {
    if (result.score >= 80) {
      setRobotState("celebrate");
      setTimeout(() => setRobotState("idle"), 2000);
    } else if (result.score < 50) {
      setRobotState("sad");
      setTimeout(() => setRobotState("idle"), 2000);
    } else {
      setRobotState("idle");
    }
  };

  const handleRetry = () => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticIntensity);
    }
    
    setRobotState("stamp");
    setTimeout(() => {
      navigate(`/workplace/${labId}`);
    }, 400);
  };

  const handleShare = () => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticIntensity);
    }
    
    setRobotState("stamp");
    setTimeout(() => {
      setShowShare(true);
      setRobotState("idle");
    }, 400);
  };

  const handleSave = () => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticIntensity);
    }
    
    setRobotState("stamp");
    
    toast({
      title: "Results Saved!",
      description: "Your experiment results have been saved to your profile",
    });
    
    setTimeout(() => setRobotState("idle"), 400);
  };

  const handleVoiceFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticIntensity);
    }
    
    toast({
      title: "Coming Soon!",
      description: "Voice feedback will be available in the next update",
    });
  };

  const handleMentorFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticIntensity);
    }
    
    setRobotState("point");
    setShowFeedback(true);
  };

  const handleAchievements = () => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticIntensity);
    }
    
    setRobotState("celebrate");
    setShowAchievements(true);
    setTimeout(() => setRobotState("idle"), 1000);
  };

  const graphData = [
    {
      label: "Accuracy",
      value: result.accuracy,
      maxValue: 100,
      color: "hsl(var(--primary))",
    },
    {
      label: "Time",
      value: result.time,
      maxValue: 100,
      color: "hsl(142, 76%, 36%)",
    },
    {
      label: "Efficiency",
      value: result.efficiency,
      maxValue: 100,
      color: "hsl(262, 83%, 58%)",
    },
  ];

  if (!lab) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Lab not found</p>
          <Button onClick={() => navigate("/branch-selector")}>
            Back to Branch Selector
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background vlx-grid-bg"
      style={{
        fontSize: `${fontSize}px`,
        filter: highContrast ? "contrast(1.2)" : "none",
      }}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container max-w-4xl py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/lab-entrance/${labId}`)}
                aria-label="Back to lab entrance"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {result.labTitle} Results
                </h1>
                <p className="text-xs text-muted-foreground">
                  Experiment Complete
                </p>
              </div>
            </div>

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
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl py-8 px-4">
        {/* Results Panel - Print animation */}
        <animated.div
          style={panelSpring}
          className="bg-card rounded-lg shadow-2xl border-2 border-border overflow-hidden"
        >
          {/* Score Section */}
          <div className="p-8 border-b border-border">
            <ScoreCard
              score={result.score}
              maxScore={result.maxScore}
              onScoreReveal={handleScoreReveal}
            />
          </div>

          {/* Graph Section */}
          <div className="p-8 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Performance Breakdown
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowGraph(!showGraph);
                  if (navigator.vibrate) {
                    navigator.vibrate(hapticIntensity);
                  }
                }}
                className="gap-2"
              >
                {showGraph ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
            </div>
            <Graph data={graphData} visible={showGraph} />
          </div>

          {/* Feedback Preview */}
          <div className="p-8 bg-muted/20">
            <p className="text-sm text-muted-foreground text-center">
              {result.feedback}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-4">
            {/* Primary actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleRetry}
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
              <Button className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>

            {/* Secondary actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleMentorFeedback}
              >
                <FileText className="h-4 w-4" />
                Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleVoiceFeedback}
              >
                <Mic className="h-4 w-4" />
                Voice
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setRobotState("point");
                  toast({
                    title: "AI Mentor",
                    description: "Consider adjusting parameters more gradually next time",
                  });
                  setTimeout(() => setRobotState("idle"), 2000);
                  if (navigator.vibrate) {
                    navigator.vibrate(hapticIntensity);
                  }
                }}
              >
                <GraduationCap className="h-4 w-4" />
                Mentor
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleAchievements}
              >
                <Trophy className="h-4 w-4" />
                Badges
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 sm:col-span-2"
                onClick={() => {
                  setShowCompare(true);
                  if (navigator.vibrate) {
                    navigator.vibrate(hapticIntensity);
                  }
                }}
              >
                <TrendingUp className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>
        </animated.div>
      </main>

      {/* Robot Assistant */}
      <RobotAssistant state={robotState} position="bottom-right" />

      {/* Modals */}
      <FeedbackModal
        open={showFeedback}
        onOpenChange={(open) => {
          setShowFeedback(open);
          if (!open) setRobotState("idle");
        }}
        feedback={result.feedback}
        improvements={result.improvements}
        strengths={result.strengths}
      />

      <ShareModal
        open={showShare}
        onOpenChange={setShowShare}
        labTitle={result.labTitle}
        score={result.score}
      />

      <AchievementsModal
        open={showAchievements}
        onOpenChange={(open) => {
          setShowAchievements(open);
          if (!open) setRobotState("idle");
        }}
        achievements={result.badges}
      />

      <CompareModal
        open={showCompare}
        onOpenChange={setShowCompare}
        userScore={result.score}
        averageScore={result.averageScore}
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
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Font Size</Label>
                <span className="text-sm font-semibold text-primary">
                  {fontSize}pt
                </span>
              </div>
              <Slider
                min={14}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={(values) => setFontSize(values[0])}
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label>High Contrast</Label>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            {/* Haptic Intensity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Vibrate className="h-4 w-4" />
                  Haptic Feedback
                </Label>
                <span className="text-sm font-semibold text-primary">
                  {hapticIntensity === 0
                    ? "Off"
                    : hapticIntensity < 50
                    ? "Low"
                    : "High"}
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={50}
                value={[hapticIntensity]}
                onValueChange={(values) => setHapticIntensity(values[0])}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperimentResults;
