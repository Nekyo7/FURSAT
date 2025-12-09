import { useState } from "react";
import { toggleLike } from "@/lib/api/likes";
import { toggleSave } from "@/lib/api/saves";
import { deletePost } from "@/lib/api/posts";
import { toast } from "sonner";

interface UsePostActionsReturn {
    handleLike: (postId: string) => Promise<void>;
    handleSave: (postId: string) => Promise<void>;
    handleDelete: (postId: string) => Promise<void>;
    likingPosts: Set<string>;
    savingPosts: Set<string>;
    deletingPosts: Set<string>;
}

/**
 * Custom hook for post actions (like, save, delete)
 */
export function usePostActions(onPostDeleted?: () => void): UsePostActionsReturn {
    const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
    const [savingPosts, setSavingPosts] = useState<Set<string>>(new Set());
    const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set());

    const handleLike = async (postId: string) => {
        if (likingPosts.has(postId)) return;

        try {
            setLikingPosts((prev) => new Set(prev).add(postId));
            const isLiked = await toggleLike(postId);

            // Optional: Show toast feedback
            // toast.success(isLiked ? "Post liked!" : "Post unliked!");
        } catch (error: any) {
            console.error("Error toggling like:", error);
            toast.error(error.message || "Failed to like post");
        } finally {
            setLikingPosts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
            });
        }
    };

    const handleSave = async (postId: string) => {
        if (savingPosts.has(postId)) return;

        try {
            setSavingPosts((prev) => new Set(prev).add(postId));
            const isSaved = await toggleSave(postId);

            toast.success(isSaved ? "Post saved!" : "Post unsaved!");
        } catch (error: any) {
            console.error("Error toggling save:", error);
            toast.error(error.message || "Failed to save post");
        } finally {
            setSavingPosts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
            });
        }
    };

    const handleDelete = async (postId: string) => {
        if (deletingPosts.has(postId)) return;

        // Confirm deletion
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            setDeletingPosts((prev) => new Set(prev).add(postId));
            await deletePost(postId);

            toast.success("Post deleted!");

            // Call callback if provided
            if (onPostDeleted) {
                onPostDeleted();
            }
        } catch (error: any) {
            console.error("Error deleting post:", error);
            toast.error(error.message || "Failed to delete post");
        } finally {
            setDeletingPosts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
            });
        }
    };

    return {
        handleLike,
        handleSave,
        handleDelete,
        likingPosts,
        savingPosts,
        deletingPosts,
    };
}
