import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UpcomingCampsSection from "@/components/UpcomingCampsSection";
import {
  Heart, Search, UserPlus, AlertTriangle, Shield, Clock, Award,
  Droplets, Phone, MapPin, Mail, ThermometerSun, CheckCircle,
  ArrowRight, Users, Activity, Cake, Star, Syringe,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container mx-auto grid min-h-[85vh] grid-cols-1 items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div className="animate-fade-in-left z-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Droplets className="h-4 w-4" /> Trusted Blood Bank
            </span>
            <h1 className="mt-4 font-serif text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
              BloodLink<br />
              <span className="text-gradient">Emergency Donor</span><br />
              Finder
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Serving humanity through safe blood—because no life should be lost for want of blood. Instantly connect with verified donors in your city.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/search">
                <Button size="lg" className="gap-2 text-base font-semibold shadow-lg">
                  <Search className="h-4 w-4" /> Find Donor
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="gap-2 text-base font-semibold">
                  <UserPlus className="h-4 w-4" /> Become a Donor
                </Button>
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              Trusted by 100,000+ lives served
            </p>
          </div>

          <div className="relative hidden lg:block animate-fade-in-right">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -top-4 -right-4 h-80 w-80 rounded-3xl bg-primary/10" />
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="flex h-48 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="text-center">
                    <Droplets className="mx-auto h-12 w-12 text-primary" />
                    <p className="mt-2 text-sm font-medium text-foreground">Save 3 Lives</p>
                    <p className="text-xs text-muted-foreground">with 1 donation</p>
                  </div>
                </div>
                <div className="mt-8 flex h-48 items-center justify-center rounded-2xl bg-accent border border-primary/10">
                  <div className="text-center">
                    <Heart className="mx-auto h-12 w-12 text-primary animate-emergency-pulse" />
                    <p className="mt-2 text-sm font-medium text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground">Emergency Support</p>
                  </div>
                </div>
                <div className="flex h-40 items-center justify-center rounded-2xl bg-accent border border-primary/10">
                  <div className="text-center">
                    <Shield className="mx-auto h-10 w-10 text-primary" />
                    <p className="mt-2 text-sm font-medium text-foreground">100% Safe</p>
                  </div>
                </div>
                <div className="flex h-40 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="text-center">
                    <Syringe className="mx-auto h-10 w-10 text-primary" />
                    <p className="mt-2 text-sm font-medium text-foreground">Sterile Kits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="border-b bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground">
            Why Trust <span className="text-primary">BloodLink</span>?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted-foreground">
            We ensure the highest safety standards in blood collection, storage, and distribution.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: "Quality Assured", desc: "100% quality score in national quality control programs." },
              { icon: Users, title: "100% Voluntary", desc: "Ensuring safety for patients through ethical practices." },
              { icon: ThermometerSun, title: "Advanced Technology", desc: "Modern compatibility testing and HemoCue machines." },
              { icon: Clock, title: "24/7 Emergency", desc: "Round-the-clock emergency blood availability support." },
            ].map((item) => (
              <Card key={item.title} className="card-shadow border-none bg-secondary/50 transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">About BloodLink</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Serving humanity through <span className="text-gradient">safe blood</span> for the community.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              BloodLink is a dedicated blood bank emergency donor finder, connecting patients in urgent need with verified, willing donors in their city. Our mission is simple: <strong>"No one should die due to non-availability of blood."</strong>
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { value: "2,400+", label: "Registered Donors" },
                { value: "850+", label: "Lives Saved" },
                { value: "24/7", label: "Emergency Support" },
                { value: "100%", label: "Voluntary Donation" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-card p-4 text-center card-shadow">
                  <span className="font-display text-2xl font-extrabold text-primary">{stat.value}</span>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-80 w-80 rounded-3xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
                <div className="text-center">
                  <Heart className="mx-auto h-20 w-20 text-primary" />
                  <p className="mt-4 font-display text-xl font-bold text-foreground">Our Mission</p>
                  <p className="mt-2 max-w-[200px] text-sm text-muted-foreground">No one should die due to non-availability of blood.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="hero-gradient py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold">Our Impact by Numbers</h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "2,400+", label: "Blood Donations", icon: Droplets },
              { value: "1,200+", label: "Emergency Requests", icon: AlertTriangle },
              { value: "850+", label: "Lives Saved", icon: Heart },
              { value: "50+", label: "Camps Conducted", icon: Activity },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-center animate-counter-up">
                <stat.icon className="h-8 w-8 text-primary-foreground/80" />
                <span className="font-display text-3xl font-extrabold sm:text-4xl">{stat.value}</span>
                <span className="text-sm text-primary-foreground/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Protocols */}
      <section className="border-b py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="space-y-4">
              {[
                "Strict medical screening before donation",
                "Hemoglobin testing using advanced equipment",
                "Sterile, single-use kits only",
                "Blood storage maintained between +4°C to −15°C",
                "Continuous monitoring of stored blood",
                "Complete disease screening tests conducted",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-xl border bg-accent/50 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <ThermometerSun className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">4°C Temperature Controlled</p>
                <p className="text-sm text-muted-foreground">Maintained continuously between +4°C to -15°C</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Donor & Patient <span className="text-primary">Safety First</span>
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We adhere to strict international medical protocols to ensure every drop of blood is safe for transfusion. From collection to storage, quality is our priority.
            </p>
          </div>
        </div>
      </section>

      {/* Celebrate CTA */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <Cake className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground">
            Celebrate Your Birthday by Saving Lives
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Instead of cutting a cake, give someone a second chance at life. Register as a donor on your special occasion.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Birthday", "Anniversary", "Special Occasions"].map((occasion) => (
              <span key={occasion} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm font-medium text-foreground">
                <Star className="h-3.5 w-3.5 text-primary" /> {occasion}
              </span>
            ))}
          </div>
          <Link to="/register" className="mt-6 inline-block">
            <Button size="lg" className="gap-2">
              Register Your Pledge <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl hero-gradient p-10 text-center text-primary-foreground sm:p-16">
            <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">Donate Blood, Save Lives</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Your 15 Minutes Can Save 3 Families.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
              Join a community of heroes. Safe, sterile, and simple process.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Clock, title: "Super Fast", desc: "Whole process takes ~45 mins" },
                { icon: Shield, title: "100% Safe", desc: "Sterile kits & expert care" },
                { icon: Activity, title: "Free Health Check", desc: "BP, Hb, & basic screening" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-primary-foreground/10 p-5 backdrop-blur-sm">
                  <item.icon className="mx-auto h-7 w-7" />
                  <h3 className="mt-2 font-display font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-primary-foreground/70">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="gap-2 text-base font-semibold">
                  <UserPlus className="h-4 w-4" /> Become a Donor
                </Button>
              </Link>
              <Link to="/emergency-request">
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground text-base font-semibold text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20">
                  <AlertTriangle className="h-4 w-4" /> Emergency Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Camps Section */}
      <UpcomingCampsSection />

      {/* Contact Section */}
      <section className="border-t bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground">
            Get in Touch
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted-foreground">
            Reach out for urgent blood requirements, donation inquiries, or any assistance. Our team is here 24/7.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Phone, title: "Emergency Hotline", value: "+91 98765 43210", sub: "24/7 Blood Availability" },
              { icon: Mail, title: "General Inquiry", value: "contact@bloodlink.org", sub: "Response within 2 hours" },
              { icon: MapPin, title: "Our Location", value: "BloodLink Center", sub: "Mumbai, Maharashtra" },
            ].map((item) => (
              <Card key={item.title} className="card-shadow transition-all duration-300 hover:card-shadow-hover">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm font-medium text-primary">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* footer is handled by Layout */}
    </div>
  );
};

export default Landing;
