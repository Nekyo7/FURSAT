-- Seed conversation between two users
DO $$
DECLARE
    user_a UUID := 'e84e00f1-44dd-4d9f-80d0-cbfbaebcf77a'; -- nekyo063@gmail.com
    user_b UUID := '1399ab34-6762-4f2d-9fb6-78f5865f9b96'; -- nekyo108@gmail.com
    convo_id UUID;
BEGIN
    -- Check if conversation exists
    SELECT conversation_id INTO convo_id
    FROM public.conversation_members cm1
    WHERE cm1.user_id = user_a
    AND EXISTS (
        SELECT 1 FROM public.conversation_members cm2
        WHERE cm2.conversation_id = cm1.conversation_id
        AND cm2.user_id = user_b
    )
    LIMIT 1;

    -- Create if not exists
    IF convo_id IS NULL THEN
        INSERT INTO public.conversations (created_at, last_message_at)
        VALUES (now(), now())
        RETURNING id INTO convo_id;

        INSERT INTO public.conversation_members (conversation_id, user_id, joined_at)
        VALUES
            (convo_id, user_a, now()),
            (convo_id, user_b, now());
    END IF;

    -- Insert messages
    INSERT INTO public.messages (conversation_id, sender_id, content, created_at, is_read)
    VALUES
        (convo_id, user_a, 'Hi there!', now() - interval '5 minutes', true),
        (convo_id, user_b, 'Hello! How are you?', now() - interval '4 minutes', true),
        (convo_id, user_a, 'I am doing good, thanks for asking.', now() - interval '3 minutes', true),
        (convo_id, user_b, 'Great to hear! Working on the project?', now() - interval '1 minute', false);

    -- Update last_message_at
    UPDATE public.conversations
    SET last_message_at = now()
    WHERE id = convo_id;

END $$;
