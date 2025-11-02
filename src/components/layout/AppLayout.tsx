import { Outlet, useLocation } from "react-router-dom";
import { Home, TestTube, User, Users, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: TestTube, label: "Labs", path: "/labs" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Users, label: "Multiplayer", path: "/multiplayer" },
    { icon: ShoppingCart, label: "Shop", path: "/shop" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            {/* VLX Logo */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8 L20 28 L30 8" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="15" r="6" stroke="hsl(var(--primary))" strokeWidth="2" fill="none"/>
              <path d="M14 15 L20 21 L26 15" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-semibold">VirtualLabX</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 w-full border-t bg-card">
        <div className="container flex h-16 items-center justify-around px-4">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive(path)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
