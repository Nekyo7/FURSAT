import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Image as ImageIcon,
  Video,
  FileText,
  Calendar,
  HelpCircle,
  X,
  Upload,
  Hash,
  AtSign,
  MapPin,
  Globe,
  Users,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PostType = "post" | "story" | "poll" | "event" | "question";

const postTypes = [
  { key: "post" as PostType, icon: FileText, label: "Post", color: "bg-secondary" },
  { key: "story" as PostType, icon: ImageIcon, label: "Story", color: "bg-accent" },
  { key: "poll" as PostType, icon: HelpCircle, label: "Poll", color: "bg-info" },
  { key: "event" as PostType, icon: Calendar, label: "Event", color: "bg-success" },
  { key: "question" as PostType, icon: HelpCircle, label: "Question", color: "bg-warning" },
];

const circles = [
  { id: 1, name: "Tech Talk" },
  { id: 2, name: "Campus Life" },
  { id: 3, name: "Placement Prep" },
  { id: 4, name: "Memes" },
];

export default function Create() {
  const [activeType, setActiveType] = useState<PostType>("post");
  const [content, setContent] = useState("");
  const [selectedCircle, setSelectedCircle] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<"public" | "circle" | "private">("public");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Posted!",
      description: "Your content has been shared successfully",
    });
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">CREATE</h1>

        {/* Post Type Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {postTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.key}
                variant={activeType === type.key ? "secondary" : "outline"}
                onClick={() => setActiveType(type.key)}
                className="gap-2"
              >
                <div
                  className={`w-6 h-6 ${type.color} border border-foreground flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {type.label}
              </Button>
            );
          })}
        </div>

        {/* Create Form */}
        <div className="bg-card border-2 border-foreground shadow-md">
          {/* Header */}
          <div className="p-4 border-b-2 border-foreground bg-muted flex items-center justify-between">
            <h2 className="font-bold">
              NEW {activeType.toUpperCase()}
            </h2>
            {selectedCircle && (
              <span className="bg-info border border-foreground px-2 py-0.5 text-xs font-bold">
                c/{circles.find((c) => c.id === selectedCircle)?.name}
              </span>
            )}
          </div>

          {/* Content Area */}
          <div className="p-4">
            {/* Circle Selector */}
            <div className="mb-4">
              <label className="block font-bold text-sm mb-2">POST TO</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCircle === null ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCircle(null)}
                >
                  My Feed
                </Button>
                {circles.map((circle) => (
                  <Button
                    key={circle.id}
                    variant={selectedCircle === circle.id ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCircle(circle.id)}
                  >
                    c/{circle.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Title (for events and questions) */}
            {(activeType === "event" || activeType === "question") && (
              <div className="mb-4">
                <label className="block font-bold text-sm mb-2">TITLE</label>
                <input
                  type="text"
                  placeholder={
                    activeType === "event"
                      ? "Event name..."
                      : "What's your question?"
                  }
                  className="w-full bg-background border-2 border-foreground px-4 py-3 outline-none focus:shadow-xs transition-shadow font-bold"
                />
              </div>
            )}

            {/* Main Content */}
            <div className="mb-4">
              <label className="block font-bold text-sm mb-2">
                {activeType === "post" && "CONTENT"}
                {activeType === "story" && "CAPTION"}
                {activeType === "poll" && "QUESTION"}
                {activeType === "event" && "DESCRIPTION"}
                {activeType === "question" && "DETAILS"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  activeType === "post"
                    ? "What's on your mind?"
                    : activeType === "story"
                    ? "Add a caption..."
                    : activeType === "poll"
                    ? "Ask a question..."
                    : activeType === "event"
                    ? "Describe your event..."
                    : "Add more context to your question..."
                }
                className="w-full bg-background border-2 border-foreground px-4 py-3 outline-none focus:shadow-xs transition-shadow min-h-[120px] resize-none"
              />
            </div>

            {/* Poll Options */}
            {activeType === "poll" && (
              <div className="mb-4">
                <label className="block font-bold text-sm mb-2">OPTIONS</label>
                <div className="space-y-2">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 bg-background border-2 border-foreground px-4 py-2 outline-none focus:shadow-xs transition-shadow"
                      />
                      {pollOptions.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePollOption(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {pollOptions.length < 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addPollOption}
                  >
                    + Add Option
                  </Button>
                )}
              </div>
            )}

            {/* Event Details */}
            {activeType === "event" && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-bold text-sm mb-2">DATE</label>
                  <input
                    type="date"
                    className="w-full bg-background border-2 border-foreground px-4 py-2 outline-none focus:shadow-xs transition-shadow"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">TIME</label>
                  <input
                    type="time"
                    className="w-full bg-background border-2 border-foreground px-4 py-2 outline-none focus:shadow-xs transition-shadow"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-sm mb-2">LOCATION</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Where is the event?"
                      className="w-full bg-background border-2 border-foreground pl-10 pr-4 py-2 outline-none focus:shadow-xs transition-shadow"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Upload */}
            {(activeType === "post" || activeType === "story") && (
              <div className="mb-4">
                <div className="border-2 border-dashed border-foreground p-8 text-center bg-muted">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-bold mb-1">Drop media here</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tags & Mentions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <Hash className="w-4 h-4" />
                Add Tags
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <AtSign className="w-4 h-4" />
                Mention
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MapPin className="w-4 h-4" />
                Location
              </Button>
            </div>

            {/* Visibility */}
            <div className="mb-4">
              <label className="block font-bold text-sm mb-2">VISIBILITY</label>
              <div className="flex gap-2">
                <Button
                  variant={visibility === "public" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setVisibility("public")}
                  className="gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Public
                </Button>
                <Button
                  variant={visibility === "circle" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setVisibility("circle")}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Circle Only
                </Button>
                <Button
                  variant={visibility === "private" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setVisibility("private")}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Private
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-foreground bg-muted flex justify-between">
            <Button variant="outline">Save Draft</Button>
            <Button variant="accent" onClick={handleSubmit}>
              {activeType === "event" ? "Create Event" : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
