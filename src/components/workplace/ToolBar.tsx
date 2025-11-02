import { useState, useEffect } from "react";
import { Wrench, Zap, Gauge, Thermometer, Beaker } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const tools: Tool[] = [
  { id: "voltmeter", name: "Voltmeter", icon: Zap, color: "#FFD700" },
  { id: "resistor", name: "Resistor", icon: Gauge, color: "#FF6B6B" },
  { id: "thermometer", name: "Thermometer", icon: Thermometer, color: "#4ECDC4" },
  { id: "wrench", name: "Wrench", icon: Wrench, color: "#95A5A6" },
  { id: "beaker", name: "Beaker", icon: Beaker, color: "#9B59B6" },
];

interface ToolBarProps {
  onToolDrag: (toolId: string) => void;
  selectedTools: string[];
}

const ToolBar = ({ onToolDrag, selectedTools }: ToolBarProps) => {
  const { toast } = useToast();
  const [animateIn, setAnimateIn] = useState(false);
  const [draggedTool, setDraggedTool] = useState<string | null>(null);

  useEffect(() => {
    // Particle assembly animation on mount
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleDragStart = (e: React.DragEvent, toolId: string) => {
    e.dataTransfer.setData("toolId", toolId);
    setDraggedTool(toolId);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    toast({
      title: "Tool selected",
      description: `Drag ${tools.find(t => t.id === toolId)?.name} to canvas`,
      duration: 2000,
    });
  };

  const handleDragEnd = () => {
    setDraggedTool(null);
  };

  return (
    <div className="h-full bg-card border-r border-border shadow-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" />
          Lab Tools
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Drag to canvas</p>
      </div>
      
      <div className="p-4 space-y-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          const isSelected = selectedTools.includes(tool.id);
          const isDragging = draggedTool === tool.id;
          
          return (
            <div
              key={tool.id}
              draggable
              onDragStart={(e) => handleDragStart(e, tool.id)}
              onDragEnd={handleDragEnd}
              className={`
                group relative p-4 rounded-lg border-2 cursor-grab active:cursor-grabbing
                transition-all duration-300 hover:scale-105 hover:shadow-lg
                ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${animateIn ? 'animate-vlx-scale' : 'opacity-0'}
              `}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              role="button"
              aria-label={`Drag ${tool.name} to canvas`}
              tabIndex={0}
            >
              {/* Particle effect background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-primary animate-vlx-pulse"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative flex items-center gap-3">
                <div
                  className="p-2 rounded-md"
                  style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tool.name}</p>
                  {isSelected && (
                    <p className="text-xs text-primary">In use</p>
                  )}
                </div>
              </div>
              
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${tool.color}, transparent 70%)`,
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Tool count indicator */}
      <div className="absolute bottom-4 left-4 right-4 p-3 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Active Tools</span>
          <span className="font-semibold text-primary">{selectedTools.length}/5</span>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
