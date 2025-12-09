import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsPost } from "@/lib/api/news";
import { format } from "date-fns";

interface NewsCardProps {
    article: NewsPost;
}

export function NewsCard({ article }: NewsCardProps) {
    return (
        <div className="bg-card border-2 border-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            {article.cover_image_url && (
                <div className="aspect-video w-full overflow-hidden border-b-2 border-foreground">
                    <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                    {article.category && (
                        <span className="bg-accent border border-foreground px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                            {article.category}
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {article.published_at ? format(new Date(article.published_at), "MMM d, yyyy") : "Draft"}
                    </span>
                </div>

                <h3 className="font-bold text-xl mb-2 line-clamp-2 leading-tight">
                    {article.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {article.summary}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-muted">
                    <Link to={`/news/${article.slug}`}>
                        <Button variant="link" size="sm" className="gap-1 px-0 text-foreground font-bold hover:no-underline hover:opacity-80">
                            Read More <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
