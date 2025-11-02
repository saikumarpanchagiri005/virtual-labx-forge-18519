import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CanvasProps {
  selectedTools: string[];
  onToolAdd: (toolId: string) => void;
  isBooting: boolean;
}

const Canvas = ({ selectedTools, onToolAdd, isBooting }: CanvasProps) => {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [laserScan, setLaserScan] = useState(false);

  useEffect(() => {
    if (isBooting) {
      // Lab boot sequence
      setTimeout(() => setGridVisible(true), 300);
      setTimeout(() => setLaserScan(true), 800);
      setTimeout(() => setLaserScan(false), 1800);
    }
  }, [isBooting]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const toolId = e.dataTransfer.getData("toolId");
    if (toolId) {
      onToolAdd(toolId);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
      
      toast({
        title: "Tool added!",
        description: "Tool successfully placed on canvas",
      });
    }
  };

  return (
    <div
      className={`
        relative h-full bg-card border-x border-border overflow-hidden
        transition-all duration-300
        ${dragOver ? 'bg-primary/5 border-primary' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="Experiment canvas"
      aria-live="polite"
    >
      {/* Grid background */}
      <div
        className={`
          absolute inset-0 vlx-grid-bg transition-opacity duration-500
          ${gridVisible ? 'opacity-100' : 'opacity-0'}
        `}
      />
      
      {/* Power-up border glow */}
      {isBooting && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-4 border-primary/50 animate-vlx-pulse" />
        </div>
      )}
      
      {/* Laser scan effect */}
      {laserScan && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{
            animation: 'vlx-laser-scan 1s ease-in-out',
            top: '50%',
          }}
        />
      )}
      
      {/* Canvas header */}
      <div className="relative z-10 p-4 border-b border-border bg-card/80 backdrop-blur">
        <h2 className="text-lg font-bold text-foreground">Experiment Canvas</h2>
        <p className="text-xs text-muted-foreground">Drop tools here to begin</p>
      </div>
      
      {/* Tool display area */}
      <div className="relative z-10 p-8 h-[calc(100%-80px)] overflow-auto">
        {selectedTools.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-6xl opacity-20 animate-vlx-pulse">🔬</div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Drag tools from the sidebar to start
              </p>
              <p className="text-xs text-muted-foreground/70">
                Your experiment will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {selectedTools.map((toolId, index) => (
              <div
                key={`${toolId}-${index}`}
                className="p-6 bg-muted/30 rounded-lg border-2 border-primary/30 animate-vlx-scale"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">🔧</div>
                  <p className="text-sm font-medium capitalize">{toolId}</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-vlx-pulse" />
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Drop zone indicator */}
      {dragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm z-20 pointer-events-none">
          <div className="text-center space-y-2 animate-vlx-scale">
            <div className="text-5xl">📍</div>
            <p className="text-lg font-semibold text-primary">Drop here</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Add laser scan animation to index.css
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-laser-scan {
    0% { top: 0%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
`;
document.head.appendChild(style);

export default Canvas;
