import { useEffect, useState } from "react";
import { ALBUM } from "../data/schedule";
import CalendarTimeline from "./CalendarTimeline";
import CalendarMini from "./CalendarMini";
import CalendarDays from "./CalendarDays";

const LOCALE = { it: "it-IT", en: "en-GB" };

export default function CalendarView({ lang, t }) {
  const [now, setNow] = useState(() => Date.now());
  const [style, setStyle] = useState("timeline"); // "timeline" | "days"

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="cal">
      {ALBUM.title && (
        <header className="cal-album">
          <h2>{ALBUM.title}</h2>
          {ALBUM.subtitle?.[lang] && <p>{ALBUM.subtitle[lang]}</p>}
        </header>
      )}

      <div className="cal-top">
        <p className="cal-warning">{t.calWarning}</p>
        <div className="cal-style">
          {[
            ["timeline", t.styleTimeline],
            ["days", t.styleDays],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`chip ${style === id ? "chip-on" : ""}`}
              aria-pressed={style === id}
              onClick={() => setStyle(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {style === "timeline" && (
        <>
          <CalendarMini lang={lang} t={t} now={now} />
          <CalendarTimeline lang={lang} t={t} now={now} />
        </>
      )}
      {style === "days" && <CalendarDays lang={lang} t={t} now={now} />}

      <p className="cal-tz">
        {t.timesShownIn} {tz}
      </p>
    </div>
  );
}
