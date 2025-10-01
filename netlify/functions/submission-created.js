// netlify/functions/submission-created.js
// E-mail de confirmation + FOMO + désinscription SendGrid
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
    const lang = (data.lang || "fr").toLowerCase();
    if (!email) return { statusCode: 400, body: "Missing email" };

    // URL du site (domaine primaire Netlify)
    const siteUrl = `https://${event.headers.host || "www.dancespot.app"}/`;

    // Ton message plus "FOMO"
    const T = {
      fr: {
        subject: "Tu es sur la liste 🎟️ — DanceSpot arrive",
        preheader: "Accès anticipé, offres limitées et les meilleurs events près de chez toi.",
        title: "Merci pour ton inscription à la liste d’attente !",
        intro:
          "Tu fais désormais partie des premiers à vivre l’expérience <strong>DanceSpot</strong>.",
        fomo:
          "Nous préparons une app qui change la donne : <strong>ne rate plus aucun événement</strong>, <strong>réserve en 2 clics</strong> et <strong>profite d’avantages exclusifs</strong> (réductions partenaires, accès prioritaire, offres limitées).",
        bullets: [
          "📍 Tous les événements de danse autour de toi, au même endroit",
          "🎫 Billetterie intégrée & rappels intelligents (fini les events manqués)",
          "💸 Réductions partenaires (cours, vêtements, chaussures, voyages…)",
          "🚀 Accès anticipé pour les premiers inscrits — places limitées"
        ],
        cta: "Découvrir ce qui arrive",
        footer:
          "Si tu ne souhaites plus recevoir nos emails, tu peux te désinscrire à tout moment via le lien ci-dessous."
      },
      en: {
        subject: "You’re on the list 🎟️ — DanceSpot is coming",
        preheader: "Early access, limited offers and the best events near you.",
        title: "Thanks for joining the waitlist!",
        intro:
          "You’re among the first to experience <strong>DanceSpot</strong>.",
        fomo:
          "We’re building an app to change the game: <strong>never miss a dance event again</strong>, <strong>book in two taps</strong> and <strong>unlock exclusive perks</strong> (partner discounts, early access, limited drops).",
        bullets: [
          "📍 All dance events around you, in one place",
          "🎫 Built-in ticketing & smart reminders (no more missed workshops)",
          "💸 Partner discounts (classes, apparel, shoes, trips…)",
          "🚀 Early access for first subscribers — limited spots"
        ],
        cta: "See what’s coming",
        footer:
          "If you no longer wish to receive our emails, you can unsubscribe at any time using the link below."
      },
      es: {
        subject: "¡Estás en la lista 🎟️ — DanceSpot llega pronto!",
        preheader: "Acceso anticipado, ofertas limitadas y los mejores eventos cerca de ti.",
        title: "¡Gracias por unirte a la lista de espera!",
        intro:
          "Ya formas parte de los primeros en probar <strong>DanceSpot</strong>.",
        fomo:
          "Estamos creando una app que lo cambia todo: <strong>no te pierdas ningún evento</strong>, <strong>reserva en segundos</strong> y <strong>disfruta de ventajas exclusivas</strong> (descuentos de partners, acceso anticipado, ofertas limitadas).",
        bullets: [
          "📍 Todos los eventos de danza cerca de ti, en un solo lugar",
          "🎫 Entradas integradas y recordatorios inteligentes",
          "💸 Descuentos de partners (clases, ropa, zapatos, viajes…)",
          "🚀 Acceso anticipado para los primeros registros — plazas limitadas"
        ],
        cta: "Descubre lo que viene",
        footer:
          "Si no quieres seguir recibiendo nuestros emails, puedes darte de baja en cualquier momento desde el enlace de abajo."
      }
    };
    const t = T[["fr", "en", "es"].includes(lang) ? lang : "fr"];

    const listItems = t.bullets.map(b => `<li style="margin:6px 0">${b}</li>`).join("");

    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${t.subject}</title>
    <style>
      body{margin:0;background:#f6f9fc;color:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
      .wrap{max-width:640px;margin:0 auto;padding:24px}
      .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;box-shadow:0 8px 28px rgba(2,6,23,.06)}
      .brand{display:inline-block;background:#0184c9;color:#fff;border-radius:12px;padding:6px 10px;font-weight:800}
      .btn{display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:700}
      .muted{color:#475569;font-size:13px}
      ul{padding-left:18px;margin:10px 0}
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
        <ul>${listItems}</ul>
        <p style="margin:14px 0 20px 0">
          <a class="btn" href="${siteUrl}" target="_blank" rel="noopener noreferrer">${t.cta}</a>
        </p>
        <p class="muted" style="margin:12px 0 0 0">${t.footer}</p>
      </div>
      <p class="muted" style="margin:14px 8px">© ${new Date().getFullYear()} DanceSpot</p>
    </div>
  </body>
</html>`.trim();

    // ---- Envoi via SendGrid ----
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@dancespot.app";
    const FROM_NAME  = process.env.FROM_NAME  || "DanceSpot";

    if (!SENDGRID_API_KEY) {
      console.error("Missing SENDGRID_API_KEY");
      return { statusCode: 500, body: "Email not configured" };
    }

    // Active le tracking de désinscription SendGrid : un lien “unsubscribe” est injecté automatiquement.
    const sgPayload = {
      personalizations: [{ to: [{ email }], subject: t.subject }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      content: [{ type: "text/html", value: html }],
      mail_settings: {
        subscription_tracking: {
          enable: true,
          // Texte de fallback si tu veux forcer un libellé personnalisé :
          text: "Pour vous désabonner, cliquez <% %>.",
          html: "Pour vous désabonner, cliquez <a href='<% %>'>ici</a>."
        }
      }
      // Variante ASM (si tu utilises des groupes de désinscription SendGrid) :
      // asm: { group_id: 12345 }
    };

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sgPayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("SendGrid error:", res.status, errText);
      return { statusCode: 500, body: "SendGrid error" };
    }

    return { statusCode: 200, body: "Confirmation email sent" };
  } catch (e) {
    console.error("Handler error:", e);
    return { statusCode: 500, body: "Internal error" };
  }
}
