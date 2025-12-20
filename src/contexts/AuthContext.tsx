import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { updateProfile as apiUpdateProfile, ProfileUpdateData } from "@/lib/api/profiles";

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  full_name?: string;
  bio?: string;
  created_at?: string;
  avatar_url?: string;
  headline?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database (with timeout)
  const fetchProfile = async (userId: string) => {
    try {
      console.log("🔍 Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // PGRST116 is "not found" - that's okay for new users
        // 42P01 is "relation does not exist" - table doesn't exist yet
        if (error.code === "PGRST116") {
          console.log("⚠️ Profile not found for user:", userId);
          return null;
        }
        if (error.code === "42P01") {
          console.error("❌ Profiles table doesn't exist! Run the SQL migration.");
          return null;
        }
        console.error("❌ Error fetching profile:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return null;
      }

      console.log("✅ Profile fetched:", data);
      console.log("Username in profile:", data?.username);
      return data;
    } catch (error: any) {
      console.error("❌ Exception fetching profile:", error);
      return null;
    }
  };

  // Create profile in database
  const createProfile = async (userId: string, email: string, username: string) => {
    try {
      const trimmedUsername = username.trim();
      console.log("📝 Creating profile with:", { userId, email, username: trimmedUsername });

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email,
          username: trimmedUsername,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating profile:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error details:", JSON.stringify(error, null, 2));

        // If profile already exists, try to update it
        if (error.code === "23505") { // Unique violation
          console.log("🔄 Profile already exists, updating username...");
          const { data: updateData, error: updateError } = await supabase
            .from("profiles")
            .update({ username: trimmedUsername })
            .eq("id", userId)
            .select()
            .single();

          if (updateError) {
            console.error("❌ Error updating profile:", updateError);
            throw updateError;
          }

          console.log("✅ Profile updated successfully:", updateData);
          return updateData;
        }

        throw error;
      }

      console.log("✅ Profile created successfully:", data);
      console.log("Username saved:", data?.username);
      return data;
    } catch (error) {
      console.error("❌ Exception creating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Timeout fallback to ensure loading never gets stuck
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("Auth initialization timeout - setting loading to false");
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        clearTimeout(timeoutId);

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }

        if (session?.user) {
          // Fetch profile but don't block if it fails
          fetchProfile(session.user.id)
            .then((profileData) => {
              if (mounted && profileData) {
                setProfile(profileData);
              }
            })
            .catch((error) => {
              console.error("Error fetching profile:", error);
              // Continue even if profile fetch fails - user can still use the app
            });
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("Error initializing auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          // Fetch profile
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            // Always update if we got profile data
            if (profileData) {
              setProfile(profileData);
            }
            // Don't clear profile if fetch returns null - might just be timing issue
            // Only clear on sign out (handled below)
          }
        } catch (error) {
          console.error("Error fetching profile on auth change:", error);
          // Continue even if profile fetch fails - don't clear existing profile
        }
      } else {
        // Only clear profile when user signs out
        if (mounted) {
          setProfile(null);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("🔐 Signing in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Sign in error:", error);
      throw error;
    }

    if (data.user) {
      // IMMEDIATE STATE UPDATE: Prevents race condition with ProtectedRoute
      setUser(data.user);
      if (data.session) {
        setSession(data.session);
      }

      console.log("✅ Signed in, fetching profile...");
      const profileData = await fetchProfile(data.user.id);
      if (profileData) {
        console.log("✅ Profile loaded:", profileData);
        console.log("Username:", profileData.username);
        setProfile(profileData);
      } else {
        console.warn("⚠️ No profile found for user");
      }
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // THIS LINE IS THE ENTIRE FIX
        },
      },
    });


    if (error) {
      console.error("❌ Signup error:", error);
      throw error;
    }

    console.log("✅ User created:", data.user?.id);

    if (data.user) {
      try {
        // Create profile with username immediately
        console.log("📝 Creating profile for user:", data.user.id);
        const profileData = await createProfile(data.user.id, email, username);

        if (profileData) {
          console.log("✅ Profile data received:", profileData);
          console.log("Username in profileData:", profileData.username);

          // Set profile state immediately
          setProfile(profileData);
          setUser(data.user);
          if (data.session) {
            setSession(data.session);
          }

          // Double-check by fetching after a short delay
          setTimeout(async () => {
            const verifyProfile = await fetchProfile(data.user.id);
            if (verifyProfile) {
              console.log("✅ Verified profile:", verifyProfile);
              setProfile(verifyProfile);
            }
          }, 1000);
        } else {
          console.warn("⚠️ Profile data is null");
        }
      } catch (profileError: any) {
        console.error("❌ Error in profile creation:", profileError);
        // Try to fetch profile in case it was created by a database trigger
        setTimeout(async () => {
          try {
            const fetchedProfile = await fetchProfile(data.user.id);
            if (fetchedProfile) {
              console.log("✅ Fetched profile after error:", fetchedProfile);
              setProfile(fetchedProfile);
            } else {
              console.warn("⚠️ Profile still not found after error");
            }
          } catch (fetchError) {
            console.error("❌ Error fetching profile after signup:", fetchError);
          }
        }, 1000);
        // Don't throw - user is still signed up
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = "/";
  };

  const updateUsername = async (username: string) => {
    if (!user) throw new Error("No user logged in");

    const trimmedUsername = username.trim();
    console.log("🔄 Updating username to:", trimmedUsername);

    const { data, error } = await supabase
      .from("profiles")
      .update({ username: trimmedUsername })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating username:", error);
      throw error;
    }

    if (data) {
      console.log("✅ Username updated:", data);
      setProfile(data);
    }
  };

  const updateUserProfile = async (data: ProfileUpdateData) => {
    if (!user) throw new Error("No user logged in");

    console.log("🔄 Updating profile with:", data);
    const updatedProfile = await apiUpdateProfile(user.id, data);

    if (updatedProfile) {
      console.log("✅ Profile updated:", updatedProfile);
      setProfile(updatedProfile);
    }
  };

  const refreshProfile = async () => {
    if (!user) {
      console.warn("⚠️ No user to refresh profile for");
      return;
    }

    console.log("🔄 Refreshing profile...");
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      console.log("✅ Profile refreshed:", profileData);
      setProfile(profileData);
    } else {
      console.warn("⚠️ Could not refresh profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateUsername,
        updateUserProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

