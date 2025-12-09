import { useState, useEffect, useCallback } from "react";
import {
    Story,
    UserStoryGroup,
    fetchActiveStories,
    fetchUserStories
} from "@/lib/api/stories";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function useStories() {
    const [stories, setStories] = useState<Story[]>([]);
    const [userStories, setUserStories] = useState<Story[]>([]); // Current user's stories
    const [groupedStories, setGroupedStories] = useState<UserStoryGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Track viewed stories in local storage for simple read status
    const [viewedStoryIds, setViewedStoryIds] = useState<Set<string>>(() => {
        const saved = localStorage.getItem("viewed_stories");
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    const markStoryAsViewed = useCallback((storyId: string) => {
        setViewedStoryIds(prev => {
            const newSet = new Set(prev);
            newSet.add(storyId);
            localStorage.setItem("viewed_stories", JSON.stringify([...newSet]));
            return newSet;
        });
    }, []);

    const loadStories = useCallback(async () => {
        try {
            setLoading(true);
            const allStories = await fetchActiveStories();
            setStories(allStories);

            // Filter current user's stories
            if (user) {
                const myStories = allStories.filter(s => s.user_id === user.id);
                setUserStories(myStories);
            }

            // Group stories by user (excluding current user for the feed list)
            const otherStories = user ? allStories.filter(s => s.user_id !== user.id) : allStories;

            const groups: Record<string, UserStoryGroup> = {};

            otherStories.forEach(story => {
                if (!groups[story.user_id]) {
                    groups[story.user_id] = {
                        user_id: story.user_id,
                        username: story.user?.username || "Unknown",
                        avatar_url: story.user?.avatar_url || "",
                        stories: [],
                        hasUnviewed: false
                    };
                }
                groups[story.user_id].stories.push(story);
            });

            // Check for unviewed stories
            Object.values(groups).forEach(group => {
                group.hasUnviewed = group.stories.some(s => !viewedStoryIds.has(s.id));
            });

            setGroupedStories(Object.values(groups));
        } catch (error) {
            console.error("Error loading stories:", error);
        } finally {
            setLoading(false);
        }
    }, [user, viewedStoryIds]);

    useEffect(() => {
        loadStories();

        // Real-time subscription
        const channel = supabase
            .channel("stories-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "stories",
                },
                () => {
                    loadStories();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadStories]);

    return {
        stories,
        userStories,
        groupedStories,
        loading,
        refreshStories: loadStories,
        markStoryAsViewed,
        viewedStoryIds
    };
}
