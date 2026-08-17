/* Raggruppa gli eventi in settimane da lunedì a domenica.
   Serve sia alla vista timeline che alla lista. */

import { EVENTS, WEEK_NOTES } from "../data/schedule";

export const DAY = 86400000;
export const LOCALE = { it: "it-IT", en: "en-GB" };

/* Le date "solo giorno" vanno lette nel fuso di chi guarda, non in UTC,
   altrimenti a ovest di Greenwich scivolano al giorno prima. */
export function toDate(value) {
  if (value instanceof Date) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const dayIndex = (d, first) => Math.round((startOfDay(toDate(d)) - first) / DAY);

export function mondayOf(value) {
  const d = startOfDay(toDate(value));
  const shift = (d.getDay() + 6) % 7; // domenica = 6
  return new Date(d.getTime() - shift * DAY);
}

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function statusOf(prevote, now) {
  if (!prevote) return "none";
  const start = toDate(prevote.start).getTime();
  const end = toDate(prevote.end).getTime();
  return now < start ? "soon" : now > end ? "closed" : "open";
}

/* mode "overlap": un evento compare in ogni settimana che la sua finestra
   attraversa, con la barra tagliata al confine (per la timeline).
   mode "episode": compare una volta sola, nella settimana della diretta. */
export function buildWeeks(mode = "overlap") {
  const stamps = EVENTS.flatMap((e) =>
    [e.episode, e.prevote?.start, e.prevote?.end].filter(Boolean).map(toDate)
  );
  const first = mondayOf(new Date(Math.min(...stamps)));
  const lastMonday = mondayOf(new Date(Math.max(...stamps)));
  const weeks = [];

  for (let t = first.getTime(); t <= lastMonday.getTime(); t += 7 * DAY) {
    const start = new Date(t);
    const end = new Date(t + 7 * DAY - 1); // domenica a fine giornata
    const days = Array.from({ length: 7 }, (_, i) => new Date(t + i * DAY));

    const events = EVENTS.filter((e) => {
      const ep = startOfDay(toDate(e.episode));
      const inWeek = ep >= start && ep <= end;
      if (mode === "episode" || !e.prevote) return inWeek;
      const ps = toDate(e.prevote.start);
      const pe = toDate(e.prevote.end);
      return inWeek || (ps <= end && pe >= start);
    }).sort((a, b) => toDate(a.episode) - toDate(b.episode));

    if (events.length === 0) continue;

    weeks.push({
      id: isoDay(start),
      start,
      end,
      days,
      events,
      note: WEEK_NOTES[isoDay(start)] || null,
    });
  }
  return weeks;
}

/* "17–23 agosto" oppure "31 agosto – 6 settembre" */
export function weekLabel(week, lang) {
  const l = LOCALE[lang];
  const sameMonth = week.start.getMonth() === week.days[6].getMonth();
  const from = new Intl.DateTimeFormat(
    l,
    sameMonth ? { day: "numeric" } : { day: "numeric", month: "long" }
  ).format(week.start);
  const to = new Intl.DateTimeFormat(l, { day: "numeric", month: "long" }).format(week.days[6]);
  return `${from} – ${to}`;
}

/* Elenco giorno per giorno: per ogni data, le dirette e le finestre di voto
   attive quel giorno, con il segnale di quelle che aprono o chiudono. */
export function buildDays() {
  const stamps = EVENTS.flatMap((e) =>
    [e.episode, e.prevote?.start, e.prevote?.end].filter(Boolean).map(toDate)
  );
  const first = startOfDay(new Date(Math.min(...stamps)));
  const last = startOfDay(new Date(Math.max(...stamps)));
  const days = [];

  for (let t = first.getTime(); t <= last.getTime(); t += DAY) {
    const date = new Date(t);
    const dayEnd = new Date(t + DAY - 1);

    const broadcasts = EVENTS.filter(
      (e) => startOfDay(toDate(e.episode)).getTime() === t
    ).sort((a, b) => toDate(a.episode) - toDate(b.episode));

    const votes = EVENTS.filter((e) => {
      if (!e.prevote) return false;
      return toDate(e.prevote.start) <= dayEnd && toDate(e.prevote.end) >= date;
    })
      .map((e) => ({
        event: e,
        opens: startOfDay(toDate(e.prevote.start)).getTime() === t,
        closes: startOfDay(toDate(e.prevote.end)).getTime() === t,
      }))
      // prima quelle che chiudono oggi, poi quelle che aprono, poi le altre
      .sort((a, b) => Number(b.closes) - Number(a.closes) || Number(b.opens) - Number(a.opens));

    if (broadcasts.length === 0 && votes.length === 0) continue;
    days.push({ id: isoDay(date), date, broadcasts, votes });
  }
  return days;
}

/* Tutti i giorni del periodo, di fila: serve alla panoramica compatta. */
export function buildRange() {
  const stamps = EVENTS.flatMap((e) =>
    [e.episode, e.prevote?.start, e.prevote?.end].filter(Boolean).map(toDate)
  );
  const first = startOfDay(new Date(Math.min(...stamps)));
  const last = startOfDay(new Date(Math.max(...stamps)));
  const days = [];
  for (let t = first.getTime(); t <= last.getTime(); t += DAY) days.push(new Date(t));
  return { first, last, days };
}

/* Per ogni music show, cosa succede in ciascun giorno del periodo:
   vote = una finestra è attiva, show = c'è la diretta, live = si vota in diretta. */
export function buildGrid() {
  const { days } = buildRange();
  const shows = [...new Set(EVENTS.map((e) => e.show))];

  const rows = shows.map((show) => {
    const events = EVENTS.filter((e) => e.show === show);
    const cells = days.map((d) => {
      const start = d.getTime();
      const end = new Date(start + DAY - 1);
      const open = events.filter(
        (e) => e.prevote && toDate(e.prevote.start) <= end && toDate(e.prevote.end) >= d
      );
      const closes = open.some((e) => startOfDay(toDate(e.prevote.end)).getTime() === start);
      const broadcast = events.find((e) => startOfDay(toDate(e.episode)).getTime() === start);
      return { vote: open.length > 0, closes, show: !!broadcast, live: !!broadcast?.liveVote };
    });
    return { show, cells };
  });

  return { days, rows };
}
