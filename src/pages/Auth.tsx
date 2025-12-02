import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate college email
    if (!email.endsWith(".edu") && !email.endsWith(".ac.in")) {
      toast({
        title: "Invalid Email",
        description: "Please use your college email (.edu or .ac.in)",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: mode === "login" ? "Welcome back!" : "Account created!",
      description: "Redirecting to your feed...",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 bg-accent border-2 border-primary-foreground flex items-center justify-center">
              <span className="font-mono font-bold text-2xl text-foreground">F</span>
            </div>
            <span className="font-bold text-2xl">FURSAT</span>
          </Link>
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            YOUR CAMPUS,
            <br />
            <span className="bg-accent text-foreground inline-block px-2 -rotate-1">
              AMPLIFIED
            </span>
          </h1>
          <p className="text-xl opacity-80 mb-8 max-w-md">
            Connect with classmates, discover opportunities, and make your 
            college years count. All in one brutally honest platform.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "50K+", label: "Students" },
              { stat: "200+", label: "Colleges" },
              { stat: "5K+", label: "Opportunities" },
              { stat: "100+", label: "Circles" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-primary-foreground/10 border-2 border-primary-foreground/30 p-4"
              >
                <p className="text-3xl font-bold">{item.stat}</p>
                <p className="text-sm opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm opacity-60">
          © 2024 Fursat. Made with brutal honesty.
        </p>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-accent border-2 border-foreground flex items-center justify-center">
              <span className="font-mono font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl">FURSAT</span>
          </Link>

          {/* Mode Toggle */}
          <div className="flex border-2 border-foreground mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 font-bold transition-colors ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 font-bold transition-colors ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              SIGN UP
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            {mode === "login" ? "Welcome Back" : "Join Fursat"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Use your college email to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block font-bold text-sm mb-2">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditya Kumar"
                    className="w-full bg-background border-2 border-foreground pl-10 pr-4 py-3 outline-none focus:shadow-xs transition-shadow"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-sm mb-2">
                COLLEGE EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full bg-background border-2 border-foreground pl-10 pr-4 py-3 outline-none focus:shadow-xs transition-shadow"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Must be a valid .edu or .ac.in email
              </p>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border-2 border-foreground pl-10 pr-12 py-3 outline-none focus:shadow-xs transition-shadow"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full gap-2">
              {mode === "login" ? "Log In" : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>

          {mode === "signup" && (
            <p className="mt-6 text-xs text-muted-foreground text-center">
              By signing up, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
