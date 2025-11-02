import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  hapticIntensity: number;
  onHapticIntensityChange: (intensity: number) => void;
}

const AccessibilityModal = ({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
  hapticIntensity,
  onHapticIntensityChange,
}: AccessibilityModalProps) => {
  const hapticLabels = ["Off", "Low", "High"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
          <DialogDescription>
            Customize your lab experience for better accessibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">Font Size</Label>
              <span className="text-sm text-muted-foreground">{fontSize}pt</span>
            </div>
            <Slider
              id="font-size"
              value={[fontSize]}
              onValueChange={(values) => onFontSizeChange(values[0])}
              min={14}
              max={20}
              step={1}
              aria-label="Adjust font size"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex flex-col gap-1">
              <span>High Contrast Mode</span>
              <span className="text-xs text-muted-foreground font-normal">
                Increase text contrast for better visibility
              </span>
            </Label>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={onHighContrastChange}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Haptic Intensity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="haptic">Haptic Feedback</Label>
              <span className="text-sm text-muted-foreground">
                {hapticLabels[hapticIntensity]}
              </span>
            </div>
            <Slider
              id="haptic"
              value={[hapticIntensity]}
              onValueChange={(values) => onHapticIntensityChange(values[0])}
              min={0}
              max={2}
              step={1}
              aria-label="Adjust haptic intensity"
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
