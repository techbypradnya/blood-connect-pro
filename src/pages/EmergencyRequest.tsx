import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BLOOD_GROUPS } from "@/data/mockData";
import { requestApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertTriangle, ShieldX, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const EmergencyRequest = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: "", bloodGroup: "", hospital: "", city: "", contact: "", unitsRequired: "1",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Client-side eligibility check mirroring backend rules
  const eligibility = useMemo(() => {
    if (!user) return { eligible: false, reasons: ["You must be logged in."] };
    const reasons: string[] = [];

    if (user.age != null) {
      if (user.age < 18 || user.age > 60) reasons.push("Age must be between 18 and 60 years");
    } else {
      reasons.push("Age is not set in your profile");
    }

    if (user.weight != null) {
      if (user.weight < 50) reasons.push("Minimum weight must be 50 kg");
    } else {
      reasons.push("Weight is not set in your profile");
    }

    if (user.weight != null && user.height != null && user.height > 0) {
      const heightM = user.height / 100;
      const bmi = user.weight / (heightM * heightM);
      if (bmi < 18.5) reasons.push("BMI is below 18.5 – underweight");
      else if (bmi > 35) reasons.push("BMI is above safe range");
    } else if (user.height == null) {
      reasons.push("Height is not set in your profile");
    }

    if (user.hemoglobin != null) {
      if (user.hemoglobin < 12.5) reasons.push("Hemoglobin must be above 12.5 g/dL");
    } else {
      reasons.push("Hemoglobin level is not set in your profile");
    }

    if (user.lastDonationDate) {
      const diff = (Date.now() - new Date(user.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);
      if (diff < 90) reasons.push("Minimum 3 months gap since last donation required");
    }

    if (user.hasMedicalConditions) reasons.push("Existing medical conditions reported");
    if (user.recentSurgery) reasons.push("Recent surgery reported");
    if (user.onMedication) reasons.push("Currently on medication");

    return { eligible: reasons.length === 0, reasons };
  }, [user]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!form.hospital.trim()) e.hospital = "Hospital name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.contact.match(/^\+?\d[\d\s-]{7,}$/)) e.contact = "Valid contact number is required";
    const units = parseInt(form.unitsRequired);
    if (isNaN(units) || units < 1 || units > 10) e.unitsRequired = "Units must be between 1 and 10";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit an emergency request");
      navigate("/login");
      return;
    }
    if (!validate()) return;
    setLoading(true);
    try {
      await requestApi.create({
        bloodGroup: form.bloodGroup,
        unitsRequired: parseInt(form.unitsRequired),
        hospitalName: form.hospital,
        city: form.city,
        contactNumber: form.contact,
      }, token!);
      toast.success("Emergency request submitted! Donors will be notified.");
      setForm({ patientName: "", bloodGroup: "", hospital: "", city: "", contact: "", unitsRequired: "1" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit request";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name} type={type} placeholder={placeholder}
        value={form[name as keyof typeof form]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className={errors[name] ? "border-destructive" : ""}
      />
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 animate-fade-in">
      <Card className="w-full max-w-lg card-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Emergency Blood Request</CardTitle>
          <CardDescription>Submit an urgent blood requirement</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Eligibility Banner */}
          {isAuthenticated && !eligibility.eligible && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <ShieldX className="h-5 w-5 text-destructive" />
              <AlertDescription>
                <p className="font-semibold text-destructive mb-2">
                  ❌ You are not eligible to submit a blood request
                </p>
                <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
                  {eligibility.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <Link to="/dashboard" className="inline-block mt-3 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Update your medical profile →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {isAuthenticated && eligibility.eligible && (
            <Alert className="mb-6 border-green-300 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  ✅ You are eligible for blood donation
                </p>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Patient Name" name="patientName" placeholder="Patient's full name" />

            <div className="space-y-1.5">
              <Label>Blood Group Required</Label>
              <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                <SelectTrigger className={errors.bloodGroup ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroup && <p className="text-xs text-destructive">{errors.bloodGroup}</p>}
            </div>

            <Field label="Units Required" name="unitsRequired" type="number" placeholder="1" />
            <Field label="Hospital Name" name="hospital" placeholder="City Hospital" />
            <Field label="City" name="city" placeholder="Mumbai" />
            <Field label="Contact Number" name="contact" type="tel" placeholder="+91 98765 43210" />

            <Button type="submit" className="w-full" disabled={loading || !eligibility.eligible}>
              {loading ? "Submitting..." : !eligibility.eligible ? "Ineligible – Cannot Submit" : "Submit Emergency Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyRequest;
