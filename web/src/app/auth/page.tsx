"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function normalizeUsername(u: string) {
  return u.toLowerCase().trim();
}

function AuthPageContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const defaultTab = useMemo(
    () => (sp.get("tab") === "signup" ? "signup" : "signin"),
    [sp]
  );

  const [tab, setTab] = useState<"signin" | "signup">(defaultTab as any);
  const [loading, setLoading] = useState(false);

  // sign in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // sign up
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");

  // username availability UX
  const [checkingUser, setCheckingUser] = useState(false);
  const [userAvailable, setUserAvailable] = useState<boolean | null>(null);

  const MAX_PASS = 50;

  function clampPass(v: string) {
    return v.slice(0, MAX_PASS);
  }

  // show / hide password
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordsMismatch =
    tab === "signup" && confirm.length > 0 && password !== confirm;
  const canSubmitSignup =
    !loading &&
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    username.trim().length >= 3 &&
    password.length >= 8 &&
    !passwordsMismatch &&
    userAvailable !== false;

  useEffect(() => setTab(defaultTab as any), [defaultTab]);

  // If already signed in, go to feed
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/feed");
    })();
  }, [router]);

  // Debounced username check (server route)
  useEffect(() => {
    if (tab !== "signup") return;

    const u = normalizeUsername(username);
    if (u.length < 3) {
      setUserAvailable(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setCheckingUser(true);
        const res = await fetch("/api/username-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: u }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setUserAvailable(null);
          return;
        }
        setUserAvailable(!!json.available);
      } catch {
        setUserAvailable(null);
      } finally {
        setCheckingUser(false);
      }
    }, 450);

    return () => clearTimeout(t);
  }, [username, tab]);

  async function handleSignIn() {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw error;

      toast.success("Welcome back.");
      router.push("/feed");
    } catch (e: any) {
      toast.error(e?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    try {
      // client-side validation first (fast feedback)
      if (!fullName.trim()) return toast.error("Name is required.");
      if (!email.trim()) return toast.error("Email is required.");
      if (!username.trim()) return toast.error("Username is required.");
      if (!/^[a-zA-Z0-9_.]+$/.test(username.trim()))
        return toast.error("Username must be letters/numbers/_/.");
      if (password.length < 8)
        return toast.error("Password must be at least 8 characters.");
      if (password !== confirm)
        return toast.error("Password confirmation does not match.");

      const u = normalizeUsername(username);

      // hard block if username is known to be taken
      if (userAvailable === false) return toast.error("Username already taken.");

      // server signup (strong handling + rollback)
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone_number: phone.trim(),
          username: u,
          email: email.trim(),
          password,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        toast.error(json?.message ?? "Sign up failed");
        return;
      }

      // login after signup
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      toast.success("Account created.");
      router.push("/feed");
    } catch (e: any) {
      toast.error(e?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background font-sans selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[150px] delay-700 animate-pulse" />
      </div>

      <div className="z-10 w-full max-w-lg px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8 space-y-4"
        >
          <div className="relative group">
            <div className="relative block">
              <Image
                src="/logo-auth.png"
                alt="Kashaaf Logo"
                width={180}
                height={180}
                className="w-72 h-auto object-contain"
                priority
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground tracking-widest uppercase">
              Where no talent is wasted.
            </p>
          </div>
        </motion.div>

        <Card className="rounded-xl border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="p-6 md:p-8">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger
                  value="signin"
                  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@kashaaf.com"
                    autoComplete="email"
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Password</Label>
                  <div className="relative">
                    <Input
                      type={showSignInPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(clampPass(e.target.value))}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-16 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                      onClick={() => setShowSignInPassword((v) => !v)}
                    >
                      {showSignInPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 font-semibold text-base py-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  onClick={handleSignIn}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : "Login"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 data-[state=inactive]:hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Full Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966..."
                      className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="agent_007"
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  <div className="text-xs text-muted-foreground flex items-center gap-2 h-4">
                    {checkingUser ? (
                      <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" /> checking...</span>
                    ) : userAvailable === true ? (
                      <span className="text-green-500 font-medium">Available</span>
                    ) : userAvailable === false ? (
                      <span className="text-red-500 font-medium">Taken</span>
                    ) : (
                      <span className="opacity-0">Placeholder</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@kashaaf.com"
                    className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Password</Label>
                    <div className="relative">
                      <Input
                        type={showSignUpPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(clampPass(e.target.value))}
                        placeholder="Min 8 chars"
                        autoComplete="new-password"
                        className="pr-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 bottom-0 px-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => setShowSignUpPassword((v) => !v)}
                      >
                        {showSignUpPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Confirm</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(clampPass(e.target.value))}
                        placeholder="Repeat"
                        autoComplete="new-password"
                        className="pr-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 bottom-0 px-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                </div>
                {passwordsMismatch && (
                  <div className="text-xs text-red-500 font-medium text-center bg-red-500/10 py-1 rounded">
                    Passwords do not match
                  </div>
                )}

                <Button
                  className="w-full mt-2 font-semibold text-base py-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  onClick={handleSignUp}
                  disabled={!canSubmitSignup}
                  size="lg"
                >
                  {loading ? "Registering..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        <div className="text-center text-xs text-muted-foreground/60">
          &copy; 2026 Kashaaf. All rights reserved.
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white bg-black">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
