import { supabase } from "@/lib/supabase";

export interface ProfileUpdateData {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    headline?: string;
    location?: string;
    website?: string;
}

export async function updateProfile(userId: string, updates: ProfileUpdateData) {
    try {
        // Add updated_at timestamp
        const updateData = {
            ...updates,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", userId)
            .select()
            .single();

        if (error) {
            console.error("Error updating profile:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Exception updating profile:", error);
        throw error;
    }
}
