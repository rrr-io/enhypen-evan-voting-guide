/* Calendario delle votazioni — dal calendario ufficiale EN-CODE
   "MUSIC SHOW VOTING SCHEDULES" (comeback the sin:bliss).

   Gli orari si scrivono in KST (fuso +09:00) perché è così che li pubblicano i
   programmi coreani. La pagina mostra solo l'ora locale di chi guarda,
   convertita da questi valori.
   Formato: "2026-08-21T20:00:00+09:00".

   Un evento = un voto e la puntata a cui serve:
     episode    data e ora della diretta (KST)
     prevote    finestra di voto anticipato, oppure null se non c'è
     liveVote   true se si vota durante la diretta
     apps       id delle app usate (vedi apps.js)
     stage      "unconfirmed" se non si sa ancora se ci sarà il palco,
                "none" se quella settimana il gruppo non è in programma.
                Senza questo campo la partecipazione si dà per prevista.
     voteUrl    link diretto alla votazione di quella puntata, se esiste:
                diventa un pulsante accanto alla finestra. Se il link è sempre
                lo stesso conviene invece metterlo sulla scheda della app.
     confirmed  true quando la finestra è confermata dai canali ufficiali.
                Senza questo campo l'evento è marcato "da confermare", e in cima
                al calendario compare l'avviso: quando tutti gli eventi hanno
                confirmed: true, l'avviso sparisce da solo.

   Le settimane non si scrivono a mano: la pagina raggruppa gli eventi da lunedì
   a domenica e, se una finestra scavalca la domenica, la barra continua nella
   settimana dopo.

   Nota del calendario ufficiale: gli orari possono cambiare a discrezione dei
   programmi. */

/* Stato del calendario. `updated` è la data dell'ultimo controllo: viene mostrata
   in cima e dice al lettore quanto è fresca l'informazione. */
export const STATUS = {
  updated: "2026-08-17",
  source: { label: "EN-CODE", url: "" }, // url opzionale: se c'è, l'etichetta diventa un link
};

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
    episode: "2026-08-21T17:15:00+09:00",
    prevote: null,
    liveVote: false,
    confirmed: true,
  },
  {
    id: "core-22",
    show: "core",
    apps: [],
    episode: "2026-08-22T15:15:00+09:00",
    prevote: null,
    confirmed: true,
    liveVote: false,
  },
  {
    id: "inki-23",
    show: "inkigayo",
    apps: [],
    episode: "2026-08-23T15:15:00+09:00",
    prevote: false,
    liveVote: false,
    confirmed: true,
  },
  {
    id: "champ-26",
    show: "champion",
    apps: ["idolchamp"],
    episode: "2026-08-26T17:00:00+09:00",
    prevote: { start: "2026-08-21T20:00:00+09:00", end: "2026-08-24T14:59:00+09:00" },
    liveVote: false,
    confirmed: true,
    voteUrl: "https://promo-web.idolchamp.com/app_proxy.html?deeplink=https%3A%2F%2Fapp.idolchamp.com%2Fopen%2Fvote%2F01M098MP4J7EEMYG22YGMXY2ED", // esempio: "https://..." — vuoto, il pulsante non compare
  },
  {
    id: "mcd-27",
    show: "mcountdown",
    apps: ["mnetplus"],
    episode: "2026-08-27T18:00:00+09:00",
    prevote: { start: "2026-08-22T00:00:00+09:00", end: "2026-08-25T23:59:00+09:00" },
    liveVote: true,
    confirmed: true,
    voteUrl: "https://mnetplus.onelink.me/TRa8/xohkwx0b?custom_link_value=vote%2Fv2%2F6a841062ad9bac26374d24ff%3Furl_fallback_type%3Dupdate",
  },
  {
    id: "bank-28",
    show: "bank",
    apps: ["coogoong"],
    episode: "2026-08-28T17:15:00+09:00",
    prevote: { start: "2026-08-23T15:00:00+09:00", end: "2026-08-26T11:00:00+09:00" },
    liveVote: false,
  },
  {
    id: "core-29",
    show: "core",
    apps: ["mubeat", "muniverse"],
    episode: "2026-08-29T15:15:00+09:00",
    prevote: { start: "2026-08-25T18:00:00+09:00", end: "2026-08-27T11:00:00+09:00" },
    liveVote: true,
  },
  {
    id: "inki-30",
    show: "inkigayo",
    apps: ["linc", "higher"],
    episode: "2026-08-30T15:20:00+09:00",
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
    episode: "2026-09-02T17:00:00+09:00",
    prevote: { start: "2026-08-28T20:00:00+09:00", end: "2026-08-31T14:59:00+09:00" },
    liveVote: false,
  },
  {
    id: "mcd-03",
    show: "mcountdown",
    apps: ["mnetplus"],
    episode: "2026-09-03T18:00:00+09:00",
    prevote: { start: "2026-08-29T00:00:00+09:00", end: "2026-09-01T23:59:00+09:00" },
    liveVote: true,
  },
  {
    id: "bank-04",
    show: "bank",
    apps: ["coogoong"],
    episode: "2026-09-04T17:15:00+09:00",
    prevote: { start: "2026-08-30T15:00:00+09:00", end: "2026-09-02T11:00:00+09:00" },
    liveVote: false,
    stage: "unconfirmed", // esempio: il voto c'è, il palco non è ancora confermato
  },
  {
    id: "core-05",
    show: "core",
    apps: ["mubeat", "muniverse"],
    episode: "2026-09-05T15:15:00+09:00",
    prevote: { start: "2026-09-01T18:00:00+09:00", end: "2026-09-03T11:00:00+09:00" },
    liveVote: true,
  },
];
