import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getSkills, addSkill, deleteSkill, Skill } from "@/lib/api/skills";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SkillsSectionProps {
    userId: string;
    isOwnProfile: boolean;
}

export function SkillsSection({ userId, isOwnProfile }: SkillsSectionProps) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadSkills();
    }, [userId]);

    const loadSkills = async () => {
        try {
            const data = await getSkills(userId);
            setSkills(data || []);
        } catch (error) {
            console.error("Failed to load skills", error);
        }
    };

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        try {
            setLoading(true);
            const skill = await addSkill(newSkill);
            setSkills([...skills, skill]);
            setNewSkill("");
            toast({
                title: "Skill added",
                description: "Your skill has been added successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add skill. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        try {
            await deleteSkill(skillId);
            setSkills(skills.filter(s => s.id !== skillId));
            toast({
                title: "Skill deleted",
                description: "Skill removed from your profile.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete skill.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="bg-card border-2 border-foreground shadow-sm">
            <div className="p-4 border-b-2 border-foreground bg-muted flex items-center justify-between">
                <h3 className="font-bold">SKILLS</h3>
            </div>
            <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill) => (
                        <span
                            key={skill.id}
                            className="bg-secondary border-2 border-foreground px-2 py-1 text-sm font-medium flex items-center gap-1 group"
                        >
                            {skill.name}
                            {isOwnProfile && (
                                <button
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    className="ml-1 hover:text-destructive transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </span>
                    ))}
                    {skills.length === 0 && (
                        <p className="text-muted-foreground text-sm italic">No skills added yet.</p>
                    )}
                </div>

                {isOwnProfile && (
                    <form onSubmit={handleAddSkill} className="flex gap-2">
                        <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill (e.g. React)"
                            className="h-8 text-sm"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={loading || !newSkill.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
