// Edge Function: send-reminders
// Desplegada en Supabase (proyecto erseehhvaqgsqsvjkovu). NO contiene secretos:
// lee las claves VAPID y el cron_secret desde la tabla public.app_config con el
// service_role. La invoca pg_cron cada hora (job "tutracker-reminders") con el
// header x-cron-secret. Para cada suscripción calcula la hora local (tzoff) y,
// si es su hora y NO cerró su día, envía un web-push. ?test=1 ignora hora/estado.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

Deno.serve(async (req: Request) => {
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(url, svc);

    const { data: cfg } = await sb.from("app_config").select("key,value");
    const map: Record<string, string> = Object.fromEntries((cfg || []).map((r: any) => [r.key, r.value]));
    const secret = map["cron_secret"];
    const given = req.headers.get("x-cron-secret");
    if (!secret || given !== secret) return new Response("forbidden", { status: 403 });

    const test = new URL(req.url).searchParams.get("test") === "1";
    webpush.setVapidDetails("mailto:dipzon03@gmail.com", map["vapid_public"], map["vapid_private"]);

    const { data: subs } = await sb.from("push_subs").select("*").eq("enabled", true);
    const now = new Date();
    let sent = 0, failed = 0, skipped = 0;

    for (const s of (subs || [])) {
      if (!test) {
        const localMin = now.getUTCHours() * 60 + now.getUTCMinutes() + (s.tzoff || 0);
        const localH = Math.floor((((localMin % 1440) + 1440) % 1440) / 60);
        if (localH !== s.hour) continue;
        const localDate = new Date(now.getTime() + (s.tzoff || 0) * 60000);
        const today = localDate.toISOString().slice(0, 10);
        const { data: ts } = await sb.from("tracker_state").select("data").eq("user_id", s.user_id).maybeSingle();
        const d: any = ts?.data?.days?.[today];
        const hl: string[] = ((d?.goals?.length ? d.goals : (ts?.data?.habits || [])) as any[]).map((h: any) => h.id);
        const done = hl.length > 0 && hl.every((id: string) => d?.habits?.[id]);
        if (done) { skipped++; continue; }
      }
      const payload = JSON.stringify({ title: "TuTracker 🔥", body: "¿Ya cerraste tu día? Aún puedes sumar tu racha.", url: "/" });
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
        sent++;
      } catch (e: any) {
        failed++;
        if (e && (e.statusCode === 404 || e.statusCode === 410)) {
          await sb.from("push_subs").delete().eq("endpoint", s.endpoint);
        }
      }
    }
    return new Response(JSON.stringify({ ok: true, sent, failed, skipped }), { headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
