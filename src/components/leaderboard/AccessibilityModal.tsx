import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface AccessibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccessibilityModal = ({ open, onOpenChange }: AccessibilityModalProps) => {
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("leaderboard-font-size") || "14")
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("leaderboard-high-contrast") === "true"
  );
  const [hapticIntensity, setHapticIntensity] = useState(
    parseInt(localStorage.getItem("leaderboard-haptic") || "50")
  );

  useEffect(() => {
    localStorage.setItem("leaderboard-font-size", fontSize.toString());
    document.documentElement.style.setProperty("--leaderboard-font-size", `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("leaderboard-high-contrast", highContrast.toString());
    if (highContrast) {
      document.documentElement.classList.add("leaderboard-high-contrast");
    } else {
      document.documentElement.classList.remove("leaderboard-high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("leaderboard-haptic", hapticIntensity.toString());
  }, [hapticIntensity]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Customize your leaderboard experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Font Size</Label>
              <span className="text-xs font-semibold text-primary">{fontSize}pt</span>
            </div>
            <Slider
              min={14}
              max={20}
              step={1}
              value={[fontSize]}
              onValueChange={(values) => setFontSize(values[0])}
              className="cursor-pointer"
              aria-label="Font size slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>14pt</span>
              <span>20pt</span>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
            <div>
              <Label className="text-sm font-medium">High Contrast Mode</Label>
              <p className="text-xs text-muted-foreground">Enhance text visibility</p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Haptic Intensity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Haptic Feedback</Label>
              <span className="text-xs font-semibold text-primary">
                {hapticIntensity === 0 ? "Off" : hapticIntensity < 50 ? "Low" : "High"}
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={50}
              value={[hapticIntensity]}
              onValueChange={(values) => setHapticIntensity(values[0])}
              className="cursor-pointer"
              aria-label="Haptic intensity slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Off</span>
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityModal;
