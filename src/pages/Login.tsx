import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Fingerprint, Mail } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Scientist character animations
  const [characterState, setCharacterState] = useState<"idle" | "writing" | "turned" | "peeking">("idle");

  const scientistSpring = useSpring({
    from: { x: -300, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: { duration: 2000 },
  });

  const briefcaseSpring = useSpring({
    from: { y: 0, rotate: 0, opacity: 1 },
    to: async (next) => {
      await next({ y: -100, rotate: 45, opacity: 1 });
      await next({ y: -120, rotate: 90, opacity: 0.8 });
      await next({ y: 0, rotate: 0, opacity: 0 });
    },
    config: { tension: 80, friction: 10 },
  });

  const handleEmailFocus = () => {
    setCharacterState("writing");
  };

  const handlePasswordFocus = () => {
    setCharacterState("turned");
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    setCharacterState(showPassword ? "turned" : "peeking");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      if (email && password.length >= 6) {
        setCharacterState("idle");
        toast.success("Login successful!");
        setTimeout(() => navigate("/home"), 500);
      } else {
        toast.error("Invalid credentials");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleGuestMode = () => {
    toast.info("Entering guest mode (limited to 5 experiments)");
    setTimeout(() => navigate("/home"), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background vlx-grid-bg p-4">
      <div className="w-full max-w-md">
        {/* Animated scientist character */}
        <animated.div
          style={scientistSpring}
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <svg viewBox="0 0 120 180" className="w-32 h-48">
            <g className={`transition-transform duration-500 ${characterState === "turned" ? "scale-x-[-1]" : ""} ${characterState === "peeking" ? "rotate-[-20deg]" : ""}`}>
              {/* Head */}
              <ellipse cx="60" cy="40" rx="18" ry="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
              {/* Body */}
              <line x1="60" y1="62" x2="60" y2="110" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
              {/* Arms */}
              <line 
                x1="60" 
                y1="75" 
                x2={characterState === "writing" ? "40" : "35"} 
                y2={characterState === "writing" ? "95" : "100"} 
                stroke="hsl(var(--primary))" 
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              <line x1="60" y1="75" x2="85" y2="100" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
              {/* Legs */}
              <line x1="60" y1="110" x2="45" y2="150" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
              <line x1="60" y1="110" x2="75" y2="150" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
              
              {/* Notepad when writing */}
              {characterState === "writing" && (
                <rect x="25" y="85" width="15" height="20" rx="1" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1"/>
              )}
            </g>
          </svg>
        </animated.div>

        {/* Login card */}
        <div className="bg-card rounded-lg shadow-lg p-8 border animate-vlx-scale">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path d="M20 12 L30 42 L40 12" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="30" cy="22" r="8" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-6">Sign in to continue your experiments</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="scientist@lab.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handlePasswordFocus}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Login button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>

            {/* Biometric login */}
            <Button type="button" variant="outline" className="w-full" onClick={() => toast.info("Biometric auth coming soon")}>
              <Fingerprint className="mr-2 h-4 w-4" />
              Use Biometric
            </Button>

            {/* Guest mode */}
            <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={handleGuestMode}>
              Continue as Guest
            </Button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center space-y-2">
            <button className="text-sm text-primary hover:underline">
              Forgot password?
            </button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button className="text-primary hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
