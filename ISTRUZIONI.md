# Due versioni dallo stesso repo

## File
| File consegnato | Dove va |
|---|---|
| `vite.config.js` | radice |
| `env.txt` | radice, **rinominare in `.env`** |
| `env.solo.txt` | radice, **rinominare in `.env.solo`** |
| `package.json` | radice |
| `index.html` | radice |
| `ui.js` | `src/data/` |
| `release.js` | `src/data/` |
| `styles.css` | `src/` |

(I due file di ambiente arrivano con estensione .txt perché i file che iniziano
con un punto spesso non sopravvivono al passaggio.)

## Come si builda
```bash
npm run build        # GitHub Pages: sottocartella, con Evan
npm run build:solo   # dominio proprio: radice, senza Evan
```

## Cosa cambia con VITE_SHOW_EVAN=false
- titolo: "Guida Votazioni Comeback Enhypen" (senza "& Evan")
- intro: cita solo la fanbase ENHYPEN ITALIA
- blocco uscite: resta solo the sin:bliss, sparisce Death of Me
- `<title>` e meta description della pagina

## Deploy sulla macchina Oracle
```bash
npm run build:solo
rsync -avz --delete dist/ utente@IP:/var/www/voting/
```

Caddyfile:
```
voting.enhypenitalia.com {
    root * /var/www/voting
    encode zstd gzip
    file_server
}
```

Ricorda: record A `voting` → IP della VM, porte 80 e 443 aperte sia nella
Security List di Oracle sia nel firewall dentro la macchina.
