import { SHOWS, APPS } from "../data/apps";
import { buildWeeks, weekLabel, statusOf, toDate, LOCALE } from "../lib/weeks";

const BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
const dayOpts = { weekday: "short", day: "numeric", month: "short" };
const hm = { hour: "2-digit", minute: "2-digit" };

function fmt(value, lang, opts) {
  return new Intl.DateTimeFormat(LOCALE[lang], opts).format(toDate(value));
}

function EventRow({ event, lang, t, now }) {
  const show = SHOWS[event.show];
  const status = statusOf(event.prevote, now);
  const apps = event.apps.map((id) => BY_ID[id]).filter(Boolean);
  const accent = apps[0]?.accent || "#0B0B0B";

  return (
    <article className={`ev ev-${status}`} style={{ "--accent": accent }}>
      <div className="ev-head">
        <span className="ev-show">
          {show.logo && (
            <span className="ev-logo">
              <img src={show.logo} alt="" />
            </span>
          )}
          <span>
            <span className="ev-showname">{show.name}</span>
            <span className="ev-episode">
              {t.episode} {fmt(event.episode, lang, { ...dayOpts, ...hm })}
            </span>
          </span>
        </span>
        <span className={`ev-status st-${status}`}>
          {status === "open"
            ? t.statusOpen
            : status === "soon"
            ? t.statusSoon
            : status === "closed"
            ? t.statusClosed
            : t.broadcastOnly}
        </span>
      </div>

      {apps.length > 0 && (
        <div className="ev-apps">
          {apps.map((a) => (
            <span key={a.id} className="ev-app">
              {a.logo && <img src={a.logo} alt="" />}
              {a.name}
            </span>
          ))}
        </div>
      )}

      {event.prevote && (
        <dl className="ev-times">
          <div>
            <dt>{t.prevote}</dt>
            <dd>
              {fmt(event.prevote.start, lang, { ...dayOpts, ...hm })}
              {" → "}
              {fmt(event.prevote.end, lang, { ...dayOpts, ...hm })}
            </dd>
          </div>
          {event.liveVote && (
            <div>
              <dt>{t.liveVote}</dt>
              <dd>{fmt(event.episode, lang, { ...dayOpts, ...hm })}</dd>
            </div>
          )}
        </dl>
      )}

      {event.note && <p className="ev-note">{event.note[lang]}</p>}
    </article>
  );
}

export default function CalendarList({ lang, t, now }) {
  const weeks = buildWeeks("episode");

  return (
    <div className="cal-list">
      {weeks.map((week) => (
        <section key={week.id} className="week">
          <header className="week-head">
            <h2 className="week-title">{weekLabel(week, lang)}</h2>
          </header>
          {week.note && <p className="week-note">{week.note[lang]}</p>}
          <div className="week-list">
            {week.events.map((event) => (
              <EventRow key={event.id} event={event} lang={lang} t={t} now={now} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
