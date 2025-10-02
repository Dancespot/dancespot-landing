// netlify/functions/submission-created.js
// ———————————————————————————————————————————————
// ✅ PARAMÈTRES À PERSONNALISER
// ———————————————————————————————————————————————
const INSTAGRAM_URL = "https://www.instagram.com/dancespot.app";       // ← remplace si besoin
const FACEBOOK_URL  = "https://www.facebook.com/profile.php?id=61581671904988"; // ← remplace si besoin
const ASM_GROUP_ID  = 46604; // ← ⚠️ remplace par l'ID de ton Unsubscribe Group (SendGrid → Marketing → Unsubscribe Groups)

// Textes de pied de mail (3 langues) incluant un lien "Se désabonner"
const FOOTER_TEXT = {
  fr: `Tu reçois cet email car tu t’es inscrit(e) à la liste d’attente de DanceSpot.
      <a href="<%asm_group_unsubscribe_raw_url%>" target="_blank" rel="noopener">Se désabonner de la newsletter</a>.`,
  en: `You’re receiving this email because you joined the DanceSpot waitlist.
      <a href="<%asm_group_unsubscribe_raw_url%>" target="_blank" rel="noopener">Unsubscribe from the newsletter</a>.`,
  es: `Recibes este correo porque te uniste a la lista de espera de DanceSpot.
      <a href="<%asm_group_unsubscribe_raw_url%>" target="_blank" rel="noopener">Darse de baja del boletín</a>.`
};

