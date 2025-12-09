import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import {
  Menu,
  X,
  Home,
  Users,
  Briefcase,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


const navItems = [
  { path: "/feed", label: "Feed", icon: Home },
  { path: "/circles", label: "Circles", icon: Users },
  { path: "/opportunities", label: "Opportunities", icon: Briefcase },
  { path: "/messages", label: "Messages", icon: MessageSquare },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, refreshProfile } = useAuth();

  // Debug: Log profile state and auto-refresh if needed
  useEffect(() => {
    if (user) {
      console.log("🔍 Navbar - User:", user.id);
      console.log("🔍 Navbar - Profile:", profile);
      console.log("🔍 Navbar - Username:", profile?.username);
      if (!profile?.username) {
        console.warn("⚠️ No username in profile, refreshing...");
        refreshProfile();
      }
    }
  }, [user, profile, refreshProfile]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent border-2 border-foreground shadow-xs flex items-center justify-center">
              <span className="font-mono font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">FURSAT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent border border-foreground text-xs font-bold flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" align="end">
                    <div className="p-4 border-b-2 border-foreground bg-secondary">
                      <h4 className="font-bold text-lg">Notifications</h4>
                    </div>
                    <div className="flex flex-col">
                      {/* Notification 1 */}
                      <div className="p-4 border-b border-muted hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start">
                        <div className="w-8 h-8 bg-accent border border-foreground flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            <span className="font-bold">Sneha</span> and 3 others liked your story
                          </p>
                          <span className="text-xs text-muted-foreground">2m ago</span>
                        </div>
                      </div>

                      {/* Notification 2 */}
                      <div className="p-4 border-b border-muted hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start">
                        <div className="w-8 h-8 bg-success border border-foreground flex items-center justify-center shrink-0">
                          <span className="font-bold text-xs">F</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Welcome to <span className="font-bold">FURSAT</span>! 🚀
                          </p>
                          <span className="text-xs text-muted-foreground">1h ago</span>
                        </div>
                      </div>

                      {/* Notification 3 */}
                      <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start">
                        <div className="w-8 h-8 bg-info border border-foreground flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Someone commented on your post
                          </p>
                          <span className="text-xs text-muted-foreground">5h ago</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <div className="w-6 h-6 bg-accent border-2 border-foreground flex items-center justify-center">
                        <span className="font-bold text-xs">
                          {profile?.username && profile.username.trim()
                            ? profile.username.slice(0, 2).toUpperCase()
                            : user.email?.slice(0, 2).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="hidden md:inline font-semibold">
                        {profile?.username && profile.username.trim()
                          ? `@${profile.username}`
                          : user.email?.split("@")[0] || "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-2 border-foreground">
                    {profile?.username && profile.username.trim() ? (
                      <DropdownMenuLabel className="font-semibold text-base">
                        @{profile.username}
                      </DropdownMenuLabel>
                    ) : null}
                    <DropdownMenuLabel className="font-mono text-xs text-muted-foreground">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="accent" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t-2 border-foreground">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="accent" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
