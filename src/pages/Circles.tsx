import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Share2, 
  Bookmark,
  TrendingUp,
  Clock,
  Flame,
  Users,
  Plus,
  Search
} from "lucide-react";

const circles = [
  { id: 1, name: "Tech Talk", members: "12.5K", color: "bg-info" },
  { id: 2, name: "Campus Life", members: "8.2K", color: "bg-accent" },
  { id: 3, name: "Placement Prep", members: "15K", color: "bg-success" },
  { id: 4, name: "Memes", members: "20K", color: "bg-secondary" },
  { id: 5, name: "Lost & Found", members: "5K", color: "bg-warning" },
];

const threads = [
  {
    id: 1,
    circle: "Tech Talk",
    circleColor: "bg-info",
    author: "anonymous_coder",
    title: "Is anyone else struggling with the new DSA course? The professor's pace is insane",
    flair: "Discussion",
    flairColor: "bg-secondary",
    votes: 156,
    comments: 89,
    time: "3h",
    userVote: 0,
  },
  {
    id: 2,
    circle: "Placement Prep",
    circleColor: "bg-success",
    author: "future_googler",
    title: "Just got my dream offer! Here's my complete preparation strategy (6 months roadmap included)",
    flair: "Success Story",
    flairColor: "bg-accent",
    votes: 342,
    comments: 127,
    time: "5h",
    userVote: 1,
  },
  {
    id: 3,
    circle: "Campus Life",
    circleColor: "bg-accent",
    author: "foodie_student",
    title: "The new food court is a scam. ₹150 for a basic thali? Let's organize a boycott",
    flair: "Rant",
    flairColor: "bg-destructive",
    votes: 89,
    comments: 234,
    time: "1h",
    userVote: -1,
  },
  {
    id: 4,
    circle: "Memes",
    circleColor: "bg-secondary",
    author: "meme_lord_420",
    title: "POV: You're waiting for internship results and refreshing email every 5 seconds",
    flair: "Meme",
    flairColor: "bg-info",
    votes: 567,
    comments: 45,
    time: "8h",
    userVote: 0,
  },
];

type SortType = "hot" | "new" | "top";

export default function Circles() {
  const [activeSort, setActiveSort] = useState<SortType>("hot");
  const [threadList, setThreadList] = useState(threads);
  const [searchQuery, setSearchQuery] = useState("");

  const handleVote = (threadId: number, direction: 1 | -1) => {
    setThreadList(prev =>
      prev.map(thread => {
        if (thread.id === threadId) {
          const currentVote = thread.userVote;
          let newVote: number = direction;
          let voteDiff: number = direction;

          if (currentVote === direction) {
            newVote = 0;
            voteDiff = -direction;
          } else if (currentVote === -direction) {
            voteDiff = direction * 2;
          }

          return {
            ...thread,
            userVote: newVote,
            votes: thread.votes + voteDiff,
          };
        }
        return thread;
      })
    );
  };

  const sortButtons = [
    { key: "hot" as SortType, icon: Flame, label: "Hot" },
    { key: "new" as SortType, icon: Clock, label: "New" },
    { key: "top" as SortType, icon: TrendingUp, label: "Top" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* Main Content */}
          <div>
            {/* Search & Sort */}
            <div className="bg-card border-2 border-foreground shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search circles and threads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border-2 border-foreground pl-10 pr-4 py-2 outline-none focus:shadow-xs transition-shadow"
                  />
                </div>
                <div className="flex gap-1">
                  {sortButtons.map((btn) => {
                    const Icon = btn.icon;
                    return (
                      <Button
                        key={btn.key}
                        variant={activeSort === btn.key ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveSort(btn.key)}
                        className="gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {btn.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Threads */}
            <div className="space-y-4">
              {threadList.map((thread) => (
                <article
                  key={thread.id}
                  className="bg-card border-2 border-foreground shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center p-3 bg-muted border-r-2 border-foreground">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-8 h-8 ${
                          thread.userVote === 1 ? "text-success" : ""
                        }`}
                        onClick={() => handleVote(thread.id, 1)}
                      >
                        <ArrowUp className="w-5 h-5" />
                      </Button>
                      <span
                        className={`font-bold text-sm ${
                          thread.userVote === 1
                            ? "text-success"
                            : thread.userVote === -1
                            ? "text-destructive"
                            : ""
                        }`}
                      >
                        {thread.votes}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-8 h-8 ${
                          thread.userVote === -1 ? "text-destructive" : ""
                        }`}
                        onClick={() => handleVote(thread.id, -1)}
                      >
                        <ArrowDown className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
                        <span
                          className={`${thread.circleColor} border border-foreground px-2 py-0.5 font-bold`}
                        >
                          c/{thread.circle}
                        </span>
                        <span className="text-muted-foreground">
                          by u/{thread.author}
                        </span>
                        <span className="text-muted-foreground">• {thread.time}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 hover:text-info cursor-pointer">
                        {thread.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`${thread.flairColor} border border-foreground px-2 py-0.5 text-xs font-bold`}
                        >
                          {thread.flair}
                        </span>
                        <Button variant="ghost" size="sm" className="gap-1 h-8">
                          <MessageSquare className="w-4 h-4" />
                          {thread.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 h-8">
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 h-8">
                          <Bookmark className="w-4 h-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden md:block space-y-6">
            {/* Create Button */}
            <Button variant="accent" className="w-full gap-2">
              <Plus className="w-5 h-5" />
              Create Thread
            </Button>

            {/* Your Circles */}
            <div className="bg-card border-2 border-foreground shadow-sm">
              <div className="p-4 border-b-2 border-foreground bg-muted">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  YOUR CIRCLES
                </h3>
              </div>
              <div className="p-2">
                {circles.map((circle) => (
                  <button
                    key={circle.id}
                    className="w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-8 h-8 ${circle.color} border border-foreground flex items-center justify-center`}
                    >
                      <span className="font-bold text-xs">
                        {circle.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">c/{circle.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {circle.members} members
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t-2 border-foreground">
                <Button variant="outline" size="sm" className="w-full">
                  Browse All Circles
                </Button>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-card border-2 border-foreground shadow-sm">
              <div className="p-4 border-b-2 border-foreground bg-secondary">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  TRENDING NOW
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {["#PlacementSeason", "#CampusFest2024", "#ExamWeek", "#InternshipHunt"].map(
                  (tag, i) => (
                    <div key={tag} className="flex items-center justify-between">
                      <span className="font-mono font-bold">{tag}</span>
                      <span className="text-xs text-muted-foreground">
                        {(5 - i) * 1.2}K posts
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
