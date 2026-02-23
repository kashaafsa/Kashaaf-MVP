"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "@/lib/i18n/en.json";
import ar from "@/lib/i18n/ar.json";

export type Locale = "en" | "ar";

const dictionaries: Record<Locale, Record<string, any>> = { en, ar };

interface I18nContextValue {
    locale: Locale;
    dir: "ltr" | "rtl";
    t: (key: string) => string;
    tArray: (key: string) => string[];
    toggleLocale: () => void;
    setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(obj: any, path: string): any {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");

    // Read from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("kashaaf-locale") as Locale | null;
        if (stored === "ar" || stored === "en") setLocaleState(stored);
    }, []);

    // Persist + update <html> attributes
    useEffect(() => {
        localStorage.setItem("kashaaf-locale", locale);
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }, [locale]);

    const dir = locale === "ar" ? "rtl" : "ltr";

    const t = useCallback(
        (key: string): string => {
            const val = resolve(dictionaries[locale], key);
            if (typeof val === "string") return val;
            // fallback to English
            const fallback = resolve(dictionaries.en, key);
            return typeof fallback === "string" ? fallback : key;
        },
        [locale]
    );

    const tArray = useCallback(
        (key: string): string[] => {
            const val = resolve(dictionaries[locale], key);
            if (Array.isArray(val)) return val;
            const fallback = resolve(dictionaries.en, key);
            return Array.isArray(fallback) ? fallback : [];
        },
        [locale]
    );

    const toggleLocale = useCallback(() => {
        setLocaleState((prev) => (prev === "en" ? "ar" : "en"));
    }, []);

    const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

    return (
        <I18nContext.Provider value={{ locale, dir, t, tArray, toggleLocale, setLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
    return ctx;
}
