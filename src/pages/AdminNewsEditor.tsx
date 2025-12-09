import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { createNewsPost, updateNewsPost, getNewsPostById, CreateNewsPostData } from "@/lib/api/news";
import { NewsForm } from "@/components/news/NewsForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminNewsEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [initialData, setInitialData] = useState<Partial<CreateNewsPostData>>({});

    useEffect(() => {
        // Redirect if not admin
        if (profile && profile.role !== 'admin' && (profile as any).role !== 'admin') {
            toast({ title: "Unauthorized", description: "You do not have permission to access this page.", variant: "destructive" });
            navigate("/news");
            return;
        }
    }, [profile, navigate]);

    useEffect(() => {
        if (id) {
            loadArticle(id);
        }
    }, [id]);

    const loadArticle = async (articleId: string) => {
        try {
            const data = await getNewsPostById(articleId);
            setInitialData({
                title: data.title,
                slug: data.slug,
                summary: data.summary,
                content: data.content || "",
                cover_image_url: data.cover_image_url || "",
                category: data.category || "NEWS",
                published: data.published,
            });
        } catch (error) {
            toast({ title: "Error loading article", variant: "destructive" });
            navigate("/admin/news");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (data: CreateNewsPostData) => {
        try {
            setLoading(true);
            if (id) {
                await updateNewsPost(id, data);
                toast({ title: "Article updated successfully" });
            } else {
                await createNewsPost(data);
                toast({ title: "Article created successfully" });
            }
            navigate("/admin/news");
        } catch (error) {
            console.error(error);
            toast({ title: "Error saving article", description: "Please check your permissions and try again.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <p>Loading editor...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/news")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-black">{id ? "Edit Article" : "New Article"}</h1>
                </div>

                <NewsForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </div>
        </Layout>
    );
}

