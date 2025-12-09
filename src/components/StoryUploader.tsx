import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { uploadStoryImage, createStory } from "@/lib/api/stories";
import { useToast } from "@/components/ui/use-toast";

interface StoryUploaderProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStoryCreated: () => void;
}

export function StoryUploader({ open, onOpenChange, onStoryCreated }: StoryUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);

            // 1. Upload image
            const imageUrl = await uploadStoryImage(file);

            // 2. Create story record
            await createStory(imageUrl);

            toast({
                title: "Story added",
                description: "Your story is now live for 24 hours.",
            });

            onStoryCreated();
            handleClose();
        } catch (error: any) {
            console.error("Error creating story:", error);
            toast({
                title: "Upload failed",
                description: error.message || "Could not upload your story. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreviewUrl(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md h-[80vh] flex flex-col bg-black border-zinc-800 text-white p-0 overflow-hidden gap-0">
                <DialogHeader className="p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-white font-medium">Add to Story</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                            onClick={handleClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-zinc-900 relative flex items-center justify-center min-h-0 w-full">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-center p-6">
                            <div
                                className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-zinc-700 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon className="w-8 h-8 text-zinc-400" />
                            </div>
                            <p className="text-zinc-400 mb-6">Select a photo to share</p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="secondary"
                            >
                                Select from Device
                            </Button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </div>

                {previewUrl && (
                    <div className="p-4 bg-black border-t border-zinc-800 flex justify-end gap-2 shrink-0 z-20">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                            }}
                            disabled={uploading}
                            className="text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Share to Story"
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
