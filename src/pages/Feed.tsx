import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Smile,
  Send
} from "lucide-react";

const stories = [
  { id: 1, username: "your_story", isYou: true, hasNew: false },
  { id: 2, username: "raj_kumar", hasNew: true },
  { id: 3, username: "priya_s", hasNew: true },
  { id: 4, username: "tech_club", hasNew: true },
  { id: 5, username: "campus_life", hasNew: false },
  { id: 6, username: "drama_soc", hasNew: true },
];

const posts = [
  {
    id: 1,
    user: {
      username: "designclub_iit",
      avatar: "DC",
      verified: true,
    },
    content: "Just wrapped up our annual design sprint! 48 hours of pure creativity. Check out some of the concepts we came up with 🎨",
    image: true,
    likes: 234,
    comments: 45,
    shares: 12,
    time: "2h",
    liked: false,
    saved: false,
  },
  {
    id: 2,
    user: {
      username: "startup_hub",
      avatar: "SH",
      verified: true,
    },
    content: "🚀 BIG NEWS: Our incubator just got funding to support 10 more student startups this semester!\n\nApplications open next week. DM for early access to the form.",
    image: false,
    likes: 567,
    comments: 89,
    shares: 156,
    time: "4h",
    liked: true,
    saved: true,
  },
  {
    id: 3,
    user: {
      username: "aanya_codes",
      avatar: "AC",
      verified: false,
    },
    content: "Day 30 of #100DaysOfCode\n\nFinally got my React app deployed! It's a campus event tracker. Would love some feedback from fellow devs 👩‍💻",
    image: true,
    likes: 123,
    comments: 34,
    shares: 8,
    time: "6h",
    liked: false,
    saved: false,
  },
];

export default function Feed() {
  const [postContent, setPostContent] = useState("");
  const [feedPosts, setFeedPosts] = useState(posts);

  const toggleLike = (postId: number) => {
    setFeedPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const toggleSave = (postId: number) => {
    setFeedPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, saved: !post.saved }
          : post
      )
    );
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Stories */}
        <section className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {stories.map((story) => (
              <button
                key={story.id}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div
                  className={`w-16 h-16 border-2 border-foreground flex items-center justify-center ${
                    story.hasNew
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : ""
                  } ${story.isYou ? "bg-muted" : "bg-secondary"}`}
                >
                  {story.isYou ? (
                    <span className="text-2xl">+</span>
                  ) : (
                    <span className="font-bold text-sm">
                      {story.username.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium truncate w-16 text-center">
                  {story.isYou ? "Add Story" : story.username}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Create Post */}
        <section className="bg-card border-2 border-foreground shadow-sm mb-6 p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-accent border-2 border-foreground flex items-center justify-center shrink-0">
              <span className="font-bold text-sm">YU</span>
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's happening on campus?"
                className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[60px]"
              />
              <div className="flex items-center justify-between pt-3 border-t border-muted">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button variant="accent" size="sm" disabled={!postContent.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feed */}
        <section className="space-y-6">
          {feedPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card border-2 border-foreground shadow-sm"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary border-2 border-foreground flex items-center justify-center">
                    <span className="font-bold text-sm">{post.user.avatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{post.user.username}</span>
                      {post.user.verified && (
                        <span className="w-4 h-4 bg-info border border-foreground flex items-center justify-center text-info-foreground text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="border-t-2 border-b-2 border-foreground">
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${post.liked ? "text-destructive" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
                      />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="w-5 h-5" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => toggleSave(post.id)}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${post.saved ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </Layout>
  );
}
