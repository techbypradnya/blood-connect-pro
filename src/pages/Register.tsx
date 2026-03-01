import { useState, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BLOOD_GROUPS } from "@/data/mockData";
import { authApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Field = memo(({ label, name, type = "text", placeholder, value, error, onChange }: { label: string; name: string; type?: string; placeholder?: string; value: string; error?: string; onChange: (value: string) => void }) => (
  <div className="space-y-1.5">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name} type={type} placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={error ? "border-destructive" : ""}
    />
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
));

Field.displayName = "Field";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", bloodGroup: "", city: "", state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFieldChange = useCallback((name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email is required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.phone.match(/^\+?\d[\d\s-]{7,}$/)) e.phone = "Valid phone number is required";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "donor",
        bloodGroup: form.bloodGroup,
        city: form.city,
        state: form.state,
      });
      login(res.data);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg card-shadow">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Donor Registration</CardTitle>
          <CardDescription>Join our network and help save lives</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" name="name" placeholder="John Doe" value={form.name} error={errors.name} onChange={(v) => handleFieldChange("name", v)} />
            <Field label="Email" name="email" type="email" placeholder="john@example.com" value={form.email} error={errors.email} onChange={(v) => handleFieldChange("email", v)} />
            <Field label="Password" name="password" type="password" placeholder="••••••••" value={form.password} error={errors.password} onChange={(v) => handleFieldChange("password", v)} />
            <Field label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} error={errors.phone} onChange={(v) => handleFieldChange("phone", v)} />

            <div className="space-y-1.5">
              <Label>Blood Group</Label>
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

            <Field label="City" name="city" placeholder="Mumbai" value={form.city} error={errors.city} onChange={(v) => handleFieldChange("city", v)} />
            <Field label="State" name="state" placeholder="Maharashtra" value={form.state} error={errors.state} onChange={(v) => handleFieldChange("state", v)} />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register as Donor"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
