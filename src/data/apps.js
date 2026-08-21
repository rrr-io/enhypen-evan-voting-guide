/* Dati della guida / Guide data.
   I campi con { it, en } sono tradotti; gli altri valgono per entrambe le lingue.
   Le icone stanno in public/icons/ e i video in public/videos/ — icon() e
   asset() ci mettono davanti il base path, che su GitHub Pages è /nome-repo/.

   Il campo video accetta: asset("videos/nome.mp4") per un file caricato,
   un link YouTube completo, oppure il solo ID YouTube. */

const icon = (p) => `${import.meta.env.BASE_URL}icons/${p}`;

export const asset = (p) => `${import.meta.env.BASE_URL}${p}`;

export const SHOWS = {
  champion: { name: "Show Champion", channel: "MBC M", logo: icon("shows/showchampion.webp") },
  core: { name: "Show! Music Core", channel: "MBC", logo: icon("shows/musiccore.png")},
  inkigayo: { name: "Inkigayo", channel: "SBS", logo: icon("shows/inkigayo.png") },
  bank: { name: "Music Bank", channel: "KBS2", logo: icon("shows/musicbank.png") },
  mcountdown: { name: "M Countdown", channel: "Mnet", logo: icon("shows/mcountdown.png") },
};

export const APPS = [
  {
    id: "idolchamp",
    name: "Idolchamp",
    show: "champion",
    accent: "#1A7F7F",
    logo: icon("apps/idolchamp.png"),
    video: "videos/idolchamp.mov",
    videoPoster: asset("images/idolchamp-poster.JPG"),
    stores: { ios: "https://apps.apple.com/it/app/idolchamp/id1185735018",
      android: "https://play.google.com/store/apps/details?id=com.nwz.ichampclient&hl=it" },
    voteType: { it: "Pre-vote", en: "Pre-vote" },
    currency: {
      it: "Ruby Chamsim + Time Chamsim",
      en: "Ruby Chamsim + Time Chamsim",
    },
    expiry: {
      it: "Ruby → 90 giorni · Time → fine del mese",
      en: "Ruby → 90 days · Time → end of the month",
    },
    collect: {
      it: [
        "Attendance giornaliera",
        "Mini game",
        "Pubblicità → roulette",
        "Missioni",
        "Star Chamsim, convertibili in Ruby",
      ],
      en: [
        "Daily attendance",
        "Mini games",
        "Ads → roulette",
        "Missions",
        "Star Chamsim, convertible into Ruby",
      ],
    },
    note: {
      it: "Nel pre-vote di Show Champion il voto è illimitato: tutto quello che accumuli lo puoi usare.",
      en: "In the Show Champion pre-vote there's no cap: everything you collect can be spent.",
    },
  },
  {
    id: "mubeat",
    name: "Mubeat",
    show: "core",
    accent: "#9847DA",
    logo: icon("apps/mubeat.png"),
    video: "videos/mubeat.mov",
    videoPoster: asset("images/mubeat-poster.JPG"),
    stores: { ios: "https://apps.apple.com/it/app/mubeat-for-kpop-lovers/id1320789688",
      android: "https://play.google.com/store/apps/details?id=com.vlending.apps.mubeat&hl=it" },
    voteType: { it: "Pre-vote + Live vote", en: "Pre-vote + live vote" },
    currency: { it: "Heart Beats", en: "Heart Beats" },
    expiry: { it: "90 giorni", en: "90 days" },
    collect: {
      it: [
        "15 pubblicità al giorno | 3 HB ciascuna",
        "Quiz",
        "Missioni",
        "Roulette e dadi",
        "Pubblicità extra: click 1 HB | 1 minuto 2 HB | video intero 3 HB",
      ],
      en: [
        "15 ads a day | 3 HB each",
        "Quizzes",
        "Missions",
        "Roulette and dice",
        "Extra ads: click 1 HB | 1 minute 2 HB | full video 3 HB",
      ],
    },
    note: {
      it: "Per il voto live su Music Core servono 5 voti per account: si ottengono convertendo 150 Heart Beats, oppure comprandoli.",
      en: "The live vote on Music Core takes 5 votes per account: convert 150 Heart Beats, or buy them.",
    },
  },
  {
    id: "muniverse",
    name: "Muniverse",
    show: "core",
    accent: "#34c69a",
    logo: icon("apps/muniverse.png"),
    video: "videos/muniverse.mov",
    videoPoster: asset("images/muniverse-poster.JPG"),
    stores: { ios: "https://apps.apple.com/tr/app/muniverse/id6749677921",
      android: "https://play.google.com/store/apps/details?id=com.tnk.muniverse&hl=it" },
    voteType: { it: "Stage M Pick / Pre-vote", en: "Stage M Pick / pre-vote" },
    currency: { it: "Lumy", en: "Lumy" },
    expiry: {
      it: "Free Lumy → 30 giorni · Ad Lumy → 60 giorni",
      en: "Free Lumy → 30 days · Ad Lumy  → 60 days",
    },
    collect: {
      it: [
        "Attendance giornaliera",
        "Roulette",
        "20 pubblicità al giorno",
        "Missioni",
        "Lucky Wheel",
        "Gold Lumy a pagamento, se vuoi",
      ],
      en: [
        "Daily attendance",
        "Roulette",
        "20 ads a day",
        "Missions",
        "Lucky Wheel",
        "Paid Gold Lumy, if you want",
      ],
    },
    note: {
      it: "Sugli Stage M Pick aspetta le indicazioni del voting team prima di spendere. Per il voto live su Music Core servono 250 Ad Lumy o 300 Gold Lumy per account.",
      en: "For Stage M Pick, wait for the voting team's instructions before spending. The live vote on Music Core takes 250 Ad Lumy or 300 Gold Lumy per account.",
    },
  },
  {
    id: "higher",
    name: "Higher",
    show: "inkigayo",
    accent: "#1F1F1F",
    logo: icon("apps/higher.png"),
    video: "videos/higher.MP4",
    videoPoster: asset("images/higher-poster.JPG"),
    stores: { ios: "https://apps.apple.com/us/app/higher-%ED%95%98%EC%9D%B4%EC%96%B4/id1672001935",
      android: "https://play.google.com/store/apps/details?id=com.dalcomsoft.mysu.a&hl=it" },
    voteType: { it: "Live vote / Hot Stage", en: "Live vote / Hot Stage" },
    currency: { it: "Rubies", en: "Rubies" },
    expiry: { it: "90 giorni", en: "90 days" },
    collect: {
      it: [
        "Attendance giornaliera",
        "50 pubblcità al giorno",
        "Roulette, 3 volte al giorno",
        "Ladder Game, 3 volte al giorno",
        "Missioni",
      ],
      en: [
        "Daily attendance",
        "50 ads a day",
        "Roulette, 3 times a day",
        "Ladder Game, 3 times a day",
        "Missions",
      ],
    },
    note: {
      it: "Il voto live su Inkigayo costa 250 rubini oppure 25 diamanti, per 5 voti a account.",
      en: "The live vote on Inkigayo costs 250 rubies or 25 diamonds, for 5 votes per account.",
    },
  },
  {
    id: "linc",
    name: "LINC",
    show: "inkigayo",
    accent: "#C81F86",
    logo: icon("apps/linc.png"),
    video: null,
    stores: { ios: "https://apps.apple.com/ng/app/linc-%EB%A7%81%ED%81%AC/id6467824343",
      android: "https://play.google.com/store/apps/details?id=io.stayge.youmeonapp&hl=it" },
    voteType: { it: "Pre-vote", en: "Pre-vote" },
    currency: { it: "Fan Points", en: "Fan Points" },
    expiry: { it: "180 giorni", en: "180 days" },
    collect: {
      it: [
        "Entra nelle Open Chat disponibili",
        "Guarda i video e le pubblicità  fino alla fine",
        "Fan Point Roulette",
        "Giochi",
        "Missioni dentro l'app",
      ],
      en: [
        "Join the available Open Chats",
        "Watch videos and ads all the way through",
        "Fan Point Roulette",
        "Games",
        "Missions and other in-app tasks",
      ],
    },
    note: {
      it: "Nel pre-vote di Inkigayo si può votare 10 volte al giorno per account, e si possono usare più account.",
      en: "In the Inkigayo pre-vote you can vote 10 times a day per account, and multiple accounts are allowed.",
    },
  },
  {
    id: "coogoong",
    name: "Coogoong",
    show: "bank",
    accent: "#017FAC",
    logo: icon("apps/coogoong.png"),
    video: "videos/coogoong.mov",
    videoPoster: asset("images/coogoong-poster.JPG"),
    stores: { ios: "https://apps.apple.com/it/app/coogoong/id1641638840",
      android: "https://play.google.com/store/apps/details?id=com.contentsmadang.fancast&hl=it" },
    voteType: { it: "Da confermare", en: "To be confirmed" },
    currency: { it: "Blue Hearts 💙", en: "Blue Hearts 💙" },
    expiry: { it: "Da confermare", en: "To be confirmed" },
    collect: {
      it: [
        "Attendance giornaliera",
        "Pubblicità",
        "Missioni giornaliere",
        "Roulette per vincere 💙",
      ],
      en: [
        "Daily check-in",
        "Ads",
        "3 types of daily missions",
        "Roulette",
        "Other activities in the Store",
      ],
    },
    note: {
      it: "Nel pre-vote di Music Bank il voto è illimitato: usa tutto quello che hai. App nuova, le regole possono cambiare: ricontrolla prima di votare.",
      en: "In the Music Bank pre-vote there's no cap: spend everything you have. It's a new app and rules may change, so check again before voting.",
    },
  },
  {
    id: "mnetplus",
    name: "Mnet Plus",
    show: "mcountdown",
    accent: "#D10E52",
    logo: icon("apps/mnetplus.png"),
    video: null,
    stores: { ios: "https://apps.apple.com/it/app/mnet-plus/id6443405421",
      android: "https://play.google.com/store/apps/details/Mnet+Plus?id=world.mnetplus&hl=it" },
    voteType: { it: "Pre-vote + Live vote", en: "Pre-vote + live vote" },
    currency: { it: "Nessuna valuta da accumulare", en: "No currency to collect" },
    expiry: { it: "—", en: "—" },
    collect: {
      it: [
        "Crea più account in anticipo, almeno 10 (¬‿¬)",
        "Il voto è limitato per account e per device",
        "Nel pre-vote: 5 voti per account/device",
      ],
      en: [
        "Create several accounts in advance, at least 10 (¬‿¬)",
        "Voting is capped per account and per device",
        "In the pre-vote: 5 votes per account/device",
      ],
    },
    note: {
      it: "Qui non serve accumulare niente: conta solo avere gli account pronti. Il pre-vote resta aperto fino al martedì della settimana di messa in onda, e ogni device conta come un account in più.",
      en: "Nothing to collect here: what matters is having the accounts ready. The pre-vote stays open until the Tuesday of the broadcast week, and each device counts as another account.",
    },
  },
];
