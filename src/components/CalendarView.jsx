import { useEffect, useState } from "react";
import { ALBUM, STATUS } from "../data/schedule";
import { anyTentative } from "../lib/weeks";
import CalendarTimeline from "./CalendarTimeline";
import CalendarMini from "./CalendarMini";
import CalendarDays from "./CalendarDays";

const LOCALE = { it: "it-IT", en: "en-GB" };

export default function CalendarView({ lang, t }) {
  const [now, setNow] = useState(() => Date.now());
  const [style, setStyle] = useState("days"); // "timeline" | "days"

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tentative = anyTentative();
  const updated = new Intl.DateTimeFormat(LOCALE[lang], { day: "numeric", month: "long" }).format(
    new Date(`${STATUS.updated}T00:00:00`)
  );

  return (
    <div className="cal">
      {ALBUM.title && (
        <header className="cal-album">
          <h2>{ALBUM.title}</h2>
          {ALBUM.subtitle?.[lang] && <p>{ALBUM.subtitle[lang]}</p>}
        </header>
      )}

      {tentative && (
        <p className="cal-flag">
          <span className="cal-flag-pill">{t.tentative}</span>
          {t.tentativeText}
        </p>
      )}

      <div className="cal-top">
        <p className="cal-warning">
          {t.calWarning}
          <span className="cal-updated">
            {t.updatedOn} {updated}
          </span>
        </p>
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
