import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className">, VariantProps<typeof buttonVariants> {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, inactiveClassName, variant = "ghost", size, to, children, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive }) =>
          cn(
            buttonVariants({ variant: isActive ? "secondary" : variant, size }),
            "transition-all duration-200",
            isActive
              ? cn(
                "bg-accent text-accent-foreground border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-accent hover:translate-y-0",
                activeClassName
              )
              : cn("hover:bg-muted/50", inactiveClassName),
            className
          )
        }
        {...props}
      >
        {children}
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
