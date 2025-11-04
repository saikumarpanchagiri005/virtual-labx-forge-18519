import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Accessibility } from "lucide-react";

interface AccessibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessibilityModal = ({ open, onOpenChange }: AccessibilityModalProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("economy-fontSize");
    const savedContrast = localStorage.getItem("economy-highContrast");
    const savedHaptic = localStorage.getItem("economy-hapticIntensity");

    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedContrast) setHighContrast(savedContrast === "true");
    if (savedHaptic) setHapticIntensity(Number(savedHaptic));
  }, []);

  const applySettings = () => {
    localStorage.setItem("economy-fontSize", fontSize.toString());
    localStorage.setItem("economy-highContrast", highContrast.toString());
    localStorage.setItem("economy-hapticIntensity", hapticIntensity.toString());

    document.documentElement.style.fontSize = `${fontSize}px`;
    
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    if (navigator.vibrate) {
      navigator.vibrate([50 * hapticIntensity]);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Customize your experience for better accessibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size: {fontSize}pt</Label>
            <Slider
              id="font-size"
              min={14}
              max={20}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast Mode</Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="haptic">
              Haptic Intensity: {hapticIntensity === 0 ? "Off" : hapticIntensity === 1 ? "Low" : "High"}
            </Label>
            <Slider
              id="haptic"
              min={0}
              max={2}
              step={1}
              value={[hapticIntensity]}
              onValueChange={(value) => setHapticIntensity(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <Button onClick={applySettings} className="w-full">
          Apply Settings
        </Button>
      </DialogContent>
    </Dialog>
  );
};
