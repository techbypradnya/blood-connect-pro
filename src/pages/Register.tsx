import { useState } from "react";
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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", bloodGroup: "", city: "", state: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login } = useAuth();

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
          <CardTitle className="font-display text-2xl">Donor Registration</CardTitle>
          <CardDescription>Join our network and help save lives</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" name="name" placeholder="John Doe" />
            <Field label="Email" name="email" type="email" placeholder="john@example.com" />
            <Field label="Password" name="password" type="password" placeholder="••••••••" />
            <Field label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" />

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

            <Field label="City" name="city" placeholder="Mumbai" />
            <Field label="State" name="state" placeholder="Maharashtra" />

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
