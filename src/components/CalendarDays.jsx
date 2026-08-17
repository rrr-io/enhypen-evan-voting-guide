import { useState } from "react";
import { SHOWS, APPS } from "../data/apps";
import { buildDays, statusOf, toDate, startOfDay, isTentative, LOCALE } from "../lib/weeks";

const BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
const hm = { hour: "2-digit", minute: "2-digit" };

function fmt(value, lang, opts) {
  return new Intl.DateTimeFormat(LOCALE[lang], opts).format(toDate(value));
}

function VoteLine({ item, lang, t, now }) {
  const { event, opens, closes } = item;
  const apps = event.apps.map((id) => BY_ID[id]).filter(Boolean);
  const accent = apps[0]?.accent || "#0B0B0B";
  const status = statusOf(event.prevote, now);
  const show = SHOWS[event.show];

  const when = closes
    ? `${t.closesAt} ${fmt(event.prevote.end, lang, hm)}`
    : opens
    ? `${t.opensAt} ${fmt(event.prevote.start, lang, hm)}`
    : t.allDay;

  return (
    <li
      className={`dv-item ${closes ? "dv-urgent" : ""} ${isTentative(event) ? "dv-tent" : ""}`}
      style={{ "--accent": accent }}
    >
      <span className="dv-apps">
        {apps.map((a) => (
          <img key={a.id} src={a.logo || undefined} alt={a.name} title={a.name} />
        ))}
      </span>
      <span className="dv-text">
        <b>{apps.map((a) => a.name).join(" + ")}</b>
        <span className="dv-meta">
          {show.name} · {t.prevote} · {when}
          {isTentative(event) && <i className="dv-tent-tag">{t.toConfirm}</i>}
        </span>
      </span>
      {status === "open" && <span className="dv-tag">{t.statusOpen}</span>}
    </li>
  );
}

function Day({ day, lang, t, now, open, onToggle, isToday }) {
  const votes = day.votes.length;
  const shows = day.broadcasts.length;

  return (
    <section className={`dv-day ${isToday ? "dv-is-today" : ""} ${open ? "is-open" : ""}`}>
      <button
        className="dv-head"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="dv-date">
          {fmt(day.date, lang, { weekday: "long", day: "numeric", month: "long" })}
        </span>
        {isToday && <span className="dv-now">{t.today}</span>}
        <span className="dv-sum">
          {[shows ? t.dayShows(shows) : null, votes ? t.dayVotes(votes) : null]
            .filter(Boolean)
            .join(" · ") || t.dayNothing}
        </span>
        <span className="dv-chev" aria-hidden="true" />
      </button>

      {open && (
        <div className="dv-body">
          {shows > 0 && (
            <ul className="dv-list dv-shows">
              {day.broadcasts.map((e) => {
                const show = SHOWS[e.show];
                return (
                  <li key={e.id} className="dv-item dv-show">
                    {show.logo && (
                      <span className="dv-logo">
                        <img src={show.logo} alt="" />
                      </span>
                    )}
                    <span className="dv-text">
                      <b>{show.name}</b>
                      <span className="dv-meta">
                        {t.episode} {fmt(e.episode, lang, hm)}
                        {isTentative(e) && <i className="dv-tent-tag">{t.toConfirm}</i>}
                      </span>
                    </span>
                    {e.liveVote && <span className="dv-tag dv-tag-live">{t.pinLive}</span>}
                  </li>
                );
              })}
            </ul>
          )}

          {votes > 0 && (
            <ul className="dv-list">
              {day.votes.map((item) => (
                <VoteLine key={item.event.id} item={item} lang={lang} t={t} now={now} />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export default function CalendarDays({ lang, t, now }) {
  const today = startOfDay(new Date(now)).getTime();
  // i giorni passati non si mostrano più
  const days = buildDays().filter((d) => d.date.getTime() >= today);
  // su telefono una lista tutta aperta è troppo lunga: aperti i primi due giorni
  const [openIds, setOpenIds] = useState(() => days.slice(0, 2).map((d) => d.id));

  const toggle = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  if (days.length === 0) return <p className="dv-empty">{t.dayNothing}</p>;

  return (
    <div className="dv">
      {days.map((day) => (
        <Day
          key={day.id}
          day={day}
          lang={lang}
          t={t}
          now={now}
          isToday={day.date.getTime() === today}
          open={openIds.includes(day.id)}
          onToggle={() => toggle(day.id)}
        />
      ))}
    </div>
  );
}
