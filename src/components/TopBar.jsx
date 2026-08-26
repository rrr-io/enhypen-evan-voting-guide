import { LANGS } from "../data/ui";

/* Riga in cima alla pagina: etichetta, selettore lingua e social.
   La usano sia la guida che l'armadietto dei trofei, così restano identiche. */
export default function TopBar({ t, lang, setLang, eyebrow }) {
  return (
    <div className="topbar">
      <p className="eyebrow">{eyebrow ?? t.eyebrow}</p>
      <div className="topbar-right">
        <div className="langswitch" role="group" aria-label={t.langLabel}>
          {LANGS.map((l) => (
            <button
              key={l}
              className={`lang ${lang === l ? "lang-on" : ""}`}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <nav className="social" aria-label={t.socialLabel}>
          <a
            href="https://www.instagram.com/enhypen.italia_/"
            className="social-btn"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
                 stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="https://x.com/ENHYPEN_ITALIA_" className="social-btn" aria-label="X">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
