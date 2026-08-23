import { ALBUMS } from "../data/release";

export default function PreSave({ t }) {
  if (ALBUMS.length === 0) return null;

  return (
    <section className="rel" aria-label={t.releasesTitle}>
      {ALBUMS.map((album) => {
        const cta = album.action === "listen" ? t.listenNow : t.presaveNow;
        const Row = album.url ? "a" : "div";

        /* Se c'è il player, prende il posto della barra: mostra già copertina,
           titolo e artista, quindi ripeterli sopra sarebbe di troppo. */
        if (album.embed) {
          return (
            <div key={album.id} className="rel-player">
              <iframe
                src={album.embed}
                title={`${album.title} — ${album.artist || ""}`}
                width="100%"
                height="152"
                frameBorder="0"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
              {album.url && (
                <a
                  className="rel-more"
                  href={album.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.allPlatforms}
                </a>
              )}
            </div>
          );
        }

        return (
          <Row
            key={album.id}
            className={`rel-row ${album.url ? "" : "is-off"} rel-${album.action}`}
            {...(album.url
              ? { href: album.url, target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="rel-cover">
              {album.cover ? (
                <img src={album.cover} alt="" />
              ) : (
                <span className="rel-cover-empty" aria-hidden="true">
                  cover
                </span>
              )}
            </span>

            <span className="rel-text">
              <b>{album.title}</b>
              {album.artist && <span className="rel-artist">{album.artist}</span>}
            </span>

            <span className="rel-cta">{cta}</span>
          </Row>
        );
      })}
    </section>
  );
}
