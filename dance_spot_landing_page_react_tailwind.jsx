import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, MapPin, TicketPercent, Trophy, Wallet, Search, Sparkles, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ------------------------------------------------------------------
// Brand & Assets
const PRODUCT_NAME = "DanceSpot"; // ⟵ Confirme si le nom de marque doit être "DancePod" ou "DanceSpot".
const LOGO_URL: string | null = null;
const APP_SCREEN_URLS: string[] = [];

// ------------------------------------------------------------------
// Internationalisation (FR/EN/ES)
// NB: Tu peux déplacer ceci dans un fichier i18n plus tard.
const i18n = {
  fr: {
    langName: "FR",
    nav: {
      features: "Fonctionnalités",
      how: "Comment ça marche",
      dancers: "Danseurs",
      organizers: "Organisateurs",
      testimonials: "Témoignages",
      feedback: "Avis & idées",
      subscribe: "S'inscrire",
    },
    hero: {
      badge: "Développée par des danseurs, pour les danseurs",
      title: "Ne ratez plus aucun évènement de danse",
      subtitle: `${PRODUCT_NAME} vous aide à économiser sur les cours, workshops, déplacements, voyages et logements — tout ce qui entoure la danse — tout en centralisant billets et infos au même endroit.`,
      emailPlaceholder: "Votre email",
      emailCta: "Prévenez-moi au lancement",
      consent: `En vous inscrivant, vous acceptez de recevoir des nouvelles de ${PRODUCT_NAME} (désinscription à tout moment).`,
      success: "Merci ! Vous serez informé(e) du lancement.",
    },
    dancers: {
      title: "Pour les danseurs",
      p: "Voyez instantanément ce qui se passe près de vous, évitez de manquer des workshops et économisez grâce aux récompenses.",
      f1: "Recherche par localisation, style, date, budget ou carte",
      f2: "Suivi des battles et compétitions (résultats & historique)",
      f3: "Réductions partenaires (cours, voyages, logements)",
      f4: "Portefeuille d'évènements (billets, passes)",
    },
    organizers: {
      title: "Pour les organisateurs",
      p: "Publiez vos évènements facilement, vendez des billets et accédez à des statistiques utiles pour vos sponsors.",
      b1: "Billetterie intégrée et portefeuille participants",
      b2: "Promotion ciblée vers une audience 100% danse",
      b3: "Tableau de bord analytics (croissance, ventes, engagement)",
      cta: "Être contacté(e) pour la bêta organisateurs",
    },
    how: {
      title: "Comment ça marche",
      subtitle: `Co‑construisons ${PRODUCT_NAME} avec la communauté` ,
      s1t: "Rejoignez la liste d'attente",
      s1d: "Laissez votre email pour être notifié(e) du lancement et accéder en priorité à la bêta.",
      s2t: "Votez & donnez votre avis",
      s2d: "Dites‑nous ce qui compte le plus (économies, déplacements, logements, fonctionnalités prioritaires).",
      s3t: "Accès anticipé & avantages",
      s3d: "Profitez d'un accès anticipé et d'avantages partenaires négociés avec la communauté.",
    },
    winwin: {
      title: "Pourquoi c'est gagnant‑gagnant ?",
      d1: "Les danseurs dépensent moins (cours, trajets, logements) et ratent moins d'opportunités.",
      d2: "Les organisateurs atteignent une audience qualifiée et trouvent plus facilement des sponsors.",
      d3: "La communauté locale se renforce : plus de visibilité, plus de rencontres, plus de danse.",
    },
    testimonials: {
      title: "Basé sur les expériences de la communauté",
      t1: { name: "Nadia, danseuse", text: "Je dépense trop pour participer aux événements : cours, déplacements, logements… J'ai besoin d'un coup de pouce." },
      t2: { name: "Alex, danseur", text: "J'ai encore raté un workshop qui était à 10 minutes de chez moi. Je veux tout voir au même endroit." },
      t3: { name: "Maya, organisatrice", text: "Difficile de trouver des sponsors. J'ai besoin d'insights clairs pour convaincre." },
    },
    feedback: {
      title: "Vos idées comptent",
      subtitle: `Aidez‑nous à construire ${PRODUCT_NAME}. Dites‑nous ce qui vous ferait économiser du temps et de l'argent.`,
      placeholder: "Vos suggestions (facultatif)",
      emailPlaceholder: "Votre email",
      cta: "Envoyer mon idée",
      success: "Merci pour votre contribution !",
    },
    subscribe: {
      title: "Restez informé(e)",
      subtitle: "Recevez la date de lancement et l'accès à la bêta en avant‑première.",
      placeholder: "Votre email",
      cta: "M'alerter au lancement",
      success: "Merci ! Nous vous tiendrons au courant très vite.",
    },
  },
  en: {
    langName: "EN",
    nav: {
      features: "Features",
      how: "How it works",
      dancers: "Dancers",
      organizers: "Organizers",
      testimonials: "Testimonials",
      feedback: "Feedback",
      subscribe: "Subscribe",
    },
    hero: {
      badge: "Built by dancers for dancers",
      title: "Never miss a dance event again",
      subtitle: `${PRODUCT_NAME} helps you save on classes, workshops, transport, trips and lodging — while keeping tickets and info in one place.`,
      emailPlaceholder: "Your email",
      emailCta: "Notify me at launch",
      consent: `By subscribing you agree to receive news from ${PRODUCT_NAME} (unsubscribe anytime).`,
      success: "Thanks! We'll let you know when we launch.",
    },
    dancers: {
      title: "For dancers",
      p: "Instantly see what's nearby, stop missing workshops and save money with perks.",
      f1: "Search by location, style, date, budget or map",
      f2: "Battle & competition tracking (results & history)",
      f3: "Partner discounts (classes, travel, lodging)",
      f4: "Event wallet (tickets & passes)",
    },
    organizers: {
      title: "For organizers",
      p: "Publish events easily, sell tickets and get sponsor‑ready analytics.",
      b1: "Built‑in ticketing & participant wallet",
      b2: "Targeted promotion to a 100% dance audience",
      b3: "Analytics dashboard (growth, sales, engagement)",
      cta: "Join organizer beta",
    },
    how: {
      title: "How it works",
      subtitle: `Let's co‑build ${PRODUCT_NAME} with the community`,
      s1t: "Join the waitlist",
      s1d: "Leave your email to be notified and get early beta access.",
      s2t: "Vote & share feedback",
      s2d: "Tell us what matters most (savings, travel, lodging, priority features).",
      s3t: "Early access & perks",
      s3d: "Enjoy early access and community‑negotiated partner deals.",
    },
    winwin: {
      title: "Why it's win‑win?",
      d1: "Dancers spend less (classes, travel, lodging) and miss fewer opportunities.",
      d2: "Organizers reach a qualified audience and secure sponsors more easily.",
      d3: "Local communities get stronger: visibility, encounters, more dance.",
    },
    testimonials: {
      title: "Based on community experiences",
      t1: { name: "Nadia, dancer", text: "I overspend to join events — classes, trips, lodging… I need relief." },
      t2: { name: "Alex, dancer", text: "I missed another workshop 10 minutes from home. I want everything in one place." },
      t3: { name: "Maya, organizer", text: "Sponsorships are hard. I need clear insights to convince." },
    },
    feedback: {
      title: "Your ideas matter",
      subtitle: `Help us build ${PRODUCT_NAME}. Tell us what would save you time and money.`,
      placeholder: "Your suggestions (optional)",
      emailPlaceholder: "Your email",
      cta: "Send feedback",
      success: "Thanks for your input!",
    },
    subscribe: {
      title: "Stay in the loop",
      subtitle: "Get the launch date and early beta access.",
      placeholder: "Your email",
      cta: "Alert me at launch",
      success: "Thanks! We'll keep you posted.",
    },
  },
  es: {
    langName: "ES",
    nav: {
      features: "Funciones",
      how: "Cómo funciona",
      dancers: "Bailarines",
      organizers: "Organizadores",
      testimonials: "Testimonios",
      feedback: "Ideas",
      subscribe: "Suscríbete",
    },
    hero: {
      badge: "Creada por bailarines para bailarines",
      title: "No te pierdas ningún evento de danza",
      subtitle: `${PRODUCT_NAME} te ayuda a ahorrar en clases, workshops, transporte, viajes y alojamiento — y guarda entradas e info en un solo lugar.`,
      emailPlaceholder: "Tu email",
      emailCta: "Avísame en el lanzamiento",
      consent: `Al suscribirte aceptas recibir novedades de ${PRODUCT_NAME} (puedes darte de baja cuando quieras).`,
      success: "¡Gracias! Te avisaremos cuando lancemos.",
    },
    dancers: {
      title: "Para bailarines",
      p: "Descubre al instante lo que pasa cerca de ti, no te pierdas workshops y ahorra con ventajas.",
      f1: "Búsqueda por ubicación, estilo, fecha, presupuesto o mapa",
      f2: "Seguimiento de batallas y competiciones (resultados e historial)",
      f3: "Descuentos con socios (clases, viajes, alojamiento)",
      f4: "Cartera de eventos (entradas y pases)",
    },
    organizers: {
      title: "Para organizadores",
      p: "Publica eventos fácilmente, vende entradas y obtén analíticas para patrocinadores.",
      b1: "Ticketing integrado y cartera de participantes",
      b2: "Promoción dirigida a una audiencia 100% danza",
      b3: "Panel de analíticas (crecimiento, ventas, engagement)",
      cta: "Unirme a la beta",
    },
    how: {
      title: "Cómo funciona",
      subtitle: `Construyamos ${PRODUCT_NAME} junto a la comunidad`,
      s1t: "Únete a la lista de espera",
      s1d: "Deja tu email para recibir el aviso y acceso anticipado.",
      s2t: "Vota y comparte ideas",
      s2d: "Cuéntanos qué te importa (ahorros, viajes, alojamiento, funciones prioritarias).",
      s3t: "Acceso temprano y ventajas",
      s3d: "Disfruta acceso temprano y acuerdos con socios negociados por la comunidad.",
    },
    winwin: {
      title: "¿Por qué todos ganan?",
      d1: "Los bailarines gastan menos (clases, viajes, alojamiento) y no se pierden oportunidades.",
      d2: "Los organizadores llegan a una audiencia cualificada y obtienen patrocinadores más fácilmente.",
      d3: "La comunidad local se fortalece: visibilidad, encuentros, más danza.",
    },
    testimonials: {
      title: "Basado en experiencias de la comunidad",
      t1: { name: "Nadia, bailarina", text: "Gasto demasiado para participar — clases, viajes, alojamiento… Necesito ayuda." },
      t2: { name: "Alex, bailarín", text: "Volví a perderme un workshop a 10 minutos de casa. Quiero verlo todo en un mismo lugar." },
      t3: { name: "Maya, organizadora", text: "Conseguir patrocinio es difícil. Necesito insights claros para convencer." },
    },
    feedback: {
      title: "Tus ideas importan",
      subtitle: `Ayúdanos a construir ${PRODUCT_NAME}. Dinos qué te ahorraría tiempo y dinero.`,
      placeholder: "Tus sugerencias (opcional)",
      emailPlaceholder: "Tu email",
      cta: "Enviar idea",
      success: "¡Gracias por tu aporte!",
    },
    subscribe: {
      title: "Mantente al día",
      subtitle: "Recibe la fecha de lanzamiento y acceso anticipado a la beta.",
      placeholder: "Tu email",
      cta: "Avisarme en el lanzamiento",
      success: "¡Gracias! Te mantendremos informado.",
    },
  },
};

