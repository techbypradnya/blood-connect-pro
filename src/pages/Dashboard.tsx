import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/services/api";

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
  AlertCircle,
  User,
  Activity,
  History,
  MapPinIcon,
  Loader2,
  Award,
  Users,
  Clock,
  UserCircle
} from "lucide-react";

import { toast } from "sonner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BMIResult {
  value: number;
  category: string;
  eligible: boolean;
  color: string;
}

const Dashboard = () => {
  const { user, token, logout, isAuthenticated, setUserData } = useAuth();
  const navigate = useNavigate();

  // Availability toggle
  const [available, setAvailable] = useState(user?.available ?? true);
  const [toggling, setToggling] = useState(false);

  // BMI Calculator State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock data for dashboard
  const totalDonations = 5;
  const livesSaved = totalDonations * 3;
  const lastDonationDate = "2025-12-15";

  const upcomingRequests = [
    { id: 1, patientBloodGroup: "A+", hospital: "City Hospital", urgency: "High", location: "Mumbai" },
    { id: 2, patientBloodGroup: "B+", hospital: "Apollo Hospital", urgency: "Normal", location: "Delhi" }
  ];

  const donationHistory = [
    { date: "2025-12-15", hospital: "City Hospital", bloodGroup: "O+", units: 1, status: "Completed" },
    { date: "2025-09-20", hospital: "Apollo Hospital", bloodGroup: "O+", units: 1, status: "Completed" },
    { date: "2025-06-10", hospital: "Max Hospital", bloodGroup: "O+", units: 1, status: "Completed" }
  ];

  const upcomingCamps = [
    { id: 1, name: "Red Cross Blood Drive", date: "2026-03-15", location: "Mumbai Central", time: "9:00 AM - 5:00 PM" },
    { id: 2, name: "City Hospital Camp", date: "2026-03-20", location: "Andheri West", time: "10:00 AM - 4:00 PM" }
  ];

  // helpers
  const getDaysUntilNext = () => {
    const next = new Date(lastDonationDate);
    next.setDate(next.getDate() + 90);
    const diff = next.getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} day${days === 1 ? "" : "s"}` : "Today";
  };

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
      const res = await userApi.updateProfile({ available: value }, token!);
      setUserData({ ...(user as any), ...(res.data as any) });
      setAvailable(value);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setToggling(false);
    }
  };

  const calculateBMI = async () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!heightNum || !weightNum) {
      toast.error("Please enter both height and weight");
      return;
    }

    if (heightNum < 50 || heightNum > 300) {
      toast.error("Please enter a valid height (50-300 cm)");
      return;
    }

    if (weightNum < 50 || weightNum > 300) {
      toast.error("Weight must be ≥ 50 kg");
      return;
    }

    setIsCalculating(true);

    const heightMeters = heightNum / 100;
    const bmiValue = weightNum / (heightMeters * heightMeters);
    const roundedBMI = Math.round(bmiValue * 10) / 10;

      let category: string;
      let eligible: boolean;
      let color: string;

      if (roundedBMI < 18.5) {
        category = "Underweight";
        eligible = false;
        color = "text-orange-600 bg-orange-50 border-orange-200";
      } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
        category = "Normal";
        eligible = true;
        color = "text-green-600 bg-green-50 border-green-200";
      } else if (roundedBMI >= 25 && roundedBMI < 30) {
        category = "Overweight";
        eligible = true;
        color = "text-yellow-600 bg-yellow-50 border-yellow-200";
      } else {
        category = "Obese";
        eligible = false;
        color = "text-red-600 bg-red-50 border-red-200";
      }

      const result: BMIResult = {
        value: roundedBMI,
        category,
        eligible,
        color
      };

    setBmiResult(result);

    try {
      const res = await userApi.updateProfile({ height: heightNum, weight: weightNum, bmi: roundedBMI }, token!);
      setUserData({ ...(user as any), ...(res.data as any) });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsCalculating(false);
    }
  };

  const getEligibilityText = (eligible: boolean) => {
    return eligible ? "Eligible for donation" : "Not eligible for donation";
  };

  const getNextEligibleDate = () => {
    const lastDonation = new Date(lastDonationDate);
    const nextDate = new Date(lastDonation.getTime() + 90 * 24 * 60 * 60 * 1000);
    return nextDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Blood Connect Pro</h1>
                <p className="text-sm text-gray-600">Donor Dashboard</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user.fullName}!</h2>
                <p className="text-red-100">Blood Group: {user.bloodGroup} • {user.city}, {user.state}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    <Award className="h-3 w-3 mr-1" />
                    {totalDonations} Donations
                  </Badge>
                  <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    <Heart className="h-3 w-3 mr-1" />
                    {livesSaved} Lives Saved
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="availability" className="text-white">Available for donation</Label>
                <Switch
                  id="availability"
                  checked={available}
                  onCheckedChange={handleToggle}
                  disabled={toggling}
                />
              </div>
              <p className="text-sm text-red-100">
                Status: <span className={available ? "text-green-300" : "text-yellow-300"}>
                  {available ? "Available" : "Unavailable"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BMI Health Check Card */}
          <Card className="md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-red-600" />
                <span>Health Eligibility Check</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={calculateBMI}
                className="w-full"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Check Eligibility"
                )}
              </Button>

              {bmiResult && (
                <Alert className={`${bmiResult.color} border`}>
                  <div className="flex items-center space-x-2">
                    {bmiResult.eligible ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <div>
                      <p className="font-semibold">BMI: {bmiResult.value}</p>
                      <p className="text-sm">{bmiResult.category}</p>
                      <p className="text-sm">{getEligibilityText(bmiResult.eligible)}</p>
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Blood Requests Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-red-600" />
                <span>Blood Requests Near You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{req.hospital}</h4>
                      <Badge variant={req.urgency === "High" ? "destructive" : "secondary"} className="text-xs">
                        {req.urgency}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Droplets className="h-3 w-3 mr-1" />
                        {req.patientBloodGroup}
                      </p>
                      <p className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {req.location}
                      </p>
                    </div>
                    <Button size="sm" className="w-full mt-3" disabled={!bmiResult?.eligible}>
                      Respond to Request
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation History Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5 text-red-600" />
                <span>Donation History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donationHistory.map((donation, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{donation.hospital}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {donation.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {donation.bloodGroup}
                      </Badge>
                      <p className="text-xs text-green-600 mt-1">{donation.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All History
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Camps Card */}
          <Card className="md:col-span-2 lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span>Upcoming Blood Donation Camps</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingCamps.map((camp) => (
                  <div key={camp.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-sm mb-2">{camp.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {camp.date}
                      </p>
                      <p className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {camp.location}
                      </p>
                      <p className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {camp.time}
                      </p>
                    </div>
                    <Link to="/blood-camps">
                      <Button size="sm" className="w-full mt-3" variant="outline">
                        Register for Camp
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-red-600" />
                <span>Your Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{totalDonations}</div>
                  <div className="text-sm text-gray-600">Total Donations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{livesSaved}</div>
                  <div className="text-sm text-gray-600">Lives Saved</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600 mb-1">Next Eligible Date</div>
                <div className="font-medium">{getNextEligibleDate()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;