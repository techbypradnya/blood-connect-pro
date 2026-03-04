import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { donorApi, userApi } from "@/services/api";
import {
  LogOut,
  Phone,
  MapPin,
  Droplets,
  Mail,
  Save,
  CheckCircle2,
  XCircle,
  Activity,
  Ruler,
  Weight,
  Calendar,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

interface MedicalForm {
  height: string;
  weight: string;
  age: string;
  gender: string;
  hemoglobin: string;
  bloodPressure: string;
  lastDonationDate: string;
  hasMedicalConditions: boolean;
  medicalConditionsDesc: string;
  recentSurgery: boolean;
  onMedication: boolean;
}

const Dashboard = () => {
  const { user, token, logout, isAuthenticated, login } = useAuth();
  const [available, setAvailable] = useState(user?.available ?? true);
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState<MedicalForm>({
    height: "",
    weight: "",
    age: "",
    gender: "",
    hemoglobin: "",
    bloodPressure: "",
    lastDonationDate: "",
    hasMedicalConditions: false,
    medicalConditionsDesc: "",
    recentSurgery: false,
    onMedication: false,
  });

  // Load existing medical data from user
  useEffect(() => {
    if (user) {
      setForm({
        height: user.height?.toString() ?? "",
        weight: user.weight?.toString() ?? "",
        age: user.age?.toString() ?? "",
        gender: user.gender ?? "",
        hemoglobin: user.hemoglobin?.toString() ?? "",
        bloodPressure: user.bloodPressure ?? "",
        lastDonationDate: user.lastDonationDate
          ? new Date(user.lastDonationDate).toISOString().split("T")[0]
          : "",
        hasMedicalConditions: user.hasMedicalConditions ?? false,
        medicalConditionsDesc: user.medicalConditionsDesc ?? "",
        recentSurgery: user.recentSurgery ?? false,
        onMedication: user.onMedication ?? false,
      });
    }
  }, [user]);

  // Real-time BMI calculation
  const bmi = useMemo(() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);
    if (!h || !w || h <= 0) return null;
    const hm = h / 100;
    return parseFloat((w / (hm * hm)).toFixed(1));
  }, [form.height, form.weight]);

  // Client-side eligibility
  const eligibility = useMemo(() => {
    const reasons: string[] = [];
    const age = parseFloat(form.age);
    const weight = parseFloat(form.weight);
    const hb = parseFloat(form.hemoglobin);

    if (age && (age < 18 || age > 60)) reasons.push("Age must be between 18 and 60");
    if (weight && weight < 50) reasons.push("Minimum weight is 50 kg");
    if (bmi !== null) {
      if (bmi < 18.5) reasons.push("BMI is below 18.5 – underweight");
      else if (bmi > 35) reasons.push("BMI is above safe range");
    }
    if (hb && hb < 12.5) reasons.push("Hemoglobin must be above 12.5 g/dL");
    if (form.lastDonationDate) {
      const diff = (Date.now() - new Date(form.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);
      if (diff < 90) reasons.push("Minimum 3 months gap since last donation");
    }
    if (form.hasMedicalConditions) reasons.push("Existing medical conditions reported");
    if (form.recentSurgery) reasons.push("Recent surgery reported");
    if (form.onMedication) reasons.push("Currently on medication");

    const hasData = form.age || form.weight || form.hemoglobin;
    return { eligible: hasData ? reasons.length === 0 : null, reasons };
  }, [form, bmi]);

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

  const handleSaveMedical = async () => {
    // Client validation
    const age = parseFloat(form.age);
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height);
    const hemoglobin = parseFloat(form.hemoglobin);

    if (form.age && (isNaN(age) || age < 1 || age > 150)) {
      toast.error("Please enter a valid age");
      return;
    }
    if (form.weight && (isNaN(weight) || weight < 20 || weight > 300)) {
      toast.error("Please enter a valid weight (20–300 kg)");
      return;
    }
    if (form.height && (isNaN(height) || height < 50 || height > 300)) {
      toast.error("Please enter a valid height (50–300 cm)");
      return;
    }
    if (form.hemoglobin && (isNaN(hemoglobin) || hemoglobin < 0 || hemoglobin > 30)) {
      toast.error("Please enter a valid hemoglobin level");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      if (form.height) body.height = height;
      if (form.weight) body.weight = weight;
      if (form.age) body.age = age;
      if (form.gender) body.gender = form.gender;
      if (form.hemoglobin) body.hemoglobin = hemoglobin;
      if (form.bloodPressure) body.bloodPressure = form.bloodPressure;
      if (form.lastDonationDate) body.lastDonationDate = form.lastDonationDate;
      body.hasMedicalConditions = form.hasMedicalConditions;
      body.medicalConditionsDesc = form.hasMedicalConditions ? form.medicalConditionsDesc : "";
      body.recentSurgery = form.recentSurgery;
      body.onMedication = form.onMedication;

      const res = await userApi.update(user._id, body as any, token!);
      // Persist updated user to context
      login({ ...user, ...res.data, token: token! });
      toast.success("Medical profile saved successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const updateField = (field: keyof MedicalForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Donor Dashboard</h1>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-display text-xl font-bold text-accent-foreground">
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
            <Switch id="availability" checked={available} disabled={toggling} onCheckedChange={handleToggle} />
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Status */}
      {eligibility.eligible !== null && (
        <Card className={`border-2 ${eligibility.eligible ? "border-primary/40 bg-accent/50" : "border-destructive/40 bg-destructive/5"}`}>
          <CardContent className="flex items-start gap-3 py-4">
            {eligibility.eligible ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            )}
            <div className="space-y-1">
              <p className={`font-semibold ${eligibility.eligible ? "text-primary" : "text-destructive"}`}>
                {eligibility.eligible
                  ? "✅ You are eligible for blood donation."
                  : "❌ You are not eligible for blood donation."}
              </p>
              {!eligibility.eligible && (
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-0.5">
                  {eligibility.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* BMI Display */}
      {bmi !== null && (
        <Card className="card-shadow">
          <CardContent className="flex items-center gap-4 py-4">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Calculated BMI</p>
              <p className="text-2xl font-bold text-foreground">{bmi}</p>
            </div>
            <Badge
              variant={bmi >= 18.5 && bmi <= 35 ? "default" : "destructive"}
              className="ml-auto"
            >
              {bmi < 18.5 ? "Underweight" : bmi <= 24.9 ? "Normal" : bmi <= 29.9 ? "Overweight" : bmi <= 35 ? "Obese" : "High Risk"}
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Medical Details Form */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Heart className="h-5 w-5 text-primary" />
            Medical & Physical Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Height */}
            <div className="space-y-1.5">
              <Label htmlFor="height" className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-muted-foreground" /> Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={form.height}
                onChange={(e) => updateField("height", e.target.value)}
                min={50}
                max={300}
              />
            </div>

            {/* Weight */}
            <div className="space-y-1.5">
              <Label htmlFor="weight" className="flex items-center gap-1.5">
                <Weight className="h-3.5 w-3.5 text-muted-foreground" /> Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="65"
                value={form.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                min={20}
                max={300}
              />
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                min={1}
                max={150}
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hemoglobin */}
            <div className="space-y-1.5">
              <Label htmlFor="hemoglobin" className="flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-muted-foreground" /> Hemoglobin (g/dL)
              </Label>
              <Input
                id="hemoglobin"
                type="number"
                step="0.1"
                placeholder="14.0"
                value={form.hemoglobin}
                onChange={(e) => updateField("hemoglobin", e.target.value)}
                min={0}
                max={30}
              />
            </div>

            {/* Blood Pressure */}
            <div className="space-y-1.5">
              <Label htmlFor="bp">Blood Pressure</Label>
              <Input
                id="bp"
                type="text"
                placeholder="120/80"
                value={form.bloodPressure}
                onChange={(e) => updateField("bloodPressure", e.target.value)}
                maxLength={10}
              />
            </div>

            {/* Last Donation Date */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="lastDonation" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Last Donation Date
              </Label>
              <Input
                id="lastDonation"
                type="date"
                value={form.lastDonationDate}
                onChange={(e) => updateField("lastDonationDate", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Boolean toggles */}
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="medCond" className="font-medium">Any Existing Medical Conditions?</Label>
              <Switch
                id="medCond"
                checked={form.hasMedicalConditions}
                onCheckedChange={(v) => updateField("hasMedicalConditions", v)}
              />
            </div>
            {form.hasMedicalConditions && (
              <Textarea
                placeholder="Please describe your medical conditions..."
                value={form.medicalConditionsDesc}
                onChange={(e) => updateField("medicalConditionsDesc", e.target.value)}
                maxLength={500}
                className="mt-2"
              />
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="surgery" className="font-medium">Recent Surgery?</Label>
              <Switch
                id="surgery"
                checked={form.recentSurgery}
                onCheckedChange={(v) => updateField("recentSurgery", v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="meds" className="font-medium">Currently on Medication?</Label>
              <Switch
                id="meds"
                checked={form.onMedication}
                onCheckedChange={(v) => updateField("onMedication", v)}
              />
            </div>
          </div>

          <Button onClick={handleSaveMedical} disabled={saving} className="w-full gap-1.5">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Medical Details"}
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