// ------------------------------------------------------------------
// UI atoms
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-start">
    <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{value}</div>
    <div className="text-sm opacity-80">{label}</div>
  </div>
);

const Feature = ({ icon: Icon, title, text }: { icon: any; title: string; text: string }) => (
  <Card className="bg-white/60 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6 flex items-start gap-4">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
        {<Icon className="w-6 h-6" />}
      </div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-sm opacity-80 leading-relaxed">{text}</p>
      </div>
    </CardContent>
  </Card>
);

const WaveBackground = () => (
  <div aria-hidden className="absolute inset-0 overflow-hidden">
    <div className="absolute -inset-[10%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_45%)] animate-pulse" />
    <div className="absolute -inset-[20%] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.2),transparent_55%)] animate-[pulse_6s_ease-in-out_infinite]" />
    <div className="absolute -inset-[30%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_65%)] animate-[pulse_7s_ease-in-out_infinite]" />
  </div>
);

const Logo = ({ className = "w-14 h-14" }: { className?: string }) => {
  if (LOGO_URL) return <img src={LOGO_URL} alt={PRODUCT_NAME} className={className} />;
  return (
    <svg viewBox="0 0 512 512" className={className} aria-label={`${PRODUCT_NAME} logo`}>
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path fill="url(#g)" d="M256 32c-98 0-176 78-176 176 0 78 40 132 92 204l57 78c9 13 28 13 37 0l57-78c52-72 92-126 92-204 0-98-78-176-176-176zm0 64a40 40 0 1 1 0 80 40 40 0 0 1 0-80zm-42 40c22 0 45 10 62 26 17 16 32 26 55 26 23 0 43-5 63-14-8 40-33 78-62 118l-76 104-76-104c-29-40-54-78-62-118 20 9 40 14 63 14 23 0 38-10 55-26 17-16 40-26 62-26z" />
    </svg>
  );
};

