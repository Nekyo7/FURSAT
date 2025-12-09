import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

import { useLocation } from "react-router-dom";

export function Layout({ children, showNav = true }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {showNav && <Navbar />}
      <main className={showNav ? "pt-16 pb-20 md:pb-8" : ""}>
        {children}
      </main>
      {showNav && <MobileNav />}
    </div>
  );
}
