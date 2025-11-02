import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

interface GraphData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

interface GraphProps {
  data: GraphData[];
  visible: boolean;
}

const Graph = ({ data, visible }: GraphProps) => {
  const [animatedHeights, setAnimatedHeights] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      // Animate bars sequentially
      data.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedHeights(prev => [...prev, index]);
        }, index * 200 + 1200); // Start after score reveal
      });
    } else {
      setAnimatedHeights([]);
    }
  }, [visible, data]);

  if (!visible) return null;

  return (
    <div className="space-y-4 animate-vlx-scale" style={{ animationDelay: "1s" }}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BarChart3 className="h-4 w-4 text-primary" />
        Performance Metrics
      </div>

      <div className="flex items-end justify-around gap-4 h-48 px-4 pt-4 bg-muted/20 rounded-lg border border-border">
        {data.map((item, index) => {
          const percentage = (item.value / item.maxValue) * 100;
          const isAnimated = animatedHeights.includes(index);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (navigator.vibrate) {
                  navigator.vibrate(30);
                }
              }}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="absolute -translate-y-full mb-2 bg-card px-3 py-2 rounded-lg shadow-lg border border-primary/30 animate-vlx-scale"
                  style={{ marginBottom: "8px" }}
                >
                  <p className="text-xs font-semibold text-foreground whitespace-nowrap">
                    {item.label}: {item.value}%
                  </p>
                </div>
              )}

              {/* Bar */}
              <div className="relative w-full flex-1 flex items-end">
                <div
                  className={`
                    w-full rounded-t-md transition-all duration-500
                    ${isHovered ? "opacity-90 scale-105" : "opacity-100"}
                  `}
                  style={{
                    height: isAnimated ? `${percentage}%` : "0%",
                    backgroundColor: item.color,
                    boxShadow: isHovered
                      ? `0 -4px 12px ${item.color}40`
                      : "none",
                  }}
                />
                
                {/* Value label on top of bar */}
                {isAnimated && (
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold animate-vlx-scale"
                    style={{
                      color: item.color,
                      animationDelay: `${index * 200 + 1400}ms`,
                    }}
                  >
                    {item.value}%
                  </div>
                )}
              </div>

              {/* Label */}
              <p className="text-xs text-muted-foreground font-medium text-center mt-2">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Graph;
