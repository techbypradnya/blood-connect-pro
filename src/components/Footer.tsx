import { Link } from "react-router-dom";
import { Droplets, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-muted py-10">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Droplets className="h-6 w-6" /> BloodLink
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Emergency blood donor finder serving the community with safe blood and saving lives.
          </p>
        </div>
        <div>
          <h4 className="font-display font-bold text-foreground">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/about" },
              { label: "Find Donor", path: "/search" },
              { label: "Register", path: "/register" },
            ].map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-foreground">Services</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Emergency Request",
              "Donor Search",
              "Blood Camps",
              "Health Screening",
            ].map((s) => (
              <li key={s} className="text-muted-foreground">{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> contact@bloodlink.org</li>
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Mumbai, Maharashtra</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
        © 2026 BloodLink. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
