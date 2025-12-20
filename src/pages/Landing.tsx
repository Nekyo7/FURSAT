import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Users,
  MessageSquare,
  Briefcase,
  Calendar,
  Trophy,
  ArrowRight,
  Zap,
  Shield,
  Star,
  Lock,
  Activity,
  Radio,
  Camera,
  Flame,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "CIRCLES",
    description: "Join topic-based communities. Upvote ideas. Spark debates.",
    color: "bg-secondary",
  },
  {
    icon: MessageSquare,
    title: "FEED",
    description: "Share moments. Stories that vanish. Reels that stick.",
    color: "bg-accent",
  },
  {
    icon: Briefcase,
    title: "OPPORTUNITIES",
    description: "Internships. Projects. Freelance gigs. All verified.",
    color: "bg-info",
  },
  {
    icon: Calendar,
    title: "EVENTS",
    description: "Campus fests. Workshops. Hackathons. Never miss out.",
    color: "bg-success",
  },
];

const stats = [
  { value: "50K+", label: "Students" },
  { value: "200+", label: "Colleges" },
  { value: "5K+", label: "Opportunities" },
  { value: "1M+", label: "Posts" },
];

const loginHighlights = [
  { label: "VERIFIED ENTRY", detail: ".edu emails only", tone: "bg-secondary" },
  { label: "ZERO NOISE", detail: "Real clubs + real peers", tone: "bg-accent" },
  { label: "TRUSTED DROPS", detail: "Vetted gigs + events", tone: "bg-info" },
];

const bulletin = [
  {
    title: "Product Sprint Applications",
    meta: "Closes 14 Dec • 200 seats",
    tag: "Opportunities",
  },
  {
    title: "Campus Fest Aftermovie Drop",
    meta: "Premiere 9 PM • Media Circle",
    tag: "Feed",
  },
  {
    title: "Debate League Finals",
    meta: "Livestream Saturday • Circle Wars",
    tag: "Circles",
  },
];

