import { supabase } from "../supabase";

export interface Circle {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
    cover_image_url: string | null;
    created_at: string;
    member_count?: number;
    is_member?: boolean;
}

export interface CircleMember {
    circle_id: string;
    user_id: string;
    role: "admin" | "moderator" | "member";
    joined_at: string;
    user?: {
        username: string;
        avatar_url: string;
    };
}

export const createCircle = async (
    name: string,
    description: string
): Promise<Circle> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // 1. Create Circle
    const { data: circle, error: circleError } = await supabase
        .from("circles")
        .insert({
            name,
            description,
            owner_id: user.id,
        })
        .select()
        .single();

    if (circleError) {
        console.error("Error creating circle (DB insert):", circleError);
        throw circleError;
    }

    // 2. Auto-join owner as admin
    const { error: memberError } = await supabase.from("circle_members").insert({
        circle_id: circle.id,
        user_id: user.id,
        role: "admin",
    });

    if (memberError) {
        console.error("Error adding owner to circle:", memberError);
        // Optional: rollback circle creation if this fails
    }

    return circle;
};

export const fetchCircles = async (): Promise<Circle[]> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("circles")
        .select("*, circle_members(count)");

    if (error) throw error;

    // Check membership if user is logged in
    let myCircleIds = new Set<string>();
    if (user) {
        const { data: myMemberships } = await supabase
            .from("circle_members")
            .select("circle_id")
            .eq("user_id", user.id);

        myMemberships?.forEach((m) => myCircleIds.add(m.circle_id));
    }

    return data.map((circle: any) => ({
        ...circle,
        member_count: circle.circle_members?.[0]?.count || 0,
        is_member: myCircleIds.has(circle.id),
    }));
};

export const fetchUserCircles = async (userId: string): Promise<Circle[]> => {
    // Get circles where user is a member
    const { data: memberships, error } = await supabase
        .from("circle_members")
        .select("circle_id, circles(*)")
        .eq("user_id", userId);

    if (error) throw error;

    return memberships.map((m: any) => m.circles) as Circle[];
};

export const fetchCircleDetails = async (circleId: string): Promise<Circle> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("circles")
        .select("*, circle_members(count)")
        .eq("id", circleId)
        .single();

    if (error) throw error;

    let isMember = false;
    if (user) {
        const { data: membership } = await supabase
            .from("circle_members")
            .select("role")
            .eq("circle_id", circleId)
            .eq("user_id", user.id)
            .single();

        isMember = !!membership;
    }

    return {
        ...data,
        member_count: data.circle_members?.[0]?.count || 0,
        is_member: isMember,
    };
};

export const joinCircle = async (circleId: string): Promise<void> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("circle_members").insert({
        circle_id: circleId,
        user_id: user.id,
        role: "member",
    });

    if (error) throw error;
};

export const leaveCircle = async (circleId: string): Promise<void> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
        .from("circle_members")
        .delete()
        .eq("circle_id", circleId)
        .eq("user_id", user.id);

    if (error) throw error;
};
