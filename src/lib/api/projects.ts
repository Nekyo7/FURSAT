import { supabase } from "@/lib/supabase";

export interface Project {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    link?: string;
    created_at: string;
}

export interface CreateProjectData {
    title: string;
    description?: string;
    link?: string;
}

export async function getProjects(userId: string) {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }

    return data as Project[];
}

export async function addProject(project: CreateProjectData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("projects")
        .insert({
            user_id: user.id,
            title: project.title.trim(),
            description: project.description?.trim(),
            link: project.link?.trim(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding project:", error);
        throw error;
    }

    return data as Project;
}

export async function updateProject(id: string, updates: Partial<CreateProjectData>) {
    const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating project:", error);
        throw error;
    }

    return data as Project;
}

export async function deleteProject(id: string) {
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
}
