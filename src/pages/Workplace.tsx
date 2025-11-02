import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabById } from "@/data/labs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Accessibility,
  Users,
  Mic,
  FileDown,
  Cat,
  GraduationCap,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  Scroll,
} from "lucide-react";
import ToolBar from "@/components/workplace/ToolBar";
import Canvas from "@/components/workplace/Canvas";
import AssistantPanel from "@/components/workplace/AssistantPanel";
import AccessibilityModal from "@/components/workplace/AccessibilityModal";
import MentorModal from "@/components/workplace/MentorModal";

interface ExperimentData {
  id: string;
  title: string;
  progress: number;
  parameters: Array<{ name: string; min: number; max: number; value: number }>;
}

const Workplace = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const lab = labId ? getLabById(labId) : null;

  // State management
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [robotState, setRobotState] = useState<"idle" | "helping" | "analyzing" | "cleanup" | "celebrate">("idle");
  const [sustainabilityEnabled, setSustainabilityEnabled] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [showQuickTip, setShowQuickTip] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  // Mock experiment data
  const [experiment, setExperiment] = useState<ExperimentData>({
    id: labId || "ece-001",
    title: lab?.title || "Circuit Basics",
    progress: 0,
    parameters: [
      { name: "Voltage", min: 5, max: 50, value: 10 },
      { name: "Current", min: 1, max: 20, value: 5 },
    ],
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`workplace-${labId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedTools(data.selectedTools || []);
      setExperiment(prev => ({ ...prev, ...data.experiment }));
      setSustainabilityEnabled(data.sustainabilityEnabled || false);
    }
  }, [labId]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`workplace-${labId}`, JSON.stringify({
      selectedTools,
      experiment,
      sustainabilityEnabled,
    }));
  }, [selectedTools, experiment, sustainabilityEnabled, labId]);

  // Boot sequence
  useEffect(() => {
    setTimeout(() => setIsBooting(false), 2000);
  }, []);

  // Progress calculation
  useEffect(() => {
    const calculatedProgress = Math.min(
      (selectedTools.length / 5) * 50 + 
      (experiment.parameters.reduce((sum, p) => sum + (p.value - p.min) / (p.max - p.min), 0) / experiment.parameters.length) * 50,
      100
    );
    setExperiment(prev => ({ ...prev, progress: Math.round(calculatedProgress) }));
  }, [selectedTools, experiment.parameters]);

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

  const handleToolAdd = (toolId: string) => {
    if (!selectedTools.includes(toolId)) {
      setSelectedTools(prev => [...prev, toolId]);
      setRobotState("helping");
      setTimeout(() => setRobotState("idle"), 800);
    }
  };

  const handleParameterChange = (index: number, value: number) => {
    setExperiment(prev => ({
      ...prev,
      parameters: prev.parameters.map((p, i) => 
        i === index ? { ...p, value } : p
      ),
    }));
    setRobotState("analyzing");
    setTimeout(() => setRobotState("idle"), 1000);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast({
      title: isPaused ? "Resumed" : "Paused",
      description: isPaused ? "Experiment resumed" : "Experiment paused",
    });
  };

  const handleRewind = () => {
    setSelectedTools([]);
    setExperiment(prev => ({
      ...prev,
      progress: 0,
      parameters: prev.parameters.map(p => ({ ...p, value: p.min })),
    }));
    setRobotState("cleanup");
    setTimeout(() => setRobotState("idle"), 1200);
    
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    
    toast({
      title: "Reset",
      description: "Experiment reset to start",
    });
  };

  const handleExport = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast({
      title: "Exported!",
      description: "Experiment state saved as PDF",
    });
  };

  const handleMultiplayerInvite = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast({
      title: "Coming Soon!",
      description: "Multiplayer invites will be available in the next update",
    });
  };

  const handleVoiceCommand = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast({
      title: "Voice Commands",
      description: "Voice control coming soon! Use manual input for now",
    });
  };

  const handlePetEquip = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    setRobotState("celebrate");
    setTimeout(() => setRobotState("idle"), 1000);
    toast({
      title: "Lab Pet Activated! 🐱",
      description: "Your virtual cat is now assisting",
    });
  };

  const handleSustainabilityToggle = () => {
    setSustainabilityEnabled(!sustainabilityEnabled);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleComplete = () => {
    if (experiment.progress >= 80) {
      setRobotState("celebrate");
      
      toast({
        title: "Experiment Complete! 🎉",
        description: "Great work! Viewing your results...",
      });
      
      setTimeout(() => {
        navigate(`/results/${labId}`);
      }, 1500);
    } else {
      toast({
        title: "Not Ready",
        description: "Add more tools and adjust parameters to complete",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        fontSize: `${fontSize}px`,
        filter: highContrast ? "contrast(1.2)" : "none",
      }}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container max-w-7xl py-3 px-4">
          <div className="flex items-center justify-between gap-4">
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
                  {experiment.title} Workspace
                </h1>
                <p className="text-xs text-muted-foreground">{lab.branchId.toUpperCase()}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuickTip(true)}
                aria-label="Quick tip"
                title="Quick Tip"
              >
                <Scroll className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAccessibility(true)}
                aria-label="Accessibility settings"
                title="Accessibility"
              >
                <Accessibility className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-primary">{experiment.progress}%</span>
            </div>
            <Progress value={experiment.progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Workspace - Split Layout */}
      <main className="container max-w-7xl p-4">
        <div className="flex gap-4 h-[calc(100vh-220px)]">
          {/* Left: Toolbar (20%) */}
          <div className="w-[20%] min-w-[200px]">
            <ToolBar
              onToolDrag={handleToolAdd}
              selectedTools={selectedTools}
            />
          </div>

          {/* Center: Canvas (60%) */}
          <div className="flex-1">
            <Canvas
              selectedTools={selectedTools}
              onToolAdd={handleToolAdd}
              isBooting={isBooting}
            />
          </div>

          {/* Right: Assistant Panel (20%) */}
          <div className="w-[20%] min-w-[200px]">
            <AssistantPanel
              parameters={experiment.parameters}
              onParameterChange={handleParameterChange}
              sustainabilityEnabled={sustainabilityEnabled}
              onSustainabilityToggle={handleSustainabilityToggle}
              robotState={robotState}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePauseToggle}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRewind}
              aria-label="Rewind"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMultiplayerInvite}
              title="Multiplayer Invite"
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceCommand}
              title="Voice Commands"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              title="Export"
            >
              <FileDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePetEquip}
              title="Lab Pet"
            >
              <Cat className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMentor(true)}
              title="AI Mentor"
            >
              <GraduationCap className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="sm"
            onClick={handleComplete}
            className="gap-2"
            disabled={experiment.progress < 80}
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </Button>
        </div>
      </main>

      {/* Modals */}
      <AccessibilityModal
        open={showAccessibility}
        onOpenChange={setShowAccessibility}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        highContrast={highContrast}
        onHighContrastChange={setHighContrast}
      />

      <MentorModal
        open={showMentor}
        onOpenChange={setShowMentor}
      />

      {/* Quick Tip Scroll */}
      {showQuickTip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur"
          onClick={() => setShowQuickTip(false)}
        >
          <div
            className="bg-card p-6 rounded-lg border-2 border-primary shadow-2xl max-w-md animate-vlx-scale"
            onClick={e => e.stopPropagation()}
            style={{
              animation: "vlx-scroll-unfurl 0.4s ease-out",
              boxShadow: "0 0 30px hsl(var(--primary) / 0.3), 0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">📜</div>
              <h3 className="text-lg font-bold text-foreground">Quick Tip</h3>
              <p className="text-sm text-muted-foreground">
                Use low voltage settings first to avoid damaging components. Gradually increase values while monitoring feedback.
              </p>
              <Button onClick={() => setShowQuickTip(false)} className="w-full">
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add scroll unfurl animation
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-scroll-unfurl {
    0% {
      transform: scaleY(0) rotateX(90deg);
      opacity: 0;
    }
    100% {
      transform: scaleY(1) rotateX(0deg);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default Workplace;
