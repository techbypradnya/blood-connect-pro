import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/contexts/AuthContext";
import { donorApi } from "@/services/api";

import {
  LogOut,
  Edit,
  Phone,
  MapPin,
  Droplets,
  Mail,
  Calendar,
  Heart,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { toast } from "sonner";

const Dashboard = () => {
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [available, setAvailable] = useState(user?.available ?? true);
  const [toggling, setToggling] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [medicalConditions, setMedicalConditions] = useState<"yes" | "no" | "">("");
  const [onMedication, setOnMedication] = useState<"yes" | "no" | "">("");

  const [bmi, setBmi] = useState<number | null>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<boolean | null>(null);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleToggle = async (value: boolean) => {
    setToggling(true);
    try {
      await donorApi.updateAvailability(value, token!);
      setAvailable(value);
      toast.success(value ? "You are now available for donation" : "You are now unavailable");
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setToggling(false);
    }
  };

  const calculateBMI = (h: number, w: number) => {
    if (h > 0 && w > 0) {
      const heightMeters = h / 100;
      const bmiValue = w / (heightMeters * heightMeters);
      setBmi(Math.round(bmiValue * 10) / 10);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = parseFloat(e.target.value) || 0;
    setHeight(e.target.value);
    if (weight) calculateBMI(h, parseFloat(weight));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const w = parseFloat(e.target.value) || 0;
    setWeight(e.target.value);
    if (height) calculateBMI(parseFloat(height), w);
  };

  const checkEligibility = () => {
    setEligibilityChecked(true);

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const hemoglobinNum = parseFloat(hemoglobin);

    if (!height || !weight || !age || !hemoglobin || !lastDonationDate || !medicalConditions || !onMedication) {
      toast.error("Please fill all fields");
      return;
    }

    const ageValid = ageNum >= 18 && ageNum <= 60;
    const weightValid = weightNum >= 50;
    const bmiValid = bmi !== null && bmi >= 18.5;
    const hemoglobinValid = hemoglobinNum >= 12.5;

    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const days = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));

    const donationGapValid = days >= 90;

    const eligible =
      ageValid &&
      weightValid &&
      bmiValid &&
      hemoglobinValid &&
      donationGapValid &&
      medicalConditions === "no" &&
      onMedication === "no";

    setEligibilityStatus(eligible);

    if (eligible) {
      toast.success("You are eligible for blood donation.");
    } else {
      toast.error("You are currently not eligible for donation.");
    }
  };

  const totalDonations = 5;
  const livesSaved = totalDonations * 3;
  const nextEligibleDate = new Date(Date.now() + 90 * 86400000).toLocaleDateString();

  const upcomingRequests = [
    { id: 1, hospital: "City Hospital", bloodGroup: "O+", urgency: "High", requiredBefore: "2026-03-10" },
    { id: 2, hospital: "Apollo Hospital", bloodGroup: "B+", urgency: "Normal", requiredBefore: "2026-03-12" }
  ];

  const donationHistory = [
    { date: "2025-12-15", hospital: "City Hospital", bloodGroup: "O+", status: "Completed" },
    { date: "2025-09-20", hospital: "Apollo Hospital", bloodGroup: "O+", status: "Completed" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-5xl px-4 py-6 flex justify-between">
          <h1 className="text-2xl font-bold">Donor Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">

        <Tabs defaultValue="overview">

          <TabsList className="grid grid-cols-4 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">

            <div className="grid sm:grid-cols-3 gap-4 mt-6">

              <Card>
                <CardContent className="pt-6">
                  <p>Total Donations</p>
                  <p className="text-2xl font-bold">{totalDonations}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p>Lives Saved</p>
                  <p className="text-2xl font-bold">{livesSaved}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p>Next Eligible</p>
                  <p>{nextEligibleDate}</p>
                </CardContent>
              </Card>

            </div>

          </TabsContent>

          <TabsContent value="health">

            <Card>
              <CardHeader>
                <CardTitle>Health Eligibility Check</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <Input placeholder="Height (cm)" value={height} onChange={handleHeightChange}/>
                <Input placeholder="Weight (kg)" value={weight} onChange={handleWeightChange}/>
                <Input placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)}/>
                <Input placeholder="Hemoglobin (g/dL)" value={hemoglobin} onChange={(e)=>setHemoglobin(e.target.value)}/>
                <Input type="date" value={lastDonationDate} onChange={(e)=>setLastDonationDate(e.target.value)}/>

                {bmi && (
                  <p className="text-sm">BMI: <b>{bmi}</b></p>
                )}

                <Button className="w-full" onClick={checkEligibility}>
                  Check Eligibility
                </Button>

                {eligibilityChecked && eligibilityStatus !== null && (
                  <div className="p-3 border rounded">
                    {eligibilityStatus ? (
                      <p className="text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4"/> Eligible for donation
                      </p>
                    ) : (
                      <p className="text-red-600 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4"/> Not eligible currently
                      </p>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="history">

            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
              </CardHeader>

              <CardContent>

                {donationHistory.map((d,i)=>(
                  <div key={i} className="flex justify-between border-b py-3">
                    <div>
                      <p>{d.hospital}</p>
                      <p className="text-sm text-muted-foreground">{d.date}</p>
                    </div>
                    <Badge>{d.status}</Badge>
                  </div>
                ))}

              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="requests">

            <Card>
              <CardHeader>
                <CardTitle>Blood Requests</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                {upcomingRequests.map(req=>(
                  <div key={req.id} className="border rounded p-4">
                    <p className="font-semibold">{req.hospital}</p>
                    <p className="text-sm">Blood Group: {req.bloodGroup}</p>
                    <p className="text-xs">Required by {req.requiredBefore}</p>

                    <Button className="mt-3 w-full" disabled={!eligibilityStatus}>
                      Respond
                    </Button>
                  </div>
                ))}

              </CardContent>
            </Card>

          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
};

export default Dashboard;