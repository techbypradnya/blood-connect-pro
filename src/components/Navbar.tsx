import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
            <Link key={item.path} to={item.path}>
              <Button variant={location.pathname === item.path ? "default" : "ghost"} size="sm">
                {item.label}
              </Button>
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="ml-2">
                <Button variant={location.pathname === "/dashboard" ? "default" : "outline"} size="sm">
                  {user?.fullName?.split(" ")[0] || "Dashboard"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Link to="/login" className="ml-2">
              <Button variant="outline" size="sm">Login</Button>
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
        <div className="border-t bg-card px-4 pb-4 lg:hidden">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
              <Button variant={location.pathname === item.path ? "default" : "ghost"} className="w-full justify-start" size="sm">
                {item.label}
              </Button>
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="outline" className="mt-1 w-full justify-start" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" className="mt-1 w-full justify-start" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="mt-1 w-full justify-start" size="sm">Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
