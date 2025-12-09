import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import { usePostActions } from "@/hooks/usePostActions";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Smile,
  Send,
  Filter,
  Flame,
  Activity,
  Hash,
  CalendarDays,
  Megaphone,
  Pin,
  Sparkles,
  Trophy,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useStories } from "@/hooks/useStories";
import { StoryUploader } from "@/components/StoryUploader";
import { StoryBubble } from "@/components/StoryBubble";
import { StoryViewer } from "@/components/StoryViewer";
import { PostCard } from "@/components/PostCard";

// Removed static stories array


const quickFilters = [
  "For you",
  "Club drops",
  "Opportunities",
  "Confessions",
  "Afterhours",
];

const campusPulse = [
  { label: "Active circles", value: "36 debates live", accent: "bg-accent" },
  { label: "New gigs today", value: "14 verified drops", accent: "bg-info" },
  { label: "Confessions queue", value: "87 pending", accent: "bg-secondary" },
];

const trendingTags = [
  { tag: "#CampusFest", heat: "12.4K posts" },
  { tag: "#BuildWeek", heat: "3.1K posts" },
  { tag: "#HostelStories", heat: "9.2K posts" },
  { tag: "#HireMe", heat: "4.8K posts" },
];

const upcomingEvents = [
  { title: "Midnight Jam Session", time: "Tonight • Media Circle" },
  { title: "VC Office Hours", time: "Wed • Startup Hub" },
  { title: "City Design Walkthrough", time: "Fri • Architecture Dept" },
];

const opportunitySpotlight = [
  { title: "UI Residency at Wipro", reward: "Stipend ₹35K", tag: "Design" },
  { title: "Hackathon Ops Crew", reward: "Paid • 3 weeks", tag: "Operations" },
];

const xpLeaderboard = [
  { user: "aanya_codes", xp: "12,340" },
  { user: "debate_chief", xp: "11,905" },
  { user: "media_society", xp: "11,220" },
];

