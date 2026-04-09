import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/services/api";
import { BLOOD_GROUPS } from "@/data/mockData";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const phoneRegex = /^\+?\d[\d\s-]{7,}$/;

const Profile = () => {
  const { user, token, isAuthenticated, setUserData } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const [form, setForm] = useState({
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    bloodGroup: user.bloodGroup ?? "",
    age: user.age != null ? String(user.age) : "",
    weight: user.weight != null ? String(user.weight) : "",
    height: user.height != null ? String(user.height) : "",
    phone: (user as unknown as { phone?: string }).phone ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    lastDonationDate: user.lastDonationDate ?? "",
    available: user.available ?? true,
  });

  const computedBmi = useMemo(() => {
    const h = Number(form.height);
    const w = Number(form.weight);
    if (!h || !w) return null;
    const hm = h / 100;
    const bmi = w / (hm * hm);
    return Math.round(bmi * 10) / 10;
  }, [form.height, form.weight]);

  const validate = () => {
    if (!form.bloodGroup) return "Blood group must be selected";
    if (form.age && Number(form.age) < 18) return "Age must be ≥ 18";
    if (form.weight && Number(form.weight) < 50) return "Weight must be ≥ 50";
    if (form.phone && !phoneRegex.test(form.phone)) return "Phone must be valid";
    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        bloodGroup: form.bloodGroup,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        bmi: computedBmi ?? undefined,
        phone: form.phone.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        lastDonationDate: form.lastDonationDate ? form.lastDonationDate : undefined,
        available: form.available,
      };

      const res = await userApi.updateProfile(payload, token!);
      // Update app auth state immediately so Dashboard/UI refreshes without reload
      setUserData({ ...(user as any), ...(res.data as any) });
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 animate-fade-in">
      <Card className="w-full max-w-2xl card-shadow">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Your Profile</CardTitle>
          <CardDescription>Update your personal and health details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Blood Group</Label>
                <Select value={form.bloodGroup} onValueChange={(v) => setForm((p) => ({ ...p, bloodGroup: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={form.height} onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastDonationDate">Last Donation Date</Label>
              <Input
                id="lastDonationDate"
                type="date"
                value={form.lastDonationDate}
                onChange={(e) => setForm((p) => ({ ...p, lastDonationDate: e.target.value }))}
              />
            </div>

            <div className="rounded-lg border bg-card p-3 text-sm text-muted-foreground">
              BMI (auto): <span className="font-medium text-foreground">{computedBmi ?? "—"}</span>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

