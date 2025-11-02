import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Trophy, Target } from "lucide-react";

interface ScoreCardProps {
  score: number;
  maxScore: number;
  onScoreReveal: () => void;
}

const ScoreCard = ({ score, maxScore, onScoreReveal }: ScoreCardProps) => {
  const [revealed, setRevealed] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);
  
  const isHighScore = score >= 80;
  const isMediumScore = score >= 50 && score < 80;

  // Score count-up animation
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: revealed ? score : 0 },
    config: { duration: 1000 },
    onRest: () => {
      onScoreReveal();
      if (isHighScore) {
        setTimeout(() => setShowTrophy(true), 300);
      }
    },
  });

  useEffect(() => {
    // Trigger score reveal after panel prints
    setTimeout(() => setRevealed(true), 600);
    
    // Haptic feedback on reveal
    if (navigator.vibrate) {
      setTimeout(() => navigator.vibrate([50, 30, 50]), 600);
    }
  }, []);

  return (
    <div className="relative text-center py-8">
      {/* Trophy unlock animation for high scores */}
      {showTrophy && isHighScore && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
          style={{
            animation: "vlx-trophy-unlock 0.6s ease-out",
          }}
        >
          <Trophy className="h-12 w-12 text-yellow-500 drop-shadow-lg" />
          {/* Spark particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400"
              style={{
                animation: `vlx-spark ${0.6 + i * 0.1}s ease-out`,
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Target className="h-4 w-4" />
          <span>Your Score</span>
        </div>
        
        <div className="relative inline-block">
          <animated.div
            className={`text-6xl font-bold transition-colors duration-500 ${
              isHighScore
                ? "text-green-600"
                : isMediumScore
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {number.to((n) => Math.floor(n))}
          </animated.div>
          <span className="text-3xl font-semibold text-muted-foreground">
            /{maxScore}
          </span>
          
          {/* Score glow effect */}
          <div
            className={`absolute inset-0 blur-2xl opacity-30 transition-opacity duration-500 ${
              revealed ? "opacity-30" : "opacity-0"
            }`}
            style={{
              background: isHighScore
                ? "radial-gradient(circle, #22c55e, transparent)"
                : isMediumScore
                ? "radial-gradient(circle, #eab308, transparent)"
                : "radial-gradient(circle, #ef4444, transparent)",
            }}
          />
        </div>

        <p
          className={`text-sm font-medium animate-vlx-scale ${
            isHighScore
              ? "text-green-600"
              : isMediumScore
              ? "text-yellow-600"
              : "text-red-600"
          }`}
          style={{ animationDelay: "1s" }}
        >
          {isHighScore
            ? "🎉 Excellent Work!"
            : isMediumScore
            ? "👍 Good Job!"
            : "💪 Keep Trying!"}
        </p>
      </div>
    </div>
  );
};

// Add trophy and spark animations
const style = document.createElement('style');
style.textContent = `
  @keyframes vlx-trophy-unlock {
    0% {
      transform: translate(-50%, 20px) rotateY(0deg) scale(0.5);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -10px) rotateY(180deg) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 0) rotateY(360deg) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes vlx-spark {
    0% {
      transform: translate(-50%, -50%) translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) translateX(40px) scale(0);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default ScoreCard;
