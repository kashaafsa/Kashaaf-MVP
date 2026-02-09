import { supabase } from "@/lib/supabase/client";

export type Attachment = {
    type: 'image' | 'video';
    url: string;
    path: string; // Stored path for deletion if needed
};

export const uploadPostMedia = async (files: File[], userId: string): Promise<Attachment[]> => {
    const uploads = files.map(async (file) => {
        const isVideo = file.type.startsWith('video/');
        const bucket = isVideo ? 'videos' : 'images'; // Assumes 'images' bucket exists, user instruction needed
        const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase.storage
            .from(bucket)
            .upload(path, file, { contentType: file.type, upsert: false });

        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

        return {
            type: isVideo ? 'video' : 'image',
            url: pub.publicUrl,
            path: path
        } as Attachment;
    });

    return Promise.all(uploads);
};
