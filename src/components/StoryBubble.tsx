import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StoryBubbleProps {
    username?: string;
    avatarUrl?: string;
    isCurrentUser?: boolean;
    hasUnviewed?: boolean;
    onClick: () => void;
}

export function StoryBubble({
    username,
    avatarUrl,
    isCurrentUser,
    hasUnviewed = false,
    onClick
}: StoryBubbleProps) {

    if (isCurrentUser) {
        return (
            <button
                onClick={onClick}
                className="flex flex-col items-center gap-2 shrink-0 group"
            >
                <div className="relative">
                    <div className="w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-zinc-400 group-hover:border-zinc-600 transition-colors">
                        <Avatar className="w-full h-full border-2 border-background">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>{username?.slice(0, 2).toUpperCase() || "ME"}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-background">
                        <Plus className="w-3 h-3" />
                    </div>
                </div>
                <span className="text-xs font-medium truncate w-16 text-center">
                    Your Story
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 shrink-0"
        >
            <div className={cn(
                "w-16 h-16 rounded-full p-[2px] transition-all",
                hasUnviewed
                    ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600"
                    : "bg-zinc-200 dark:bg-zinc-700"
            )}>
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                    <Avatar className="w-full h-full">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <span className="text-xs font-medium truncate w-16 text-center">
                {username}
            </span>
        </button>
    );
}
