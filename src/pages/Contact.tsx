import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll respond within 2 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient py-20 text-center text-primary-foreground">
        <div className="container mx-auto px-4">
          <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">Contact Us</span>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Reach out for urgent blood requirements, donation inquiries, or any assistance. Our team is here 24/7.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Phone, title: "Emergency Hotline", value: "+91 98765 43210", sub: "24/7 Blood Availability" },
              { icon: Phone, title: "Alternative", value: "+91 87654 32109", sub: "Emergency Support" },
              { icon: Mail, title: "Email Us", value: "contact@bloodlink.org", sub: "Response within 2 hours" },
              { icon: Clock, title: "Working Hours", value: "9 AM - 6 PM", sub: "Monday - Saturday" },
            ].map((item) => (
              <Card key={item.title} className="card-shadow transition-all duration-300 hover:card-shadow-hover">
                <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm font-medium text-primary">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="border-t bg-card py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Send us a Message</CardTitle>
              <CardDescription>We'll get back to you within 2 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" placeholder="Your message..." rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-center gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Our Location</h3>
              <p className="mt-2 text-muted-foreground">BloodLink Emergency Center, Mumbai, Maharashtra, India</p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">BloodLink Center</p>
                <p className="text-sm text-muted-foreground">Central Mumbai, Maharashtra 400001</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Emergency: +91 98765 43210</p>
                <p className="text-sm text-muted-foreground">Available 24/7 for blood emergencies</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">contact@bloodlink.org</p>
                <p className="text-sm text-muted-foreground">We respond within 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
