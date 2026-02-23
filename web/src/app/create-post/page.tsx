"use client";

import { useI18n } from "@/lib/i18n-context";

export default function CreatePostPage() {
    const { t } = useI18n();
    return (
        <main className="min-h-screen p-6">
            <h1 className="text-2xl font-semibold">{t("createPostPage.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("createPostPage.comingSoon")}</p>
        </main>
    );
}

