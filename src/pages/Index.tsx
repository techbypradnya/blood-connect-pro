import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Search, UserPlus, AlertTriangle } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero */}
      <section className="hero-gradient flex flex-1 flex-col items-center justify-center px-4 py-20 text-center text-primary-foreground">
        <div className="animate-fade-in max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20 animate-emergency-pulse">
            <Heart className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Emergency Blood<br />Donor Finder
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
            Every drop counts. Instantly connect with verified blood donors in your city during emergencies and help save lives.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/search">
              <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold">
                <Search className="h-4 w-4" /> Find Donor
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10">
                <UserPlus className="h-4 w-4" /> Become a Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          {[
            { label: "Registered Donors", value: "2,400+", icon: UserPlus },
            { label: "Lives Saved", value: "850+", icon: Heart },
            { label: "Emergency Requests", value: "1,200+", icon: AlertTriangle },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <stat.icon className="h-8 w-8 text-primary" />
              <span className="font-display text-3xl font-extrabold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-6 text-center text-sm text-muted-foreground">
        © 2026 BloodLink. All rights reserved. Built with ❤️ to save lives.
      </footer>
    </div>
  );
};

export default Landing;
