import { supabase } from "@/lib/supabase/client";

export const uploadVideoPost = async (file: File, content: string) => {
  const { data: userRes, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  const user = userRes.user;
  if (!user) throw new Error("Not logged in");

  if (!file?.type?.startsWith("video/")) throw new Error("File must be a video");

  const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const BUCKET = "videos";

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  

  if (upErr) throw upErr;

 
  const mediaUrl = pub.publicUrl;

  const { error: dbErr } = await supabase.from("posts").insert({
    user_id: user.id,
    content: content?.trim() || null,
    media_url: mediaUrl,
  });

  if (dbErr) throw dbErr;

  return { mediaUrl, path };
  
};

export default uploadVideoPost;
