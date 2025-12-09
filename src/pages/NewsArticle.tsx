import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getNewsBySlug } from "@/lib/api/news";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { format } from "date-fns";

export default function NewsArticle() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            loadArticle(slug);
        }
    }, [slug]);

    const loadArticle = async (slug: string) => {
        try {
            setLoading(true);
            const data = await getNewsBySlug(slug);
            setArticle(data);
        } catch (error) {
            console.error("Failed to load article", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="h-8 w-32 bg-muted animate-pulse mb-8" />
                    <div className="h-12 w-3/4 bg-muted animate-pulse mb-4" />
                    <div className="h-96 w-full bg-muted animate-pulse mb-8" />
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-muted animate-pulse" />
                        <div className="h-4 w-full bg-muted animate-pulse" />
                        <div className="h-4 w-2/3 bg-muted animate-pulse" />
                    </div>
                </div>
            </Layout>
        );
    }

    if (!article) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Article not found</h2>
                    <Link to="/news">
                        <Button>Back to News</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <article className="max-w-4xl mx-auto px-4 py-8">
                <Link to="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to News
                </Link>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {article.category && (
                        <span className="bg-accent border border-foreground px-3 py-1 text-sm font-bold uppercase tracking-wider">
                            {article.category}
                        </span>
                    )}
                    <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.published_at ? format(new Date(article.published_at), "MMMM d, yyyy") : "Draft"}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                    {article.title}
                </h1>

                {article.author && (
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b-2 border-muted">
                        <div className="w-10 h-10 bg-secondary border border-foreground rounded-full overflow-hidden flex items-center justify-center">
                            {article.author.avatar_url ? (
                                <img src={article.author.avatar_url} alt={article.author.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold">{article.author.full_name || "Unknown Author"}</p>
                            <p className="text-xs text-muted-foreground">Author</p>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto">
                            <Share2 className="w-5 h-5" />
                        </Button>
                    </div>
                )}

                {article.cover_image_url && (
                    <div className="w-full aspect-video mb-10 border-2 border-foreground shadow-sm overflow-hidden bg-muted">
                        <img
                            src={article.cover_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg max-w-none mb-10">
                    {/* Simple rendering for now, could use a markdown renderer */}
                    {article.content?.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                </div>
            </article>
        </Layout>
    );
}
