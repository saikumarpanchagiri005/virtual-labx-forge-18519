import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabById } from "@/data/labs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Accessibility,
  Mic,
  Lightbulb,
  Users,
  Leaf,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import ModeSelector from "@/components/lab/ModeSelector";
import DifficultySlider from "@/components/lab/DifficultySlider";
import LoadoutPicker from "@/components/lab/LoadoutPicker";
import AccessibilityModal from "@/components/lab/AccessibilityModal";
import MentorHintsModal from "@/components/lab/MentorHintsModal";
import { cn } from "@/lib/utils";

const LabEntrance = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const lab = labId ? getLabById(labId) : null;

  // Configuration state
  const [mode, setMode] = useState<"solo" | "team" | "">("");
  const [difficulty, setDifficulty] = useState(0);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [skipTutorial, setSkipTutorial] = useState(false);
  const [sustainabilityMode, setSustainabilityMode] = useState(false);
  
  // Accessibility state
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1); // 0=off, 1=low, 2=high
  
  // Modals state
  const [mentorHintsOpen, setMentorHintsOpen] = useState(false);
  
  // Animation state
  const [portalActivated, setPortalActivated] = useState(false);
  const [scientistAction, setScientistAction] = useState<"idle" | "wrench" | "headset" | "dial" | "leaf" | "salute">("idle");
  const [isEntering, setIsEntering] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Load saved preferences
  useEffect(() => {
    if (labId) {
      const saved = localStorage.getItem(`lab-entrance-${labId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setMode(data.mode || "");
        setDifficulty(data.difficulty || 0);
        setSelectedTools(data.tools || []);
        setSkipTutorial(data.skipTutorial || false);
        setSustainabilityMode(data.sustainability || false);
      }

      const accessibilityData = localStorage.getItem("accessibility-settings");
      if (accessibilityData) {
        const settings = JSON.parse(accessibilityData);
        setFontSize(settings.fontSize || 16);
        setHighContrast(settings.highContrast || false);
        setHapticIntensity(settings.hapticIntensity ?? 1);
      }
    }

    // Activate portal animation on load
    setTimeout(() => setPortalActivated(true), 100);
  }, [labId]);

  // Save preferences
  useEffect(() => {
    if (labId && mode) {
      localStorage.setItem(
        `lab-entrance-${labId}`,
        JSON.stringify({
          mode,
          difficulty,
          tools: selectedTools,
          skipTutorial,
          sustainability: sustainabilityMode,
        })
      );
    }
  }, [labId, mode, difficulty, selectedTools, skipTutorial, sustainabilityMode]);

  // Save accessibility settings
  useEffect(() => {
    localStorage.setItem(
      "accessibility-settings",
      JSON.stringify({ fontSize, highContrast, hapticIntensity })
    );
  }, [fontSize, highContrast, hapticIntensity]);

  // Scientist reactions
  useEffect(() => {
    if (mode === "solo") {
      setScientistAction("wrench");
      setTimeout(() => setScientistAction("idle"), 1000);
    } else if (mode === "team") {
      setScientistAction("headset");
      setTimeout(() => setScientistAction("idle"), 1000);
    }
  }, [mode]);

  useEffect(() => {
    if (difficulty > 0) {
      setScientistAction("dial");
      setTimeout(() => setScientistAction("idle"), 800);
    }
  }, [difficulty]);

  useEffect(() => {
    if (sustainabilityMode) {
      setScientistAction("leaf");
      setTimeout(() => setScientistAction("idle"), 800);
    }
  }, [sustainabilityMode]);

  const triggerHaptic = (intensity: number = hapticIntensity) => {
    if ('vibrate' in navigator && intensity > 0) {
      const duration = intensity === 1 ? 50 : 100;
      navigator.vibrate(duration);
    }
  };

  const handleModeChange = (newMode: "solo" | "team") => {
    triggerHaptic();
    setMode(newMode);
  };

  const handleDifficultyChange = (value: number) => {
    triggerHaptic();
    setDifficulty(value);
  };

  const handleToolsChange = (tools: string[]) => {
    setSelectedTools(tools);
  };

  const handleVoiceConfirm = () => {
    triggerHaptic();
    toast.info("Voice confirmation coming soon!");
  };

  const handleMentorHints = () => {
    triggerHaptic();
    setScientistAction("idle");
    setMentorHintsOpen(true);
  };

  const handleGuildInvite = () => {
    triggerHaptic();
    toast.info("Guild invites coming soon!");
  };

  const handleEnterLab = () => {
    // Validate required fields
    if (!mode) {
      setShowValidation(true);
      setScientistAction("idle");
      setTimeout(() => {
        setScientistAction("idle");
        setShowValidation(false);
      }, 2000);
      toast.error("Please select a lab mode");
      return;
    }

    triggerHaptic(2);
    setScientistAction("salute");
    setIsEntering(true);

    setTimeout(() => {
      navigate(`/workplace/${labId}`);
    }, 800);
  };

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

  const hasPrerequisites = lab.prerequisites.length > 0;

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Faint door outline background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect x="150" y="50" width="100" height="200" fill="none" stroke="currentColor" strokeWidth="2" rx="10"/>
        <circle cx="170" cy="150" r="3" fill="currentColor"/>
      </svg>

      <div className="container max-w-4xl py-8 px-4 space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between vlx-fade-in">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/lab-list/${lab.branchId}`)}
              aria-label="Back to lab list"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{lab.title} Setup</h1>
              <p className="text-sm text-muted-foreground">Configure your lab session</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAccessibilityOpen(true)}
            aria-label="Accessibility settings"
          >
            <Accessibility className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Portal Panel */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Configuration Panel */}
          <Card
            className={cn(
              "flex-1 p-6 space-y-6 relative overflow-hidden transition-all duration-500",
              portalActivated && "vlx-slide-up",
              isEntering && "scale-150 opacity-0",
              highContrast && "bg-background text-foreground border-2"
            )}
          >
            {/* Portal ripple effect */}
            {portalActivated && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
                <div className="absolute inset-0 bg-primary/3 rounded-full animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
              </div>
            )}

            {/* Lab Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{lab.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{lab.description}</p>
                </div>
                <Badge variant="secondary" className="capitalize flex-shrink-0">
                  {lab.difficulty}
                </Badge>
              </div>

              {/* Prerequisites warning */}
              {hasPrerequisites && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive animate-pulse">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Prerequisites required: {lab.prerequisites.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Mode Selector */}
            <div className={cn(showValidation && !mode && "ring-2 ring-destructive rounded-lg p-2 animate-pulse")}>
              <ModeSelector value={mode} onChange={handleModeChange} />
            </div>

            {/* Difficulty Slider */}
            <DifficultySlider value={difficulty} onChange={handleDifficultyChange} />

            {/* Loadout Picker */}
            <LoadoutPicker
              selectedTools={selectedTools}
              onChange={handleToolsChange}
              maxTools={3}
            />

            {/* Additional Options */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="tutorial-skip"
                    checked={skipTutorial}
                    onCheckedChange={(checked) => setSkipTutorial(checked as boolean)}
                  />
                  <Label htmlFor="tutorial-skip" className="text-sm cursor-pointer">
                    Skip tutorial overlay
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sustainability"
                    checked={sustainabilityMode}
                    onCheckedChange={(checked) => setSustainabilityMode(checked as boolean)}
                  />
                  <Label htmlFor="sustainability" className="text-sm cursor-pointer flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Sustainability mode
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceConfirm}
                className="w-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMentorHints}
                className="w-full"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Mentor Hints
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGuildInvite}
                className="col-span-2"
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Guild Members
              </Button>
            </div>

            {/* Enter Lab Button */}
            <Button
              size="lg"
              className="w-full text-lg"
              onClick={handleEnterLab}
              disabled={isEntering}
            >
              Enter Lab
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </Card>

          {/* Scientist Silhouette */}
          <div className="hidden lg:flex flex-col items-center gap-4">
            <div className="relative">
              <svg
                width="120"
                height="200"
                viewBox="0 0 120 200"
                className="opacity-70 transition-all duration-300"
              >
                {/* Head */}
                <ellipse cx="60" cy="30" rx="15" ry="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                
                {/* Lab coat body */}
                <path
                  d="M 45 48 L 45 120 L 40 125 L 40 145 M 75 48 L 75 120 L 80 125 L 80 145"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect x="45" y="48" width="30" height="72" fill="none" stroke="currentColor" strokeWidth="2"/>
                
                {/* Arms */}
                <g className={cn("transition-all duration-300", scientistAction === "wrench" && "translate-x-2")}>
                  <line x1="45" y1="60" x2="25" y2="80" stroke="currentColor" strokeWidth="2"/>
                  {scientistAction === "wrench" && (
                    <path d="M 20 80 L 25 85 L 20 90" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"/>
                  )}
                </g>
                
                <g className={cn("transition-all duration-300", scientistAction === "headset" && "-translate-x-2")}>
                  <line x1="75" y1="60" x2="95" y2="80" stroke="currentColor" strokeWidth="2"/>
                  {scientistAction === "headset" && (
                    <>
                      <circle cx="55" cy="28" r="4" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
                      <circle cx="65" cy="28" r="4" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
                      <path d="M 55 24 Q 60 20 65 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
                    </>
                  )}
                </g>
                
                {/* Legs */}
                <line x1="52" y1="120" x2="48" y2="160" stroke="currentColor" strokeWidth="2"/>
                <line x1="68" y1="120" x2="72" y2="160" stroke="currentColor" strokeWidth="2"/>
                
                {/* Control dial */}
                {scientistAction === "dial" && (
                  <g className="animate-vlx-spin origin-center">
                    <circle cx="100" cy="70" r="8" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"/>
                    <line x1="100" y1="70" x2="106" y2="70" stroke="hsl(var(--primary))" strokeWidth="2"/>
                  </g>
                )}
                
                {/* Leaf icon */}
                {scientistAction === "leaf" && (
                  <path
                    d="M 100 90 Q 110 85 105 95 Q 100 100 95 95 Q 90 90 100 90"
                    fill="none"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth="2"
                    className="animate-vlx-bounce"
                  />
                )}
                
                {/* Salute */}
                {scientistAction === "salute" && (
                  <line x1="75" y1="60" x2="70" y2="25" stroke="currentColor" strokeWidth="2" className="animate-vlx-fade-in"/>
                )}
              </svg>
              
              <p className="text-xs text-center text-muted-foreground mt-2">Lab Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AccessibilityModal
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        highContrast={highContrast}
        onHighContrastChange={setHighContrast}
        hapticIntensity={hapticIntensity}
        onHapticIntensityChange={setHapticIntensity}
      />

      <MentorHintsModal
        isOpen={mentorHintsOpen}
        onClose={() => setMentorHintsOpen(false)}
        labTitle={lab.title}
      />
    </div>
  );
};

export default LabEntrance;
