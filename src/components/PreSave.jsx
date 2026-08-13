import { ALBUMS } from "../data/release";

function Cover({ album }) {
    return (
        <>
      <span className="cover">
        {album.cover ? (
            <img src={album.cover} alt={album.title} />
        ) : (
            <span className="cover-empty" aria-hidden="true">cover</span>
        )}
      </span>
            <span className="cover-title">{album.title}</span>
        </>
    );
}

export default function PreSave({ t }) {
    if (ALBUMS.length === 0) return null;
    return (
        <section className="presave" aria-label={t.presaveTitle}>
            <p className="presave-title">{t.presaveTitle}</p>
            <div className="presave-grid">
                {ALBUMS.map((album) =>
                        album.url ? (
                            <a key={album.id} className="cover-link" href={album.url}
                               target="_blank" rel="noopener noreferrer">
                                <Cover album={album} />
                            </a>
                        ) : (
                            <span key={album.id} className="cover-link cover-link-off">
              <Cover album={album} />
            </span>
                        )
                )}
            </div>
        </section>
    );
}