const feedPeeks = [
  {
    label: "Story drop",
    title: "Hostel rooftop session got wild 🔥",
    color: "bg-secondary",
  },
  {
    label: "Opportunity ping",
    title: "Wipro design residency added to board",
    color: "bg-accent",
  },
  {
    label: "Circle battle",
    title: "Tech vs Arts meme wars live now",
    color: "bg-info",
  },
];

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is logged in (but wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/feed", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show minimal loading while auth is initializing (only briefly)
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

  // Don't render landing page if user is logged in (will redirect)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Logged in successfully!");
        window.location.href = "/feed";
      } else {
        if (!email.toLowerCase().trim().endsWith("@bmsit.in")) {
          toast.error("Only @bmsit.in emails are allowed to sign up");
          setLoading(false);
          return;
        }

        if (!username.trim()) {
          toast.error("Username is required");
          setLoading(false);
          return;
        }
        await signUp(email, password, username);
        toast.success("Account created! Check your email to verify.");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-accent border-2 border-foreground shadow-sm flex items-center justify-center">
              <span className="font-mono font-bold text-2xl">F</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">FURSAT</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="default" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Login-first Hero */}
      <section className="border-b-2 border-foreground bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary border-2 border-foreground px-3 py-1 mb-6 shadow-xs uppercase font-mono text-xs tracking-wide">
                <Lock className="w-4 h-4" />
                VERIFIED CAMPUS LOGIN
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                DROP
                <span className="bg-accent inline-block px-3 rotate-1 mx-2 border-2 border-foreground shadow-sm">
                  IN
                </span>
                WITHOUT THE NOISE.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                This isn&apos;t another glossy landing page. It&apos;s the front door
                to the most brutally honest student feed on campus. Log in, see what
                your circles are plotting, and claim the gigs before they vanish.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {loginHighlights.map((item) => (
                  <div
                    key={item.label}
                    className={`${item.tone} border-2 border-foreground px-4 py-5 shadow-sm`}
                  >
                    <p className="font-mono text-xs mb-1">{item.label}</p>
                    <p className="font-bold text-sm">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border-2 border-foreground shadow-xl p-6 md:p-8 relative">
              <div className="absolute -top-4 -left-4 bg-accent border-2 border-foreground px-3 py-1 font-mono text-xs shadow-sm rotate-[-2deg]">
                CAMPUS ACCESS ONLY
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {isLogin ? "LOGIN" : "SIGN UP"}
                  </p>
                  <h2 className="text-2xl font-bold">
                    {isLogin ? "Enter the brutalist feed" : "Join the campus universe"}
                  </h2>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="border-2 border-foreground rounded-none focus-visible:ring-0"
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
                    className="border-2 border-foreground rounded-none focus-visible:ring-0"
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
                    className="border-2 border-foreground rounded-none focus-visible:ring-0"
                    required
                  />
                </div>
                {isLogin && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <label className="flex items-center gap-2">
                      <Checkbox id="remember" className="border-foreground rounded-none" />
                      Remember me
                    </label>
                    <Link to="/auth?mode=reset" className="underline">
                      Forgot?
                    </Link>
                  </div>
                )}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 font-black tracking-wide"
                  disabled={loading}
                >
                  {loading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {isLogin ? (
                    <>
                      Need an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="underline font-semibold"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="underline font-semibold"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Live Bulletin */}
      <section className="border-b-2 border-foreground bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5" />
              <p className="font-mono text-xs tracking-[0.2em]">LIVE CAMPUS BULLETIN</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {bulletin.map((item) => (
                <div
                  key={item.title}
                  className="border-2 border-primary-foreground bg-primary text-left px-5 py-6 shadow-xs"
                >
                  <p className="font-mono text-[11px] mb-2 opacity-80">{item.tag}</p>
                  <p className="font-semibold text-xl mb-1">{item.title}</p>
                  <p className="text-sm opacity-70">{item.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-[1fr_0.6fr] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6" />
                <p className="font-mono text-sm">BRUTALIST STACK</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                EVERYTHING THAT MAKES CAMPUS ALIVE
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Feed, circles, gigs, events – all stitched into one unapologetically
                raw interface. Zero gradients, all signal.
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                {features.slice(0, 4).map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="bg-card border-2 border-foreground p-5 shadow-sm"
                    >
                      <div
                        className={`w-12 h-12 ${feature.color} border-2 border-foreground flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-muted border-2 border-foreground p-6 space-y-4 shadow-inner">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5" />
                <p className="font-mono text-xs">FEED SNEAK PEEK</p>
              </div>
              {feedPeeks.map((peek) => (
                <div
                  key={peek.title}
                  className="border-2 border-foreground bg-background px-4 py-4 flex flex-col gap-1"
                >
                  <p className="font-mono text-[11px] tracking-wide">{peek.label}</p>
                  <p className="text-lg font-semibold">{peek.title}</p>
                  <div className={`w-6 h-1 ${peek.color}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="border-b-2 border-foreground bg-secondary">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">VERIFIED COLLEGES</h3>
                <p className="text-muted-foreground">
                  Only .edu emails. Real students. Real connections.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">GAMIFIED XP</h3>
                <p className="text-muted-foreground">
                  Earn points. Unlock badges. Climb leaderboards.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">ZERO SPAM</h3>
                <p className="text-muted-foreground">
                  Moderated communities. Quality over quantity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-foreground">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                STILL READING?
                <span className="bg-accent border-2 border-foreground px-3 mx-2 rotate-1 inline-block">
                  LOG IN
                </span>
                AND SEE FOR YOURSELF.
              </h2>
              <p className="text-lg text-muted-foreground">
                The feed resets every 24 hours. Opportunities go first-come-first-serve.
                Don&apos;t wait for screenshots.
              </p>
            </div>
            <div className="bg-card border-2 border-foreground p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs">SYSTEM STATUS</p>
                <Flame className="w-4 h-4" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-2 border-dashed border-foreground/60 px-3 py-4">
                    <p className="text-2xl font-black">{stat.value}</p>
                    <p className="font-mono text-[11px]">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full mt-6 gap-2 font-black">
                <Link to="/auth">
                  Go to login
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-accent border-2 border-primary-foreground flex items-center justify-center">
                  <span className="font-mono font-bold text-lg text-foreground">F</span>
                </div>
                <span className="font-bold text-xl">FURSAT</span>
              </div>
              <p className="text-sm opacity-80">
                The brutally honest college platform.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">PRODUCT</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Feed</a></li>
                <li><a href="#" className="hover:opacity-100">Circles</a></li>
                <li><a href="#" className="hover:opacity-100">Opportunities</a></li>
                <li><a href="#" className="hover:opacity-100">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">About</a></li>
                <li><a href="#" className="hover:opacity-100">Blog</a></li>
                <li><a href="#" className="hover:opacity-100">Careers</a></li>
                <li><a href="#" className="hover:opacity-100">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">LEGAL</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms</a></li>
                <li><a href="#" className="hover:opacity-100">Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/30 mt-8 pt-8 text-center text-sm opacity-60">
            © 2024 Fursat. Made with brutal honesty.
          </div>
        </div>
      </footer>
    </div>
  );
}
