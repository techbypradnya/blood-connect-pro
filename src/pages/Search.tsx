import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOOD_GROUPS, mockDonors, type Donor } from "@/data/mockData";
import DonorCard from "@/components/DonorCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<Donor[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const filtered = mockDonors.filter((d) => {
        const matchBG = !bloodGroup || d.bloodGroup === bloodGroup;
        const matchCity = !city.trim() || d.city.toLowerCase().includes(city.toLowerCase());
        return matchBG && matchCity;
      });
      setResults(filtered);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 font-display text-2xl font-bold">Find a Donor</h1>
      <p className="mb-6 text-muted-foreground">Search for available blood donors in your area</p>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-4 rounded-lg border bg-card p-5 card-shadow sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label>Blood Group</Label>
          <Select value={bloodGroup} onValueChange={setBloodGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Any blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label>City</Label>
          <Input placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <Button type="submit" className="gap-1.5" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
          Search
        </Button>
      </form>

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-2">Searching donors...</p>
        </div>
      )}

      {results !== null && !loading && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} donor{results.length !== 1 ? "s" : ""} found
          </p>
          {results.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No donors found matching your criteria. Try broadening your search.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((d) => (
                <DonorCard key={d.id} name={d.name} bloodGroup={d.bloodGroup} city={d.city} phone={d.phone} available={d.available} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
