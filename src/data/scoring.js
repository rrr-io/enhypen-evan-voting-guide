/* Come i music show calcolano il punteggio settimanale.
   Dati dal poster ufficiale EN-CODE "Music Show Scoring Criteria".

   Ogni criterio ha un colore suo, ripreso dalle grafiche di the sin:bliss, e
   resta lo stesso in tutti gli show così si riconosce a colpo d'occhio.
   star: true mette la stellina accanto al criterio, per segnare quelli a cui
   i fan possono contribuire.
   note su uno show: riga di testo sotto la legenda, per le eccezioni. In ogni show le fette hanno la percentuale
   e la fonte del dato. */

export const CRITERIA = {
  digitals: {
    label: { it: "Streaming", en: "Digitals" },
    color: "#08a118",
    what: {
      it: "Ascolti sulle piattaforme di streaming coreane. Quali contano cambia da programma a programma.",
      en: "Streams on Korean streaming platforms. Which ones count changes from show to show.",
    },
  },
  physical: {
    star: true,
    label: { it: "Vendite fisiche", en: "Physical sales" },
    color: "#fdcf01",
    what: {
      it: "Copie dell'album vendute, contate da Circle o da Hanteo secondo il programma.",
      en: "Album copies sold, counted by Circle or Hanteo depending on the show.",
    },
  },
  broadcast: {
    label: { it: "Broadcast", en: "Broadcast" },
    color: "#ff2020",
    what: {
      it: "Quante volte il canale manda in onda la canzone, fra TV, radio e contenuti propri.",
      en: "How often the channel airs the song across TV, radio and its own content.",
    },
  },
  sns: {
    star: true,
    label: { it: "SNS", en: "SNS" },
    color: "#0120bb",
    what: {
      it: "Visualizzazioni del video musicale, in alcuni programmi anche TikTok e short form.",
      en: "Music video views, and on some shows TikTok and short form too.",
    },
  },
  prevote: {
    star: true,
    label: { it: "Pre-vote", en: "Pre-vote" },
    color: "#D0367F",
    what: {
      it: "Voto nelle app nei giorni prima della puntata.",
      en: "App voting in the days before the episode.",
    },
  },
  livevote: {
    star: true,
    label: { it: "Voto live", en: "Live vote" },
    color: "#fe7d06",
    what: {
      it: "Voto durante la diretta, dall'app o via SMS secondo il programma.",
      en: "Voting during the broadcast, from the app or by text depending on the show.",
    },
  },
  committee: {
    label: { it: "Comitato spettatori", en: "Viewers committee" },
    color: "#d8d8d8",
    what: {
      it: "Una giuria di spettatori registrati sul sito del canale.",
      en: "A panel of viewers registered on the channel's website.",
    },
  },
};

export const SCORING = [
  {
    show: "bank",
    slices: [
      { key: "digitals", pct: 60, detail: { it: "MelOn, Genie, FLO, VIBE, Bugs", en: "MelOn, Genie, FLO, VIBE, Bugs" } },
      { key: "physical", pct: 5, detail: { it: "Circle Album Chart", en: "Circle Album Chart" } },
      { key: "broadcast", pct: 20, detail: { it: "KBS: TV, radio e contenuti digitali", en: "KBS: TV, radio and digital content" } },
      { key: "sns", pct: 5, detail: { it: "Video musicale, Circle social chart, TikTok e YouTube Shorts", en: "Music video, Circle social chart, TikTok and YouTube Shorts" } },
      { key: "prevote", pct: 10, apps: ["coogoong"] },
    ],
  },
  {
    show: "champion",
    slices: [
      { key: "digitals", pct: 35, detail: { it: "Bugs, MelOn, Genie, FLO", en: "Bugs, MelOn, Genie, FLO" } },
      { key: "physical", pct: 15, detail: { it: "Hanteo Chart", en: "Hanteo Chart" } },
      { key: "broadcast", pct: 20, detail: { it: "MBC M: TV, Show Champion, Weekly Idol", en: "MBC M: TV, Show Champion, Weekly Idol" } },
      { key: "sns", pct: 10, detail: { it: "Circle Chart", en: "Circle Chart" } },
      { key: "prevote", pct: 20, apps: ["idolchamp"] },
    ],
  },
  {
    show: "inkigayo",
    slices: [
      { key: "digitals", pct: 50, detail: { it: "MelOn, Genie, FLO, Circle Global K-Pop Chart", en: "MelOn, Genie, FLO, Circle Global K-Pop Chart" } },
      { key: "physical", pct: 10, detail: { it: "Circle Album Chart", en: "Circle Album Chart" } },
      { key: "broadcast", pct: 10, detail: { it: "SBS: TV e radio", en: "SBS: TV and radio" } },
      { key: "sns", pct: 20, detail: { it: "Visualizzazioni MV", en: "MV views" } },
      { key: "prevote", pct: 5, apps: ["linc"], detail: { it: "10 voti al giorno per account", en: "10 votes a day per account" } },
      { key: "livevote", pct: 5, apps: ["higher"], detail: { it: "Durante la diretta, 5 voti per account", en: "During the broadcast, 5 votes per account" } },
    ],
  },
  {
    show: "core",
    slices: [
      { key: "digitals", pct: 50, detail: { it: "Circle Digital Chart", en: "Circle Digital Chart" } },
      { key: "physical", pct: 10, detail: { it: "Circle Album Chart", en: "Circle Album Chart" } },
      { key: "broadcast", pct: 5, detail: { it: "MBC: TV e radio", en: "MBC: TV and radio" } },
      { key: "sns", pct: 10, detail: { it: "Visualizzazioni MV", en: "MV views" } },
      { key: "prevote", pct: 10, apps: ["mubeat", "muniverse"] },
      {
        key: "livevote",
        pct: 10,
        apps: ["mubeat", "muniverse"],
        detail: {
          it: "Diviso in due: 6% dalle app e 4% dal voto via SMS, che si può fare solo dalla Corea",
          en: "Split in two: 6% from the apps and 4% from the text vote, which is Korea-only",
        },
      },
      {
        key: "committee",
        pct: 5,
        detail: {
          it: "Sito MBC, solo dalla Corea. Ha una finestra propria: mercoledì 9:00 – giovedì 11:00 KST",
          en: "MBC website, Korea only. It has its own window: Wednesday 9:00 – Thursday 11:00 KST",
        },
      },
    ],
  },
  {
    show: "mcountdown",
    note: {
      it: "I criteri di M Countdown sommano 110%: il voto durante la diretta si aggiunge sopra il resto del punteggio.",
      en: "M Countdown's criteria add up to 110%: the live vote is added on top of the rest of the score.",
    },
    slices: [
      { key: "digitals", pct: 50, detail: { it: "Circle Global K-Pop Chart", en: "Circle Global K-Pop Chart" } },
      { key: "physical", pct: 15, detail: { it: "Circle Album Chart", en: "Circle Album Chart" } },
      { key: "broadcast", pct: 10, detail: { it: "Mnet: TV", en: "Mnet: TV" } },
      { key: "sns", pct: 15, detail: { it: "Video musicale e TikTok", en: "Music video and TikTok" } },
      { key: "prevote", pct: 10, apps: ["mnetplus"] },
      { key: "livevote", pct: 10, apps: ["mnetplus"] },
    ],
  },
];
