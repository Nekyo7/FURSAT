import { supabase } from "../supabase";

export interface Story {
    id: string;
    user_id: string;
    image_url: string;
    created_at: string;
    expires_at: string;
    user?: {
        username: string;
        avatar_url: string;
    };
}

export interface UserStoryGroup {
    user_id: string;
    username: string;
    avatar_url: string;
    stories: Story[];
    hasUnviewed: boolean;
}

export const uploadStoryImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("stories")
        .upload(filePath, file);

    if (uploadError) {
        console.error("Storage Upload Error:", uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage.from("stories").getPublicUrl(filePath);
    return data.publicUrl;
};

export const createStory = async (imageUrl: string): Promise<Story> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // Calculate 24h expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // 1. Insert story
    const { data: storyData, error: insertError } = await supabase
        .from("stories")
        .insert({
            user_id: user.id,
            image_url: imageUrl,
            expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

    if (insertError) {
        console.error("Database Insert Error:", insertError);
        throw insertError;
    }

    // 2. Fetch user profile
    const { data: profileData } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

    // 3. Combine
    return {
        ...storyData,
        user: {
            username: profileData?.username || "Unknown",
            avatar_url: profileData?.avatar_url || "",
        },
    };
};

export const fetchActiveStories = async (): Promise<Story[]> => {
    // 1. Fetch stories
    const { data: stories, error } = await supabase
        .from("stories")
        .select("*")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: true });

    if (error) throw error;
    if (!stories || stories.length === 0) return [];

    // 2. Fetch profiles
    const userIds = [...new Set(stories.map((s) => s.user_id))];
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

    // 3. Map profiles to stories
    const profileMap = new Map(profiles?.map((p) => [p.id, p]));

    return stories.map((story) => ({
        ...story,
        user: {
            username: profileMap.get(story.user_id)?.username || "Unknown",
            avatar_url: profileMap.get(story.user_id)?.avatar_url || "",
        },
    }));
};

export const fetchUserStories = async (userId: string): Promise<Story[]> => {
    // 1. Fetch stories
    const { data: stories, error } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", userId)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: true });

    if (error) throw error;
    if (!stories || stories.length === 0) return [];

    // 2. Fetch profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", userId)
        .single();

    // 3. Combine
    return stories.map((story) => ({
        ...story,
        user: {
            username: profile?.username || "Unknown",
            avatar_url: profile?.avatar_url || "",
        },
    }));
};

export const deleteStory = async (storyId: string): Promise<void> => {
    const { error } = await supabase.from("stories").delete().eq("id", storyId);
    if (error) throw error;
};
