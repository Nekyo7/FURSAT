import { supabase } from "@/lib/supabase";

export interface Conversation {
    id: string;
    created_at: string;
    last_message_at: string;
    unread_count?: number; // Optional for now
    other_user?: {
        id: string;
        username: string;
        avatar_url: string | null;
        full_name?: string;
    };
    last_message?: {
        content: string;
        sender_id: string;
        created_at: string;
    };
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

/**
 * Create a new conversation or return existing one
 */
export async function createConversation(otherUserId: string): Promise<string> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Check if conversation already exists
        // This is a bit complex in Supabase without a stored procedure, 
        // so we'll do a client-side check or a simplified approach.
        // For now, let's just create a new one if we can't easily find it.
        // A better way is to query conversation_members.

        // Find conversation where both users are members
        // We can do this by fetching the current user's conversations and checking members
        // But for performance, let's just create a new one for now or assume the UI handles checking.
        // Actually, let's try to find it.

        // 1. Get all conversation IDs for current user
        const { data: myConvos } = await supabase
            .from("conversation_members")
            .select("conversation_id")
            .eq("user_id", user.id);

        if (myConvos && myConvos.length > 0) {
            const myConvoIds = myConvos.map(c => c.conversation_id);

            // 2. Check if other user is in any of these
            const { data: existing } = await supabase
                .from("conversation_members")
                .select("conversation_id")
                .eq("user_id", otherUserId)
                .in("conversation_id", myConvoIds)
                .single();

            if (existing) {
                return existing.conversation_id;
            }
        }

        // Create new conversation
        const { data: newConvo, error: createError } = await supabase
            .from("conversations")
            .insert({})
            .select()
            .single();

        if (createError) throw createError;

        // Add members
        const { error: memberError } = await supabase
            .from("conversation_members")
            .insert([
                { conversation_id: newConvo.id, user_id: user.id },
                { conversation_id: newConvo.id, user_id: otherUserId }
            ]);

        if (memberError) throw memberError;

        return newConvo.id;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
    }
}

/**
 * Get all conversations for current user
 */
export async function getConversations(): Promise<Conversation[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Get conversations the user is in
        const { data: members, error } = await supabase
            .from("conversation_members")
            .select(`
                conversation_id,
                conversation:conversations (
                    id,
                    created_at,
                    last_message_at
                )
            `)
            .eq("user_id", user.id)
            .order("joined_at", { ascending: false }); // Ideally order by last_message_at from conversation

        if (error) throw error;

        if (!members || members.length === 0) return [];

        // For each conversation, get the other member and last message
        const conversations = await Promise.all(members.map(async (m: any) => {
            const convo = m.conversation;

            // Get other member
            const { data: otherMember } = await supabase
                .from("conversation_members")
                .select(`
                    user_id,
                    profile:profiles!user_id (
                        id,
                        username,
                        avatar_url,
                        full_name
                    )
                `)
                .eq("conversation_id", convo.id)
                .neq("user_id", user.id)
                .single();

            // Get last message
            const { data: lastMsg } = await supabase
                .from("messages")
                .select("content, sender_id, created_at")
                .eq("conversation_id", convo.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            // Handle case where profile might be missing (if using auth.users directly without profile sync)
            // But we assume profiles exist as per requirement.
            // If profile is null, we might need to fetch from auth (not possible via client usually) or just show "Unknown".

            // Note: The 'profiles' relation needs to exist. If 'profiles' table uses 'id' as FK to auth.users, it should work.
            // If the relation name is different, we might need to adjust.
            // Assuming 'profiles' table exists and has 'id' matching 'auth.users.id'.

            return {
                ...convo,
                other_user: otherMember?.profile || { id: otherMember?.user_id, username: "User", avatar_url: null },
                last_message: lastMsg
            };
        }));

        // Sort by last_message_at
        return conversations.sort((a, b) =>
            new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
        );
    } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error;
    }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    try {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
}

/**
 * Send a message
 */
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Insert message
        const { data, error } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content
            })
            .select()
            .single();

        if (error) throw error;

        // Update conversation last_message_at
        await supabase
            .from("conversations")
            .update({ last_message_at: new Date().toISOString() })
            .eq("id", conversationId);

        return data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
}
