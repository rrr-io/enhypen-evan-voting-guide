import { SHOWS } from "../data/apps";
import { buildGrid, startOfDay, LOCALE } from "../lib/weeks";

/* Panoramica compatta di tutto il periodo: una riga per music show, una colonna
   per giorno. Usa un linguaggio suo, diverso dalla timeline: il colore dice lo
   stato del voto (verde aperto, ambra ultimo giorno) e il triangolo la diretta
   (nero normale, rosso se si vota in diretta). */
export default function CalendarMini({ lang, t, now }) {
  const { days, rows } = buildGrid();
  const today = startOfDay(new Date(now)).getTime();

  const label = (d, opts) => new Intl.DateTimeFormat(LOCALE[lang], opts).format(d);

  const cellTitle = (show, d, c) =>
    [
      show,
      label(d, { weekday: "long", day: "numeric", month: "long" }),
      c.closes ? t.miniLast : c.vote ? t.miniOpen : null,
      c.live ? t.miniLive : c.show ? t.miniShow : null,
    ]
      .filter(Boolean)
      .join(" · ");

  return (
    <section className="mini" aria-label={t.miniTitle}>
      <p className="eyebrow">{t.miniTitle}</p>

      <div className="mini-grid" style={{ "--days": days.length }}>
        <span className="mini-row mini-scale">
          <span className="mini-label" />
          {days.map((d, i) => (
            <span
              key={i}
              className={`mini-num ${d.getTime() === today ? "mini-num-today" : ""}`}
            >
              {d.getDay() === 1 || i === 0 ? d.getDate() : ""}
            </span>
          ))}
        </span>

        {rows.map((row) => {
          const show = SHOWS[row.show];
          return (
            <span key={row.show} className="mini-row">
              <span className="mini-label" title={show.name}>
                {show.logo ? <img src={show.logo} alt={show.name} /> : show.name.slice(0, 3)}
              </span>
              {row.cells.map((c, i) => (
                <span
                  key={i}
                  className={[
                    "mini-cell",
                    c.closes ? "is-last" : c.vote ? "is-open" : "",
                    days[i].getTime() === today ? "is-today" : "",
                  ].join(" ")}
                  title={cellTitle(show.name, days[i], c)}
                >
                  {c.show && <i className={`mini-tv ${c.live ? "is-live" : ""}`} />}
                </span>
              ))}
            </span>
          );
        })}
      </div>

      <p className="mini-legend">
        <span className="mk mk-open" /> {t.miniOpen}
        <span className="mk mk-last" /> {t.miniLast}
        <span className="mk mk-tv" /> {t.miniShow}
        <span className="mk mk-tv mk-live" /> {t.miniLive}
      </p>
    </section>
  );
}
