import { supabase } from "@/lib/supabase";
import { Post } from "./posts";

/**
 * Toggle save on a post
 * If user already saved, remove save. Otherwise, add save.
 */
export async function toggleSave(postId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        // Check if already saved
        const { data: existingSave } = await supabase
            .from("saves")
            .select("id")
            .eq("user_id", user.id)
            .eq("post_id", postId)
            .single();

        if (existingSave) {
            // Unsave
            const { error } = await supabase
                .from("saves")
                .delete()
                .eq("user_id", user.id)
                .eq("post_id", postId);

            if (error) {
                console.error("Error removing save:", error);
                throw error;
            }

            return false; // Not saved anymore
        } else {
            // Save
            const { error } = await supabase
                .from("saves")
                .insert({
                    user_id: user.id,
                    post_id: postId,
                });

            if (error) {
                console.error("Error adding save:", error);
                throw error;
            }

            return true; // Now saved
        }
    } catch (error) {
        console.error("Exception toggling save:", error);
        throw error;
    }
}

/**
 * Check if current user saved a post
 */
export async function isPostSaved(postId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return false;
        }

        const { data } = await supabase
            .from("saves")
            .select("id")
            .eq("user_id", user.id)
            .eq("post_id", postId)
            .single();

        return !!data;
    } catch (error) {
        console.error("Exception checking if post is saved:", error);
        return false;
    }
}

/**
 * Get all saved posts for current user
 */
export async function getSavedPosts(): Promise<Post[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        // Get saves for current user
        const { data: saves, error } = await supabase
            .from("saves")
            .select("post_id, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching saves:", error);
            throw error;
        }

        if (!saves || saves.length === 0) {
            return [];
        }

        // Get post IDs from saves
        const postIds = saves.map((s) => s.post_id);

        // Fetch posts
        const { data: posts } = await supabase
            .from("posts")
            .select("*")
            .in("id", postIds);

        if (!posts || posts.length === 0) {
            return [];
        }

        // Get unique user IDs from posts
        const userIds = [...new Set(posts.map((p) => p.user_id))];

        // Fetch profiles for all users
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, email")
            .in("id", userIds);

        // Create a map of user_id to profile
        const profileMap: Record<string, { username: string; email: string }> = {};
        profiles?.forEach((profile) => {
            profileMap[profile.id] = {
                username: profile.username || "Anonymous",
                email: profile.email,
            };
        });

        // Get like counts for all posts
        const { data: likesData } = await supabase
            .from("likes")
            .select("post_id")
            .in("post_id", postIds);

        // Count likes per post
        const likeCounts: Record<string, number> = {};
        likesData?.forEach((like) => {
            likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1;
        });

        // Get current user's likes
        const { data: userLikesData } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", user.id)
            .in("post_id", postIds);

        const userLikes = new Set(userLikesData?.map((l) => l.post_id) || []);

        // Combine all data and sort by save date
        const postsWithData = posts.map((post) => ({
            ...post,
            profiles: profileMap[post.user_id] || { username: "Anonymous", email: "" },
            likes_count: likeCounts[post.id] || 0,
            is_liked: userLikes.has(post.id),
            is_saved: true, // All these posts are saved
        }));

        // Sort by save date (maintain the order from saves query)
        const postOrderMap = new Map(postIds.map((id, index) => [id, index]));
        postsWithData.sort((a, b) => {
            const orderA = postOrderMap.get(a.id) ?? Infinity;
            const orderB = postOrderMap.get(b.id) ?? Infinity;
            return orderA - orderB;
        });

        return postsWithData;
    } catch (error) {
        console.error("Exception fetching saved posts:", error);
        throw error;
    }
}
