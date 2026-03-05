import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const UpcomingCampsSection = () => {
  // Mock data for upcoming camps
  const upcomingCamps = [
    {
      id: 1,
      name: "Red Cross Blood Drive",
      date: "2026-03-15",
      location: "Mumbai Central",
      organizer: "Red Cross Society",
      availableSlots: 45,
      totalSlots: 100,
      bloodGroupsNeeded: ["O+", "A+"],
      image: "🏥"
    },
    {
      id: 2,
      name: "City Hospital Camp",
      date: "2026-03-20",
      location: "Andheri West",
      organizer: "City Hospital",
      availableSlots: 30,
      totalSlots: 80,
      bloodGroupsNeeded: ["B+", "AB+"],
      image: "🏨"
    },
    {
      id: 3,
      name: "Apollo Blood Donation Camp",
      date: "2026-03-25",
      location: "Bandra East",
      organizer: "Apollo Hospitals",
      availableSlots: 60,
      totalSlots: 120,
      bloodGroupsNeeded: ["O+", "A+", "AB+"],
      image: "⚕️"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-primary">
            Join Our Cause
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Upcoming Blood Donation Camps
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Discover and register for blood donation camps happening near you. Every donation can save up to three lives.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {upcomingCamps.map((camp) => (
            <Card
              key={camp.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 text-center">
                <span className="text-4xl">{camp.image}</span>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{camp.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{camp.organizer}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{camp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{camp.availableSlots} slots available</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {camp.bloodGroupsNeeded.map((bg) => (
                    <Badge key={bg} variant="secondary" className="text-xs">
                      {bg}
                    </Badge>
                  ))}
                </div>

                <Link to="/blood-camps">
                  <Button className="w-full">Register Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blood-camps">
            <Button size="lg" variant="outline">
              View All Camps →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingCampsSection;
