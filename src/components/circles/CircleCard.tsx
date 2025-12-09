import { Circle, joinCircle, leaveCircle } from "@/lib/api/circles";
import { Button } from "@/components/ui/button";
import { Users, LogIn, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface CircleCardProps {
    circle: Circle;
    onUpdate?: () => void;
}

export function CircleCard({ circle, onUpdate }: CircleCardProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if clicking button
        try {
            setLoading(true);
            await joinCircle(circle.id);
            toast({ title: "Joined circle!", description: `You are now a member of ${circle.name}` });
            onUpdate?.();
        } catch (error) {
            toast({ title: "Error", description: "Failed to join circle", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await leaveCircle(circle.id);
            toast({ title: "Left circle", description: `You left ${circle.name}` });
            onUpdate?.();
        } catch (error) {
            toast({ title: "Error", description: "Failed to leave circle", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link to={`/circles/${circle.id}`} className="block h-full">
            <div className="h-full border-2 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-foreground rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bold text-white text-lg">
                            {circle.name.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    {circle.is_member ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50"
                            onClick={handleLeave}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 mr-1" />}
                            Leave
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleJoin}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 mr-1" />}
                            Join
                        </Button>
                    )}
                </div>

                <h3 className="font-bold text-lg mb-1 line-clamp-1">{circle.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                    {circle.description || "No description provided."}
                </p>

                <div className="flex items-center text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
                    <Users className="w-3 h-3 mr-1" />
                    {circle.member_count} members
                </div>
            </div>
        </Link>
    );
}
