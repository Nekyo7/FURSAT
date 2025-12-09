import { supabase } from "@/lib/supabase";

export interface NewsPost {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content?: string;
    category?: string;
    cover_image_url?: string;
    published: boolean;
    published_at?: string;
    author_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreateNewsPostData {
    title: string;
    slug: string;
    summary: string;
    content?: string;
    category?: string;
    cover_image_url?: string;
    published?: boolean;
}

export async function getNewsList(category?: string) {
    let query = supabase
        .from("news_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

    if (category && category !== "All") {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching news list:", error);
        throw error;
    }

    return data as NewsPost[];
}

export async function getNewsBySlug(slug: string) {
    const { data, error } = await supabase
        .from("news_posts")
        .select(`
            *,
            author:author_id (
                full_name,
                avatar_url
            )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single();

    if (error) {
        console.error("Error fetching news post:", error);
        throw error;
    }

    return data;
}

// Admin Functions

export async function getAllNewsPosts() {
    const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all news posts:", error);
        throw error;
    }

    return data as NewsPost[];
}

export async function getNewsPostById(id: string) {
    const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching news post by id:", error);
        throw error;
    }

    return data as NewsPost;
}

export async function createNewsPost(post: CreateNewsPostData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("news_posts")
        .insert({
            ...post,
            author_id: user.id,
            published_at: post.published ? new Date().toISOString() : null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating news post:", error);
        throw error;
    }

    return data as NewsPost;
}

export async function updateNewsPost(id: string, updates: Partial<CreateNewsPostData>) {
    const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
    };

    if (updates.published === true) {
        (updateData as any).published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("news_posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating news post:", error);
        throw error;
    }

    return data as NewsPost;
}

export async function deleteNewsPost(id: string) {
    const { error } = await supabase
        .from("news_posts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting news post:", error);
        throw error;
    }
}

export async function togglePublishNewsPost(id: string, published: boolean) {
    return updateNewsPost(id, { published });
}
