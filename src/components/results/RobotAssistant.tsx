import { Sparkles } from "lucide-react";

interface RobotAssistantProps {
  state: "idle" | "analyzing" | "celebrate" | "sad" | "stamp" | "point";
  position?: "bottom-right" | "center";
}

const RobotAssistant = ({ state, position = "bottom-right" }: RobotAssistantProps) => {
  const positionClasses =
    position === "bottom-right"
      ? "fixed bottom-24 right-8"
      : "relative mx-auto";

  return (
    <div className={`${positionClasses} z-40`}>
      <div className="relative">
        {/* Robot body */}
        <div
          className={`
            w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 
            border-2 border-primary flex items-center justify-center
            transition-all duration-300
            ${state === "celebrate" ? "animate-vlx-bounce" : ""}
            ${state === "sad" ? "animate-vlx-shake" : ""}
            ${state === "stamp" ? "scale-110" : ""}
          `}
        >
          <Sparkles
            className={`
              h-8 w-8 text-primary
              ${state === "analyzing" ? "animate-vlx-spin" : ""}
            `}
          />
        </div>

        {/* Celebration particles */}
        {state === "celebrate" && (
          <>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary"
                style={{
                  animation: `vlx-celebrate-particle ${
                    0.8 + i * 0.05
                  }s ease-out`,
                  transform: `rotate(${i * 30}deg)`,
                }}
              />
            ))}
          </>
        )}

        {/* Stamp effect */}
        {state === "stamp" && (
          <div
            className="absolute inset-0 rounded-full border-4 border-green-500"
            style={{
              animation: "vlx-stamp 0.4s ease-out",
            }}
          />
        )}

        {/* Laser pointer */}
        {state === "point" && (
          <div
            className="absolute top-1/2 -left-12 w-12 h-0.5 bg-primary/70"
            style={{
              animation: "vlx-laser-point 1.5s ease-in-out infinite",
            }}
          />
        )}

        {/* Sad pulse */}
        {state === "sad" && (
          <div
            className="absolute inset-0 rounded-full border-2 border-red-500"
            style={{
              animation: "vlx-sad-pulse 1s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-celebrate-particle {
    0% {
      transform: translate(-50%, -50%) translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) translateX(50px) scale(0);
      opacity: 0;
    }
  }
  
  @keyframes vlx-stamp {
    0% {
      transform: scale(1.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  
  @keyframes vlx-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  @keyframes vlx-sad-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default RobotAssistant;
