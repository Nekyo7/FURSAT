import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Circle, fetchCircleDetails, joinCircle, leaveCircle } from "@/lib/api/circles";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, LogIn, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PostCard } from "@/components/PostCard";
import { CreatePostModal } from "@/components/CreatePostModal";
import { supabase } from "@/lib/supabase";

export default function CircleDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [circle, setCircle] = useState<Circle | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const { toast } = useToast();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Use the hook for posts
    const { posts, loading: postsLoading, refetch: refetchPosts } = usePosts(id);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };
        getUser();
    }, []);

    const loadCircle = async () => {
        if (!id) return;
        try {
            const data = await fetchCircleDetails(id);
            setCircle(data);
        } catch (error) {
            console.error("Error loading circle:", error);
            toast({ title: "Error", description: "Circle not found", variant: "destructive" });
            navigate("/circles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCircle();
    }, [id]);

    const handleJoin = async () => {
        if (!circle) return;
        try {
            setActionLoading(true);
            await joinCircle(circle.id);
            toast({ title: "Joined!", description: `Welcome to ${circle.name}` });
            loadCircle();
        } catch (error) {
            toast({ title: "Error", description: "Failed to join", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!circle) return;
        try {
            setActionLoading(true);
            await leaveCircle(circle.id);
            toast({ title: "Left circle", description: "You have left the circle." });
            loadCircle();
        } catch (error) {
            toast({ title: "Error", description: "Failed to leave", variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Skeleton className="h-40 w-full mb-8" />
                    <Skeleton className="h-10 w-1/3 mb-4" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </Layout>
        );
    }

    if (!circle) return null;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => navigate("/circles")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Circles
                </Button>

                {/* Circle Header */}
                <div className="bg-card border-2 border-foreground p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-foreground rounded-full flex items-center justify-center shrink-0 text-3xl font-bold text-white">
                            {circle.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                                <h1 className="text-3xl font-bold">{circle.name}</h1>
                                {circle.is_member ? (
                                    <Button
                                        variant="outline"
                                        className="text-destructive border-destructive/50 hover:bg-destructive/10"
                                        onClick={handleLeave}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                                        Leave Circle
                                    </Button>
                                ) : (
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={handleJoin}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                                        Join Circle
                                    </Button>
                                )}
                            </div>
                            <p className="text-lg text-muted-foreground mb-4">{circle.description}</p>
                            <div className="flex items-center text-sm font-medium">
                                <Users className="w-4 h-4 mr-2" />
                                {circle.member_count} members
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Discussion</h2>
                        {circle.is_member && (
                            <CreatePostModal
                                onPostCreated={refetchPosts}
                                circleId={circle.id} // Pass circleId to create post in this circle
                            />
                        )}
                    </div>

                    {!circle.is_member ? (
                        <div className="text-center py-12 bg-muted/20 border-2 border-dashed border-muted-foreground/20">
                            <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold mb-2">Join to view posts</h3>
                            <p className="text-muted-foreground mb-4">
                                This circle's discussions are for members only.
                            </p>
                            <Button onClick={handleJoin}>Join Circle</Button>
                        </div>
                    ) : postsLoading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <Skeleton key={i} className="h-60 w-full" />)}
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="space-y-6">
                            {posts.map(post => (
                                <PostCard key={post.id} post={post} currentUserId={currentUserId || ""} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