// ———————————————————————————————————————————————
// ✉️ FUNCTION
// ———————————————————————————————————————————————
export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const payload = body?.payload || {};
    const formName = payload?.form_name;
    const data = payload?.data || {};

    if (formName !== "subscribe") {
      return { statusCode: 200, body: `Ignored form: ${formName}` };
    }

    const email = (data.email || "").trim();
    const lang  = (data.lang  || "fr").toLowerCase();
    if (!email) return { statusCode: 400, body: "Missing email" };

    const T = {
      fr: {
        subject: "Tu es sur la liste 🎟️ — DanceSpot arrive",
        preheader: "Accès anticipé, offres limitées et les meilleurs events près de chez toi.",
        title: "Merci pour ton inscription à la liste d’attente !",
        intro: "Tu fais désormais partie des premiers à vivre l’expérience <strong>DanceSpot</strong>.",
        fomo: "Nous préparons une app qui change la donne : <strong>ne rate plus aucun événement</strong>, <strong>réserve en 2 clics</strong> et <strong>profite d’avantages exclusifs</strong>.",
        bullets: [
          "📍 Tous les événements de danse autour de toi, au même endroit",
          "🎫 Billetterie intégrée & rappels intelligents (fini les events manqués)",
          "💸 Réductions partenaires",
          "🚀 Accès anticipé pour les premiers inscrits — places limitées"
        ],
        follow: "Suis-nous pour les coulisses et les annonces :",
        footer: FOOTER_TEXT.fr
      },
      en: {
        subject: "You’re on the list 🎟️ — DanceSpot is coming",
        preheader: "Early access, limited offers and the best events near you.",
        title: "Thanks for joining the waitlist!",
        intro: "You’re among the first to experience <strong>DanceSpot</strong>.",
        fomo: "We’re building an app to change the game: <strong>never miss a dance event again</strong>, <strong>book in two taps</strong> and <strong>unlock exclusive perks</strong>.",
        bullets: [
          "📍 All dance events around you, in one place",
          "🎫 Built-in ticketing & smart reminders",
          "💸 Partner discounts",
          "🚀 Early access for first subscribers — limited spots"
        ],
        follow: "Follow us for behind-the-scenes and drops:",
        footer: FOOTER_TEXT.en
      },
      es: {
        subject: "¡Estás en la lista 🎟️ — DanceSpot llega pronto!",
        preheader: "Acceso anticipado, ofertas limitadas y los mejores eventos cerca de ti.",
        title: "¡Gracias por unirte a la lista de espera!",
        intro: "Ya formas parte de los primeros en probar <strong>DanceSpot</strong>.",
        fomo: "Estamos creando una app que lo cambia todo: <strong>no te pierdas ningún evento</strong>, <strong>reserva en segundos</strong> y <strong>disfruta de ventajas exclusivas</strong>.",
        bullets: [
          "📍 Todos los eventos de danza cerca de ti, en un solo lugar",
          "🎫 Entradas integradas y recordatorios inteligentes",
          "💸 Descuentos de partners",
          "🚀 Acceso anticipado para los primeros — plazas limitadas"
        ],
        follow: "Síguenos para novedades y anuncios:",
        footer: FOOTER_TEXT.es
      }
    };

    const t = T[["fr","en","es"].includes(lang) ? lang : "fr"];
    const li = t.bullets.map(b => `<li style="margin:6px 0">${b}</li>`).join("");

    const html = `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.subject}</title>
<style>
  body{margin:0;background:#f6f9fc;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
  .wrap{max-width:640px;margin:0 auto;padding:24px}
  .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;box-shadow:0 8px 28px rgba(2,6,23,.06)}
  .brand{display:inline-block;background:#0184c9;color:#fff;border-radius:12px;padding:6px 10px;font-weight:800}
  .muted{color:#475569;font-size:13px}
  ul{padding-left:18px;margin:10px 0}
  .social a{display:inline-block;margin-right:10px;text-decoration:none;background:#111827;color:#fff;padding:10px 14px;border-radius:10px;font-weight:700}
  .social a.fb{background:#1877F2}.social a.ig{background:#E1306C}
</style>
</head>
<body>
  <div class="wrap">
    <p class="muted" style="margin:8px 0">${t.preheader}</p>
    <div class="card">
      <div style="margin-bottom:10px"><span class="brand">DanceSpot</span></div>
      <h1 style="margin:8px 0 10px 0;font-size:24px;line-height:1.3">${t.title}</h1>
      <p style="margin:0 0 12px 0;line-height:1.6">${t.intro}</p>
      <p style="margin:0 0 10px 0;line-height:1.6">${t.fomo}</p>
      <ul>${li}</ul>
      <p style="margin:16px 0 8px 0;font-weight:700">${t.follow}</p>
      <p class="social" style="margin:8px 0 0 0">
        <a class="ig" href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Instagram</a>
        <a class="fb" href="${FACEBOOK_URL}"  target="_blank" rel="noopener">Facebook</a>
      </p>
      <p class="muted" style="margin-top:16px;line-height:1.5">${t.footer}</p>
    </div>
    <p class="muted" style="margin:14px 8px">© ${new Date().getFullYear()} DanceSpot</p>
  </div>
</body></html>`.trim();

    const { SENDGRID_API_KEY, FROM_EMAIL, FROM_NAME } = process.env;
    if (!SENDGRID_API_KEY || !FROM_EMAIL) {
      console.error("Missing SENDGRID_API_KEY or FROM_EMAIL");
      return { statusCode: 500, body: "Email not configured" };
    }

    // ———————————————————————————————————————————————
    // 📤 ENVOI SENDGRID
    // ———————————————————————————————————————————————
    const payloadSend = {
      personalizations: [{ to: [{ email }], subject: t.subject }],
      from: { email: FROM_EMAIL, name: FROM_NAME || "DanceSpot" },
      content: [{ type: "text/html", value: html }],
      categories: ["waitlist_welcome"],
      // 1) Toujours envoyer (confirmation) même si l’adresse est déjà sur listes → bypass
      mail_settings: {
        bypass_list_management: { enable: true },
        // 2) Activer l'injection du lien d'unsubscribe via substitution tag dans le HTML
        subscription_tracking: {
          enable: true,
          substitution_tag: "<%asm_group_unsubscribe_raw_url%>"
        }
      },
      // 3) Liens propres (pas de réécriture) mais on garde l'open tracking
      tracking_settings: {
        click_tracking: { enable: false },
        open_tracking:  { enable: true }
      },
      // 4) Associer l'email au bon Unsubscribe Group (ASM)
      asm: { group_id: ASM_GROUP_ID }
    };

    const send = async () => {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadSend)
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("SendGrid error:", res.status, text);
        return { ok: false, status: res.status, text };
      }
      return { ok: true };
    };

    // Petit retry sur 429/5xx
    let attempt = 0, out;
    do {
      out = await send();
      if (out.ok || ![429,500,502,503,504].includes(out.status)) break;
      await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
      attempt++;
    } while (attempt < 2);

    if (!out.ok) return { statusCode: 502, body: "SendGrid error" };
    return { statusCode: 200, body: "Confirmation email sent" };
  } catch (e) {
    console.error("Handler error:", e);
    return { statusCode: 500, body: "Internal error" };
  }
}
