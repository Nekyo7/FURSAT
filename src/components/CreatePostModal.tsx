import { useState, useRef } from "react";
import { createPost } from "@/lib/api/posts";
import { toast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface CreatePostModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onPostCreated?: () => void;
    circleId?: string;
}

export function CreatePostModal({
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    onPostCreated,
    circleId
}: CreatePostModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Error",
                description: "Please select an image file",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Image must be less than 5MB",
                variant: "destructive",
            });
            return;
        }

        setSelectedFile(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast({
                title: "Error",
                description: "Please write something",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            await createPost(content, selectedFile || undefined, circleId);
            toast({
                title: "Success",
                description: "Post created!",
            });

            // Reset form
            setContent("");
            handleRemoveImage();
            setOpen(false);

            // Call callback if provided
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error: any) {
            console.error("Error creating post:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create post",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // If controlled, we don't render the trigger button here usually, 
    // but for the standalone usage in CircleDetails, we might want a trigger.
    // However, the previous usage in Feed might have been controlled.
    // Let's support both or just render the Dialog.
    // Based on previous code, it seems it was used both ways or just controlled.
    // Let's assume it's mostly controlled or we provide a trigger if not.

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <Button onClick={() => setOpen(true)} className="gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Create Post
                </Button>
            )}
            <DialogContent className="sm:max-w-[600px] border-2 border-foreground shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">CREATE POST</DialogTitle>
                    <DialogDescription className="font-mono text-xs">
                        Share what's on your mind
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content" className="font-bold">
                            What's happening?
                        </Label>
                        <Textarea
                            id="content"
                            placeholder="Drop your thoughts..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[120px] border-2 border-foreground rounded-none resize-none"
                            disabled={loading}
                        />
                    </div>

                    {previewUrl && (
                        <div className="relative border-2 border-foreground">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-auto max-h-[300px] object-contain"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 border-2 border-foreground shadow-sm hover:bg-destructive/90"
                                disabled={loading}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={loading}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading || !!selectedFile}
                            className="gap-2"
                        >
                            <ImagePlus className="w-4 h-4" />
                            {selectedFile ? "Image selected" : "Add image"}
                        </Button>

                        <div className="flex-1" />

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading || !content.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
