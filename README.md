# AminaAndEren 💗

A responsive birthday celebration website for Amina & Eren. Plain HTML, CSS and vanilla JavaScript: no build step, no dependencies.

**Features:** cake intro (blow out the candles), party countdown, two birthday cards, story timeline, photo gallery with lightbox, animated love letter, party details with RSVP and calendar download, guestbook wall, optional background music.

## Run locally

Just open `index.html` in a browser. Or, for a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Make it yours

All content lives in **`js/config.js`**: names, birthdays, party date and place, story, photos, letter and starter wishes.

| Want to change…      | Do this                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| Names & dates        | Edit `couple`, `birthdays` and `party.date` in `js/config.js`           |
| Photos               | Add images to `assets/images/` and update the `photos` list             |
| Music                | Add `assets/audio/song.mp3` (the music button hides itself if missing)  |
| Colours & fonts      | Edit the variables at the top of `css/styles.css`                       |
| Replay the intro     | Open the page with `?intro` at the end of the URL                       |

### Receiving real RSVPs
By default RSVPs and guestbook wishes are saved only in the visitor's own browser (demo mode). To collect RSVPs, create a free form endpoint (e.g. [Formspree](https://formspree.io)) and paste its URL into `rsvpEndpoint` in `js/config.js`. Guestbook wishes remain per-browser; a shared wall would need a small backend.

## Publish on GitHub Pages

```bash
git init
git add .
git commit -m "Birthday website for Amina & Eren"
git branch -M main
git remote add origin https://github.com/<your-username>/AminaAndEren.git
git push -u origin main
```

Then in your repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. The included workflow (`.github/workflows/pages.yml`) publishes the site on every push to `main` at `https://<your-username>.github.io/AminaAndEren/`.

## Structure

```
AminaAndEren/
├── index.html
├── css/styles.css
├── js/
│   ├── config.js      ← edit your content here
│   └── main.js
├── assets/
│   ├── images/        ← placeholder SVGs, replace with photos
│   └── audio/         ← add song.mp3
├── .github/workflows/pages.yml
├── .gitignore
├── LICENSE
└── README.md
```

## Notes
- Fonts (Fraunces, Nunito Sans) load from Google Fonts, with system fallbacks if offline.
- Respects `prefers-reduced-motion` and supports keyboard navigation.
- Inspired by the flow of birthday-gift sites (cake → letter → photos → music), with an original design and code.
