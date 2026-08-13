# Voting Guide Comeback Enhypen & Evan

React page (Vite) with a card for each voting app: rating, deadlines, how to collect and a video tutorial. 
Automatic deployment on GitHub Pages.


## Run Locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # generate dist/
```

## Locale

Page is bilingual Italian/English, with the IT/EN selector at the top right.
The locales are in  `src/data/ui.js`, the card contents in `src/data/apps.js`: 
fields written as `{ it: "...", en: "..." }` exist in both languages.


## Add and modify Voting Apps

Everything is in `src/data/apps.js`. Every app is a JS object with these fields:

```js
{
  id: "mubeat",              // unique
  name: "Mubeat",
  show: "core",              // key SHOWS, top
  accent: "#5B2BD9",         // color card when selected, also used for the video player
  logo: icon("apps/mubeat.png"),   
  voteType: { it: "Pre-vote + Live vote", en: "Pre-vote + live vote" },
  currency: { it: "Heart Beats", en: "Heart Beats" },
  expiry: { it: "90 giorni", en: "90 days" },
  collect: { it: ["..."], en: ["..."] },   
  note: { it: "...", en: "..." },          
  video: asset("videos/mubeat.mp4"),  
}
```

## Add video tutorial

The `video` field accepts three formats, and the correct player is selected automatically:

- **file uploaded to the repo**: put the file in `public/videos/` and write  
  `video: asset("videos/mubeat.mp4")` — supported formats: `.mp4`, `.webm`, `.mov`, `.m4v`
- **YouTube link**: `video: "https://www.youtube.com/watch?v=AbC123xyz"`
- **YouTube ID only**: `video: "AbC123xyz"`

For files, you can also add `videoPoster: asset("videos/mubeat-poster.jpg")`:  
this is the image shown before playback.


## Icons

- App: `public/icons/apps/name.png` — square, transparent background, at least 256×256  
- Music show: `public/icons/shows/name.png` — wide logos are fine too

Then link them with `logo: icon("apps/name.png")`. As long as the field is `null`,  
the dashed placeholder box is shown.


## Deploy

Every push to `main` triggers the workflow in `.github/workflows/deploy.yml`,
which builds and publishes the site. One time only, on GitHub: **Settings → Pages → Source: GitHub Actions**.

If you rename the repository, update `base` in `vite.config.js`.
