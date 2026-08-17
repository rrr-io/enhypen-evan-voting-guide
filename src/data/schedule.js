/* Calendario delle votazioni — dal calendario ufficiale EN-CODE
   "MUSIC SHOW VOTING SCHEDULES" (comeback the sin:bliss).

   Gli orari si scrivono in KST (fuso +09:00) perché è così che li pubblicano i
   programmi coreani. La pagina mostra solo l'ora locale di chi guarda,
   convertita da questi valori.
   Formato: "2026-08-21T20:00:00+09:00".

   Un evento = un voto e la puntata a cui serve:
     episode   data e ora della diretta (KST)
     prevote   finestra di voto anticipato, oppure null se non c'è
     liveVote  true se si vota durante la diretta
     apps      id delle app usate (vedi apps.js)

   Le settimane non si scrivono a mano: la pagina raggruppa gli eventi da lunedì
   a domenica e, se una finestra scavalca la domenica, la barra continua nella
   settimana dopo.

   Nota del calendario ufficiale: gli orari possono cambiare a discrezione dei
   programmi. */

/* Titolo mostrato in cima al calendario. Lascia title vuoto per non mostrarlo. */
export const ALBUM = {
  title: "the sin:bliss",
  subtitle: { it: "", en: "" },
};

/* Note in cima a una settimana. La chiave è il lunedì di quella settimana.
   Esempio: "2026-08-17": { it: "...", en: "..." } */
export const WEEK_NOTES = {};

export const EVENTS = [
  {
    id: "bank-21",
    show: "bank",
    apps: [],
    episode: "2026-08-21T18:00:00+09:00",
    prevote: null,
    liveVote: false,
  },
  {
    id: "core-22",
    show: "core",
    apps: [],
    episode: "2026-08-22T15:45:00+09:00",
    prevote: null,
    liveVote: false,
  },
  {
    id: "champ-26",
    show: "champion",
    apps: ["idolchamp"],
    episode: "2026-08-26T18:00:00+09:00",
    prevote: { start: "2026-08-21T20:00:00+09:00", end: "2026-08-24T15:00:00+09:00" },
    liveVote: false,
  },
  {
    id: "mcd-27",
    show: "mcountdown",
    apps: ["mnetplus"],
    episode: "2026-08-27T18:00:00+09:00",
    prevote: { start: "2026-08-22T00:00:00+09:00", end: "2026-08-24T23:59:00+09:00" },
    liveVote: true,
  },
  {
    id: "bank-28",
    show: "bank",
    apps: ["coogoong"],
    episode: "2026-08-28T18:00:00+09:00",
    prevote: { start: "2026-08-23T15:00:00+09:00", end: "2026-08-26T11:00:00+09:00" },
    liveVote: false,
  },
  {
    id: "core-29",
    show: "core",
    apps: ["mubeat", "muniverse"],
    episode: "2026-08-29T15:45:00+09:00",
    prevote: { start: "2026-08-25T18:00:00+09:00", end: "2026-08-27T11:00:00+09:00" },
    liveVote: true,
  },
  {
    id: "inki-30",
    show: "inkigayo",
    apps: ["linc", "higher"],
    episode: "2026-08-30T15:25:00+09:00",
    prevote: { start: "2026-08-24T12:00:00+09:00", end: "2026-08-28T23:59:00+09:00" },
    liveVote: true,
    note: {
      it: "Pre-vote su LINC, voto live su Higher: servono 250 rubini.",
      en: "Pre-vote on LINC, live vote on Higher: 250 rubies needed.",
    },
  },
  {
    id: "champ-02",
    show: "champion",
    apps: ["idolchamp"],
    episode: "2026-09-02T18:00:00+09:00",
    prevote: { start: "2026-08-28T20:00:00+09:00", end: "2026-08-31T15:00:00+09:00" },
    liveVote: false,
  },
  {
    id: "mcd-03",
    show: "mcountdown",
    apps: ["mnetplus"],
    episode: "2026-09-03T18:00:00+09:00",
    prevote: { start: "2026-08-29T00:00:00+09:00", end: "2026-08-31T23:59:00+09:00" },
    liveVote: true,
  },
  {
    id: "bank-04",
    show: "bank",
    apps: ["coogoong"],
    episode: "2026-09-04T18:00:00+09:00",
    prevote: { start: "2026-08-30T15:00:00+09:00", end: "2026-09-02T11:00:00+09:00" },
    liveVote: false,
  },
  {
    id: "core-05",
    show: "core",
    apps: ["mubeat", "muniverse"],
    episode: "2026-09-05T15:45:00+09:00",
    prevote: { start: "2026-09-01T18:00:00+09:00", end: "2026-09-03T11:00:00+09:00" },
    liveVote: true,
  },
];
