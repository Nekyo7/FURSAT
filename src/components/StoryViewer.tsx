import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Trash2, MoreHorizontal } from "lucide-react";
import { Story, deleteStory } from "@/lib/api/stories";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface StoryViewerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    stories: Story[];
    initialStoryIndex?: number;
    onStoryViewed?: (storyId: string) => void;
    onDelete?: (storyId: string) => void;
    isCurrentUser?: boolean;
}

export function StoryViewer({
    open,
    onOpenChange,
    stories,
    initialStoryIndex = 0,
    onStoryViewed,
    onDelete,
    isCurrentUser
}: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { toast } = useToast();

    const currentStory = stories[currentIndex];
    const STORY_DURATION = 5000; // 5 seconds per story

    // Reset state when opening or changing stories
    useEffect(() => {
        if (open) {
            setCurrentIndex(initialStoryIndex);
            setProgress(0);
            setIsPaused(false);
        }
    }, [open, initialStoryIndex]);

    // Mark as viewed when story changes
    useEffect(() => {
        if (open && currentStory && onStoryViewed) {
            onStoryViewed(currentStory.id);
        }
    }, [currentIndex, open, currentStory, onStoryViewed]);

    // Timer for progress and auto-advance
    useEffect(() => {
        if (!open || isPaused || !currentStory) return;

        const startTime = Date.now();
        const initialProgress = progress;

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(100, initialProgress + (elapsed / STORY_DURATION) * 100);

            setProgress(newProgress);

            if (newProgress >= 100) {
                if (currentIndex < stories.length - 1) {
                    // Next story
                    setCurrentIndex(prev => prev + 1);
                    setProgress(0);
                } else {
                    // End of stories
                    onOpenChange(false);
                }
            }
        }, 50);

        return () => clearInterval(timer);
    }, [open, isPaused, currentIndex, stories.length, onOpenChange, currentStory]);

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        } else {
            // Restart current story if it's the first one
            setProgress(0);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onOpenChange(false);
        }
    };

    const handleDelete = async () => {
        if (!currentStory) return;

        try {
            setIsPaused(true);
            await deleteStory(currentStory.id);

            toast({
                title: "Story deleted",
                description: "Your story has been removed.",
            });

            if (onDelete) onDelete(currentStory.id);

            if (stories.length <= 1) {
                onOpenChange(false);
            } else if (currentIndex === stories.length - 1) {
                setCurrentIndex(prev => prev - 1);
                setProgress(0);
            } else {
                // Stay on same index, but it will be a different story now
                setProgress(0);
            }
        } catch (error) {
            console.error("Error deleting story:", error);
            toast({
                title: "Error",
                description: "Could not delete story.",
                variant: "destructive",
            });
            setIsPaused(false);
        }
    };

    if (!currentStory) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full h-[80vh] p-0 gap-0 bg-black border-zinc-800 overflow-hidden sm:rounded-xl">
                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
                    {stories.map((story, idx) => (
                        <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{
                                    width: idx < currentIndex ? '100%' :
                                        idx === currentIndex ? `${progress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pt-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border border-white/20">
                            <AvatarImage src={currentStory.user?.avatar_url} />
                            <AvatarFallback>{currentStory.user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold text-white drop-shadow-md">
                                {currentStory.user?.username}
                            </p>
                            <p className="text-xs text-white/80 drop-shadow-md">
                                {formatDistanceToNow(new Date(currentStory.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isCurrentUser && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 h-8 w-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 h-8 w-8"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Story Image */}
                <div
                    className="w-full h-full relative bg-zinc-900 flex items-center justify-center"
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    <img
                        src={currentStory.image_url}
                        alt="Story"
                        className="w-full h-full object-contain"
                    />

                    {/* Navigation Tap Zones */}
                    <div
                        className="absolute top-0 left-0 w-1/3 h-full z-10"
                        onClick={handlePrevious}
                    />
                    <div
                        className="absolute top-0 right-0 w-1/3 h-full z-10"
                        onClick={handleNext}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
