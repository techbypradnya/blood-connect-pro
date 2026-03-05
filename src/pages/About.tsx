import { Heart, Shield, Users, Clock, Award, CheckCircle, Droplets, Activity, ThermometerSun, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero */}
      <section className="hero-gradient py-20 text-center text-primary-foreground">
        <div className="container mx-auto px-4">
          <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">About Us</span>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">About BloodLink</h1>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            A pioneer emergency blood donor finder, connecting patients in urgent need with verified donors.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our Mission</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              "No one should die due to non-availability of blood."
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              BloodLink was created with a simple yet powerful vision: to ensure that no patient in emergency ever suffers due to lack of blood availability. We connect donors with recipients instantly, saving precious time during medical emergencies.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Our platform maintains a database of verified, voluntary blood donors who are ready to help at a moment's notice. We prioritize safety, quality, and speed in every interaction.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-72 w-72 rounded-3xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
              <Heart className="h-24 w-24 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">Our Values</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Safety First", desc: "Strict medical protocols and sterile processes at every step." },
              { icon: Users, title: "Community Driven", desc: "Built on voluntary donations and community participation." },
              { icon: Award, title: "Quality Assured", desc: "Highest standards in blood collection, testing, and storage." },
              { icon: Clock, title: "Always Available", desc: "24/7 emergency support for urgent blood requirements." },
            ].map((item) => (
              <Card key={item.title} className="card-shadow border-none bg-secondary/50">
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

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "2,400+", label: "Registered Donors", icon: Droplets },
              { value: "850+", label: "Lives Saved", icon: Heart },
              { value: "1,200+", label: "Emergency Requests", icon: Activity },
              { value: "50+", label: "Camps Conducted", icon: MapPin },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center card-shadow">
                <stat.icon className="h-8 w-8 text-primary" />
                <span className="font-display text-2xl font-extrabold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="border-t bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-foreground">Safety Protocols</h2>
          <div className="mx-auto max-w-2xl space-y-3">
            {[
              "Strict medical screening before every donation",
              "Hemoglobin testing using advanced HemoCue equipment",
              "Only sterile, single-use kits used",
              "Blood storage maintained between +4°C to −15°C",
              "Continuous monitoring of stored blood units",
              "Complete disease screening and compatibility testing",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border bg-card p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
