import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();
  const [showSkip, setShowSkip] = useState(false);
  const [progress, setProgress] = useState(0);

  // Logo particle animation
  const logoSpring = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 120, friction: 14 },
    delay: 500,
  });

  // Scientist character animation
  const scientistSpring = useSpring({
    from: { x: -200, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: { duration: 2000 },
  });

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/login"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimer);
    };
  }, [navigate]);

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted to-background overflow-hidden">
      {/* Animated scientist character */}
      <animated.div
        style={scientistSpring}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-32"
      >
        <svg viewBox="0 0 100 150" className="w-full h-full">
          {/* Scientist outline */}
          <ellipse cx="50" cy="30" rx="15" ry="18" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
          <line x1="50" y1="48" x2="50" y2="90" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
          <line x1="50" y1="60" x2="30" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
          <line x1="50" y1="60" x2="70" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
          <line x1="50" y1="90" x2="35" y2="120" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
          <line x1="50" y1="90" x2="65" y2="120" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
          {/* Briefcase */}
          <rect x="65" y="75" width="20" height="15" rx="2" fill="hsl(var(--primary))" opacity="0.7"/>
        </svg>
      </animated.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo */}
        <animated.div style={logoSpring} className="flex flex-col items-center gap-4">
          <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            {/* Beaker outline */}
            <path 
              d="M40 20 L40 40 L30 80 C30 90, 40 95, 60 95 C80 95, 90 90, 90 80 L80 40 L80 20 Z" 
              fill="none" 
              stroke="url(#logoGradient)" 
              strokeWidth="3"
            />
            {/* Circuit lines */}
            <path d="M50 30 L70 30 M50 40 L70 40 M50 50 L70 50" stroke="url(#logoGradient)" strokeWidth="2"/>
            <circle cx="50" cy="30" r="2" fill="url(#logoGradient)"/>
            <circle cx="70" cy="40" r="2" fill="url(#logoGradient)"/>
            <circle cx="50" cy="50" r="2" fill="url(#logoGradient)"/>
          </svg>
          
          <h1 className="text-4xl font-bold text-foreground">VirtualLabX</h1>
          <p className="text-muted-foreground text-center">Empowering Scientific Discovery</p>
        </animated.div>

        {/* Loading spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Assets Loaded: {progress}%
        </p>
      </div>

      {/* Skip button */}
      {showSkip && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-20 right-8 text-muted-foreground hover:text-foreground"
          onClick={handleSkip}
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Skip
        </Button>
      )}
    </div>
  );
};

export default Splash;
