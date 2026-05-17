import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────

export async function performNotificationsAction(request: Request) {
  const { supabase, headers } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  // ── Marquer UNE notification comme lue ──────────────────────
  if (intent === "mark_read") {
    const key = formData.get("key") as string;
    if (!key) return data({ success: false }, { headers });

    await supabase
      .from("notification_reads")
      .upsert(
        { user_id: user.id, notification_key: key },
        { onConflict: "user_id,notification_key" }
      );

    return data({ success: true, intent: "mark_read" }, { headers });
  }

  // ── Tout marquer comme lu ────────────────────────────────────
  if (intent === "mark_all_read") {
    const rawKeys = formData.get("keys") as string;
    const keys: string[] = JSON.parse(rawKeys ?? "[]");

    if (keys.length > 0) {
      const rows = keys.map((notification_key) => ({
        user_id: user.id,
        notification_key,
      }));
      await supabase
        .from("notification_reads")
        .upsert(rows, { onConflict: "user_id,notification_key" });
    }

    return data({ success: true, intent: "mark_all_read" }, { headers });
  }

  return data({ success: false, message: "Action inconnue." }, { headers });
}
