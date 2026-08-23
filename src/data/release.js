const cover = (p) => `${import.meta.env.BASE_URL}icons/covers/${p}`;

/* Le uscite mostrate in cima alla pagina, una barra per riga.
   action decide la scritta del pulsante:
     "listen"  → già uscito, si ascolta
     "presave" → non ancora uscito, si salva in anticipo
   Se manca la cover, al suo posto compare un riquadro tratteggiato.
   L'ordine dell'elenco è l'ordine in cui compaiono le barre.

   embed: indirizzo del player Spotify. Si prende dall'album con Condividi →
   Copia codice di incorporamento, tenendo solo l'indirizzo dentro src="...".
   Se c'è, al posto della barra compare il player e sotto il link a tutte le
   piattaforme. */

export const ALBUMS = [
  {
    id: "enhypen",
    title: "the sin:bliss",
    artist: "ENHYPEN",
    cover: cover("thesinbliss.jpg"),
    url: "https://enhypen.lnk.to/THESINBLISS",
    action: "listen",
    embed:
      "https://open.spotify.com/embed/album/2os46ReV779WlryAHPL6ko?utm_source=generator&theme=0",
  },
  {
    id: "evan",
    title: "Death of Me",
    artist: "EVAN",
    cover: cover("deathofme.jpg"),
    url: "https://evan.lnk.to/DEATHOFME",
    action: "presave",
  },
];
