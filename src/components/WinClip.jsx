import { useEffect, useRef, useState } from "react";

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

function tweetId(url) {
  const m = String(url).match(/status\/(\d+)/);
  return m ? m[1] : null;
}

function youtubeId(value) {
  const m = String(value).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  return m ? m[1] : value;
}

export default function WinClip({ clip, title, onClose, closeLabel, copy }) {
  const slot = useRef(null);
  const [state, setState] = useState(clip.type === "x" ? "loading" : "ready");

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

  /* createTweet costruisce il post dentro il contenitore vuoto: così non si
     vede mai il link grezzo prima che l'embed sia pronto. */
  useEffect(() => {
    if (clip.type !== "x") return;
    const id = tweetId(clip.url);
    if (!id) {
      setState("error");
      return;
    }
    let alive = true;
    loadX()
      .then((twttr) => {
        if (!alive || !slot.current) return null;
        return twttr.widgets.createTweet(id, slot.current, {
          align: "center",
          dnt: true,
          conversation: "none",
        });
      })
      .then((el) => {
        if (alive) setState(el ? "ready" : "error");
      })
      .catch(() => alive && setState("error"));
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

        <div className="wc-body">
          {clip.type === "x" && (
            <>
              {state === "loading" && <p className="wc-state">{copy.loading}</p>}
              {state === "error" && (
                <p className="wc-state">
                  {copy.failed}{" "}
                  <a href={clip.url} target="_blank" rel="noopener noreferrer">
                    {copy.openOnX}
                  </a>
                </p>
              )}
              <div className={`wc-slot ${state === "ready" ? "is-ready" : ""}`} ref={slot} />
            </>
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
