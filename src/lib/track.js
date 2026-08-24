/* Conteggio eventi con GoatCounter.

   Lo script sta in index.html; qui c'è solo la funzione che registra un click.
   Se lo script non è caricato — sviluppo in locale, blocco pubblicità, rete
   lenta — la funzione non fa niente e non rompe il click. */

export function track(path, title) {
  try {
    window.goatcounter?.count?.({ path, title, event: true });
  } catch {
    // il conteggio non deve mai impedire l'apertura del link
  }
}
