import { useState } from "react";
import { SHOWS, APPS } from "../data/apps";
import {
  buildWeeks, weekLabel, statusOf, toDate, startOfDay, dayIndex, LOCALE,
} from "../lib/weeks";

const BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
const hm = { hour: "2-digit", minute: "2-digit" };

function fmt(value, lang, opts) {
  return new Intl.DateTimeFormat(LOCALE[lang], opts).format(toDate(value));
}

function Row({ event, week, lang, t, now, todayIdx, hit, onHit }) {
  const show = SHOWS[event.show];
  const apps = event.apps.map((id) => BY_ID[id]).filter(Boolean);
  const accent = apps[0]?.accent || "#0B0B0B";
  const status = statusOf(event.prevote, now);
  const first = week.start;

  // la diretta compare solo nella settimana in cui cade
  const epDay = startOfDay(toDate(event.episode));
  const epIdx = epDay >= week.start && epDay <= week.end ? dayIndex(event.episode, first) : null;

  // la barra viene tagliata ai bordi della settimana
  let bar = null;
  if (event.prevote) {
    const ps = toDate(event.prevote.start);
    const pe = toDate(event.prevote.end);
    const cutLeft = startOfDay(ps) < week.start;
    const cutRight = startOfDay(pe) > startOfDay(week.days[6]);
    bar = {
      from: cutLeft ? 0 : dayIndex(ps, first),
      to: cutRight ? 6 : dayIndex(pe, first),
      cutLeft,
      cutRight,
    };
  }

  const span = bar ? [bar.from, bar.to] : epIdx !== null ? [epIdx, epIdx] : null;
  const notify = () => onHit(span);

  return (
    <article
      className={`tl-row tl-${status} ${hit ? "tl-row-hit" : ""}`}
      style={{ "--accent": accent }}
      onMouseEnter={notify}
      onMouseLeave={() => onHit(null)}
      onFocusCapture={notify}
      onClick={notify}
      tabIndex={0}
    >
      <div className="tl-label">
        {show.logo && (
          <span className="tl-logo">
            <img src={show.logo} alt="" />
          </span>
        )}
        <span className="tl-name">{show.name}</span>
        {apps.length > 0 && (
          <span className="tl-apps">
            {apps.map((a) => (
              <img key={a.id} src={a.logo || undefined} alt={a.name} title={a.name} />
            ))}
          </span>
        )}
        {status === "open" && <span className="tl-live-now">{t.statusOpen}</span>}
      </div>

      <div className="tl-track">
        {week.days.map((_, i) => (
          <span
            key={i}
            className={`tl-cell ${i === todayIdx ? "tl-cell-today" : ""}`}
            style={{ gridColumn: i + 1 }}
          />
        ))}

        {bar && (
          <div
            className={`tl-bar ${bar.cutLeft ? "tl-cut-l" : ""} ${bar.cutRight ? "tl-cut-r" : ""}`}
            style={{ gridColumn: `${bar.from + 1} / ${bar.to + 2}` }}
          >
            <span>
              {bar.cutLeft ? "←" : fmt(event.prevote.start, lang, { weekday: "short", ...hm })}
            </span>
            <span>
              {bar.cutRight ? "→" : fmt(event.prevote.end, lang, { weekday: "short", ...hm })}
            </span>
          </div>
        )}

        {epIdx !== null && (
          <span
            className={`tl-bubble ${event.liveVote ? "tl-bubble-live" : ""} ${
              epIdx >= 5 ? "tl-bubble-end" : epIdx <= 1 ? "tl-bubble-start" : ""
            }`}
            style={{ gridColumn: epIdx + 1 }}
          >
            {event.liveVote ? t.pinBoth : t.pinShow}
            <b>{fmt(event.episode, lang, hm)}</b>
          </span>
        )}
      </div>

      <p className="tl-detail">
        {event.prevote ? (
          <>
            {t.prevote}{" "}
            {fmt(event.prevote.start, lang, { weekday: "short", day: "numeric", ...hm })}
            {" → "}
            {fmt(event.prevote.end, lang, { weekday: "short", day: "numeric", ...hm })}
          </>
        ) : (
          <span className="tl-muted">{t.broadcastOnly}</span>
        )}
      </p>

      {event.note && epIdx !== null && <p className="ev-note">{event.note[lang]}</p>}
    </article>
  );
}

export default function CalendarTimeline({ lang, t, now }) {
  const weeks = buildWeeks("overlap");
  const today = startOfDay(new Date(now));
  // [primo, ultimo] indice di giorno della riga sotto il dito o il mouse
  const [hit, setHit] = useState(null);

  return (
    <div className="tl">
      <p className="tl-legend">
        <span className="lg-bar" /> {t.prevote}
        <span className="lg-bubble">{t.pinShow}</span>
        <span className="lg-bubble lg-bubble-live">{t.pinBoth}</span>
      </p>

      {weeks.map((week) => {
        const todayIdx =
          today >= week.start && today <= week.end ? dayIndex(today, week.start) : -1;
        return (
          <section key={week.id} className="tl-week">
            <header className="week-head">
              <h2 className="week-title">{weekLabel(week, lang)}</h2>
            </header>
            {week.note && <p className="week-note">{week.note[lang]}</p>}

            <div className="tl-scale" aria-hidden="true">
              {week.days.map((d, i) => {
                const on = hit && hit.week === week.id && i >= hit.from && i <= hit.to;
                return (
                  <span
                    key={i}
                    className={`tl-day ${i === todayIdx ? "tl-today" : ""} ${on ? "tl-day-hit" : ""}`}
                  >
                    <b>{fmt(d, lang, { weekday: "short" })}</b>
                    {d.getDate()}
                  </span>
                );
              })}
            </div>

            {week.events.map((event) => (
              <Row
                key={event.id}
                event={event}
                week={week}
                lang={lang}
                t={t}
                now={now}
                todayIdx={todayIdx}
                hit={hit?.week === week.id && hit?.id === event.id}
                onHit={(span) =>
                  setHit(span ? { week: week.id, id: event.id, from: span[0], to: span[1] } : null)
                }
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
