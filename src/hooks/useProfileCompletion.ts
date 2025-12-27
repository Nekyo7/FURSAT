import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function useProfileCompletion(userId: string | undefined) {
    const { profile } = useAuth();
    const [completion, setCompletion] = useState({
        percentage: 0,
        criteria: {
            hasBio: false,
            hasSkill: false,
            hasProject: false,
            hasAvatar: false,
        },
    });
    const [loading, setLoading] = useState(true);

    const calculateCompletion = async () => {
        if (!userId) return;

        try {
            setLoading(true);

            // Check for skills
            const { count: skillCount, error: skillError } = await supabase
                .from("skills")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId);

            if (skillError) throw skillError;

            // Check for projects
            const { count: projectCount, error: projectError } = await supabase
                .from("projects")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId);

            if (projectError) throw projectError;

            const hasBio = !!(profile?.bio && profile.bio.trim().length > 0);
            const hasAvatar = !!(profile?.avatar_url && profile.avatar_url.trim().length > 0);
            const hasSkill = (skillCount || 0) > 0;
            const hasProject = (projectCount || 0) > 0;

            let percentage = 0;
            if (hasBio) percentage += 25;
            if (hasSkill) percentage += 25;
            if (hasProject) percentage += 25;
            if (hasAvatar) percentage += 25;

            setCompletion({
                percentage,
                criteria: {
                    hasBio,
                    hasSkill,
                    hasProject,
                    hasAvatar,
                },
            });
        } catch (error) {
            console.error("Error calculating profile completion:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        calculateCompletion();
    }, [userId, profile]);

    return { completion, loading, refresh: calculateCompletion };
}
