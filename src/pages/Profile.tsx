import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  Trophy,
  Zap,
  Users,
  FileText,
  Grid,
  Bookmark,
  Settings,
} from "lucide-react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ProjectsSection } from "@/components/profile/ProjectsSection";

const badges = [
  { icon: Trophy, label: "Top Contributor", color: "bg-secondary" },
  { icon: Zap, label: "30 Day Streak", color: "bg-accent" },
  { icon: Star, label: "Verified Student", color: "bg-info" },
  { icon: Award, label: "Club President", color: "bg-success" },
];

const skills = [
  { name: "React", verified: true },
  { name: "Python", verified: true },
  { name: "UI/UX Design", verified: false },
  { name: "Machine Learning", verified: false },
  { name: "Node.js", verified: true },
];

const projects = [
  {
    id: 1,
    title: "Campus Event Tracker",
    description: "A web app to track all campus events, RSVPs, and notifications",
    tech: ["React", "Node.js", "MongoDB"],
    likes: 45,
    views: 230,
  },
  {
    id: 2,
    title: "Study Group Finder",
    description: "Match with students for group study sessions based on courses",
    tech: ["Flutter", "Firebase"],
    likes: 32,
    views: 180,
  },
];

const experiences = [
  {
    id: 1,
    role: "Software Engineering Intern",
    company: "TechCorp India",
    duration: "Jun 2024 - Aug 2024",
    type: "Internship",
  },
  {
    id: 2,
    role: "Tech Lead",
    company: "Coding Club",
    duration: "Jan 2024 - Present",
    type: "Leadership",
  },
];

type TabType = "posts" | "projects" | "saved";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const { profile, user } = useAuth();

  const tabs = [
    { key: "posts" as TabType, icon: Grid, label: "Posts" },
    { key: "projects" as TabType, icon: FileText, label: "Projects" },
    { key: "saved" as TabType, icon: Bookmark, label: "Saved" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-card border-2 border-foreground shadow-md mb-6">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-accent via-secondary to-info border-b-2 border-foreground relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 bg-background border-4 border-foreground shadow-md flex items-center justify-center">
                <span className="font-bold text-3xl">
                  {profile?.username && profile.username.trim()
                    ? profile.username.slice(0, 2).toUpperCase()
                    : user?.email?.slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <EditProfileModal />
              <Button variant="outline" size="icon" className="w-9 h-9 bg-background">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="pt-14 px-6 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">
                    {profile?.full_name || (profile?.username && profile.username.trim()
                      ? profile.username
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                      : user?.email?.split("@")[0] || "User")}
                  </h1>
                  {user && (
                    <span className="w-5 h-5 bg-info border border-foreground flex items-center justify-center text-info-foreground text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {profile?.username && profile.username.trim()
                    ? `@${profile.username}`
                    : user?.email || "@user"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="accent" size="sm">
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </div>
            </div>

            <p className="mb-4 whitespace-pre-wrap">
              {profile?.bio || "No bio yet."}
            </p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
              {profile?.headline && (
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {profile.headline}
                </span>
              )}
              {profile?.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
              )}
              {profile?.website && (
                <span className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-info hover:underline"
                  >
                    {profile.website}
                  </a>
                </span>
              )}
              {/* Join date could be added here if available in profile */}
            </div>
          </div>

          {/* Badges */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className={`${badge.color} border-2 border-foreground px-3 py-1 flex items-center gap-2 shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Skills */}
            <SkillsSection userId={user?.id || ""} isOwnProfile={!!user} />

            {/* Experience */}
            <div className="bg-card border-2 border-foreground shadow-sm">
              <div className="p-4 border-b-2 border-foreground bg-muted flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  EXPERIENCE
                </h3>
                <Button variant="ghost" size="sm" className="h-7">
                  Add
                </Button>
              </div>
              <div className="divide-y-2 divide-foreground">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4">
                    <p className="font-bold">{exp.role}</p>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {exp.duration}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 border border-foreground ${exp.type === "Internship" ? "bg-info/20" : "bg-secondary"
                          }`}
                      >
                        {exp.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Circles */}
            <div className="bg-card border-2 border-foreground shadow-sm">
              <div className="p-4 border-b-2 border-foreground bg-muted">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  CIRCLES
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {["Tech Talk", "Placement Prep", "Coding Club", "Startup Hub"].map(
                    (circle) => (
                      <span
                        key={circle}
                        className="bg-muted border border-foreground px-2 py-1 text-sm font-medium"
                      >
                        c/{circle}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div>
            {/* Tabs */}
            <div className="flex border-2 border-foreground bg-card mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold transition-colors ${activeTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === "projects" && (
              <ProjectsSection userId={user?.id || ""} isOwnProfile={!!user} />
            )}

            {activeTab === "posts" && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted border-2 border-foreground flex items-center justify-center hover:opacity-80 cursor-pointer transition-opacity"
                  >
                    <Grid className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="bg-card border-2 border-foreground p-8 text-center">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-bold text-lg mb-2">No saved posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Posts you save will appear here
                </p>
                <Button variant="secondary">Browse Feed</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
