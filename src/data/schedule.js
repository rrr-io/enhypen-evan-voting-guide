/* Calendario delle votazioni — dal calendario ufficiale EN-CODE
   "I WANT YOU — MUSIC SHOW TRACKING & VOTING SCHEDULES"
   (comeback the sin : parallel world).

   Gli orari si scrivono in KST (fuso +09:00) perché è così che li pubblicano i
   programmi coreani. La pagina mostra solo l'ora locale di chi guarda,
   convertita da questi valori.
   Formato: "2026-11-23T12:00:00+09:00".

   Un evento = un voto e la puntata a cui serve:
     episode    data e ora della diretta (KST)
     prevote    finestra di voto anticipato, oppure null se non c'è
     liveVote   true se si vota durante la diretta
     apps       id delle app usate (vedi apps.js)
     stage      "unconfirmed" se non si sa ancora se ci sarà il palco,
                "none" se quella settimana il gruppo non è in programma.
                Senza questo campo la partecipazione si dà per prevista.
     voteLabel  etichetta della finestra al posto di "Pre-vote", per le
                votazioni che non fanno classifica: { it: "...", en: "..." }
     voteUrl    link diretto alla votazione di quella puntata, se esiste:
                diventa un pulsante accanto alla finestra. Se il link è sempre
                lo stesso conviene invece metterlo sulla scheda della app.
                Con più app è un oggetto: { mubeat: "...", muniverse: "..." }.
                I link vuoti non fanno comparire il pulsante.
     confirmed  true quando la finestra è confermata dai canali ufficiali.
                Senza questo campo l'evento è marcato "da confermare", e in cima
                al calendario compare l'avviso: quando tutti gli eventi hanno
                confirmed: true, l'avviso sparisce da solo.

   Le settimane non si scrivono a mano: la pagina raggruppa gli eventi da lunedì
   a domenica e, se una finestra scavalca la domenica, la barra continua nella
   settimana dopo.

   Nota del calendario ufficiale: gli orari possono cambiare a discrezione dei
   programmi.

   Orari delle dirette che il poster non specifica, presi dalla fascia abituale
   del programma: Music Bank 17:00, Music Core 15:15, Inkigayo 15:40. */

/* Stato del calendario. `updated` è la data dell'ultimo controllo: viene mostrata
   in cima e dice al lettore quanto è fresca l'informazione. */
export const STATUS = {
  updated: "2026-11-23",
  source: { label: "EN-CODE", url: "" }, // url opzionale: se c'è, l'etichetta diventa un link
};

/* Titolo mostrato in cima al calendario. Lascia title vuoto per non mostrarlo. */
export const ALBUM = {
  title: "the sin:parallel world ✿ ",
  subtitle: { it: "I Want You", en: "I Want You" },
};

/* Note in cima a una settimana. La chiave è il lunedì di quella settimana.
   Esempio: "2026-11-23": { it: "...", en: "..." } */
export const WEEK_NOTES = {};

export const EVENTS = [
  /* ── Settimana del comeback: 23–29 novembre ───────────────────────────── */

  {
    id: "bank-27",
    show: "bank",
    apps: [],
    episode: "2026-11-27T17:00:00+09:00",
    prevote: null,
    liveVote: false,
    confirmed: true,
  },
  {
    id: "core-28",
    show: "core",
    apps: ["mubeat", "muniverse"],
    episode: "2026-11-28T15:15:00+09:00",
    prevote: { start: "2026-11-24T18:00:00+09:00", end: "2026-11-26T11:00:00+09:00" },
    liveVote: false,
    confirmed: true,
    voteUrl: { mubeat: "", muniverse: "" },
  },
  {
    id: "inki-29",
    show: "inkigayo",
    apps: ["linc"],
    episode: "2026-11-29T15:40:00+09:00",
    prevote: { start: "2026-11-23T12:00:00+09:00", end: "2026-11-27T23:59:00+09:00" },
    liveVote: false,
    confirmed: true,
    voteUrl: "",
    note: {
      it: "30 Fan Point o 8 💎 per voto. Max 10 voti per account.",
      en: "30 Fan Points or 8 💎 per vote. Max 10 votes per account.",
    },
  },

  /* ── Settimana del 30 novembre – 6 dicembre ───────────────────────────── */

  {
    id: "kpop-30",
    show: "kpop",
    apps: ["mubeat"],
    episode: "2026-11-30T18:00:00+09:00",
    prevote: { start: "2026-11-26T12:00:00+09:00", end: "2026-11-28T12:00:00+09:00" },
    liveVote: true,
    confirmed: true,
    voteUrl: "",
    note: {
      it: "Il pre-vote serve a entrare nei primi due in classifica; il voto durante la diretta decide chi dei due vince, con un massimo di 50 voti a persona.",
      en: "The pre-vote decides who makes the top two; the live vote during the broadcast picks the winner between them, with up to 50 votes per person.",
    },
  },
  {
    id: "champ-02",
    show: "champion",
    apps: ["idolchamp"],
    episode: "2026-12-02T17:00:00+09:00",
    prevote: { start: "2026-11-27T20:00:00+09:00", end: "2026-11-30T15:00:00+09:00" },
    liveVote: false,
    confirmed: true,
    voteUrl: "",
  },
  {
    id: "bank-04",
    show: "bank",
    apps: ["coogoong"],
    episode: "2026-12-04T17:00:00+09:00",
    prevote: { start: "2026-11-29T15:00:00+09:00", end: "2026-12-02T11:00:00+09:00" },
    liveVote: false,
    confirmed: true,
    voteUrl: "",
  },
  {
    id: "core-05",
    show: "core",
    apps: ["mubeat", "muniverse"],
    episode: "2026-12-05T15:15:00+09:00",
    prevote: null, // il poster non dà ancora la finestra: aggiungila quando esce
    liveVote: true,
    confirmed: true,
    voteUrl: { mubeat: "", muniverse: "" },
  },
  {
    id: "inki-06",
    show: "inkigayo",
    apps: ["higher"],
    episode: "2026-12-06T15:40:00+09:00",
    prevote: null, // il poster non dà ancora la finestra: aggiungila quando esce
    liveVote: true,
    confirmed: true,
    voteUrl: "",
  },

  /* Votazione fuori classifica, per esempio lo Stage M Pick di Muniverse o
     l'Hot Stage di Higher: stessa struttura, con l'etichetta cambiata e la
     puntata in cui andrebbe in onda il palco. Togli le barre di commento e
     metti le date vere.

  {
    id: "mpick-05",
    show: "core",
    apps: ["muniverse"],
    episode: "",
    prevote: { start: "2026-11-28T17:00:00+09:00", end: "2026-12-03T12:00:00+09:00" },
    liveVote: false,
    voteLabel: { it: "Stage M Pick", en: "Stage M Pick" },
    voteUrl: "https://www.muniverse.io/votes",
    confirmed: true,
    note: {
      it: "Non fa classifica: decide chi porta il palco speciale.",
      en: "It doesn't count towards the chart: it picks who performs the special stage.",
    },
  },
  */
];
