import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { donorApi } from "@/services/api";
import { LogOut, Edit, Phone, MapPin, Droplets, Mail } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [available, setAvailable] = useState(user?.available ?? true);
  const [toggling, setToggling] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleToggle = async (value: boolean) => {
    setToggling(true);
    try {
      await donorApi.updateAvailability(value, token!);
      setAvailable(value);
      toast.success(value ? "You are now available for donation" : "You are now unavailable");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update";
      toast.error(message);
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = () => {
    logout();
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
            {user.bloodGroup}
          </div>
          <div>
            <CardTitle className="font-display text-xl">{user.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={MapPin} label="City" value={`${user.city}, ${user.state}`} />
            <InfoRow icon={Droplets} label="Blood Group" value={user.bloodGroup} />
            <InfoRow icon={Phone} label="Role" value={user.role} />
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
              disabled={toggling}
              onCheckedChange={handleToggle}
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
