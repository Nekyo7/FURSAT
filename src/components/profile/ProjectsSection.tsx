import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getProjects, addProject, updateProject, deleteProject, Project, CreateProjectData } from "@/lib/api/projects";
import { Plus, Trash2, Edit2, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectsSectionProps {
    userId: string;
    isOwnProfile: boolean;
    onUpdate?: () => void;
}

export function ProjectsSection({ userId, isOwnProfile, onUpdate }: ProjectsSectionProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadProjects();
    }, [userId]);

    const loadProjects = async () => {
        try {
            const data = await getProjects(userId);
            setProjects(data || []);
        } catch (error) {
            console.error("Failed to load projects", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
            onUpdate?.();
            toast({ title: "Project deleted" });
        } catch (error) {
            toast({ title: "Error deleting project", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-4">
            {isOwnProfile && (
                <ProjectModal
                    onSave={async (data) => {
                        const newProject = await addProject(data);
                        setProjects([newProject, ...projects]);
                        onUpdate?.();
                    }}
                    trigger={
                        <Button variant="outline" className="w-full border-2 border-dashed border-muted-foreground/50 hover:border-foreground hover:bg-muted">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Project
                        </Button>
                    }
                />
            )}

            <div className="grid gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-card border-2 border-foreground shadow-sm p-4 hover:shadow-md transition-shadow relative group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {project.title}
                            </h3>
                            {isOwnProfile && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ProjectModal
                                        project={project}
                                        onSave={async (data) => {
                                            const updated = await updateProject(project.id, data);
                                            setProjects(projects.map(p => p.id === project.id ? updated : p));
                                        }}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {project.description && (
                            <p className="text-muted-foreground mb-3 text-sm whitespace-pre-wrap">
                                {project.description}
                            </p>
                        )}

                        {project.link && (
                            <a
                                href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-info hover:underline font-medium"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View Project
                            </a>
                        )}
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No projects showcased yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ProjectModalProps {
    project?: Project;
    onSave: (data: CreateProjectData) => Promise<void>;
    trigger: React.ReactNode;
}

function ProjectModal({ project, onSave, trigger }: ProjectModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProjectData>({
        title: project?.title || "",
        description: project?.description || "",
        link: project?.link || "",
    });
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await onSave(formData);
            setOpen(false);
            if (!project) {
                setFormData({ title: "", description: "", link: "" });
            }
            toast({ title: project ? "Project updated" : "Project added" });
        } catch (error) {
            toast({ title: "Error saving project", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-2 border-foreground">
                <DialogHeader>
                    <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Portfolio Website"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Briefly describe your project..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="link">Project Link</Label>
                        <Input
                            id="link"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Project"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
