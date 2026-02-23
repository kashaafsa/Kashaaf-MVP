"use client";

import { useI18n } from "@/lib/i18n-context";

export default function TournamentPage() {
    const { t } = useI18n();
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
            <h1 className="text-4xl font-bold">{t("tournament.title")}</h1>
        </div>
    );
}

