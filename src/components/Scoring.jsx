import { useEffect, useId, useRef, useState } from "react";
import { SHOWS, APPS } from "../data/apps";
import { CRITERIA, SCORING } from "../data/scoring";

const BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
const KEYS = Object.keys(CRITERIA);
const R = 54;
const C = 2 * Math.PI * R;
const GREY = "#D5D5D5";
const SWEEP_MS = 1150; // durata del giro completo
const RESET_MS = 280; // pausa a torta vuota fra un programma e l'altro

const lessMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target, deps) {
  const [n, setN] = useState(target);
  const raf = useRef(0);
  useEffect(() => {
    if (lessMotion()) {
      setN(target);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 700);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return n;
}

/* Le fette si disegnano come un unico giro d'orologio: ogni fetta parte
   esattamente quando la precedente ha finito, con durata proporzionale alla
   sua ampiezza. Le etichette si accendono al passaggio del giro. */
function buildRing(entry) {
  const total = entry ? entry.slices.reduce((a, s) => a + s.pct, 0) : 0;
  let acc = 0;
  return KEYS.map((key) => {
    const slice = entry?.slices.find((s) => s.key === key) || null;
    const share = entry ? (slice ? slice.pct / total : 0) : 1 / KEYS.length;
    const from = acc;
    acc += share;
    return {
      key,
      slice,
      share,
      from,
      mid: from + share / 2,
      delay: Math.round(from * SWEEP_MS),
      duration: Math.max(120, Math.round(share * SWEEP_MS)),
    };
  });
}

export default function Scoring({ lang, t }) {
  const [openGlossary, setOpenGlossary] = useState(false);
  const [showId, setShowId] = useState(null);
  const [sel, setSel] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle · reset · draw
  const maskId = useId();

  const entry = showId ? SCORING.find((e) => e.show === showId) : null;
  const ring = buildRing(entry);
  const slices = entry ? [...entry.slices].sort((a, b) => b.pct - a.pct) : [];
  const picked = sel ? slices.find((s) => s.key === sel) : null;
  const pickedPct = useCountUp(picked?.pct ?? 0, [showId, sel]);

  /* A ogni cambio di programma la torta si azzera del tutto e solo dopo parte
     il giro nuovo: senza il vuoto in mezzo le fette sembrano scivolare da una
     configurazione all'altra. */
  useEffect(() => {
    if (!entry) {
      setPhase("idle");
      return;
    }
    if (lessMotion()) {
      setPhase("draw");
      return;
    }
    setPhase("reset");
    const id = setTimeout(() => setPhase("draw"), RESET_MS);
    return () => clearTimeout(id);
  }, [entry]);

  return (
    <div className="pz-wrap">
      <p className="pz-intro">{t.scoringIntro}</p>

      <button
        className="pz-toggle"
        aria-expanded={openGlossary}
        onClick={() => setOpenGlossary((v) => !v)}
      >
        {t.criteriaTitle}
        <span className="dv-chev" aria-hidden="true" />
      </button>

      {openGlossary && (
        <>
          <ul className="pz-gloss">
            {Object.entries(CRITERIA).map(([key, c], i) => (
              <li key={key} style={{ "--c": c.color, "--i": i }}>
                <span className="pz-gkey" />
                <span>
                  <b>
                    {c.label[lang]}
                    {c.star && (
                      <span className="pz-star" aria-hidden="true">
                        ᯓ★
                      </span>
                    )}
                  </b>
                  <span className="pz-gwhat">{c.what[lang]}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <nav className="pz-tabs" aria-label={t.viewScoring}>
        {SCORING.map((e) => {
          const show = SHOWS[e.show];
          const on = e.show === showId;
          return (
            <button
              key={e.show}
              className={`pz-tab ${on ? "is-on" : ""}`}
              aria-pressed={on}
              title={show.name}
              onClick={() => {
                setShowId((prev) => (prev === e.show ? null : e.show));
                setSel(null);
              }}
            >
              {show.logo ? <img src={show.logo} alt={show.name} /> : <span>{show.name}</span>}
            </button>
          );
        })}
      </nav>

      <div className="pz-stage">
      <div className={`pz-chart ${entry ? "has-show" : ""}`}>
        <svg className="pz" viewBox="0 0 140 140" role="presentation">
          <defs>
            {/* la maschera è un solo tratto che gira: scopre le fette in modo
                continuo, senza che nessuna si muova */}
            <mask id={maskId}>
              <circle
                className="pz-sweep"
                cx="70"
                cy="70"
                r={R}
                strokeDasharray={`${phase === "draw" ? C : 0} ${C}`}
                style={{ transitionDuration: phase === "draw" ? `${SWEEP_MS}ms` : "0ms" }}
              />
            </mask>
          </defs>

          <circle className="pz-track" cx="70" cy="70" r={R} />

          {/* anello grigio a riposo */}
          <circle
            className={`pz-rest ${entry ? "is-off" : ""}`}
            cx="70"
            cy="70"
            r={R}
            stroke={GREY}
          />

          <g mask={`url(#${maskId})`}>
            {ring.map(({ key, slice, share, from }) => {
              const len = share * C;
              const live = entry && slice && phase === "draw";
              return (
                <circle
                  key={key}
                  className={`pz-slice ${live ? "is-live" : ""} ${
                    sel && sel !== key ? "is-dim" : ""
                  } ${sel === key ? "is-sel" : ""}`}
                  cx="70"
                  cy="70"
                  r={R}
                  stroke={CRITERIA[key].color}
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-from * C}
                  onClick={() => live && setSel(sel === key ? null : key)}
                />
              );
            })}
          </g>
        </svg>

        <div className="pz-center" aria-hidden="true">
          {picked ? (
            <>
              <span className="pz-lab">{CRITERIA[picked.key].label[lang]}</span>
              <span className="pz-num">{pickedPct}%</span>
            </>
          ) : entry ? (
            <span className="pz-show">{SHOWS[showId].name}</span>
          ) : (
            <span className="pz-hint">{t.pickShow}</span>
          )}
        </div>
      </div>

      {/* anteprima: etichette corte, attorno alle fette su schermo largo,
          in fila sotto la torta sul telefono */}
      <div className="pz-tags" aria-hidden="true">
        {entry &&
          phase === "draw" &&
          ring
            .filter((r) => r.slice)
            .map((r) => {
              const a = (r.mid * 360 - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(a) * 40;
              const y = 50 + Math.sin(a) * 40;
              const side = Math.cos(a) > 0.25 ? "l" : Math.cos(a) < -0.25 ? "r" : "c";
              return (
                <span
                  key={r.key}
                  className={`pz-tag side-${side} ${sel && sel !== r.key ? "is-dim" : ""}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    "--c": CRITERIA[r.key].color,
                    animationDelay: `${Math.round(r.mid * SWEEP_MS)}ms`,
                  }}
                >
                  {CRITERIA[r.key].label[lang]}
                  <b>{r.slice.pct}%</b>
                </span>
              );
            })}
      </div>
      </div>

      {entry && (
        <ul className="pz-legend" key={showId}>
          {slices.map((s, i) => {
            const c = CRITERIA[s.key];
            const apps = (s.apps || []).map((id) => BY_ID[id]).filter(Boolean);
            return (
              <li
                key={s.key}
                className={sel && sel !== s.key ? "is-dim" : ""}
                style={{ "--i": i }}
              >
                <button
                  className={`pz-row ${sel === s.key ? "is-sel" : ""}`}
                  aria-pressed={sel === s.key}
                  onClick={() => setSel(sel === s.key ? null : s.key)}
                >
                  <span className="pz-key" style={{ background: c.color }} />
                  <span className="pz-text">
                    <b>{c.label[lang]}</b>
                    <span className="pz-src">{s.detail ? s.detail[lang] : c.what[lang]}</span>
                  </span>
                  <span className="pz-pct">{s.pct}%</span>
                </button>
                {apps.length > 0 && (
                  <p className="pz-apps">
                    {apps.map((a) => (
                      <a key={a.id} href={`#${a.id}`} className="pz-app">
                        {a.logo && <img src={a.logo} alt="" />}
                        {a.name}
                      </a>
                    ))}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {entry?.note && <p className="pz-note">{entry.note[lang]}</p>}

      <p className="pz-foot">{t.scoringFoot}</p>
    </div>
  );
}
