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
import { Accessibility } from "lucide-react";

interface AccessibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
}

const AccessibilityModal = ({
  open,
  onOpenChange,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
}: AccessibilityModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-primary" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Customize your workspace for better accessibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Font Size</Label>
              <span className="text-sm font-semibold text-primary">{fontSize}pt</span>
            </div>
            <Slider
              min={14}
              max={20}
              step={1}
              value={[fontSize]}
              onValueChange={(values) => onFontSizeChange(values[0])}
              aria-label="Font size"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller</span>
              <span>Larger</span>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="space-y-0.5">
              <Label>High Contrast Mode</Label>
              <p className="text-xs text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={onHighContrastChange}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p
              className="text-sm transition-all duration-300"
              style={{
                fontSize: `${fontSize}px`,
                filter: highContrast ? "contrast(1.2)" : "none",
              }}
            >
              Preview: This is how your text will appear in the workspace.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityModal;
