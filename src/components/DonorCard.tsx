import { Phone, MapPin, Droplets, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DonorCardProps {
  name: string;
  bloodGroup: string;
  city: string;
  phone: string;
  available: boolean;
}

const DonorCard = ({ name, bloodGroup, city, phone, available }: DonorCardProps) => {
  return (
    <Card className="card-shadow transition-all duration-300 hover:card-shadow-hover">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">{name}</h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {city}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-primary">
            {bloodGroup}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" /> {phone}
        </div>

        <Badge
          variant={available ? "default" : "secondary"}
          className="w-fit gap-1"
        >
          {available ? (
            <><CheckCircle className="h-3 w-3" /> Available</>
          ) : (
            <><XCircle className="h-3 w-3" /> Not Available</>
          )}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default DonorCard;
