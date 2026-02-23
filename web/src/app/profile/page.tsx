"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, AtSign, Lock, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n-context";

interface Profile {
    full_name: string;
    username: string;
    phone_number: string | null;
}

export default function ProfilePage() {
    const router = useRouter();
    const { t } = useI18n();
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState<Profile | null>(null);

    // password change
    const [showPwSection, setShowPwSection] = useState(false);
    const [oldPw, setOldPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) { router.replace("/auth?redirect=/profile"); return; }
                setEmail(session.user.email ?? "");
                const { data, error } = await supabase.from("profiles").select("full_name, username, phone_number").eq("id", session.user.id).single();
                if (error) throw error;
                setProfile(data);
            } catch (e: any) {
                toast.error(e?.message ?? "Failed to load profile");
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    async function handlePasswordChange() {
        if (!oldPw.trim()) return toast.error(t("profile.oldPwRequired"));
        if (newPw.length < 8) return toast.error(t("profile.pwMin8"));
        if (newPw !== confirmPw) return toast.error(t("profile.noMatch"));

        setPwLoading(true);
        try {
            // Verify old password by signing in
            const { error: signInErr } = await supabase.auth.signInWithPassword({
                email,
                password: oldPw,
            });
            if (signInErr) {
                toast.error(t("profile.oldPwWrong"));
                setPwLoading(false);
                return;
            }

            // Update password
            const { error } = await supabase.auth.updateUser({ password: newPw });
            if (error) throw error;
            toast.success(t("profile.pwUpdated"));
            setOldPw("");
            setNewPw("");
            setConfirmPw("");
            setShowPwSection(false);
        } catch (e: any) {
            toast.error(e?.message ?? t("profile.pwFailed"));
        } finally {
            setPwLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gaming-dark flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gaming-primary/30 border-t-gaming-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gaming-dark flex items-center justify-center text-gray-400">
                {t("profile.unableToLoad")}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gaming-dark text-white font-sans">
            <div className="max-w-xl mx-auto px-4 py-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center border-2" style={{ borderColor: "#00E5FF", background: "rgba(0,229,255,.08)", boxShadow: "0 0 30px rgba(0,229,255,.15)" }}>
                            <span className="text-2xl font-black" style={{ color: "#00E5FF" }}>
                                {profile.full_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">{t("profile.yourProfile")}</h1>
                        <p className="text-sm text-gray-500 mt-1">@{profile.username}</p>
                    </div>

                    {/* Info Card */}
                    <Card className="rounded-2xl border-white/10 backdrop-blur-md p-6 space-y-5" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                                <User size={13} /> {t("profile.fullName")}
                            </Label>
                            <div className="text-white font-medium text-lg">{profile.full_name}</div>
                        </div>
                        <div className="border-t border-white/5" />
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                                <AtSign size={13} /> {t("profile.username")}
                            </Label>
                            <div className="text-white font-medium text-lg">{profile.username}</div>
                        </div>
                        <div className="border-t border-white/5" />
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                                <Mail size={13} /> {t("profile.email")}
                            </Label>
                            <div className="text-white font-medium text-lg">{email}</div>
                        </div>
                    </Card>

                    {/* Password Change */}
                    <div className="mt-6">
                        {!showPwSection ? (
                            <button onClick={() => setShowPwSection(true)} className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 cursor-pointer" style={{ color: "#00E5FF" }}>
                                <Lock size={14} /> {t("profile.changePassword")}
                            </button>
                        ) : (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-white/10 p-5 space-y-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                                        <Lock size={14} /> {t("profile.changePassword")}
                                    </span>
                                    <button onClick={() => { setShowPwSection(false); setOldPw(""); setNewPw(""); setConfirmPw(""); }} className="text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">
                                        {t("profile.cancel")}
                                    </button>
                                </div>

                                {/* Old Password */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">{t("profile.oldPassword")}</Label>
                                    <div className="relative">
                                        <Input type={showOld ? "text" : "password"} value={oldPw} onChange={(e) => setOldPw(e.target.value.slice(0, 50))} placeholder="••••••••" className="pe-10 bg-background/50 border-border/50 focus:border-primary/50" />
                                        <button type="button" className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer" onClick={() => setShowOld(!showOld)}>
                                            {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">{t("profile.newPassword")}</Label>
                                    <div className="relative">
                                        <Input type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value.slice(0, 50))} placeholder={t("profile.min8")} className="pe-10 bg-background/50 border-border/50 focus:border-primary/50" />
                                        <button type="button" className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer" onClick={() => setShowNew(!showNew)}>
                                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">{t("profile.confirmPassword")}</Label>
                                    <div className="relative">
                                        <Input type={showConfirm ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value.slice(0, 50))} placeholder={t("profile.repeat")} className="pe-10 bg-background/50 border-border/50 focus:border-primary/50" />
                                        <button type="button" className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer" onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {confirmPw.length > 0 && newPw !== confirmPw && (
                                        <p className="text-xs text-red-500">{t("profile.noMatch")}</p>
                                    )}
                                </div>

                                <Button onClick={handlePasswordChange} disabled={pwLoading || !oldPw.trim() || newPw.length < 8 || newPw !== confirmPw} className="w-full font-semibold" size="sm">
                                    {pwLoading ? (
                                        <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> {t("profile.updating")}</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><Check size={14} /> {t("profile.updatePassword")}</span>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
