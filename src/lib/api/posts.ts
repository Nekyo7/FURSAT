import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export interface Post {
    id: string;
    user_id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    circle_id?: string | null;
    // Joined data
    profiles?: {
        username: string;
        email: string;
        full_name?: string;
        avatar_url?: string | null;
    };
    likes_count?: number;
    is_liked?: boolean;
    is_saved?: boolean;
}

/**
 * Upload an image to Supabase storage
 */
export async function uploadPostImage(file: File, userId: string): Promise<string> {
    try {
        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `posts/${userId}/${fileName}`;

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from("post-images")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Error uploading image:", error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("post-images")
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error("Exception uploading image:", error);
        throw error;
    }
}

/**
 * Create a new post
 */
export async function createPost(content: string, file?: File, circleId?: string): Promise<Post> {
    try {
        // Verify session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("Session error:", sessionError);
            throw new Error("Failed to verify session");
        }

        if (!session) {
            throw new Error("No active session. Please sign in again.");
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        console.log("Creating post for user:", user.id);

        let imageUrl: string | null = null;

        // Upload image if provided
        if (file) {
            imageUrl = await uploadPostImage(file, user.id);
        }

        // Insert post
        const { data, error } = await supabase
            .from("posts")
            .insert({
                user_id: user.id,
                content,
                image_url: imageUrl,
                circle_id: circleId || null,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating post:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Exception creating post:", error);
        throw error;
    }
}

/**
 * Get all posts with user profiles, like counts, and save status
 */
export async function getPosts(circleId?: string): Promise<Post[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Get posts without join first
        let query = supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (circleId) {
            query = query.eq("circle_id", circleId);
        } else {
            query = query.is("circle_id", null);
        }

        const { data: posts, error } = await query;

        if (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }

        if (!posts || posts.length === 0) {
            return [];
        }

        // Get unique user IDs from posts
        const userIds = [...new Set(posts.map((p) => p.user_id))];

        // Fetch profiles for all users
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, email, full_name, avatar_url")
            .in("id", userIds);

        // Create a map of user_id to profile
        const profileMap: Record<string, { username: string; email: string; full_name?: string; avatar_url?: string | null }> = {};
        profiles?.forEach((profile) => {
            profileMap[profile.id] = {
                username: profile.username || "Anonymous",
                email: profile.email,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
            };
        });

        // Get like counts for all posts
        const postIds = posts.map((p) => p.id);
        const { data: likesData } = await supabase
            .from("likes")
            .select("post_id")
            .in("post_id", postIds);

        // Count likes per post
        const likeCounts: Record<string, number> = {};
        likesData?.forEach((like) => {
            likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1;
        });

        // Get current user's likes and saves if authenticated
        let userLikes: Set<string> = new Set();
        let userSaves: Set<string> = new Set();

        if (user) {
            const { data: likes } = await supabase
                .from("likes")
                .select("post_id")
                .eq("user_id", user.id)
                .in("post_id", postIds);

            const { data: saves } = await supabase
                .from("saves")
                .select("post_id")
                .eq("user_id", user.id)
                .in("post_id", postIds);

            userLikes = new Set(likes?.map((l) => l.post_id) || []);
            userSaves = new Set(saves?.map((s) => s.post_id) || []);
        }

        // Combine all data
        return posts.map((post) => ({
            ...post,
            profiles: profileMap[post.user_id] || { username: "Anonymous", email: "" },
            likes_count: likeCounts[post.id] || 0,
            is_liked: userLikes.has(post.id),
            is_saved: userSaves.has(post.id),
        }));
    } catch (error) {
        console.error("Exception fetching posts:", error);
        throw error;
    }
}

/**
 * Update a post (content only)
 */
export async function updatePost(postId: string, content: string): Promise<Post> {
    try {
        const { data, error } = await supabase
            .from("posts")
            .update({ content })
            .eq("id", postId)
            .select()
            .single();

        if (error) {
            console.error("Error updating post:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Exception updating post:", error);
        throw error;
    }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
    try {
        // Get post to check if it has an image
        const { data: post } = await supabase
            .from("posts")
            .select("image_url, user_id")
            .eq("id", postId)
            .single();

        // Delete image from storage if exists
        if (post?.image_url) {
            const urlParts = post.image_url.split("/");
            const filePath = `posts/${post.user_id}/${urlParts[urlParts.length - 1]}`;

            await supabase.storage
                .from("post-images")
                .remove([filePath]);
        }

        // Delete post (cascades to likes and saves)
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    } catch (error) {
        console.error("Exception deleting post:", error);
        throw error;
    }
}
