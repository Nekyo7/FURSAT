import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get expired stories
        const { data: expiredStories, error: fetchError } = await supabaseClient
            .from('stories')
            .select('id, image_url')
            .lt('expires_at', new Date().toISOString())

        if (fetchError) throw fetchError

        if (!expiredStories || expiredStories.length === 0) {
            return new Response(
                JSON.stringify({ message: 'No expired stories to clean up' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                }
            )
        }

        console.log(`Found ${expiredStories.length} expired stories`)

        // 2. Delete images from storage
        const filesToDelete = expiredStories
            .map(story => {
                // Extract file path from URL
                // URL format: https://project.supabase.co/storage/v1/object/public/stories/filename.jpg
                const url = new URL(story.image_url)
                const pathParts = url.pathname.split('/stories/')
                return pathParts.length > 1 ? pathParts[1] : null
            })
            .filter(path => path !== null)

        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabaseClient
                .storage
                .from('stories')
                .remove(filesToDelete)

            if (storageError) {
                console.error('Error deleting files:', storageError)
                // Continue to delete records even if storage delete fails
            } else {
                console.log(`Deleted ${filesToDelete.length} images from storage`)
            }
        }

        // 3. Delete records from database
        const { error: deleteError } = await supabaseClient
            .from('stories')
            .delete()
            .in('id', expiredStories.map(s => s.id))

        if (deleteError) throw deleteError

        return new Response(
            JSON.stringify({
                message: `Successfully cleaned up ${expiredStories.length} stories`,
                deleted_count: expiredStories.length
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
