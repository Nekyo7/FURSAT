import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Circle, fetchCircles } from "@/lib/api/circles";
import { CircleCard } from "@/components/circles/CircleCard";
import { CreateCircleDialog } from "@/components/circles/CreateCircleDialog";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Circles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCircles = async () => {
    try {
      const data = await fetchCircles();
      setCircles(data);
    } catch (error) {
      console.error("Failed to load circles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCircles();
  }, []);

  const filteredCircles = circles.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Circles</h1>
            <p className="text-muted-foreground">
              Discover communities and connect with people who share your interests.
            </p>
          </div>
          <CreateCircleDialog onCircleCreated={loadCircles} />
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search circles..."
            className="pl-10 border-2 border-foreground h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-none" />
            ))}
          </div>
        ) : filteredCircles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCircles.map((circle) => (
              <CircleCard key={circle.id} circle={circle} onUpdate={loadCircles} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-muted-foreground/20">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No circles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or create a new circle!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
