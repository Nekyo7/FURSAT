import { supabase } from "@/lib/supabase";

/**
 * Toggle like on a post
 * If user already liked, remove like. Otherwise, add like.
 */
export async function toggleLike(postId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        // Check if already liked
        const { data: existingLike } = await supabase
            .from("likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("post_id", postId)
            .single();

        if (existingLike) {
            // Unlike
            const { error } = await supabase
                .from("likes")
                .delete()
                .eq("user_id", user.id)
                .eq("post_id", postId);

            if (error) {
                console.error("Error removing like:", error);
                throw error;
            }

            return false; // Not liked anymore
        } else {
            // Like
            const { error } = await supabase
                .from("likes")
                .insert({
                    user_id: user.id,
                    post_id: postId,
                });

            if (error) {
                console.error("Error adding like:", error);
                throw error;
            }

            return true; // Now liked
        }
    } catch (error) {
        console.error("Exception toggling like:", error);
        throw error;
    }
}

/**
 * Get like count for a post
 */
export async function getLikeCount(postId: string): Promise<number> {
    try {
        const { count, error } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postId);

        if (error) {
            console.error("Error getting like count:", error);
            throw error;
        }

        return count || 0;
    } catch (error) {
        console.error("Exception getting like count:", error);
        throw error;
    }
}

/**
 * Check if current user liked a post
 */
export async function isPostLiked(postId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return false;
        }

        const { data } = await supabase
            .from("likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("post_id", postId)
            .single();

        return !!data;
    } catch (error) {
        console.error("Exception checking if post is liked:", error);
        return false;
    }
}
