import { useState, useEffect } from "react";
import { getPosts, Post } from "@/lib/api/posts";
import { supabase } from "@/lib/supabase";

interface UsePostsReturn {
    posts: Post[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch posts with real-time updates
 */
export function usePosts(circleId?: string): UsePostsReturn {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPosts(circleId);
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchPosts();

        // Subscribe to real-time changes
        const channel = supabase
            .channel(`posts-changes-${circleId || 'global'}`)
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: "public",
                    table: "posts",
                    filter: circleId ? `circle_id=eq.${circleId}` : `circle_id=is.null`,
                },
                (payload) => {
                    console.log("Post change detected:", payload);
                    // Refetch posts when any change occurs
                    fetchPosts();
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [circleId]); // Re-run when circleId changes

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts,
    };
}
