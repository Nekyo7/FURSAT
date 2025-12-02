import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  Calendar, 
  Trophy,
  ArrowRight,
  Zap,
  Shield,
  Star
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

export default function Landing() {
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

      {/* Hero */}
      <section className="border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-secondary border-2 border-foreground px-3 py-1 mb-4 shadow-xs">
                <span className="font-mono text-sm font-bold">FOR STUDENTS, BY STUDENTS</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                YOUR
                <br />
                <span className="bg-accent inline-block px-2 -rotate-1 border-2 border-foreground shadow-sm">
                  CAMPUS
                </span>
                <br />
                UNIVERSE
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
                One app for everything college. Social feeds, communities, 
                opportunities, events — all in one brutally honest platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/feed">
                  <Button variant="hero" size="xl" className="gap-2">
                    Explore Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="xl">
                    Join Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card border-2 border-foreground p-4 shadow-md">
                    <div className="w-full aspect-square bg-accent/30 border-2 border-foreground mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-secondary border-2 border-foreground" />
                      <div>
                        <p className="font-bold text-sm">@student_life</p>
                        <p className="text-xs text-muted-foreground">2h ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary border-2 border-foreground p-4 shadow-md">
                    <p className="font-mono text-sm font-bold mb-2">TRENDING</p>
                    <p className="font-bold">#CampusFest2024</p>
                    <p className="text-sm text-muted-foreground">12K posts</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-info border-2 border-foreground p-4 shadow-md text-info-foreground">
                    <Briefcase className="w-8 h-8 mb-2" />
                    <p className="font-bold">New Internship</p>
                    <p className="text-sm opacity-90">Google • Remote</p>
                  </div>
                  <div className="bg-card border-2 border-foreground p-4 shadow-md">
                    <Trophy className="w-8 h-8 mb-2 text-secondary" />
                    <p className="font-bold text-sm">+500 XP</p>
                    <p className="text-xs text-muted-foreground">Level up!</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent border-2 border-foreground shadow-lg -rotate-6 flex items-center justify-center">
                <Star className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b-2 border-foreground bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-8 px-4 text-center ${
                  i !== stats.length - 1 ? "border-r-2 border-primary-foreground/30" : ""
                }`}
              >
                <p className="text-4xl md:text-5xl font-bold mb-1">{stat.value}</p>
                <p className="font-mono text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              EVERYTHING YOU NEED
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No more switching between apps. Fursat brings your entire college 
              experience into one unified, brutally efficient platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-card border-2 border-foreground p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className={`w-14 h-14 ${feature.color} border-2 border-foreground flex items-center justify-center mb-4 shadow-xs group-hover:shadow-sm transition-all`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="border-b-2 border-foreground bg-secondary">
        <div className="max-w-7xl mx-auto px-4 py-16">
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
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            READY TO
            <span className="bg-accent inline-block px-3 mx-2 rotate-1 border-2 border-foreground shadow-sm">
              JOIN
            </span>
            ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Your college email is your ticket. Sign up in 30 seconds.
          </p>
          <Link to="/auth">
            <Button variant="hero" size="xl" className="gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
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
