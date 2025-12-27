import { useEffect } from "react";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { Check, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Assuming react-router-dom is used
import { cn } from "@/lib/utils";

interface ProfileCompletionMeterProps {
    userId: string;
    isOwnProfile: boolean;
    className?: string; // Add className prop for better flexibility
    refreshTrigger?: number; // Trigger refresh from parent
}

export function ProfileCompletionMeter({ userId, isOwnProfile, className, refreshTrigger }: ProfileCompletionMeterProps) {
    const { completion, loading, refresh } = useProfileCompletion(userId);

    useEffect(() => {
        refresh();
    }, [refreshTrigger]);

    if (!isOwnProfile) return null; // Only show for the user themselves

    // Optional: Hide if 100% complete
    // if (completion.percentage === 100) return null; 

    return (
        <Card className={cn("border-2 border-foreground shadow-sm", className)}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold">Profile Completion</CardTitle>
                    <span className="text-xl font-black text-primary transition-all duration-500 ease-in-out">{completion.percentage}%</span>
                </div>
                <Progress value={completion.percentage} className="h-3 border border-foreground transition-all duration-500" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mt-2">
                    <CompletionItem
                        label="Add a profile picture"
                        completed={completion.criteria.hasAvatar}
                    />
                    <CompletionItem
                        label="Write a bio"
                        completed={completion.criteria.hasBio}
                    />
                    <CompletionItem
                        label="Add at least one skill"
                        completed={completion.criteria.hasSkill}
                    />
                    <CompletionItem
                        label="Showcase a project"
                        completed={completion.criteria.hasProject}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function CompletionItem({ label, completed }: { label: string, completed: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border border-foreground transition-colors",
                completed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
            )}>
                {completed ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
            </div>
            <span className={cn(
                "text-sm font-medium transition-colors",
                completed ? "text-muted-foreground line-through" : "text-foreground"
            )}>
                {label}
            </span>
        </div>
    );
}
