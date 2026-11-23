import { useEffect, useMemo, useRef, useState } from "react";
import { buildDays, startOfDay, toDate, LOCALE } from "../lib/weeks";
import { drawCard, cardFileName, downloadCanvas, FORMATS } from "../lib/cardImage";
import { track } from "../lib/track";

/* Genera la card di recap di una giornata, nei due formati social.
   L'immagine si disegna qui nel browser: niente va su nessun server. */

export default function ShareCard({ lang, t, now }) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState("post");
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef(null);

  const today = startOfDay(new Date(now)).getTime();
  const days = useMemo(
    () => buildDays().filter((d) => d.date.getTime() >= today),
    [today]
  );
  const [dayId, setDayId] = useState(() => days[0]?.id || null);

  const day = days.find((d) => d.id === dayId) || days[0] || null;

  /* chiusura con Esc e pagina bloccata dietro al riquadro */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* ridisegna a ogni cambio di giorno, formato o lingua */
  useEffect(() => {
    if (!open || !day || !canvasRef.current) return;
    let alive = true;
    setBusy(true);
    drawCard(canvasRef.current, { format, day, lang, t, now })
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [open, day, format, lang, now, t]);

  if (days.length === 0) return null;

  const label = (d) =>
    new Intl.DateTimeFormat(LOCALE[lang], { weekday: "short", day: "numeric" }).format(
      toDate(d.date)
    );

  const save = async () => {
    if (!canvasRef.current || !day) return;
    setBusy(true);
    await downloadCanvas(canvasRef.current, cardFileName(day, format, lang));
    track(`card/${format}/${day.id}`, "Card recap");
    setBusy(false);
  };

  return (
    <>
      <div className="sc-bar">
        <button
          className="sc-open"
          onClick={() => {
            setOpen(true);
            track("card/apri", "Card recap");
          }}
        >
          {t.cardMake}
        </button>
        <span className="sc-hint">{t.cardHint}</span>
      </div>

      {open && (
        <div
          className="sc-back"
          role="dialog"
          aria-modal="true"
          aria-label={t.cardMake}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="sc-box">
            <header className="sc-head">
              <h3>{t.cardMake}</h3>
              <button className="sc-close" onClick={() => setOpen(false)} aria-label={t.cardClose}>
                ×
              </button>
            </header>

            <div className="sc-controls">
              <div className="sc-days" role="group" aria-label={t.cardPickDay}>
                {days.map((d) => (
                  <button
                    key={d.id}
                    className={`chip ${d.id === day?.id ? "chip-on" : ""}`}
                    aria-pressed={d.id === day?.id}
                    onClick={() => setDayId(d.id)}
                  >
                    {label(d)}
                  </button>
                ))}
              </div>

              <div className="sc-formats" role="group" aria-label={t.cardFormat}>
                {Object.keys(FORMATS).map((id) => (
                  <button
                    key={id}
                    className={`chip ${format === id ? "chip-on" : ""}`}
                    aria-pressed={format === id}
                    onClick={() => setFormat(id)}
                  >
                    {id === "post" ? t.cardPost : t.cardStory}
                  </button>
                ))}
              </div>
            </div>

            <div className={`sc-stage is-${format} ${busy ? "is-busy" : ""}`}>
              <canvas ref={canvasRef} className="sc-canvas" />
            </div>

            <footer className="sc-foot">
              <button className="sc-save" onClick={save} disabled={busy}>
                {t.cardDownload}
              </button>
              <span className="sc-size">
                {FORMATS[format].w}×{FORMATS[format].h}
              </span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
