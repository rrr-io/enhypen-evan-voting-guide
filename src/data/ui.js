/* Testi dell'interfaccia / Interface copy.
   Per cambiare una scritta modifica qui, in entrambe le lingue. */

export const LANGS = ["it", "en"];

// Firma in fondo alla pagina, uguale nelle due lingue.
export const CREDIT = "coded by rio";

export const UI = {
  it: {
    eyebrow: "Fan guide · voting",
    // Una voce per riga del titolo: qui decidi tu dove va a capo.
    titleLines: ["Guida Votazioni", "Comeback", "Enhypen & Evan"],
    intro:
      "Ogni scheda dice quale valuta serve, come raccoglierla e quando scade. Tocca una scheda per tenerla in evidenza." +
        "\n La fanbase di enhypen italia e evan italia vi augura buon divertimento e fighting per il comeback!",
    langLabel: "Lingua",
    presaveTitle: "Presave ora",
    socialLabel: "Profili social",
    filterLabel: "Filtra per music show",
    allApps: "Tutte le app",
    currency: "Valuta",
    expiry: "Scadenza",
    tabSummary: "Riepilogo",
    tabVideo: "Video tutorial",
    contentsLabel: (name) => `Contenuti per ${name}`,
    collectTitle: "Come raccogliere",
    videoEmptyTitle: "Tutorial in arrivo",
    videoEmptyBody: (name) => `Collega il video nella scheda di ${name} e il player compare qui.`,
    videoFallback: "Questo browser non riesce a riprodurre il video.",
    videoDownload: "Scaricalo",
    footer:"",
  },
  en: {
    eyebrow: "Fan guide · voting",
    titleLines: ["Voting Guide", "Enhypen & Evan", "Comeback"],
    intro:
      "Each card tells you which currency you need, how to collect it and when it expires. Tap a Voting App card to keep it highlighted. "+
        "\n The ENHYPEN italia and EVAN italia fanbase wish you fun and fighting for the comeback!",
    langLabel: "Language",
    presaveTitle: "Presave now",
    socialLabel: "Social profiles",
    filterLabel: "Filter by music show",
    allApps: "All apps",
    currency: "Currency",
    expiry: "Expires",
    tabSummary: "Summary",
    tabVideo: "Video tutorial",
    contentsLabel: (name) => `Contents for ${name}`,
    collectTitle: "How to collect",
    videoEmptyTitle: "Tutorial coming soon",
    videoEmptyBody: (name) => `Link the video in the ${name} entry and the player shows up here.`,
    videoFallback: "This browser can't play the video.",
    videoDownload: "Download it",
    footer: "",
  },
};
