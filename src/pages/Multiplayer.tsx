import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, Globe, Lock, Plus, Search, Share2, Mic, Sparkles, Settings, RefreshCw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  teamName: string;
  labId: string;
  labTitle: string;
  members: number;
  maxMembers: number;
  isActive: boolean;
}

const mockSessions: Session[] = [
  { id: "sess-001", teamName: "Circuit Masters", labId: "ece-001", labTitle: "Circuit Basics", members: 3, maxMembers: 4, isActive: true },
  { id: "sess-002", teamName: "Mechanics Crew", labId: "mech-002", labTitle: "Mechanics Lab", members: 2, maxMembers: 4, isActive: true },
  { id: "sess-003", teamName: "Chem Squad", labId: "chem-003", labTitle: "Chemical Reactions", members: 4, maxMembers: 4, isActive: false },
  { id: "sess-004", teamName: "Logic Masters", labId: "ece-004", labTitle: "Digital Logic", members: 1, maxMembers: 3, isActive: true },
  { id: "sess-005", teamName: "Structure Team", labId: "civil-005", labTitle: "Structural Analysis", members: 3, maxMembers: 5, isActive: true },
];

const Multiplayer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);
  const [robotState, setRobotState] = useState<"idle" | "connecting" | "scanning">("idle");

  const filteredSessions = sessions.filter(s =>
    s.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.labTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerHaptic = () => {
    if (navigator.vibrate && hapticIntensity > 0) {
      navigator.vibrate([50 * hapticIntensity]);
    }
  };

  const handleJoinSession = (labId: string) => {
    triggerHaptic();
    setRobotState("connecting");
    toast({ title: "Joining Session...", description: "Connecting to team" });
    setTimeout(() => {
      setRobotState("idle");
      navigate(`/lab-entrance/${labId}`);
    }, 800);
  };

  const handleCreateSession = () => {
    triggerHaptic();
    toast({ title: "Create Session", description: "Team creation coming soon!" });
  };

  const handleRefresh = () => {
    triggerHaptic();
    setRobotState("scanning");
    toast({ title: "Refreshing...", description: "Loading latest sessions" });
    setTimeout(() => setRobotState("idle"), 1000);
  };

  const handleShare = () => {
    triggerHaptic();
    toast({ title: "Session Shared!", description: "Invite link copied" });
  };

  const handleVoiceChat = () => {
    triggerHaptic();
    toast({ title: "Voice Chat", description: "Voice chat coming soon!" });
  };

  const handleMentorMatch = () => {
    triggerHaptic();
    toast({ title: "Mentor Match", description: "Finding best team match..." });
  };

  return (
    <div className="min-h-screen bg-background relative" style={{ fontSize: `${fontSize}px` }}>
      <div className="container max-w-6xl py-8 px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2 vlx-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold relative inline-block">
              Multiplayer Hub
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-[scale-in_0.3s_ease-out]" />
            </h1>
            <Button variant="ghost" size="icon" onClick={() => setShowAccessibility(true)} aria-label="Accessibility settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">Collaborate with peers in lab experiments</p>
        </div>

        {/* Robot Assistant */}
        <div className={`fixed bottom-24 right-4 z-40 transition-transform duration-300 ${robotState === "connecting" ? "animate-vlx-bounce" : ""}`}>
          <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center`}>
            <Users className={`h-6 w-6 text-primary ${robotState === "scanning" ? "animate-vlx-spin" : ""}`} />
          </div>
          {robotState === "connecting" && (
            <svg className="absolute -left-2 top-1/2 -translate-y-1/2 w-16 h-0.5" style={{ animation: "network-line 0.4s ease-out" }}>
              <line x1="0" y1="0" x2="64" y2="0" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" />
            </svg>
          )}
        </div>

        {/* Search */}
        <div className="relative vlx-slide-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams or labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search sessions"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 vlx-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button onClick={handleCreateSession}>
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Sessions
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Session
          </Button>
          <Button variant="outline" onClick={handleVoiceChat}>
            <Mic className="mr-2 h-4 w-4" />
            Voice Chat
          </Button>
          <Button variant="outline" onClick={handleMentorMatch}>
            <Sparkles className="mr-2 h-4 w-4" />
            Mentor Match
          </Button>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 vlx-fade-in">
            <div className="mb-6">
              <div className="inline-block w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center animate-vlx-bounce">
                <Users className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Start a Team</h3>
            <p className="text-muted-foreground mb-6">Create a session and invite others</p>
            <Button onClick={handleCreateSession}>Create Session</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSessions.map((session, index) => (
              <Card
                key={session.id}
                className={`p-6 hover:shadow-lg transition-all duration-300 vlx-slide-left ${
                  session.isActive ? "border-primary/40 animate-[pulse_3s_ease-in-out_infinite]" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{session.teamName}</h3>
                      <p className="text-sm text-muted-foreground">{session.labTitle}</p>
                    </div>
                    {session.isActive && (
                      <Badge className="bg-green-500">Active</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {session.members}/{session.maxMembers} members
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    disabled={session.members >= session.maxMembers}
                    onClick={() => handleJoinSession(session.labId)}
                  >
                    {session.members >= session.maxMembers ? "Session Full" : "Join Session"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

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
        @keyframes network-line {
          0% {
            stroke-dashoffset: 64;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Multiplayer;
