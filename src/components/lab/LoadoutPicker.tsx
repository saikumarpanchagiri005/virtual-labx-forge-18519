import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Beaker, Wrench, Microscope, Calculator, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const availableTools: Tool[] = [
  { id: "voltmeter", name: "Voltmeter", icon: <Zap className="h-5 w-5" /> },
  { id: "beaker", name: "Beaker", icon: <Beaker className="h-5 w-5" /> },
  { id: "wrench", name: "Wrench", icon: <Wrench className="h-5 w-5" /> },
  { id: "microscope", name: "Microscope", icon: <Microscope className="h-5 w-5" /> },
  { id: "calculator", name: "Calculator", icon: <Calculator className="h-5 w-5" /> },
  { id: "flask", name: "Flask", icon: <FlaskConical className="h-5 w-5" /> },
];

interface LoadoutPickerProps {
  selectedTools: string[];
  onChange: (tools: string[]) => void;
  maxTools?: number;
}

const LoadoutPicker = ({ selectedTools, onChange, maxTools = 3 }: LoadoutPickerProps) => {
  const [animatingTools, setAnimatingTools] = useState<Set<string>>(new Set());

  const handleToggleTool = (toolId: string) => {
    if ('vibrate' in navigator) navigator.vibrate(50);
    
    if (selectedTools.includes(toolId)) {
      onChange(selectedTools.filter((id) => id !== toolId));
    } else if (selectedTools.length < maxTools) {
      // Animate tool addition
      setAnimatingTools(new Set([...animatingTools, toolId]));
      onChange([...selectedTools, toolId]);
      setTimeout(() => {
        setAnimatingTools((prev) => {
          const next = new Set(prev);
          next.delete(toolId);
          return next;
        });
      }, 500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Tool Loadout
        </label>
        <Badge variant="secondary">
          {selectedTools.length} / {maxTools}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {availableTools.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          const isAnimating = animatingTools.has(tool.id);
          const isDisabled = !isSelected && selectedTools.length >= maxTools;

          return (
            <Card
              key={tool.id}
              className={cn(
                "p-3 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200",
                "hover:shadow-md hover:scale-105",
                isSelected && "bg-primary/10 border-primary ring-2 ring-primary",
                isDisabled && "opacity-50 cursor-not-allowed hover:scale-100",
                isAnimating && "animate-vlx-bounce"
              )}
              onClick={() => !isDisabled && handleToggleTool(tool.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && !isDisabled && handleToggleTool(tool.id)}
              aria-label={`${tool.name} - ${isSelected ? "selected" : "not selected"}`}
              aria-pressed={isSelected}
            >
              <div className={cn(
                "transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {tool.icon}
              </div>
              <span className="text-xs font-medium text-center">{tool.name}</span>
              
              {/* Spark particle effect on selection */}
              {isAnimating && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-primary rounded-full opacity-0 animate-vlx-particle"
                      style={{
                        top: "50%",
                        left: "50%",
                        "--x-start": `${Math.cos((i * Math.PI) / 2) * 30}px`,
                        "--y-start": `${Math.sin((i * Math.PI) / 2) * 30}px`,
                        animationDelay: `${i * 0.05}s`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Select up to {maxTools} tools for your experiment
      </p>
    </div>
  );
};

export default LoadoutPicker;
