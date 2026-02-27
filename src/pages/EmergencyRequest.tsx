import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BLOOD_GROUPS } from "@/data/mockData";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

const EmergencyRequest = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: "", bloodGroup: "", hospital: "", city: "", contact: "", requiredDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!form.hospital.trim()) e.hospital = "Hospital name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.contact.match(/^\+?\d[\d\s-]{7,}$/)) e.contact = "Valid contact number is required";
    if (!form.requiredDate) e.requiredDate = "Required date is needed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Emergency request submitted! Donors will be notified.");
      setForm({ patientName: "", bloodGroup: "", hospital: "", city: "", contact: "", requiredDate: "" });
    }, 1000);
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg card-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Emergency Blood Request</CardTitle>
          <CardDescription>Submit an urgent blood requirement</CardDescription>
        </CardHeader>
        <CardContent>
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

            <Field label="Hospital Name" name="hospital" placeholder="City Hospital" />
            <Field label="City" name="city" placeholder="Mumbai" />
            <Field label="Contact Number" name="contact" type="tel" placeholder="+91 98765 43210" />
            <Field label="Required Date" name="requiredDate" type="date" />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Emergency Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyRequest;
