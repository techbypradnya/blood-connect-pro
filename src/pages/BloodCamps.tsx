import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, AlertTriangle, Search, Plus } from "lucide-react";
import { toast } from "sonner";

const BloodCamps = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);

  // Mock camp data
  const camps = [
    {
      id: 1,
      name: "Red Cross Blood Drive",
      date: "2026-03-15",
      time: "9:00 AM - 5:00 PM",
      location: "Mumbai Central",
      address: "123 Main Street, Mumbai, Maharashtra",
      organizer: "Red Cross Society",
      availableSlots: 45,
      totalSlots: 100,
      bloodGroupsNeeded: ["O+", "O-", "A+"],
      image: "🏥"
    },
    {
      id: 2,
      name: "City Hospital Camp",
      date: "2026-03-20",
      time: "10:00 AM - 4:00 PM",
      location: "Andheri West",
      address: "456 Hospital Road, Mumbai, Maharashtra",
      organizer: "City Hospital",
      availableSlots: 30,
      totalSlots: 80,
      bloodGroupsNeeded: ["B+", "B-", "AB+"],
      image: "🏨"
    },
    {
      id: 3,
      name: "Apollo Blood Donation Camp",
      date: "2026-03-25",
      time: "8:00 AM - 3:00 PM",
      location: "Bandra East",
      address: "789 Medical Lane, Mumbai, Maharashtra",
      organizer: "Apollo Hospitals",
      availableSlots: 60,
      totalSlots: 120,
      bloodGroupsNeeded: ["O+", "A+", "AB+", "B+"],
      image: "⚕️"
    },
    {
      id: 4,
      name: "NGO Health Initiative",
      date: "2026-04-05",
      time: "9:00 AM - 6:00 PM",
      location: "Worli",
      address: "321 Community Center, Mumbai, Maharashtra",
      organizer: "Health for All NGO",
      availableSlots: 25,
      totalSlots: 60,
      bloodGroupsNeeded: ["O-", "A-", "B-", "AB-"],
      image: "🎯"
    }
  ];

  const filteredCamps = camps.filter((camp) => {
    const locationMatch = camp.location.toLowerCase().includes(searchLocation.toLowerCase());
    const dateMatch = !filterDate || camp.date === filterDate;
    const bloodGroupMatch =
      !filterBloodGroup || camp.bloodGroupsNeeded.includes(filterBloodGroup);
    return locationMatch && dateMatch && bloodGroupMatch;
  });

  const handleRegisterCamp = (campId: number) => {
    toast.success("Successfully registered for the camp! Check your email for confirmation.");
  };

  const handleOrganizerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Camp organization request submitted! Our team will review and contact you soon.");
    setShowOrganizerForm(false);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero Section */}
      <section className="hero-gradient py-20 text-center text-primary-foreground">
        <div className="container mx-auto px-4">
          <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
            Join Us
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Blood Donation Camps
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Discover and register for upcoming blood donation camps in your area. Save lives by
            donating blood.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="border-b bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">Search by Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Enter location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Filter by Date</Label>
              <Input
                id="date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="blood">Blood Group</Label>
              <Select value={filterBloodGroup} onValueChange={setFilterBloodGroup}>
                <SelectTrigger id="blood">
                  <SelectValue placeholder="All blood groups" />
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
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchLocation("");
                  setFilterDate("");
                  setFilterBloodGroup("");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Camps Display Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                {filteredCamps.length} Upcoming Camps
              </h2>
              <p className="mt-1 text-muted-foreground">Register today and save lives</p>
            </div>
            <Button
              onClick={() => setShowOrganizerForm(true)}
              className="gap-2"
              size="lg"
            >
              <Plus className="h-4 w-4" /> Organize a Camp
            </Button>
          </div>

          {filteredCamps.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No camps found matching your filters. Try adjusting your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCamps.map((camp) => (
                <Card
                  key={camp.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 text-center">
                    <span className="text-4xl">{camp.image}</span>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{camp.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{camp.organizer}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Date & Time */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{camp.date}</p>
                          <p className="text-xs text-muted-foreground">{camp.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{camp.location}</p>
                          <p className="text-xs text-muted-foreground">{camp.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Available Slots */}
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {camp.availableSlots} of {camp.totalSlots} slots available
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${((camp.totalSlots - camp.availableSlots) / camp.totalSlots) *
                              100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Blood Groups Needed */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Blood Groups Needed
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {camp.bloodGroupsNeeded.map((bg) => (
                          <Badge key={bg} variant="secondary" className="text-xs">
                            {bg}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button
                      onClick={() => handleRegisterCamp(camp.id)}
                      className="w-full"
                      disabled={camp.availableSlots === 0}
                    >
                      {camp.availableSlots === 0 ? "Slots Full" : "Register Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Organizer Form Modal */}
      {showOrganizerForm && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg card-shadow">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle>Organize a Blood Donation Camp</CardTitle>
              <button
                onClick={() => setShowOrganizerForm(false)}
                className="text-2xl hover:text-muted-foreground"
              >
                ×
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOrganizerSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    placeholder="Your organization name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact-person">Contact Person Name</Label>
                  <Input
                    id="contact-person"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="org-email">Email</Label>
                    <Input
                      id="org-email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-phone">Phone Number</Label>
                    <Input
                      id="org-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="camp-location">Proposed Location</Label>
                  <Input
                    id="camp-location"
                    placeholder="City/Area name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="camp-date">Proposed Date</Label>
                    <Input
                      id="camp-date"
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="donor-count">Expected Donors</Label>
                    <Input
                      id="donor-count"
                      type="number"
                      placeholder="e.g., 100"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowOrganizerForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default BloodCamps;
