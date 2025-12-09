import { useState, useEffect, useRef } from "react";
import {
    Conversation,
    Message,
    getConversations,
    getMessages,
    sendMessage
} from "@/lib/api/messages";
import { supabase } from "@/lib/supabase";

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await getConversations();
            setConversations(data);
        } catch (err) {
            console.error("Error fetching conversations:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();

        // Subscribe to new messages to update conversation list (last message)
        // We subscribe to the 'messages' table. When a new message is inserted, 
        // we should re-fetch conversations to update the last_message and order.
        const channel = supabase
            .channel("conversations-list-updates")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                () => {
                    // Refresh list on new message
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { conversations, loading, error, refetch: fetchConversations };
}

export function useChat(conversationId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await getMessages(conversationId);
                setMessages(data);
            } catch (err) {
                console.error("Error fetching messages:", err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Subscribe to new messages in this conversation
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    const send = async (content: string) => {
        if (!conversationId || !content.trim()) return;

        try {
            setSending(true);
            // Optimistic update could be added here
            await sendMessage(conversationId, content);
            // The subscription will handle adding the message to the list
        } catch (err) {
            console.error("Error sending message:", err);
            // Handle error (maybe show toast)
        } finally {
            setSending(false);
        }
    };

    return { messages, loading, error, sendMessage: send, sending };
}
