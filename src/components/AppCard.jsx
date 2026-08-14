import { useState } from "react";
import { SHOWS } from "../data/apps";

function LogoSlot({ src, label, size = 52, round = false }) {
  const radius = round ? "50%" : size >= 40 ? 12 : 8;
  if (src) {
    return (
      <img
        src={src}
        alt={label}
        style={{ width: size, height: size, borderRadius: radius }}
        className="logo-img"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="logo-slot"
      style={{ width: size, height: size, borderRadius: radius, fontSize: size >= 40 ? 16 : 10 }}
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}

const STORE_ICONS = {
  ios: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
        <path d="M16.4 1.4c0 1.1-.4 2.2-1.1 3-.9 1-2.3 1.7-3.4 1.6-.1-1.1.4-2.3 1.1-3 .8-.9 2.2-1.5 3.4-1.6zM20.7 17.1c-.6 1.3-.8 1.8-1.5 3-1 1.5-2.4 3.5-4.2 3.5-1.5 0-1.9-1-4-1s-2.6 1-4.1 1c-1.7 0-3.1-1.8-4.1-3.3C.1 16.9-.2 11.7 1.4 8.9c1.2-2 3.1-3.1 4.9-3.1 1.8 0 2.9 1 4.4 1s2.4-1 4.5-1c1.6 0 3.3.9 4.4 2.4-3.9 2.1-3.2 7.7.1 8.9z" />
      </svg>
  ),
  android: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
        <path d="M3.6 20.5V4.3c0-.5.2-.9.5-1.2l9 8.9-9 9c-.3-.3-.5-.8-.5-1.5zM14.6 15.1l-9.2 5.3 7.1-7.1 2.1 1.8zM17.9 10.6c.6.4 1 .9 1 1.4s-.3 1-1 1.4l-2 1.2-2.4-2.6 2.4-2.4 2 1zM5.4 3.4l9.2 5.3-2.1 2.1-7.1-7.4z" />
      </svg>
  ),
};

function StoreLinks({ app, t }) {
  const stores = app.stores || {};
  const links = [
    ["ios", "App Store", stores.ios],
    ["android", "Google Play", stores.android],
  ].filter(([, , url]) => url);
  if (links.length === 0) return null;

  return (
      <div className="stores">
        {links.map(([id, label, url]) => (
        <a
            key={id}
          className="store-btn"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.download} ${app.name} — ${label}`}
          >
        {STORE_ICONS[id]}
        {label}
        </a>
          ))}
</div>
);
}

/* Il campo video accetta tre cose:
   - il percorso di un file caricato: "videos/idolchamp.mp4"
   - un link YouTube completo
   - il solo ID di un video YouTube
   Il player giusto viene scelto in base a quello che trova. */
const VIDEO_FILE = /\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i;
const YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/;

/* I tutorial sono registrazioni di schermo del telefono, quindi il riquadro
   parte verticale. Per i file caricati si adatta da solo alle proporzioni vere
   appena il browser legge il video; per gli embed puoi forzarle con videoRatio
   (per esempio videoRatio: "16 / 9" su un tutorial orizzontale). */
const RATIO_DEFAULT = "9 / 16";
const MAX_H = 460; // altezza massima del player, in px

function frameStyle(ratio) {
  const [w, h] = ratio.split("/").map((n) => parseFloat(n));
  const isPortrait = h > w;
  return {
    aspectRatio: ratio,
    maxWidth: isPortrait ? `${Math.round(MAX_H * (w / h))}px` : "100%",
  };
}

function VideoSlot({ app, t }) {
  const video = app.video;
  const [ratio, setRatio] = useState(
    app.videoRatio || (video && !VIDEO_FILE.test(video) ? "16 / 9" : RATIO_DEFAULT)
  );

  if (!video) {
    return (
      <div className="video-empty" style={frameStyle(app.videoRatio || RATIO_DEFAULT)}>
        <p className="video-empty-title">{t.videoEmptyTitle}</p>
        <p className="video-empty-body">{t.videoEmptyBody(app.name)}</p>
      </div>
    );
  }

  if (VIDEO_FILE.test(video)) {
    return (
      <div className="video-frame" style={frameStyle(ratio)}>
        <video
          controls
          playsInline
          preload="metadata"
          poster={app.videoPoster || undefined}
          onLoadedMetadata={(e) => {
            const { videoWidth: w, videoHeight: h } = e.currentTarget;
            if (!app.videoRatio && w && h) setRatio(`${w} / ${h}`);
          }}
        >
          <source src={video} />
          {t.videoFallback}{" "}
          <a href={video} download>
            {t.videoDownload}
          </a>
          .
        </video>
      </div>
    );
  }

  const match = video.match(YOUTUBE);
  const id = match ? match[1] : video;
  return (
    <div className="video-frame" style={frameStyle(ratio)}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={`${t.tabVideo} ${app.name}`}
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function AppCard({ app, active, onSelect, mode, lang, t }) {
  const [tab, setTab] = useState("riepilogo");
  const show = SHOWS[app.show];

  return (
    <article
      className={`card ${active ? "card-on" : ""}`}
      style={{ "--accent": app.accent }}
      onMouseDown={onSelect}
      onFocusCapture={onSelect}
    >
      {mode === "float" && (
        <div className="float-mark" role="img" aria-label={show.name}>
          {show.logo ? (
            <img src={show.logo} alt="" />
          ) : (
            <LogoSlot src={null} label={show.name} size={60} />
          )}
        </div>
      )}

      <header className="card-head">
        <LogoSlot src={app.logo} label={app.name} size={52} />
        <div className="card-head-text">
          <h3 className="card-title">{app.name}</h3>
          <p className="card-votetype">{app.voteType[lang]}</p>
        </div>
        <StoreLinks app={app} t={t} />
        {mode === "header" && (
          <div className={`show-badge ${show.logo ? "show-badge-mark" : ""}`}>
            {show.logo ? (
              <>
                <span className="show-mark">
                  <img src={show.logo} alt={show.name} />
                </span>
                <p className="show-channel">{show.channel}</p>
              </>
            ) : (
              <>
                <LogoSlot src={null} label={show.name} size={28} round />
                <div>
                  <p className="show-name">{show.name}</p>
                  <p className="show-channel">{show.channel}</p>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      <dl className="meta">
        <div>
          <dt>{t.currency}</dt>
          <dd>{app.currency[lang]}</dd>
        </div>
        <div>
          <dt>{t.expiry}</dt>
          <dd>{app.expiry[lang]}</dd>
        </div>
      </dl>

      <div className="tabs" role="tablist" aria-label={t.contentsLabel(app.name)}>
        {[
          ["riepilogo", t.tabSummary],
          ["video", t.tabVideo],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={`tab ${tab === id ? "tab-on" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="panel">
        {tab === "riepilogo" ? (
          <>
            <p className="eyebrow mb-2">{t.collectTitle}</p>
            <ul className="collect-list">
              {app.collect[lang].map((f) => (
                <li key={f}>
                  <span className="bullet" />
                  {f}
                </li>
              ))}
            </ul>
            {app.note && <p className="note">{app.note[lang]}</p>}
          </>
        ) : (
          <VideoSlot app={app} t={t} />
        )}
      </div>
    </article>
  );
}
