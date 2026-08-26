import { SHOWS, APPS } from "../data/apps";
import { WINS } from "../data/wins";
import { toDate, LOCALE } from "../lib/weeks";

const SHOW_ORDER = ["bank", "champion", "core", "inkigayo", "mcountdown"];

/* Il colore di ogni mensola viene dall'app che si usa per votare quel
   programma, così l'armadietto parla la stessa lingua del resto del sito. */
const ACCENT = Object.fromEntries(
  SHOW_ORDER.map((show) => [show, APPS.find((a) => a.show === show)?.accent || "#0B0B0B"])
);

function fmtDay(value, lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "short" }).format(
    toDate(value)
  );
}

/* Coppa disegnata, non emoji: così prende il colore del programma e si può
   animare. */
function Trophy({ win, lang, index, accent }) {
  const date = fmtDay(win.episode, lang);
  const label = win.label?.[lang];

  return (
    <figure
      className="tr-trophy"
      style={{ "--c": accent, "--i": index }}
      title={[date, label].filter(Boolean).join(" · ")}
    >
      <svg viewBox="0 0 56 46" aria-hidden="true">
        {/* corona: tre punte con le gemme in cima */}
        <path
          d="M6 34 4 12l13 9L28 6l11 15 13-9-2 22z"
          fill="var(--c)"
          stroke="var(--c)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* fascia della corona */}
        <rect x="6" y="34" width="44" height="8" rx="2.5" fill="var(--ink)" />
        {/* gemme sulle punte */}
        <circle cx="4" cy="11" r="3.4" fill="var(--ink)" />
        <circle cx="28" cy="5" r="4" fill="var(--ink)" />
        <circle cx="52" cy="11" r="3.4" fill="var(--ink)" />
        {/* riflesso che passa */}
        <rect className="tr-shine" x="12" y="12" width="6" height="22" fill="#fff" opacity=".4" />
      </svg>
      <figcaption>
        <span className="tr-date">{date}</span>
        {label && <span className="tr-label">{label}</span>}
      </figcaption>
    </figure>
  );
}

function Shelf({ show, wins, lang, order, copy }) {
  const info = SHOWS[show];
  const accent = ACCENT[show];
  const sorted = wins.slice().sort((a, b) => toDate(a.episode) - toDate(b.episode));

  return (
    <section className="tr-shelf" style={{ "--c": accent, "--row": order }}>
      <div className="tr-stage">
        {sorted.length > 0 ? (
          sorted.map((w, i) => (
            <Trophy key={w.id} win={w} lang={lang} index={i} accent={accent} />
          ))
        ) : (
          <p className="tr-waiting">{copy.waiting}</p>
        )}
      </div>

      <div className="tr-plank" />

      <div className="tr-plate">
        <span className="tr-logo">
          {info.logo ? <img src={info.logo} alt={info.name} /> : info.name}
        </span>
        <span className="tr-count">
          {sorted.length} {sorted.length === 1 ? copy.win : copy.wins}
        </span>
      </div>
    </section>
  );
}

export default function TrophyCase({ lang }) {
  const byShow = Object.fromEntries(SHOW_ORDER.map((id) => [id, []]));
  WINS.forEach((w) => byShow[w.show]?.push(w));
  const total = WINS.length;

  const copy = {
    it: {
      title: "Armadietto dei trofei",
      eyebrow: "the sin:bliss",
      total: total === 1 ? "vittoria" : "vittorie",
      waiting: "mensola in attesa",
      win: "vittoria",
      wins: "vittorie",
      back: "← Torna alla guida",
    },
    en: {
      title: "Trophy case",
      eyebrow: "the sin:bliss",
      total: total === 1 ? "win" : "wins",
      waiting: "shelf waiting",
      win: "win",
      wins: "wins",
      back: "← Back to the guide",
    },
  }[lang];

  return (
    <div className="tr-page">
      <div className="tr-wrap">
        <header className="tr-head">
          <p className="tr-eyebrow">{copy.eyebrow}</p>
          <h1 className="tr-title">{copy.title}</h1>
          <p className="tr-total">
            <b>{total}</b> {copy.total}
          </p>
        </header>

        <div className="tr-case">
          {SHOW_ORDER.map((id, i) => (
            <Shelf key={id} show={id} wins={byShow[id]} lang={lang} order={i} copy={copy} />
          ))}
        </div>

        <a className="tr-back" href="#guida">
          {copy.back}
        </a>
      </div>
    </div>
  );
}
