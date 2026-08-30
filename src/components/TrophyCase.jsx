import { useState } from "react";
import { SHOWS } from "../data/apps";
import { WINS } from "../data/wins";
import { toDate, LOCALE } from "../lib/weeks";
import WinClip from "./WinClip";
import TopBar from "./TopBar";

const SHOW_ORDER = [ "champion", "mcountdown", "bank", "core", "inkigayo", ];

/* Un unico colore per tutte le corone: una vittoria vale una vittoria,
   indipendentemente dal programma. */
const CROWN = "#D9A521";

function fmtDay(value, lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "short" }).format(
    toDate(value)
  );
}

function Crown({ win, lang, index, onOpen }) {
  const date = fmtDay(win.episode, lang);
  const label = win.label?.[lang];
  const Tag = win.clip ? "button" : "figure";

  return (
    <Tag
      className={`tr-crown ${win.clip ? "has-clip" : ""}`}
      style={{ "--i": index }}
      title={[date, label].filter(Boolean).join(" · ")}
      {...(win.clip ? { onClick: () => onOpen(win), type: "button" } : {})}
    >
      <svg viewBox="0 0 56 46" aria-hidden="true">
        {/* corpo della corona */}
        <path
          d="M6 34 4 12l13 9L28 6l11 15 13-9-2 22z"
          fill="var(--gold)"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* fascia e gemme, oro più scuro */}
        <rect x="6" y="34" width="44" height="8" rx="2.5" fill="var(--gold-dark)" />
        <circle cx="4" cy="11" r="3.4" fill="var(--gold-dark)" />
        <circle cx="28" cy="5" r="4" fill="var(--gold-dark)" />
        <circle cx="52" cy="11" r="3.4" fill="var(--gold-dark)" />
        <rect className="tr-shine" x="12" y="12" width="6" height="22" fill="#fff" />
      </svg>
      <span className="tr-when">{date}</span>
    </Tag>
  );
}

function Column({ show, wins, lang, order, onOpen, seq }) {
  const info = SHOWS[show];
  const sorted = wins.slice().sort((a, b) => toDate(a.episode) - toDate(b.episode));

  return (
    <div className={`tr-col ${sorted.length === 0 ? "is-empty" : ""}`} style={{ "--row": order }}>
      <span className="tr-logo">
        {info.logo ? <img src={info.logo} alt={info.name} /> : <b>{info.name}</b>}
      </span>

      {sorted.length > 0 && (
        <div className="tr-crowns">
          {sorted.map((w, i) => (
            <Crown key={w.id} win={w} lang={lang} index={seq.get(w.id)} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrophyCase({ lang, setLang, t }) {
  const [open, setOpen] = useState(null);
  const byShow = Object.fromEntries(SHOW_ORDER.map((id) => [id, []]));
  WINS.forEach((w) => byShow[w.show]?.push(w));
  const total = WINS.length;

  /* Grande slam: almeno una vittoria su ognuno dei cinque programmi.
     Quando succede, dopo l'ultima corona parte la celebrazione. */
  const slam = SHOW_ORDER.every((id) => byShow[id].length > 0);

  /* Ordine di entrata valido per tutta la pagina: senza, la prima corona di
     ogni programma avrebbe indice 0 e partirebbero tutte insieme. */
  const seq = new Map(
    WINS.slice()
      .sort((a, b) => toDate(a.episode) - toDate(b.episode))
      .map((w, i) => [w.id, i])
  );

  const copy = {
    it: {
      title: "THE SIN:BLISS",
      eyebrow: "ENHYPEN",
      total: total === 1 ? "vittoria" : "vittorie",
      hint: "Engene, clicca una corona per una sorpresa",
      slam: "5/5 Grand Slam!",
      close: "Chiudi",
      loading: "Carico il post…",
      failed: "Il post non si carica.",
      openOnX: "Aprilo su X →",
      back: "← Torna alla guida",
    },
    en: {
      title: "THE SIN:BLISS",
      eyebrow: "ENHYPEN",
      total: total === 1 ? "win" : "wins",
      hint: "Engene, tap a crown for a surprise",
      slam: "5/5 Grand Slam!",
      close: "Close",
      loading: "Loading the post…",
      failed: "The post won't load.",
      openOnX: "Open it on X →",
      back: "← Back to the guide",
    },
  }[lang];

  return (
    <div
      className={`tr-page ${open ? "is-locked" : ""} ${slam ? "is-slam" : ""}`}
      style={{ "--wins": total }}
    >
      <div className="tr-wrap">
        <TopBar t={t} lang={lang} setLang={setLang} eyebrow={copy.eyebrow} />

        <header className="tr-head">
          <h1 className="tr-title">{copy.title}</h1>
          <p className="tr-total">
            <b>{total}</b> {copy.total}
          </p>
          {total > 0 && <p className="tr-hint">{copy.hint}</p>}
          {slam && <p className="tr-slam">{copy.slam}</p>}
        </header>

        <div className="tr-case">
          {SHOW_ORDER.map((id, i) => (
            <Column
              key={id}
              show={id}
              wins={byShow[id]}
              lang={lang}
              order={i}
              seq={seq}
              onOpen={setOpen}
            />
          ))}
        </div>

        <a className="tr-back" href="#guida">
          {copy.back}
        </a>
      </div>

      {open?.clip && (
        <WinClip
          clip={open.clip}
          title={`${SHOWS[open.show].name} · ${fmtDay(open.episode, lang)}`}
          closeLabel={copy.close}
          copy={copy}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
