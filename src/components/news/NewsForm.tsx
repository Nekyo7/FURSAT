import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateNewsPostData } from "@/lib/api/news";
import { Save, Image as ImageIcon } from "lucide-react";

interface NewsFormProps {
    initialData?: Partial<CreateNewsPostData>;
    onSubmit: (data: CreateNewsPostData) => Promise<void>;
    loading: boolean;
}

const CATEGORIES = ["NEWS", "ANNOUNCEMENT", "EVENT", "UPDATE"];

export function NewsForm({ initialData, onSubmit, loading }: NewsFormProps) {
    const [formData, setFormData] = useState<CreateNewsPostData>({
        title: "",
        slug: "",
        summary: "",
        content: "",
        category: "NEWS",
        cover_image_url: "",
        published: false,
        ...initialData,
    });

    // Auto-generate slug from title if slug is empty
    useEffect(() => {
        if (!initialData?.slug && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, published: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8">
                <div className="bg-card border-2 border-foreground p-6 shadow-sm space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Article Title"
                            className="text-lg font-bold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="article-title-slug"
                            className="font-mono text-sm"
                            required
                        />
                        <p className="text-xs text-muted-foreground">URL-friendly version of the title.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary *</Label>
                        <Textarea
                            id="summary"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            placeholder="Brief summary for the preview card..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_image_url">Cover Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="cover_image_url"
                                    name="cover_image_url"
                                    value={formData.cover_image_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                                <Button variant="outline" size="icon" type="button">
                                    <ImageIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="published" className="font-medium cursor-pointer">
                            Publish immediately
                        </Label>
                    </div>
                </div>

                <div className="bg-card border-2 border-foreground p-6 shadow-sm space-y-4">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your article content here (Markdown supported)..."
                        className="min-h-[400px] font-mono"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} size="lg" className="gap-2">
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Post"}
                </Button>
            </div>
        </form>
    );
}
