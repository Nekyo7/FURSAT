import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  IndianRupee,
  Filter,
  Bookmark,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

const opportunities = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Razorpay",
    logo: "RZ",
    location: "Bangalore",
    type: "Internship",
    mode: "Hybrid",
    stipend: "₹50K/month",
    duration: "6 months",
    posted: "2 days ago",
    deadline: "Dec 15, 2024",
    skills: ["React", "TypeScript", "CSS"],
    applicants: 234,
    saved: false,
  },
  {
    id: 2,
    title: "ML Research Assistant",
    company: "Microsoft Research",
    logo: "MS",
    location: "Remote",
    type: "Part-time",
    mode: "Remote",
    stipend: "₹40K/month",
    duration: "3 months",
    posted: "1 week ago",
    deadline: "Dec 20, 2024",
    skills: ["Python", "PyTorch", "NLP"],
    applicants: 567,
    saved: true,
  },
  {
    id: 3,
    title: "Product Design Intern",
    company: "CRED",
    logo: "CR",
    location: "Bangalore",
    type: "Internship",
    mode: "On-site",
    stipend: "₹60K/month",
    duration: "4 months",
    posted: "3 days ago",
    deadline: "Dec 10, 2024",
    skills: ["Figma", "UI/UX", "Prototyping"],
    applicants: 189,
    saved: false,
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "Zerodha",
    logo: "ZD",
    location: "Bangalore",
    type: "Full-time",
    mode: "On-site",
    stipend: "₹18-25 LPA",
    duration: "Permanent",
    posted: "5 days ago",
    deadline: "Rolling",
    skills: ["Go", "PostgreSQL", "Redis"],
    applicants: 892,
    saved: false,
  },
];

const filters = {
  type: ["Internship", "Part-time", "Full-time", "Freelance"],
  mode: ["Remote", "Hybrid", "On-site"],
  duration: ["< 3 months", "3-6 months", "6+ months"],
};

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [opps, setOpps] = useState(opportunities);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleSave = (id: number) => {
    setOpps((prev) =>
      prev.map((opp) =>
        opp.id === id ? { ...opp, saved: !opp.saved } : opp
      )
    );
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">OPPORTUNITIES</h1>
          <p className="text-muted-foreground">
            Verified internships, jobs, and gigs from top companies
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-card border-2 border-foreground shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by role, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border-2 border-foreground pl-10 pr-4 py-2 outline-none focus:shadow-xs transition-shadow"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.type.map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Button>
            ))}
            <span className="border-l-2 border-foreground mx-2" />
            {filters.mode.map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <strong className="text-foreground">{opps.length}</strong>{" "}
            opportunities
          </p>
          <Button variant="ghost" size="sm" className="gap-2">
            Sort by: Relevance
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {opps.map((opp) => (
            <article
              key={opp.id}
              className="bg-card border-2 border-foreground shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-4 md:p-6">
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="w-14 h-14 bg-secondary border-2 border-foreground flex items-center justify-center shrink-0 shadow-xs">
                    <span className="font-bold text-lg">{opp.logo}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-lg hover:text-info cursor-pointer">
                          {opp.title}
                        </h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {opp.company}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9"
                          onClick={() => toggleSave(opp.id)}
                        >
                          <Bookmark
                            className={`w-5 h-5 ${
                              opp.saved ? "fill-current text-secondary" : ""
                            }`}
                          />
                        </Button>
                        <Button variant="accent" size="sm" className="gap-1">
                          Apply
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-info/20 border border-foreground px-2 py-0.5 text-xs font-bold">
                        {opp.type}
                      </span>
                      <span className="bg-muted border border-foreground px-2 py-0.5 text-xs font-bold">
                        {opp.mode}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {opp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {opp.stipend}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {opp.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {opp.applicants} applicants
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {opp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-background border border-foreground px-2 py-0.5 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-muted text-xs text-muted-foreground">
                  <span>Posted {opp.posted}</span>
                  <span
                    className={`font-bold ${
                      opp.deadline === "Rolling" ? "text-success" : "text-warning"
                    }`}
                  >
                    Deadline: {opp.deadline}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Opportunities
          </Button>
        </div>
      </div>
    </Layout>
  );
}