const PhoneFrame = ({ src, alt }: { src?: string; alt?: string }) => (
  <div className="relative w-[240px] h-[500px] rounded-[2.5rem] border border-black/10 bg-gradient-to-b from-white to-slate-50 shadow-xl overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-8 bg-black/80 rounded-b-3xl mx-auto w-2/3" />
    {src ? (
      <img src={src} alt={alt || "App screen"} className="absolute inset-0 w-full h-full object-cover" />
    ) : (
      <div className="absolute inset-0 grid place-items-center">
        <Sparkles className="w-10 h-10" />
      </div>
    )}
  </div>
);

const GradientBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow">
    {children}
  </span>
);

// ------------------------------------------------------------------
export default function DanceLanding() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [lang, setLang] = useState<keyof typeof i18n>("fr");
  const t = i18n[lang];

  useEffect(() => {
    // Dev assertions (pseudo‑tests légers)
    console.assert(i18n.fr && i18n.en && i18n.es, "i18n doit contenir fr/en/es");
    console.assert(Array.isArray(APP_SCREEN_URLS), "APP_SCREEN_URLS doit être un tableau.");
    console.assert([t.organizers.b1, t.organizers.b2, t.organizers.b3].length === 3, "3 bullet points attendus côté organisateurs");
  }, [t]);

  const onSubmitEmail: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert(t.hero.success);
  };

  const onSubmitFeedback: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert(t.feedback.success);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <span className="font-extrabold tracking-tight text-xl">{PRODUCT_NAME}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:opacity-70">{t.nav.features}</a>
            <a href="#how-it-works" className="hover:opacity-70">{t.nav.how}</a>
            <a href="#dancers" className="hover:opacity-70">{t.nav.dancers}</a>
            <a href="#organizers" className="hover:opacity-70">{t.nav.organizers}</a>
            <a href="#testimonials" className="hover:opacity-70">{t.nav.testimonials}</a>
            <a href="#feedback" className="hover:opacity-70">{t.nav.feedback}</a>
            <a href="#subscribe" className="hover:opacity-70">{t.nav.subscribe}</a>
          </nav>
          <div className="flex items-center gap-2">
            <select
              aria-label="Language"
              className="rounded-lg border px-2 py-1 bg-white/80"
              value={lang}
              onChange={(e) => setLang(e.target.value as keyof typeof i18n)}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
        </div>
      </header>

      {/* Hero (email capture) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-sky-100 to-white" />
        <WaveBackground />
        <motion.div style={{ y }} className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12">
          <div className="relative z-10">
            <GradientBadge><MapPin className="w-4 h-4" /> {t.hero.badge}</GradientBadge>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-lg opacity-90 max-w-xl">{t.hero.subtitle}</p>
            <div className="mt-6">
              <form className="flex flex-col sm:flex-row gap-3 max-w-xl" onSubmit={onSubmitEmail}>
                <input
                  type="email"
                  required
                  placeholder={t.hero.emailPlaceholder}
                  className="flex-1 rounded-xl px-4 py-3 border border-slate-300 bg-white/90"
                />
                <Button type="submit" size="lg" className="rounded-2xl">{t.hero.emailCta}</Button>
              </form>
              <p className="mt-2 text-xs opacity-70 max-w-xl">{t.hero.consent}</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              <Stat value="10k+" label="Events" />
              <Stat value="120+" label="Cities" />
              <Stat value="600+" label="Organizers" />
            </div>
          </div>
          <div className="relative md:justify-self-end">
            <div className="absolute -top-6 -left-10 -right-10 -bottom-6 blur-3xl bg-gradient-to-br from-cyan-300/40 to-blue-500/30 rounded-[3rem]" />
            <div className="relative flex gap-6 md:gap-8">
              <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <PhoneFrame src={APP_SCREEN_URLS[0]} />
              </motion.div>
              <motion.div initial={{ y: -30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }} className="hidden md:block mt-10">
                <PhoneFrame src={APP_SCREEN_URLS[1]} />
              </motion.div>
              <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }} className="hidden lg:block">
                <PhoneFrame src={APP_SCREEN_URLS[2]} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Win‑Win section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{t.winwin.title}</h2>
        <ul className="space-y-2 text-sm md:text-base opacity-90 list-disc pl-5">
          <li>{t.winwin.d1}</li>
          <li>{t.winwin.d2}</li>
          <li>{t.winwin.d3}</li>
        </ul>
      </section>

      {/* Features (teaser only) */}
      <section id="features" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div id="dancers">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.dancers.title}</h3>
            <p className="mt-3 opacity-90 max-w-prose">{t.dancers.p}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Feature icon={Search} title="" text={t.dancers.f1} />
              <Feature icon={Trophy} title="" text={t.dancers.f2} />
              <Feature icon={TicketPercent} title="" text={t.dancers.f3} />
              <Feature icon={Wallet} title="" text={t.dancers.f4} />
            </div>
          </div>
          <div id="organizers">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.organizers.title}</h3>
            <p className="mt-3 opacity-90 max-w-prose">{t.organizers.p}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[t.organizers.b1, t.organizers.b2, t.organizers.b3].map((txt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 text-blue-600" />
                  <span className="opacity-90">{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works (no app yet) */}
      <section id="how-it-works" className="py-20 bg-slate-50/70">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.how.title}</h2>
          <p className="mt-2 opacity-80">{t.how.subtitle}</p>
          <div className="mt-12 grid md:grid-cols-3 gap-10 items-start">
            {[
              { title: t.how.s1t, text: t.how.s1d },
              { title: t.how.s2t, text: t.how.s2d },
              { title: t.how.s3t, text: t.how.s3d },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full grid place-items-center bg-gradient-to-br from-indigo-400 to-cyan-400 text-white font-bold text-xl shadow">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm opacity-80 max-w-xs">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (pain points) */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">{t.testimonials.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            t.testimonials.t1,
            t.testimonials.t2,
            t.testimonials.t3,
          ].map((tm, i) => (
            <Card key={i} className="bg-white shadow hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col gap-4">
                <Quote className="w-6 h-6 text-blue-600" />
                <p className="text-sm opacity-90 italic">“{tm.text}”</p>
                <span className="text-sm font-semibold">{tm.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feedback (ideas) */}
      <section id="feedback" className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">{t.feedback.title}</h2>
        <p className="mt-2 opacity-80 text-center">{t.feedback.subtitle}</p>
        <form className="mt-6 grid gap-3" onSubmit={onSubmitFeedback}>
          <textarea rows={4} placeholder={t.feedback.placeholder} className="w-full rounded-xl px-4 py-3 border border-slate-300 bg-white/90" />
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" required placeholder={t.feedback.emailPlaceholder} className="flex-1 rounded-xl px-4 py-3 border border-slate-300 bg-white/90" />
            <Button type="submit" className="rounded-xl">{t.feedback.cta}</Button>
          </div>
        </form>
      </section>

      {/* Subscribe (email capture) */}
      <section id="subscribe" className="relative py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-600 to-blue-700" />
        <div className="absolute inset-0 -z-0 opacity-30">
          <WaveBackground />
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t.subscribe.title}</h2>
          <p className="mt-2 text-white/90">{t.subscribe.subtitle}</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={onSubmitEmail}>
            <input
              type="email"
              required
              placeholder={t.subscribe.placeholder}
              className="flex-1 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-500"
            />
            <Button type="submit" className="rounded-xl">{t.subscribe.cta}</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Logo className="w-7 h-7" />
              <span className="font-bold">{PRODUCT_NAME}</span>
            </div>
            <p className="opacity-80">Un seul hub pour la communauté de danse mondiale.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-2">{t.nav.features}</h5>
            <ul className="space-y-1 opacity-80">
              <li>{t.dancers.f1}</li>
              <li>{t.dancers.f2}</li>
              <li>{t.dancers.f3}</li>
              <li>{t.dancers.f4}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">{t.nav.how}</h5>
            <ul className="space-y-1 opacity-80">
              <li>{t.how.s1t}</li>
              <li>{t.how.s2t}</li>
              <li>{t.how.s3t}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">Contact</h5>
            <ul className="space-y-1 opacity-80">
              <li>Véronique Mukendi – Founder & CEO</li>
              <li>hello@dancespot.app</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs opacity-70 pb-8">© {new Date().getFullYear()} {PRODUCT_NAME}. Tous droits réservés.</div>
      </footer>
    </div>
  );
}
