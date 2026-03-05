import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOOD_GROUPS } from "@/data/mockData";
import { donorApi, type DonorResult } from "@/services/api";
import DonorCard from "@/components/DonorCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<DonorResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await donorApi.search({
        bloodGroup: bloodGroup || undefined,
        city: city.trim() || undefined,
      });
      setResults(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Search failed";
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 animate-fade-in">
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

      {error && (
        <p className="mb-4 text-sm text-destructive">{error}</p>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-lg bg-muted animate-pulse" />
          ))}
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
                <DonorCard key={d._id} name={d.fullName} bloodGroup={d.bloodGroup} city={d.city} phone={d.phone} available={d.available} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
