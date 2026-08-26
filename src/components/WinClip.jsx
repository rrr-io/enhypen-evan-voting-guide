import { useEffect, useRef } from "react";

/* Finestra che mostra il post della vittoria.
   Lo script di X viene caricato solo qui, cioè solo se qualcuno apre una
   corona: chi non clicca non incontra nessuno script esterno. */

const X_SCRIPT = "https://platform.twitter.com/widgets.js";

function loadX() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  const existing = document.querySelector(`script[src="${X_SCRIPT}"]`);
  if (existing) {
    return new Promise((res) => existing.addEventListener("load", () => res(window.twttr)));
  }
  return new Promise((res, rej) => {
    const el = document.createElement("script");
    el.src = X_SCRIPT;
    el.async = true;
    el.onload = () => res(window.twttr);
    el.onerror = rej;
    document.head.appendChild(el);
  });
}

function youtubeId(value) {
  const m = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : value;
}

export default function WinClip({ clip, title, onClose, closeLabel }) {
  const box = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (clip.type !== "x" || !box.current) return;
    let alive = true;
    loadX()
      .then((twttr) => {
        if (alive && box.current) twttr.widgets.load(box.current);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [clip]);

  return (
    <div className="wc-back" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="wc-box" onClick={(e) => e.stopPropagation()}>
        <button className="wc-close" onClick={onClose} aria-label={closeLabel}>
          ×
        </button>

        <div className="wc-body" ref={box}>
          {clip.type === "x" && (
            <blockquote className="twitter-tweet" data-dnt="true">
              <a href={clip.url}>{clip.url}</a>
            </blockquote>
          )}

          {clip.type === "youtube" && (
            <div className="wc-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId(clip.url)}`}
                title={title}
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
