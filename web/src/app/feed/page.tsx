"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { uploadPostMedia, Attachment } from "@/lib/posts/uploadMedia";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreVertical,
  Trash2,
  Edit,
  Ban,
  Send,
  X,
  Image as ImageIcon,
  Video
} from "lucide-react";

type PostRow = {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  attachments: Attachment[] | null;
  created_at: string;
  profiles?: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null;
  post_likes?: { user_id: string }[] | null;
  post_comments?: { id: string }[] | null;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: { username?: string | null; full_name?: string | null; avatar_url?: string | null } | null;
};

export default function FeedPage() {
  const router = useRouter();
  const { t } = useI18n();

  const [me, setMe] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<PostRow[]>([]);
  const [creating, setCreating] = useState(false);

  const [newText, setNewText] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ type: 'image' | 'video', url: string }[]>([]);

  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, CommentRow[]>>({});
  const [commentText, setCommentText] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editAttachments, setEditAttachments] = useState<Attachment[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);

  const myId = me?.id ?? null;

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) { router.replace("/auth?tab=signin"); return; }
      setMe({ id: user.id, email: user.email ?? undefined });
      setLoading(false);
    })();
  }, [router]);

  useEffect(() => {
    if (!myId && loading) return;
    if (!myId) return;
    loadPosts();
  }, [myId]);

  async function loadPosts() {
    try {
      const { data: blocks } = await supabase.from("user_blocks").select("blocked_id").eq("blocker_id", myId);
      const blockedIds = (blocks ?? []).map((b: any) => b.blocked_id);
      let query = supabase.from("posts").select("id,user_id,content,media_url,attachments,created_at,profiles(username,full_name,avatar_url),post_likes(user_id),post_comments(id)").order("created_at", { ascending: false }).limit(50);
      if (blockedIds.length > 0) query = query.not("user_id", "in", `(${blockedIds.join(",")})`);
      const { data, error } = await query;
      if (error) throw error;
      setPosts((data as any) ?? []);
    } catch (e: any) { toast.error(e?.message ?? "Failed to load feed"); }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const currentFiles = isEdit ? editNewFiles : newFiles;
    let videos = 0;
    let images = 0;
    if (isEdit) {
      editAttachments.forEach(a => a.type === 'video' ? videos++ : images++);
      editNewFiles.forEach(f => f.type.startsWith('video/') ? videos++ : images++);
    } else {
      newFiles.forEach(f => f.type.startsWith('video/') ? videos++ : images++);
    }
    const validFiles: File[] = [];
    for (const f of files) {
      const isVideo = f.type.startsWith('video/');
      if (isVideo) {
        if (videos < 2 && (videos + images) < 4) { videos++; validFiles.push(f); }
        else toast.error("Limit reached: Max 2 videos.");
      } else {
        if ((videos + images) < 4) { images++; validFiles.push(f); }
        else toast.error("Limit reached: Max 4 items.");
      }
    }
    if (isEdit) {
      setEditNewFiles(prev => [...prev, ...validFiles]);
    } else {
      const updated = [...newFiles, ...validFiles];
      setNewFiles(updated);
      const newPreviews = validFiles.map(f => ({ type: (f.type.startsWith('video/') ? 'video' : 'image') as 'video' | 'image', url: URL.createObjectURL(f) }));
      setFilePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => { setNewFiles(prev => prev.filter((_, i) => i !== index)); setFilePreviews(prev => prev.filter((_, i) => i !== index)); };
  const removeEditFile = (index: number) => { setEditNewFiles(prev => prev.filter((_, i) => i !== index)); };
  const removeEditAttachment = (index: number) => { setEditAttachments(prev => prev.filter((_, i) => i !== index)); };

  async function createPost() {
    const text = newText.trim();
    if (!myId) return toast.error("Not signed in");
    if (!text && newFiles.length === 0) return toast.error("Write something or pick media.");
    setCreating(true);
    try {
      let attachments: Attachment[] = [];
      if (newFiles.length > 0) attachments = await uploadPostMedia(newFiles, myId);
      const { error } = await supabase.from("posts").insert({ user_id: myId, content: text || null, media_url: attachments.length > 0 ? attachments[0].url : null, attachments });
      if (error) throw error;
      setNewText(""); setNewFiles([]); setFilePreviews([]);
      toast.success(t("feed.posted"));
      await loadPosts();
    } catch (e: any) { console.error(e); toast.error(e?.message ?? "Failed to create post"); }
    finally { setCreating(false); }
  }

  function isLikedByMe(p: PostRow) { return (p.post_likes ?? []).some((l) => l.user_id === myId); }

  async function toggleLike(postId: string) {
    if (!myId) return toast.error("Not signed in");
    const p = posts.find((x) => x.id === postId);
    if (!p) return;
    const liked = isLikedByMe(p);
    setPosts((prev) => prev.map((x) => {
      if (x.id !== postId) return x;
      const likes = x.post_likes ?? [];
      return { ...x, post_likes: liked ? likes.filter((l) => l.user_id !== myId) : [...likes, { user_id: myId }] };
    }));
    try {
      if (!liked) await supabase.from("post_likes").insert({ post_id: postId, user_id: myId });
      else await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", myId);
    } catch { toast.error("Like failed"); await loadPosts(); }
  }

  async function openComments(postId: string) {
    if (openCommentsFor === postId) { setOpenCommentsFor(null); setCommentText(""); return; }
    setOpenCommentsFor(postId); setCommentText("");
    const { data } = await supabase.from("post_comments").select("id,post_id,user_id,content,created_at,profiles(username,full_name,avatar_url)").eq("post_id", postId).order("created_at", { ascending: true });
    setComments((prev) => ({ ...prev, [postId]: (data as any) ?? [] }));
  }

  async function addComment() {
    if (!myId || !openCommentsFor || !commentText.trim()) return;
    try { await supabase.from("post_comments").insert({ post_id: openCommentsFor, user_id: myId, content: commentText.trim() }); setCommentText(""); await openComments(openCommentsFor); await loadPosts(); }
    catch { toast.error("Comment failed"); }
  }

  async function deletePost(postId: string) {
    if (!confirm(t("feed.confirmDelete"))) return;
    setPosts(prev => prev.filter(p => p.id !== postId));
    try { await supabase.from("posts").delete().eq("id", postId); toast.success(t("feed.deleted")); }
    catch { toast.error("Failed delete"); await loadPosts(); }
  }

  function startEditing(p: PostRow) {
    setEditingId(p.id); setEditText(p.content || "");
    let existing: Attachment[] = p.attachments || [];
    if (existing.length === 0 && p.media_url) {
      const isVid = p.media_url.includes(".mp4") || p.media_url.includes("video");
      existing = [{ type: isVid ? 'video' : 'image', url: p.media_url, path: '' }];
    }
    setEditAttachments(existing); setEditNewFiles([]);
  }

  function cancelEditing() { setEditingId(null); setEditText(""); setEditAttachments([]); setEditNewFiles([]); }

  async function savePostEdit(postId: string) {
    try {
      let finalAttachments = [...editAttachments];
      if (editNewFiles.length > 0) { const newUploaded = await uploadPostMedia(editNewFiles, myId!); finalAttachments = [...finalAttachments, ...newUploaded]; }
      const changes = { content: editText, attachments: finalAttachments, media_url: finalAttachments.length > 0 ? finalAttachments[0].url : null };
      const { error } = await supabase.from("posts").update(changes).eq("id", postId);
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...changes } : p));
      cancelEditing(); toast.success(t("feed.postUpdated"));
    } catch { toast.error("Failed to update post"); }
  }

  async function blockUser(userId: string) {
    if (!myId || !confirm(t("feed.confirmBlock"))) return;
    setPosts(prev => prev.filter(p => p.user_id !== userId));
    await supabase.from("user_blocks").insert({ blocker_id: myId, blocked_id: userId });
    toast.success(t("feed.blocked"));
  }

  async function share(postId: string) {
    navigator.clipboard.writeText(`${window.location.origin}/p/${postId}`);
    toast.success(t("feed.copied"));
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">{t("feed.loading")}</div>;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Create post */}
        <Card className="p-5 rounded-xl border-border/60 shadow-sm">
          <div className="font-semibold text-lg mb-2">{t("feed.createPost")}</div>
          <div className="space-y-4">
            <Textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder={t("feed.placeholder")} className="resize-none min-h-[100px] bg-muted/30 border-none focus-visible:ring-1" />

            {filePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {filePreviews.map((f, i) => (
                  <div key={i} className="relative aspect-video bg-black rounded-md overflow-hidden group">
                    {f.type === 'video' ? <video src={f.url} className="w-full h-full object-cover" /> : <img src={f.url} className="w-full h-full object-cover" />}
                    <button onClick={() => removeFile(i)} className="absolute top-1 end-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex gap-2">
                <label className="cursor-pointer p-2 hover:bg-muted rounded-full text-gaming-primary transition-colors">
                  <ImageIcon className="h-5 w-5" />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                </label>
                <label className="cursor-pointer p-2 hover:bg-muted rounded-full text-blue-400 transition-colors">
                  <Video className="h-5 w-5" />
                  <input type="file" multiple accept="video/*" className="hidden" onChange={handleFileSelect} />
                </label>
                <span className="text-xs text-muted-foreground flex items-center ms-2">{t("feed.maxItems")}</span>
              </div>
              <Button onClick={createPost} disabled={creating} size="sm" className="px-6 rounded-full font-bold">
                {creating ? t("feed.posting") : t("feed.post")}
              </Button>
            </div>
          </div>
        </Card>

        {/* Posts */}
        {posts.map((p) => {
          const liked = isLikedByMe(p);
          const name = p.profiles?.full_name || p.profiles?.username || "User";
          const avatarUrl = p.profiles?.avatar_url || "/avatar-placeholder.png";
          const isEditing = editingId === p.id;

          let displayAttachments: Attachment[] = p.attachments || [];
          if (displayAttachments.length === 0 && p.media_url) {
            const isVid = p.media_url.includes(".mp4");
            displayAttachments = [{ type: isVid ? 'video' : 'image', url: p.media_url, path: '' }];
          }

          return (
            <Card key={p.id} className="rounded-xl border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Avatar><AvatarImage src={avatarUrl} /><AvatarFallback>{name[0]}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-semibold text-sm">{name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {p.user_id === myId ? (
                        <>
                          <DropdownMenuItem onClick={() => startEditing(p)}><Edit className="me-2 h-4 w-4" /> {t("feed.edit")}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deletePost(p.id)} className="text-destructive"><Trash2 className="me-2 h-4 w-4" /> {t("feed.delete")}</DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => blockUser(p.user_id)} className="text-destructive"><Ban className="me-2 h-4 w-4" /> {t("feed.block")}</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Textarea value={editText} onChange={e => setEditText(e.target.value)} className="min-h-[100px]" />

                      {editAttachments.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold mb-2">{t("feed.currentMedia")}</div>
                          <div className="grid grid-cols-2 gap-2">
                            {editAttachments.map((a, i) => (
                              <div key={i} className="relative aspect-video bg-black rounded-md overflow-hidden group">
                                {a.type === 'video' ? <video src={a.url} controls className="w-full h-full object-cover" /> : <img src={a.url} className="w-full h-full object-cover" />}
                                <button onClick={() => removeEditAttachment(i)} className="absolute top-1 end-1 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {editNewFiles.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold mb-2 mt-2">{t("feed.newUploads")}</div>
                          <div className="space-y-1">
                            {editNewFiles.map((f, i) => (
                              <div key={i} className="flex justify-between text-xs bg-muted p-2 rounded">
                                <span>{f.name}</span>
                                <button onClick={() => removeEditFile(i)} className="text-red-500"><X className="h-3 w-3" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 border-t pt-2">
                        <label className="cursor-pointer p-2 hover:bg-muted rounded-full">
                          <ImageIcon className="h-5 w-5" />
                          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, true)} />
                        </label>
                        <label className="cursor-pointer p-2 hover:bg-muted rounded-full">
                          <Video className="h-5 w-5" />
                          <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => handleFileSelect(e, true)} />
                        </label>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>{t("feed.cancelBtn")}</Button>
                        <Button size="sm" onClick={() => savePostEdit(p.id)}>{t("feed.saveChanges")}</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {p.content && <div className="text-sm dark:text-gray-200 whitespace-pre-wrap">{p.content}</div>}

                      {displayAttachments.length > 0 && (
                        <div className={cn("mt-3 grid gap-2 overflow-hidden rounded-xl", displayAttachments.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                          {displayAttachments.map((a, idx) => (
                            <div key={idx} className={cn("relative bg-black/50 overflow-hidden", a.type === 'video' ? "aspect-video" : "aspect-square")}>
                              {a.type === 'video' ? <video src={a.url} controls playsInline className="w-full h-full object-contain" /> : <img src={a.url} alt="Attachment" className="w-full h-full object-cover" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleLike(p.id)} className={cn("h-8 rounded-full gap-2", liked && "text-primary")}>
                      <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} /> <span className="text-xs">{p.post_likes?.length || t("feed.like")}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openComments(p.id)} className={cn("h-8 rounded-full gap-2", openCommentsFor === p.id && "text-blue-500")}>
                      <MessageSquare className="h-4 w-4" /> <span className="text-xs">{p.post_comments?.length || t("feed.comment")}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => share(p.id)} className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
                </div>

                {openCommentsFor === p.id && (
                  <div className="mt-3 pt-3 border-t bg-muted/20 -mx-4 px-4 pb-2 space-y-3">
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {(comments[p.id] || []).map(c => (
                        <div key={c.id} className="flex gap-2">
                          <Avatar className="h-6 w-6"><AvatarFallback>{c.profiles?.username?.[0]}</AvatarFallback></Avatar>
                          <div className="bg-muted/50 px-3 py-1.5 rounded-2xl text-xs">
                            <span className="font-bold block text-muted-foreground mb-0.5">{c.profiles?.username}</span>
                            {c.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t("feed.writeComment")} className="h-9 rounded-full" onKeyDown={(e) => { if (e.key === "Enter") addComment(); }} />
                      <Button size="icon" className="h-9 w-9 rounded-full" onClick={addComment}><Send className="h-4 w-4" /></Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
