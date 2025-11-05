import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Scientist character animations
  const [characterState, setCharacterState] = useState<"idle" | "writing" | "turned" | "peeking">("idle");

  const scientistSpring = useSpring({
    from: { x: -300, opacity: 0 },
    to: { x: 0, opacity: 1 },
    config: { duration: 2000 },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validation
        if (!fullName.trim()) {
          toast.error("Full name is required");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords don't match");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/home`,
          },
        });

        if (error) throw error;

        toast.success("Account created! Welcome to VirtualLabX");
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message);
    }
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

        {/* Login/Signup card */}
        <div className="bg-card rounded-lg shadow-lg p-8 border animate-vlx-scale">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path d="M20 12 L30 42 L40 12" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="30" cy="22" r="8" stroke="hsl(var(--primary))" strokeWidth="2.5" fill="none"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            {isSignUp ? "Join VirtualLabX" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            {isSignUp ? "Create your account to start experimenting" : "Sign in to continue your experiments"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

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

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isSignUp
                  ? "Creating account..."
                  : "Signing in..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          {/* Toggle between login/signup */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setConfirmPassword("");
                setFullName("");
              }}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
