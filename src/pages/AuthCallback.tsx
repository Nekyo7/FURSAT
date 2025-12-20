import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Determine where to redirect based on user state or just default to home/feed
        // The Supabase client in AuthContext will handle the session recovery from URL hash
        navigate("/feed", { replace: true });
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-foreground border-t-transparent animate-spin mx-auto mb-4" />
                <p className="font-mono text-sm">Verifying authentication...</p>
            </div>
        </div>
    );
}
