// netlify/functions/submission-created.js
export async function handler(event) {
  try {
    // L’évènement Netlify contient le payload de la soumission
    const payload = JSON.parse(event.body);
    const formName = payload?.payload?.form_name;
    const data = payload?.payload?.data || {};

    // On ne traite que le formulaire "subscribe"
    if (formName !== "subscribe") {
      return { statusCode: 200, body: `Ignored form: ${formName}` };
    }

    const email = (data.email || "").trim();
    const lang = (data.lang || "fr").toLowerCase(); // voir Étape 4 (champ caché "lang")

    if (!email) {
      return { statusCode: 400, body: "Missing email" };
    }

    // -- Templates multi-langues (objet simple)
    const T = {
      fr: {
        subject: "Confirme ton inscription — DanceSpot",
        preheader: "Reste à l’affût pour le lancement : découvre, réserve, danse.",
        title: "Bienvenue dans la communauté DanceSpot 💃🕺",
        body: "Merci pour ton inscription à la liste d’attente. Nous te préviendrons au lancement et t’enverrons des nouveautés en avant-première.",
        cta: "Voir la page",
        footer: "Tu peux te désinscrire à tout moment via le lien au bas de nos emails."
      },
      en: {
        subject: "Confirm your signup — DanceSpot",
        preheader: "Stay tuned for launch: discover, book, dance.",
        title: "Welcome to the DanceSpot community 💃🕺",
        body: "Thanks for joining the waitlist. We’ll notify you at launch and share early updates.",
        cta: "Visit the site",
        footer: "You can unsubscribe at any time using the link at the bottom of our emails."
      },
      es: {
        subject: "Confirma tu suscripción — DanceSpot",
        preheader: "Mantente atento al lanzamiento: descubre, reserva, baila.",
        title: "Bienvenido/a a la comunidad de DanceSpot 💃🕺",
        body: "Gracias por unirte a la lista de espera. Te avisaremos en el lanzamiento y compartiremos novedades anticipadas.",
        cta: "Ir al sitio",
        footer: "Puedes darte de baja en cualquier momento desde el enlace al final de nuestros correos."
      }
    };

    const t = T[lang] || T.fr;

    // HTML simple (responsive)
    const html = `
<!doctype html>
<html>
  <head><meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${t.subject}</title>
    <style>
      body{margin:0;background:#f6f9fc;color:#0f172a}
      .container{max-width:640px;margin:0 auto;padding:24px}
      .card{background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e2e8f0}
      .btn{display:inline-block;background:#0184c9;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:600}
      .muted{color:#475569;font-size:13px}
      .brand{display:inline-block;background:#0184c9;color:#fff;border-radius:12px;padding:6px 10px;font-weight:700}
    </style>
  </head>
  <body>
    <div class="container">
      <p class="muted" style="margin:8px 0">${t.preheader}</p>
      <div class="card">
        <div style="margin-bottom:8px"><span class="brand">DanceSpot</span></div>
        <h1 style="margin:8px 0 10px 0;font-size:24px;line-height:1.3">${t.title}</h1>
        <p style="margin:0 0 16px 0;line-height:1.6">${t.body}</p>
        <p style="margin:0 0 20px 0">
          <a class="btn" href="https://YOUR-NETLIFY-SITE.netlify.app" target="_blank" rel="noopener noreferrer">${t.cta}</a>
        </p>
        <p class="muted" style="margin:12px 0 0 0">${t.footer}</p>
      </div>
      <p class="muted" style="margin:14px 8px">© ${new Date().getFullYear()} DanceSpot</p>
    </div>
  </body>
</html>`.trim();

    // Envoi via SendGrid API (pas besoin de package)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY; // à définir dans Netlify
    const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@dancespot.app";
    const FROM_NAME = process.env.FROM_NAME || "DanceSpot";

    if (!SENDGRID_API_KEY) {
      console.error("Missing SENDGRID_API_KEY");
      return { statusCode: 500, body: "Email not configured" };
    }

    const sgPayload = {
      personalizations: [{ to: [{ email }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: t.subject,
      content: [{ type: "text/html", value: html }]
    };

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
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
