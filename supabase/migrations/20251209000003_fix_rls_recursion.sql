-- Fix RLS recursion by using a security definer function

-- Function to check if a user is a member of a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_member(_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.conversation_members
        WHERE conversation_id = _conversation_id
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS Policies for Conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" ON public.conversations
    FOR SELECT USING (
        public.is_conversation_member(id)
    );

-- Update RLS Policies for Conversation Members
DROP POLICY IF EXISTS "Users can view members of their conversations" ON public.conversation_members;
CREATE POLICY "Users can view members of their conversations" ON public.conversation_members
    FOR SELECT USING (
        public.is_conversation_member(conversation_id)
    );

-- Update RLS Policies for Messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        public.is_conversation_member(conversation_id)
    );

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
CREATE POLICY "Users can send messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        public.is_conversation_member(conversation_id)
    );
