import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { requestId, correct, helpful, tags } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
        }

        // Update feedback fields
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (typeof correct === "boolean") {
            updateData.feedback_correct = correct;
        }

        if (typeof helpful === "number" && helpful >= 1 && helpful <= 5) {
            updateData.feedback_helpful = helpful;
        }

        if (Array.isArray(tags)) {
            updateData.feedback_tags = tags;
        }

        const { error } = await supabaseAdmin
            .from("analysis_requests")
            .update(updateData)
            .eq("id", requestId);

        if (error) {
            console.error("Feedback update error:", error);
            return NextResponse.json(
                { error: "Failed to save feedback" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Feedback route error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
