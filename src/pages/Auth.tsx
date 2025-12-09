import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/feed", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth page if user is logged in (will redirect)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN - force page reload to ensure auth state is refreshed
        await signIn(email, password);
        toast.success("Logged in successfully!");
        window.location.href = "/feed";
      } else {
        // SIGNUP
        if (!username.trim()) {
          toast.error("Username is required");
          setLoading(false);
          return;
        }

        await signUp(email, password, username);
        toast.success("Account created! Check your email to verify.");

        // After signup, switch back to login form
        setIsLogin(true);
        setUsername("");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full border-2 border-foreground bg-card shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "LOGIN" : "SIGN UP"}
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {isLogin
              ? "Enter your campus credentials"
              : "Create your brutalist account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="font-bold text-sm">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-foreground rounded-none"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold text-sm">
              Campus Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-foreground rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-foreground rounded-none"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-black tracking-wide"
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
          </Button>

          <button
            type="button"
            className="text-sm underline w-full text-center block"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setUsername("");
            }}
          >
            {isLogin ? "Create an account" : "Already have an account?"}
          </button>
        </form>
      </div>
    </div>
  );
}
