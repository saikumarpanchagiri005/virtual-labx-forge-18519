import { useState, useEffect } from "react";
import { Sparkles, Settings, HelpCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AssistantPanelProps {
  parameters: Array<{ name: string; min: number; max: number; value: number }>;
  onParameterChange: (index: number, value: number) => void;
  sustainabilityEnabled: boolean;
  onSustainabilityToggle: () => void;
  robotState: "idle" | "helping" | "analyzing" | "cleanup" | "celebrate";
}

const AssistantPanel = ({
  parameters,
  onParameterChange,
  sustainabilityEnabled,
  onSustainabilityToggle,
  robotState,
}: AssistantPanelProps) => {
  const [rippleIndex, setRippleIndex] = useState<number | null>(null);

  const handleSliderChange = (index: number, values: number[]) => {
    onParameterChange(index, values[0]);
    setRippleIndex(index);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    setTimeout(() => setRippleIndex(null), 300);
  };

  return (
    <div className="h-full bg-card border-l border-border shadow-lg overflow-hidden flex flex-col">
      {/* Robot Assistant */}
      <div className="p-4 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-3">
          <div className="relative">
            {/* Robot silhouette */}
            <div className={`
              w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 
              border-2 border-primary flex items-center justify-center
              transition-transform duration-300
              ${robotState === "helping" ? "scale-110" : ""}
              ${robotState === "celebrate" ? "animate-vlx-bounce" : ""}
            `}>
              <Sparkles className={`
                h-6 w-6 text-primary
                ${robotState === "analyzing" ? "animate-vlx-spin" : ""}
              `} />
            </div>
            
            {/* Mechanical arm animation */}
            {robotState === "helping" && (
              <div
                className="absolute -right-8 top-4 w-16 h-0.5 bg-primary origin-left"
                style={{
                  animation: "vlx-arm-extend 0.4s ease-out",
                }}
              />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              Lab Assistant
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {robotState === "idle" && "Ready to assist"}
              {robotState === "helping" && "Helping you..."}
              {robotState === "analyzing" && "Analyzing..."}
              {robotState === "cleanup" && "Cleaning up..."}
              {robotState === "celebrate" && "Great work!"}
            </p>
          </div>
        </div>
      </div>

      {/* Parameters Section */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Parameters</h3>
          </div>
          
          {parameters.map((param, index) => (
            <div key={index} className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">{param.name}</Label>
                <span className="text-xs font-semibold text-primary">
                  {param.value}{param.name.includes("Voltage") ? "V" : ""}
                </span>
              </div>
              
              <div className="relative">
                <Slider
                  min={param.min}
                  max={param.max}
                  step={1}
                  value={[param.value]}
                  onValueChange={(values) => handleSliderChange(index, values)}
                  className="cursor-pointer"
                  aria-label={param.name}
                />
                
                {/* Ripple effect */}
                {rippleIndex === index && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                          animation: `vlx-ripple 0.6s ease-out ${i * 0.1}s`,
                        }}
                      >
                        <div className="w-8 h-8 rounded-full border-2 border-primary" />
                      </div>
                    ))}
                  </>
                )}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{param.min}</span>
                <span>{param.max}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sustainability Toggle */}
        <div className="p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-lg">🌱</div>
              <div>
                <Label className="text-xs font-medium">Eco Mode</Label>
                <p className="text-xs text-muted-foreground">Low energy</p>
              </div>
            </div>
            <Switch
              checked={sustainabilityEnabled}
              onCheckedChange={onSustainabilityToggle}
              aria-label="Toggle sustainability mode"
            />
          </div>
          
          {sustainabilityEnabled && (
            <div className="mt-2 p-2 bg-green-500/10 rounded border border-green-500/30 animate-vlx-scale">
              <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-vlx-pulse" />
                Energy saving active
              </p>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">Quick Tip</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start with low values and gradually increase for best results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add ripple and arm extend animations
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-ripple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(3);
      opacity: 0;
    }
  }
  
  @keyframes vlx-arm-extend {
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
`;
document.head.appendChild(style);

export default AssistantPanel;
