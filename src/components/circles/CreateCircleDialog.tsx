import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createCircle } from "@/lib/api/circles";
import { useToast } from "@/components/ui/use-toast";

interface CreateCircleDialogProps {
    onCircleCreated?: () => void;
}

export function CreateCircleDialog({ onCircleCreated }: CreateCircleDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLoading(true);
            await createCircle(name, description);

            toast({
                title: "Circle created!",
                description: `You have successfully created "${name}".`,
            });

            setOpen(false);
            setName("");
            setDescription("");
            onCircleCreated?.();
        } catch (error: any) {
            console.error("Error creating circle:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create circle. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4" />
                    Create Circle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create a New Circle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Circle Name</label>
                        <Input
                            placeholder="e.g. Coding Club, Photography..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            placeholder="What is this circle about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border-2 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Circle"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
