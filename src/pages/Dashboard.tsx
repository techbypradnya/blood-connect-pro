import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockDonors } from "@/data/mockData";
import { LogOut, Edit, User, Phone, MapPin, Droplets, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const donor = mockDonors[0]; // Mock logged-in user
  const [available, setAvailable] = useState(donor.available);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Donor Dashboard</h1>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-display text-xl font-bold text-primary">
            {donor.bloodGroup}
          </div>
          <div>
            <CardTitle className="font-display text-xl">{donor.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{donor.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={Phone} label="Phone" value={donor.phone} />
            <InfoRow icon={MapPin} label="City" value={donor.city} />
            <InfoRow icon={Droplets} label="Blood Group" value={donor.bloodGroup} />
            <InfoRow icon={CalendarDays} label="Last Donation" value={donor.lastDonation} />
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="availability" className="font-medium">Availability Status</Label>
              <Badge variant={available ? "default" : "secondary"}>
                {available ? "Available" : "Not Available"}
              </Badge>
            </div>
            <Switch
              id="availability"
              checked={available}
              onCheckedChange={(v) => {
                setAvailable(v);
                toast.success(v ? "You are now available for donation" : "You are now unavailable");
              }}
            />
          </div>

          <Button variant="outline" className="w-full gap-1.5">
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default Dashboard;
