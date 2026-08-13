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
