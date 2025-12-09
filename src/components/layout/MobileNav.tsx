import { Link, useLocation } from "react-router-dom";
import { Home, Users, PlusSquare, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";

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
          const isCreate = item.path === "/create";

          if (isCreate) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 relative -top-4"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-accent border-2 border-foreground shadow-sm transition-transform active:scale-95">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-foreground">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              variant="ghost"
              className="flex-col h-auto py-2 px-3 gap-1 rounded-none border-0 shadow-none hover:bg-transparent data-[active=true]:bg-transparent"
              activeClassName="bg-transparent border-0 shadow-none text-foreground"
              inactiveClassName="text-muted-foreground"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 transition-all rounded-md",
                      isActive && "bg-secondary border-2 border-foreground shadow-2xs"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
