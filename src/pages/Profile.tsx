import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit3,
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
                <span className="font-bold text-3xl">AK</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
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
                  <h1 className="text-2xl font-bold">Aditya Kumar</h1>
                  <span className="w-5 h-5 bg-info border border-foreground flex items-center justify-center text-info-foreground text-xs">
                    ✓
                  </span>
                </div>
                <p className="text-muted-foreground">@aditya_codes</p>
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

            <p className="mb-4">
              CS undergrad passionate about building products that matter. 
              Currently exploring the intersection of AI and education. 
              Open to internship opportunities! 🚀
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                IIT Delhi • B.Tech CS '26
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                New Delhi, India
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined March 2023
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-info hover:underline">
                  github.com/adityak
                </a>
              </span>
            </div>

            <div className="flex gap-6 text-sm">
              <span>
                <strong className="text-foreground">1,234</strong>{" "}
                <span className="text-muted-foreground">Followers</span>
              </span>
              <span>
                <strong className="text-foreground">567</strong>{" "}
                <span className="text-muted-foreground">Following</span>
              </span>
              <span>
                <strong className="text-foreground">4,500</strong>{" "}
                <span className="text-muted-foreground">XP</span>
              </span>
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
            <div className="bg-card border-2 border-foreground shadow-sm">
              <div className="p-4 border-b-2 border-foreground bg-muted flex items-center justify-between">
                <h3 className="font-bold">SKILLS</h3>
                <Button variant="ghost" size="sm" className="h-7">
                  Add
                </Button>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`border-2 border-foreground px-2 py-1 text-sm font-medium flex items-center gap-1 ${
                        skill.verified ? "bg-success/20" : "bg-muted"
                      }`}
                    >
                      {skill.name}
                      {skill.verified && (
                        <span className="w-3 h-3 bg-success text-success-foreground text-[8px] flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

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
                        className={`text-xs px-2 py-0.5 border border-foreground ${
                          exp.type === "Internship" ? "bg-info/20" : "bg-secondary"
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
                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold transition-colors ${
                      activeTab === tab.key
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
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-card border-2 border-foreground shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                    <p className="text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="bg-info/20 border border-foreground px-2 py-0.5 text-xs font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>❤️ {project.likes}</span>
                      <span>👁️ {project.views} views</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add New Project
                </Button>
              </div>
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
