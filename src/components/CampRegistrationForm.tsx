import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CampRegistrationFormProps {
  campName?: string;
  onClose?: () => void;
}

const CampRegistrationForm = ({ campName = "Blood Donation Camp", onClose }: CampRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    bloodGroup: "",
    age: "",
    phoneNumber: "",
    email: "",
    preferredTimeSlot: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.bloodGroup || !formData.age || !formData.phoneNumber || !formData.email || !formData.preferredTimeSlot) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    toast.success(
      `Registration successful! Thank you ${formData.fullName.split(" ")[0]} for saving lives. A confirmation email has been sent to ${formData.email}.`
    );
    
    // Reset form
    setFormData({
      fullName: "",
      bloodGroup: "",
      age: "",
      phoneNumber: "",
      email: "",
      preferredTimeSlot: ""
    });

    if (onClose) {
      setTimeout(onClose, 1500);
    }
  };

  return (
    <Card className="w-full max-w-lg card-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Register for {campName}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Please fill in your details to register for the upcoming blood donation camp
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleSelectChange("bloodGroup", value)}
              >
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="25"
                min="18"
                max="65"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="preferredTimeSlot">Preferred Time Slot *</Label>
            <Select
              value={formData.preferredTimeSlot}
              onValueChange={(value) => handleSelectChange("preferredTimeSlot", value)}
            >
              <SelectTrigger id="preferredTimeSlot">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12:00 PM - 4:00 PM)</SelectItem>
                <SelectItem value="evening">Evening (4:00 PM - 8:00 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-xs text-blue-900">
              ℹ️ A confirmation email will be sent to you shortly with camp details and important information.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Now"}
            </Button>
            {onClose && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CampRegistrationForm;
