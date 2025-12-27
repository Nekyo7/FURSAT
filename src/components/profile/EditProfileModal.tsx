import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

export function EditProfileModal() {
    const { profile, updateUserProfile } = useAuth();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        bio: "",
        headline: "",
        location: "",
        website: "",
        avatar_url: "",
    });

    // Reset form data when modal opens or profile changes
    useEffect(() => {
        if (open && profile) {
            setFormData({
                username: profile.username || "",
                full_name: profile.full_name || "",
                bio: profile.bio || "",
                headline: profile.headline || "",
                location: profile.location || "",
                website: profile.website || "",
                avatar_url: profile.avatar_url || "",
            });
            setError(null);
        }
    }, [open, profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);

            // Validate username if provided
            if (formData.username.trim() && formData.username.trim().length < 3) {
                setError("Username must be at least 3 characters long");
                setLoading(false);
                return;
            }

            // Build update data - convert empty strings to null for optional fields
            // Always include all fields so we can clear them if needed
            const updateData: Record<string, string | null> = {
                username: formData.username.trim() || null,
                full_name: formData.full_name.trim() || null,
                bio: formData.bio.trim() || null,
                headline: formData.headline.trim() || null,
                location: formData.location.trim() || null,
                website: formData.website.trim() || null,
                avatar_url: formData.avatar_url || null,
            };

            await updateUserProfile(updateData);

            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
            });

            setOpen(false);
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const errorMessage = error?.message || "Failed to update profile. Please try again.";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-2 border-foreground max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <AvatarUpload
                        currentAvatarUrl={formData.avatar_url}
                        onUploadComplete={(url) => setFormData({ ...formData, avatar_url: url })}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline / Education</Label>
                        <Input
                            id="headline"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            placeholder="Student at IIT Delhi"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="New Delhi, India"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="github.com/username"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                            className="resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
