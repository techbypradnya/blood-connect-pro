import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Find Donor", path: "/search" },
    ...(!isAuthenticated ? [{ label: "Register", path: "/register" }] : []),
    { label: "Emergency", path: "/emergency-request" },
    { label: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Droplets className="h-6 w-6" />
          <span>BloodLink</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative group"
              onClick={() => setOpen(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-foreground",
                  "transition-colors"
                )}
              >
                {item.label}
              </Button>
              <span
                className={cn(
                  "absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === item.path
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="ml-2 relative group" onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    location.pathname === "/dashboard"
                      ? "text-primary font-semibold"
                      : "text-foreground",
                    "transition-colors"
                  )}
                >
                  {user?.fullName?.split(" ")[0] || "Dashboard"}
                </Button>
                <span
                  className={cn(
                    "absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300",
                    location.pathname === "/dashboard"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Link to="/login" className="ml-2 relative group" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  location.pathname === "/login" ? "text-primary font-semibold" : "text-foreground",
                  "transition-colors"
                )}
              >
                Login
              </Button>
              <span
                className={cn(
                  "absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === "/login" ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card px-4 pb-4 lg:hidden transition-all duration-300 ease-in-out">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="relative group"
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-colors",
                  location.pathname === item.path ? "text-primary font-semibold" : "text-foreground"
                )}
                size="sm"
              >
                {item.label}
              </Button>
              <span
                className={cn(
                  "absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "mt-1 w-full justify-start transition-colors",
                    location.pathname === "/dashboard" ? "text-primary font-semibold" : "text-foreground"
                  )}
                  size="sm"
                >
                  Dashboard
                </Button>
                <span
                  className={cn(
                    "absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300",
                    location.pathname === "/dashboard" ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
              <Button variant="ghost" className="mt-1 w-full justify-start" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="relative group">
              <Button
                variant="ghost"
                className={cn(
                  "mt-1 w-full justify-start transition-colors",
                  location.pathname === "/login" ? "text-primary font-semibold" : "text-foreground"
                )}
                size="sm"
              >
                Login
              </Button>
              <span
                className={cn(
                  "absolute left-0 -bottom-0.5 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === "/login" ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
