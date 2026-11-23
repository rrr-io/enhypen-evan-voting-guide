/* Disegna la card di recap di una giornata, da postare sui social.
   Tutto su canvas: niente librerie, niente richieste esterne, l'immagine esce
   già pronta alla dimensione giusta.

   Lo sfondo riprende il template della fanbase: cornice rossa, fiorellini
   appena accennati, logo in alto, firma in fondo.

   Per cambiare i colori o le misure basta toccare THEME e FORMATS. */

import { SHOWS, APPS, asset } from "../data/apps";
import { toDate, startOfDay, statusOf, LOCALE } from "./weeks";

const BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));

export const THEME = {
  red: "#BF141C",
  petal: "#F8E1E2",
  paper: "#FFFFFF",
  ink: "#141414",
  muted: "#8A8A8A",
};

/* Un formato = misure in pixel reali del file che esce.
   `rows` è quante righe ci stanno prima del "+ altri N". */
export const FORMATS = {
  post: {
    id: "post",
    w: 1080,
    h: 1350,
    frame: 12,
    pad: 96,
    logoW: 156,
    logoTop: 74,
    eyebrow: 23,
    title: 78,
    section: 25,
    name: 38,
    meta: 26,
    icon: 74,
    rowGap: 26,
    blockGap: 54,
    rows: 7,
    flowers: 44,
  },
  story: {
    id: "story",
    w: 1080,
    h: 1920,
    frame: 12,
    pad: 96,
    logoW: 180,
    logoTop: 150,
    eyebrow: 25,
    title: 88,
    section: 27,
    name: 42,
    meta: 29,
    icon: 82,
    rowGap: 34,
    blockGap: 70,
    rows: 10,
    flowers: 62,
  },
};

/* ---------- utilità ---------- */

/* Numeri casuali ma sempre gli stessi: la card di oggi è identica a ogni
   rigenerazione, così non cambia sotto le mani mentre la si scarica. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // icona mancante: si salta, non si rompe
    img.src = src;
  });
}

/* I font arrivano da Google Fonts: il canvas li usa solo se sono già pronti,
   altrimenti disegnerebbe con un ripiego di sistema. */
export async function waitForFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load("400 80px Anton"),
      document.fonts.load("600 40px 'Instrument Sans'"),
      document.fonts.load("400 28px 'JetBrains Mono'"),
      document.fonts.load("700 28px 'JetBrains Mono'"),
    ]);
    await document.fonts.ready;
  } catch {
    /* se il browser non espone document.fonts si disegna lo stesso */
  }
}

/* Scrive distanziando le lettere, come le etichette della pagina.
   Lo fa lettera per lettera perché ctx.letterSpacing non c'è ovunque. */
function tracked(ctx, text, cx, y, spacing) {
  const chars = [...text];
  const width = chars.reduce((w, c) => w + ctx.measureText(c).width + spacing, -spacing);
  let x = cx - width / 2;
  for (const c of chars) {
    ctx.fillText(c, x, y);
    x += ctx.measureText(c).width + spacing;
  }
  return width;
}

/* Accorcia con i puntini se non ci sta. */
function clamp(ctx, text, max) {
  if (ctx.measureText(text).width <= max) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(s + "…").width > max) s = s.slice(0, -1);
  return s + "…";
}

/* Rimpicciolisce il titolo finché non entra nella larghezza utile. */
function fitFont(ctx, text, max, size, family) {
  let s = size;
  for (;;) {
    ctx.font = `${s}px ${family}`;
    if (ctx.measureText(text).width <= max || s <= size * 0.6) return s;
    s -= 2;
  }
}

/* ---------- sfondo ---------- */

function flower(ctx, cx, cy, r, rot) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.fillStyle = THEME.petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.52, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = THEME.paper;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.19, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function background(ctx, f, seed) {
  ctx.fillStyle = THEME.red;
  ctx.fillRect(0, 0, f.w, f.h);
  ctx.fillStyle = THEME.paper;
  ctx.fillRect(f.frame, f.frame, f.w - f.frame * 2, f.h - f.frame * 2);

  const rnd = seeded(seed);
  const m = f.frame + 18;
  const placed = [];
  let tries = 0;
  while (placed.length < f.flowers && tries < f.flowers * 60) {
    tries++;
    const x = m + rnd() * (f.w - m * 2);
    const y = m + rnd() * (f.h - m * 2);
    const r = 16 + rnd() * 22;
    // niente fiori sopra il logo
    if (y < f.logoTop + f.logoW * 0.9 && Math.abs(x - f.w / 2) < f.logoW) continue;
    // e nessuno appiccicato a un altro: si vogliono sparsi, non a grappoli
    if (placed.some((p) => Math.hypot(p.x - x, p.y - y) < (p.r + r) * 1.25)) continue;
    placed.push({ x, y, r });
  }
  for (const p of placed) flower(ctx, p.x, p.y, p.r, rnd() * Math.PI);
}

/* ---------- contenuto ---------- */

const hm = { hour: "2-digit", minute: "2-digit" };
const fmt = (v, lang, opts) => new Intl.DateTimeFormat(LOCALE[lang], opts).format(toDate(v));

