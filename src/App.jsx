import { useEffect, useState } from "react";
import { SHOWS, APPS } from "./data/apps";
import { UI, LANGS, CREDIT } from "./data/ui";
import AppCard from "./components/AppCard";
import PreSave from "./components/PreSave";
import TopBar from "./components/TopBar";
import CalendarView from "./components/CalendarView";
import TrophyCase from "./components/TrophyCase";
import Scoring from "./components/Scoring";
import "./styles.css";

const HASH = { guide: "#guida", calendar: "#calendario", scoring: "#punteggi" };
const APP_IDS = new Set(APPS.map((a) => a.id));

/* L'indirizzo può contenere #calendario, #guida oppure l'id di una app,
   per esempio #idolchamp: in quel caso apre la guida su quella scheda. */
function readHash() {
  if (typeof window === "undefined") return { view: "guide", app: null };
  const raw = decodeURIComponent(window.location.hash.replace("#", ""));
  if (raw === "calendario") return { view: "calendar", app: null };
  if (raw === "vittorie") return { view: "trophy", app: null };
  if (raw === "punteggi") return { view: "scoring", app: null };
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

  if (view === "trophy") {
    return <TrophyCase lang={lang} setLang={setLang} t={t} />;
  }

  return (
    <div className="page">
      <div className="wrap">
        <header>
          <TopBar t={t} lang={lang} setLang={setLang} />

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
            ["scoring", t.viewScoring],
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
        ) : view === "scoring" ? (
          <Scoring lang={lang} t={t} />
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
