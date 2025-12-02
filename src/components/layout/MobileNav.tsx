import { Link, useLocation } from "react-router-dom";
import { Home, Users, PlusSquare, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/feed", label: "Feed", icon: Home },
  { path: "/circles", label: "Circles", icon: Users },
  { path: "/create", label: "Create", icon: PlusSquare },
  { path: "/opportunities", label: "Jobs", icon: Briefcase },
  { path: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-foreground md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isCreate = item.path === "/create";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all",
                isCreate && "relative -top-4"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center transition-all",
                  isCreate
                    ? "w-12 h-12 bg-accent border-2 border-foreground shadow-sm"
                    : "w-8 h-8",
                  isActive && !isCreate && "bg-secondary border-2 border-foreground shadow-2xs"
                )}
              >
                <Icon className={cn("w-5 h-5", isCreate && "w-6 h-6")} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
