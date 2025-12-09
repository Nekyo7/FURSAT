import { Button } from "@/components/ui/button";
import {
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/api/posts";
import { usePostActions } from "@/hooks/usePostActions";

interface PostCardProps {
    post: Post;
    currentUserId: string;
    onDelete?: (postId: string) => void;
    onUpdate?: () => void;
}

export function PostCard({ post, currentUserId, onDelete, onUpdate }: PostCardProps) {
    // We need to pass a dummy refetch function if onUpdate is not provided
    // Ideally usePostActions should be refactored to not require refetch, or we pass it down
    // For now, let's instantiate usePostActions here, but it might be better to pass handlers from parent
    // However, to make it self-contained like in Feed, we can use the hook.

    const { handleLike, handleSave, handleDelete, likingPosts, savingPosts, deletingPosts } = usePostActions(onUpdate || (() => { }));

    const formatTimeAgo = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true })
                .replace("about ", "")
                .replace(" ago", "");
        } catch {
            return "just now";
        }
    };

    const handlePostDelete = async (id: string) => {
        await handleDelete(id);
        if (onDelete) onDelete(id);
    };

    return (
        <article className="bg-card border-2 border-foreground shadow-sm">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-secondary border-2 border-foreground flex items-center justify-center">
                        <span className="font-bold text-sm">
                            {post.profiles?.username?.slice(0, 2).toUpperCase() || "U"}
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold">
                                {post.profiles?.full_name || post.profiles?.username || "Anonymous"}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(post.created_at)}
                        </span>
                    </div>
                </div>
                {currentUserId === post.user_id && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-destructive"
                        onClick={() => handlePostDelete(post.id)}
                        disabled={deletingPosts.has(post.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.image_url && (
                <div className="border-t-2 border-b-2 border-foreground">
                    <img
                        src={post.image_url}
                        alt="post"
                        className="w-full max-h-[500px] object-contain bg-muted"
                    />
                </div>
            )}

            {/* Post Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${post.is_liked ? "text-destructive" : ""}`}
                            onClick={() => handleLike(post.id)}
                            disabled={likingPosts.has(post.id)}
                        >
                            <Heart
                                className={`w-5 h-5 ${post.is_liked ? "fill-current" : ""}`}
                            />
                            {post.likes_count || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <MessageCircle className="w-5 h-5" />
                            0
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Share2 className="w-5 h-5" />
                            0
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => handleSave(post.id)}
                        disabled={savingPosts.has(post.id)}
                    >
                        <Bookmark
                            className={`w-5 h-5 ${post.is_saved ? "fill-current" : ""}`}
                        />
                    </Button>
                </div>
            </div>
        </article>
    );
}
