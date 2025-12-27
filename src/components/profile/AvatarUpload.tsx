import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
    currentAvatarUrl?: string;
    onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

    useEffect(() => {
        setPreviewUrl(currentAvatarUrl || null);
    }, [currentAvatarUrl]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            if (!user) {
                toast({
                    title: "Error",
                    description: "You must be logged in to upload an avatar.",
                    variant: "destructive",
                });
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            setUploading(true);

            // Upload image
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setPreviewUrl(data.publicUrl);
            onUploadComplete(data.publicUrl);

            toast({
                title: "Success",
                description: "Avatar uploaded successfully!",
            });

        } catch (error: any) {
            toast({
                title: "Error uploading avatar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-foreground shadow-md bg-muted flex items-center justify-center group">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <UserIcon className="w-16 h-16 text-muted-foreground" />
                )}

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-8 h-8 text-white" />
                </div>
            </div>

            <input
                type="file"
                id="avatar"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
            />

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
            >
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    "Change Picture"
                )}
            </Button>
        </div>
    );
}