export default function Feed() {
  const [activeFilter, setActiveFilter] = useState(quickFilters[0]);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [storyUploaderOpen, setStoryUploaderOpen] = useState(false);
  const [viewingStoryUser, setViewingStoryUser] = useState<string | null>(null);

  const { profile, user } = useAuth();
  const { posts, loading, error, refetch } = usePosts();
  const {
    groupedStories,
    userStories,
    refreshStories,
    markStoryAsViewed
  } = useStories();

  const { handleLike, handleSave, handleDelete, likingPosts, savingPosts, deletingPosts } = usePostActions(refetch);

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
        .replace("about ", "")
        .replace(" ago", "");
    } catch {
      return "just now";
    }
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,640px)_280px]">
          {/* Left rail */}
          <aside className="hidden lg:flex flex-col gap-4">
            <div className="bg-card border-2 border-foreground p-4 space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>CAMPUS PULSE</span>
                <Activity className="w-4 h-4" />
              </div>
              {campusPulse.map((item) => (
                <div
                  key={item.label}
                  className="border-2 border-dashed border-foreground/40 p-3"
                >
                  <p className="font-mono text-[11px] tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold">{item.value}</p>
                  <div className={`h-1 w-8 mt-2 ${item.accent}`} />
                </div>
              ))}
            </div>
            <div className="bg-secondary border-2 border-foreground p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-4 h-4" />
                <p className="font-mono text-xs">TRENDING TAGS</p>
              </div>
              <div className="space-y-3">
                {trendingTags.map((trend) => (
                  <div
                    key={trend.tag}
                    className="flex items-center justify-between text-sm font-semibold"
                  >
                    <span>{trend.tag}</span>
                    <span className="font-mono text-[11px] uppercase">
                      {trend.heat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border-2 border-foreground p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Megaphone className="w-4 h-4" />
                Broadcast something
              </div>
              <Button
                variant="outline"
                className="w-full border-2 border-dashed border-foreground"
                onClick={() => setCreatePostOpen(true)}
              >
                Create new post
              </Button>
            </div>
          </aside>

          {/* Middle column */}
          <section className="space-y-6">
            <div className="bg-card border-2 border-foreground p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase">
                  <Filter className="w-4 h-4" />
                  signal filters
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter) => (
                    <Button
                      key={filter}
                      size="sm"
                      variant={filter === activeFilter ? "default" : "ghost"}
                      className={`rounded-none px-4 ${filter === activeFilter
                        ? "border-2 border-foreground"
                        : "border border-dashed border-foreground"
                        }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-mono border-t border-muted pt-3">
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  {posts.length} posts loaded
                </span>
                <span>Noise filter: medium</span>
                <span>Location: campus-wide</span>
              </div>
            </div>

            {/* Stories */}
            <section className="border-2 border-foreground bg-muted/40 p-4">
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {/* Current User Story Bubble */}
                <StoryBubble
                  isCurrentUser
                  username={profile?.username || "You"}
                  avatarUrl={profile?.avatar_url}
                  onClick={() => {
                    if (userStories.length > 0) {
                      setViewingStoryUser(user?.id || null);
                    } else {
                      setStoryUploaderOpen(true);
                    }
                  }}
                />

                {/* Other Users' Stories */}
                {groupedStories.map((group) => (
                  <StoryBubble
                    key={group.user_id}
                    username={group.username}
                    avatarUrl={group.avatar_url}
                    hasUnviewed={group.hasUnviewed}
                    onClick={() => setViewingStoryUser(group.user_id)}
                  />
                ))}
              </div>
            </section>

            {/* Create Post - Quick version */}
            <section className="bg-card border-2 border-foreground shadow-sm p-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-accent border-2 border-foreground flex items-center justify-center shrink-0">
                  <span className="font-bold text-sm">
                    {profile?.username && profile.username.trim()
                      ? profile.username.slice(0, 2).toUpperCase()
                      : user?.email?.slice(0, 2).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => setCreatePostOpen(true)}
                    className="w-full text-left bg-transparent resize-none outline-none text-muted-foreground min-h-[80px] flex items-center"
                  >
                    Broadcast what the lecture slides won't...
                  </button>
                  <div className="flex items-center justify-between pt-3 border-t border-muted">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setCreatePostOpen(true)}>
                        <ImageIcon className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setCreatePostOpen(true)}>
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setCreatePostOpen(true)}>
                        <Smile className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => setCreatePostOpen(true)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Drop it
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Daily brief */}
            <section className="bg-secondary border-2 border-foreground p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>DAILY BRIEF</span>
                <Pin className="w-4 h-4" />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-card border-2 border-foreground p-3">
                  <p className="font-mono text-[11px] uppercase mb-1">
                    Circle wars
                  </p>
                  <p className="font-semibold text-sm">
                    Design vs Drama meme battle hits round 4
                  </p>
                </div>
                <div className="bg-card border-2 border-foreground p-3">
                  <p className="font-mono text-[11px] uppercase mb-1">
                    Gig radar
                  </p>
                  <p className="font-semibold text-sm">
                    Snap internship AMA at 6PM
                  </p>
                </div>
                <div className="bg-card border-2 border-foreground p-3">
                  <p className="font-mono text-[11px] uppercase mb-1">
                    Night feed
                  </p>
                  <p className="font-semibold text-sm">
                    Confessions queue unlocked
                  </p>
                </div>
              </div>
            </section>

            {/* Feed - Loading State */}
            {loading && (
              <section className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border-2 border-foreground shadow-sm p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-11 h-11 border-2 border-foreground" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </section>
            )}

            {/* Feed - Error State */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive p-6 text-center">
                <p className="font-bold mb-2">Failed to load posts</p>
                <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
                <Button onClick={refetch} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Feed - Posts */}
            {!loading && !error && (
              <section className="space-y-6">
                {posts.length === 0 ? (
                  <div className="bg-muted border-2 border-dashed border-foreground p-12 text-center">
                    <p className="font-bold text-lg mb-2">No posts yet</p>
                    <p className="text-muted-foreground mb-4">
                      Be the first to drop something!
                    </p>
                    <Button onClick={() => setCreatePostOpen(true)}>
                      Create Post
                    </Button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={user?.id || ""}
                      onUpdate={refetch}
                    />
                  ))
                )}
              </section>
            )}
          </section>

          {/* Right rail */}
          <aside className="hidden xl:flex flex-col gap-4">
            <div className="bg-card border-2 border-foreground p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <CalendarDays className="w-4 h-4" />
                UPCOMING SIGNALS
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.title}
                    className="border-2 border-dashed border-foreground/50 p-3"
                  >
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary border-2 border-foreground p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>OPPORTUNITY SPOTLIGHT</span>
                <Sparkles className="w-4 h-4" />
              </div>

              {opportunitySpotlight.map((item) => (
                <div
                  key={item.title}
                  className="bg-card border-2 border-foreground p-3"
                >
                  <p className="font-mono text-[11px] uppercase mb-1">
                    {item.tag}
                  </p>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.reward}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-card border-2 border-foreground p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Trophy className="w-4 h-4" />
                XP LEADERBOARD
              </div>
              <div className="space-y-2">
                {xpLeaderboard.map((item, index) => (
                  <div
                    key={item.user}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs">{index + 1}.</span>
                      {item.user}
                    </span>
                    <span className="font-mono text-xs">{item.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        onPostCreated={refetch}
      />

      <StoryUploader
        open={storyUploaderOpen}
        onOpenChange={setStoryUploaderOpen}
        onStoryCreated={refreshStories}
      />

      {viewingStoryUser && (
        <StoryViewer
          open={!!viewingStoryUser}
          onOpenChange={(open) => !open && setViewingStoryUser(null)}
          stories={
            viewingStoryUser === user?.id
              ? userStories
              : groupedStories.find(g => g.user_id === viewingStoryUser)?.stories || []
          }
          isCurrentUser={viewingStoryUser === user?.id}
          onStoryViewed={markStoryAsViewed}
          onDelete={() => refreshStories()}
        />
      )}
    </Layout>
  );
}
