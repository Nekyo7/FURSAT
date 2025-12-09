import { supabase } from "@/lib/supabase";

export interface Skill {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
}

export async function getSkills(userId: string) {
    const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching skills:", error);
        throw error;
    }

    return data as Skill[];
}

export async function addSkill(name: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("skills")
        .insert({
            user_id: user.id,
            name: name.trim(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding skill:", error);
        throw error;
    }

    return data as Skill;
}

export async function deleteSkill(skillId: string) {
    const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skillId);

    if (error) {
        console.error("Error deleting skill:", error);
        throw error;
    }
}