/* Dal giorno del calendario alle righe da stampare. */
export function cardRows(day, lang, t, now) {
  const shows = day.broadcasts.map((e) => ({
    key: "s-" + e.id,
    icon: SHOWS[e.show]?.logo || null,
    wide: true, // i loghi degli show non sono quadrati
    name: SHOWS[e.show]?.name || "",
    meta: `${t.episode} ${fmt(e.episode, lang, hm)}`,
    tag: e.liveVote ? t.pinLive : null,
  }));

  const votes = day.votes.map(({ event, opens, closes }) => {
    const apps = event.apps.map((id) => BY_ID[id]).filter(Boolean);
    const when = closes
      ? `${t.closesAt} ${fmt(event.prevote.end, lang, hm)}`
      : opens
      ? `${t.opensAt} ${fmt(event.prevote.start, lang, hm)}`
      : t.allDay;
    return {
      key: "v-" + event.id,
      icon: apps[0]?.logo || null,
      icon2: apps[1]?.logo || null,
      name: apps.map((a) => a.name).join(" + ") || SHOWS[event.show]?.name || "",
      meta: `${SHOWS[event.show]?.name || ""} · ${
        event.voteLabel ? event.voteLabel[lang] : t.prevote
      } · ${when}`,
      tag: closes ? t.cardLastDay : statusOf(event.prevote, now) === "open" ? null : null,
      urgent: closes,
    };
  });

  return { shows, votes };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawRow(ctx, f, row, x, y, maxW, images) {
  const box = f.icon;
  const img = images[row.icon];
  const img2 = images[row.icon2];
  let textX = x;

  if (img) {
    if (row.wide) {
      // logo show: sta dentro un riquadro alto quanto l'icona, largo a piacere
      const w = Math.min(box * 1.9, (img.width / img.height) * box);
      const h = Math.min(box, (img.height / img.width) * w);
      ctx.drawImage(img, x, y + (box - h) / 2, w, h);
      textX = x + Math.max(w, box * 1.1) + 26;
    } else {
      ctx.save();
      roundRect(ctx, x, y, box, box, box * 0.26);
      ctx.clip();
      ctx.drawImage(img, x, y, box, box);
      ctx.restore();
      let right = x + box;
      if (img2) {
        const x2 = x + box * 0.74;
        ctx.save();
        roundRect(ctx, x2, y, box, box, box * 0.26);
        ctx.fillStyle = THEME.paper;
        ctx.fill();
        ctx.clip();
        ctx.drawImage(img2, x2, y, box, box);
        ctx.restore();
        right = x2 + box;
      }
      textX = right + 26;
    }
  }

  /* L'etichetta si misura prima e sta in linea con il nome: la riga sotto,
     quella con l'orario, resta libera per tutta la larghezza. */
  let pill = null;
  if (row.tag) {
    ctx.font = `700 ${f.meta * 0.82}px 'JetBrains Mono', monospace`;
    const w = ctx.measureText(row.tag).width + f.meta * 1.5;
    const h = f.meta * 1.9;
    pill = { w, h, x: x + maxW - w, y: y + f.name * 0.82 - h * 0.72 };
  }

  const nameY = y + f.name * 0.82;
  const nameRoom = maxW - (textX - x) - (pill ? pill.w + f.meta * 0.8 : 0);

  ctx.textAlign = "left";
  ctx.fillStyle = THEME.ink;
  ctx.font = `600 ${f.name}px 'Instrument Sans', sans-serif`;
  ctx.fillText(clamp(ctx, row.name, nameRoom), textX, nameY);

  /* L'orario è l'informazione che conta: prima si rimpicciolisce un po',
     e solo se proprio non ci sta si taglia. */
  const metaRoom = maxW - (textX - x);
  let ms = f.meta;
  ctx.font = `400 ${ms}px 'JetBrains Mono', monospace`;
  while (ctx.measureText(row.meta).width > metaRoom && ms > f.meta * 0.74) {
    ms -= 1;
    ctx.font = `400 ${ms}px 'JetBrains Mono', monospace`;
  }
  ctx.fillStyle = THEME.muted;
  ctx.fillText(clamp(ctx, row.meta, metaRoom), textX, nameY + f.meta * 1.5);

  if (pill) {
    ctx.fillStyle = row.urgent ? THEME.red : THEME.ink;
    roundRect(ctx, pill.x, pill.y, pill.w, pill.h, pill.h / 2);
    ctx.fill();
    ctx.fillStyle = THEME.paper;
    ctx.font = `700 ${f.meta * 0.82}px 'JetBrains Mono', monospace`;
    ctx.fillText(row.tag, pill.x + f.meta * 0.75, pill.y + pill.h * 0.68);
  }
}

/* ---------- la card ---------- */

export async function drawCard(canvas, { format, day, lang, t, now }) {
  const f = FORMATS[format] || FORMATS.post;
  canvas.width = f.w;
  canvas.height = f.h;
  const ctx = canvas.getContext("2d");

  const { shows, votes } = cardRows(day, lang, t, now);

  // tutte le immagini servite, caricate una volta sola
  const srcs = [
    ...new Set(
      [...shows, ...votes].flatMap((r) => [r.icon, r.icon2]).filter(Boolean)
    ),
  ];
  const loaded = await Promise.all(srcs.map(loadImage));
  const images = Object.fromEntries(srcs.map((s, i) => [s, loaded[i]]));
  const logo = await loadImage(asset("icons/enitalia.png"));

  await waitForFonts();

  background(ctx, f, hash(day.id + format));

  const left = f.pad;
  const maxW = f.w - f.pad * 2;
  let y = f.logoTop;

  if (logo) {
    const w = f.logoW;
    const h = (logo.height / logo.width) * w;
    ctx.drawImage(logo, (f.w - w) / 2, y, w, h);
    y += h + f.blockGap * 0.9;
  } else {
    y += f.blockGap;
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  // occhiello
  ctx.fillStyle = THEME.muted;
  ctx.font = `400 ${f.eyebrow}px 'JetBrains Mono', monospace`;
  tracked(ctx, t.cardEyebrow.toUpperCase(), f.w / 2, y, f.eyebrow * 0.34);
  y += f.eyebrow * 2.2;

  // data
  const title = fmt(day.date, lang, { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
  const size = fitFont(ctx, title, maxW, f.title, "Anton, sans-serif");
  ctx.fillStyle = THEME.red;
  ctx.textAlign = "center";
  ctx.font = `${size}px Anton, sans-serif`;
  ctx.fillText(title, f.w / 2, y + size * 0.78);
  y += size * 1.12;

  // filetto
  ctx.strokeStyle = THEME.red;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(f.w - left, y);
  ctx.stroke();
  y += f.blockGap;

  const rowH = f.icon + f.rowGap;

  /* Prima si decide cosa entra, poi si centra il blocco nello spazio che
     resta: così una giornata con una riga sola non lascia un buco in fondo. */
  let budget = f.rows;
  const blocks = [];
  for (const [label, rows] of [
    [t.cardShows, shows],
    [t.cardVotes, votes],
  ]) {
    if (rows.length === 0 || budget <= 0) continue;
    const shown = rows.slice(0, budget);
    budget -= shown.length;
    blocks.push({ label, shown, hidden: rows.length - shown.length });
  }

  const blockH = (b) =>
    f.section * 1.9 +
    b.shown.length * rowH +
    (b.hidden > 0 ? f.meta * 2 : 0) +
    f.blockGap -
    f.rowGap;
  const contentH = blocks.reduce((h, b) => h + blockH(b), 0) - (f.blockGap - f.rowGap);
  const room = f.h - f.pad * 1.7 - y;
  if (room > contentH) y += (room - contentH) / 2;

  const block = ({ label, shown, hidden }) => {
    ctx.textAlign = "left";
    ctx.fillStyle = THEME.red;
    ctx.font = `700 ${f.section}px 'JetBrains Mono', monospace`;
    let x = left;
    for (const c of [...label.toUpperCase()]) {
      ctx.fillText(c, x, y);
      x += ctx.measureText(c).width + f.section * 0.3;
    }
    y += f.section * 1.9;

    for (const r of shown) {
      drawRow(ctx, f, r, left, y, maxW, images);
      y += rowH;
    }

    if (hidden > 0) {
      ctx.textAlign = "left";
      ctx.fillStyle = THEME.muted;
      ctx.font = `400 ${f.meta}px 'JetBrains Mono', monospace`;
      ctx.fillText(t.cardMore(hidden), left, y + f.meta);
      y += f.meta * 2;
    }
    y += f.blockGap - f.rowGap;
  };

  blocks.forEach(block);

  if (blocks.length === 0) {
    ctx.textAlign = "center";
    ctx.fillStyle = THEME.muted;
    ctx.font = `400 ${f.name}px 'Instrument Sans', sans-serif`;
    ctx.fillText(t.dayNothing, f.w / 2, y + f.name);
  }

  // piede: indirizzo del sito e firma
  const host = typeof window !== "undefined" ? window.location.host : "";
  if (host) {
    ctx.textAlign = "center";
    ctx.fillStyle = THEME.muted;
    ctx.font = `400 ${f.eyebrow}px 'JetBrains Mono', monospace`;
    tracked(ctx, host, f.w / 2, f.h - f.pad * 0.92, f.eyebrow * 0.18);
  }
  ctx.fillStyle = THEME.red;
  ctx.font = `700 ${f.eyebrow}px 'JetBrains Mono', monospace`;
  tracked(ctx, "ENHYPEN ITALIA", f.w / 2, f.h - f.pad * 0.44, f.eyebrow * 0.5);

  return canvas;
}

/* Il file da scaricare. */
export function cardFileName(day, format, lang) {
  return `${lang === "en" ? "voting" : "votazioni"}-${day.id}-${format}.png`;
}

export function downloadCanvas(canvas, name) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(false);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve(true);
    }, "image/png");
  });
}

export { startOfDay };
