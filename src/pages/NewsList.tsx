import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/news/NewsCard";
import { getNewsList, NewsPost } from "@/lib/api/news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = ["All", "NEWS", "ANNOUNCEMENT", "EVENT", "UPDATE"];

export default function NewsList() {
    const [news, setNews] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const { profile } = useAuth();

    useEffect(() => {
        loadNews();
    }, [activeCategory]);

    const loadNews = async () => {
        try {
            setLoading(true);
            const data = await getNewsList(activeCategory);
            setNews(data || []);
        } catch (error) {
            console.error("Failed to load news", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNews = news.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if user is admin
    const isAdmin = profile?.role === 'admin' || (profile as any)?.role === 'admin';

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black mb-2">NEWSROOM</h1>
                        <p className="text-muted-foreground text-lg">Latest updates, stories, and announcements.</p>
                    </div>
                    {isAdmin && (
                        <Link to="/admin/news">
                            <Button variant="default" className="border-2 border-foreground shadow-sm">
                                Manage News
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card border-2 border-foreground p-4 shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search news..."
                            className="pl-9 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {CATEGORIES.map(category => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                onClick={() => setActiveCategory(category)}
                                className="whitespace-nowrap"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-96 bg-muted animate-pulse border-2 border-muted-foreground/20" />
                        ))}
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.map(article => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                        <h3 className="text-xl font-bold mb-2">No news found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                        <Button
                            variant="link"
                            onClick={() => {
                                setActiveCategory("All");
                                setSearchQuery("");
                            }}
                            className="mt-2"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
