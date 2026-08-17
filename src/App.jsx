import { useEffect, useState } from "react";
import { SHOWS, APPS } from "./data/apps";
import { UI, LANGS, CREDIT } from "./data/ui";
import AppCard from "./components/AppCard";
import PreSave from "./components/PreSave";
import CalendarView from "./components/CalendarView";
import "./styles.css";

const HASH = { guide: "#guida", calendar: "#calendario" };
const APP_IDS = new Set(APPS.map((a) => a.id));

/* L'indirizzo può contenere #calendario, #guida oppure l'id di una app,
   per esempio #idolchamp: in quel caso apre la guida su quella scheda. */
function readHash() {
  if (typeof window === "undefined") return { view: "guide", app: null };
  const raw = decodeURIComponent(window.location.hash.replace("#", ""));
  if (raw === "calendario") return { view: "calendar", app: null };
  if (APP_IDS.has(raw)) return { view: "guide", app: raw };
  return { view: "guide", app: null };
}

export default function App() {
  const [lang, setLang] = useState("it");
  // la vista è legata all'indirizzo: #calendario apre il calendario, anche da
  // un link esterno, e il tasto indietro del telefono torna alla guida
  const [view, setView] = useState(() => readHash().view);
  const [filter, setFilter] = useState("tutti");
  const [active, setActive] = useState(() => readHash().app);
  // Variante del logo music show: "float" (a cavallo del bordo) o "header" (dentro la fascia).
  const mode = "float";
  const t = UI[lang];
  const visible = filter === "tutti" ? APPS : APPS.filter((a) => a.show === filter);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const sync = () => {
      const { view: v, app } = readHash();
      setView(v);
      if (app) {
        setActive(app);
        setFilter("tutti"); // se un filtro nascondeva quella scheda
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const goTo = (next) => {
    setView(next);
    if (window.location.hash !== HASH[next]) {
      window.history.pushState(null, "", HASH[next]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <div className="wrap">
        <header>
          <div className="topbar">
            <p className="eyebrow">{t.eyebrow}</p>
            <div className="topbar-right">
              <div className="langswitch" role="group" aria-label={t.langLabel}>
                {LANGS.map((l) => (
                  <button
                    key={l}
                    className={`lang ${lang === l ? "lang-on" : ""}`}
                    aria-pressed={lang === l}
                    onClick={() => setLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <nav className="social" aria-label={t.socialLabel}>
                <a href="https://www.instagram.com/enhypen.italia_/" className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
                       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://x.com/ENHYPEN_ITALIA_" className="social-btn" aria-label="X">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>

          <h1 className="hero-title">
            {t.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-sub">{t.intro}</p>
          <PreSave t={t} />
          <div className="hero-rule" />
        </header>

        <nav className="views" aria-label={t.viewLabel}>
          {[
            ["guide", t.viewGuide],
            ["calendar", t.viewCalendar],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`view-tab ${view === id ? "view-on" : ""}`}
              aria-pressed={view === id}
              onClick={() => goTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {view === "calendar" ? (
          <CalendarView lang={lang} t={t} />
        ) : (
          <>
        <p className="jump-row">
          <a className="jump" href={HASH.calendar}>
            {t.jumpToCalendar}
          </a>
        </p>

        <nav className="filters" aria-label={t.filterLabel}>
          <button
            className={`chip ${filter === "tutti" ? "chip-on" : ""}`}
            onClick={() => setFilter("tutti")}
          >
            {t.allApps}
          </button>
          {Object.entries(SHOWS).map(([id, s]) => (
            <button
              key={id}
              className={`chip ${filter === id ? "chip-on" : ""}`}
              onClick={() => setFilter(id)}
            >
              {s.name}
            </button>
          ))}
        </nav>

        <main className={`grid mode-${mode}`}>
          {visible.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              mode={mode}
              lang={lang}
              t={t}
              active={active === app.id}
              onSelect={() => setActive(app.id)}
            />
          ))}
        </main>
          </>
        )}

        <footer className="foot">
          {t.footer}
          <p className="credit">{CREDIT}</p>
        </footer>
      </div>
    </div>
  );
}
