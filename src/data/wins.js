/* Vittorie ai music show. Una riga per vittoria: la pagina le raggruppa da
   sola per programma e le mostra come corone nell'armadietto dei trofei.

   show     chiave di SHOWS in apps.js
   episode  data della puntata (solo giorno, es. "2026-08-26")
   label    facoltativo, compare nel titolo al passaggio sulla corona
            (es. "1º posto", "Triple Crown")
   clip     facoltativo: il post da mostrare cliccando la corona.
            { type: "x", url: "https://x.com/.../status/..." }
            type può essere "x" (post di X) o "youtube" (id o link del video). */

export const WINS = [
   {
     id: "w1",
     show: "champion",
     episode: "2026-08-26",
     label: { it: "1º posto", en: "#1" },
     clip: { type: "x", url: "https://x.com/showchampion1/status/2092540432244941274?s=46" },
   },
    {
        id: "w2",
        show: "mcountdown",
        episode: "2026-08-27",
        label: { it: "1º posto", en: "#1" },
        clip: { type: "x", url: "https://x.com/enhypen_italia_/status/2092947128091849195?s=46" },
    },
    {
        id: "w3",
        show: "bank",
        episode: "2026-08-28",
        label: { it: "1º posto", en: "#1" },
        clip: { type: "x", url: "https://x.com/enhypen_italia_/status/2093292482523959332?s=46" },
    },
    {
        id: "w4",
        show: "core",
        episode: "2026-09-03",
        label: { it: "1º posto", en: "#1" },
        clip: { type: "x", url: "https://x.com/enhypen_italia_/status/2093625661696913786?s=46" },
    },
    {
        id: "w5",
        show: "inkigayo",
        episode: "2026-08-30",
        label: { it: "1º posto", en: "#1" },
        clip: { type: "x", url: "https://x.com/enhypen_italia_/status/2093977528109003062?s=46" },
    }
];
