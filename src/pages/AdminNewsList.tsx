import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getAllNewsPosts, deleteNewsPost, togglePublishNewsPost, NewsPost } from "@/lib/api/news";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export default function AdminNewsList() {
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Redirect if not admin
        if (profile && profile.role !== 'admin' && (profile as any).role !== 'admin') {
            toast({ title: "Unauthorized", description: "You do not have permission to access this page.", variant: "destructive" });
            navigate("/news");
            return;
        }
        loadPosts();
    }, [profile, navigate]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await getAllNewsPosts();
            setPosts(data || []);
        } catch (error) {
            toast({ title: "Error loading posts", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteNewsPost(id);
            setPosts(posts.filter(p => p.id !== id));
            toast({ title: "Post deleted" });
        } catch (error) {
            toast({ title: "Error deleting post", variant: "destructive" });
        }
    };

    const handleTogglePublish = async (post: NewsPost) => {
        try {
            const newStatus = !post.published;
            await togglePublishNewsPost(post.id, newStatus);
            setPosts(posts.map(p => p.id === post.id ? { ...p, published: newStatus } : p));
            toast({ title: newStatus ? "Post published" : "Post unpublished" });
        } catch (error) {
            toast({ title: "Error updating status", variant: "destructive" });
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/news")}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black">Manage News</h1>
                            <p className="text-muted-foreground">Create, edit, and manage news posts.</p>
                        </div>
                    </div>
                    <Link to="/admin/news/new">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Post
                        </Button>
                    </Link>
                </div>

                <div className="bg-card border-2 border-foreground shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted border-b-2 border-foreground">
                                <tr>
                                    <th className="p-4 font-bold">Title</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold">Date</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">Loading...</td>
                                    </tr>
                                ) : posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">No posts found.</td>
                                    </tr>
                                ) : (
                                    posts.map(post => (
                                        <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium">{post.title}</div>
                                                <div className="text-xs text-muted-foreground font-mono">/{post.slug}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${post.published ? "bg-success/20 text-success-foreground" : "bg-warning/20 text-warning-foreground"}`}>
                                                    {post.published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {format(new Date(post.created_at), "MMM d, yyyy")}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={post.published ? "Unpublish" : "Publish"}
                                                        onClick={() => handleTogglePublish(post)}
                                                    >
                                                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </Button>
                                                    <Link to={`/admin/news/${post.id}/edit`}>
                                                        <Button variant="ghost" size="icon" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        title="Delete"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
