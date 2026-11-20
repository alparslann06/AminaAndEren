# For Amina 💗

An interactive birthday presentation for Amina (7 December). One page, plain HTML, CSS and vanilla JavaScript: no build step, no dependencies.

## How it works

She blows out a candle to start, then clicks (or taps, or swipes, or uses the arrow keys) through the slides:

1. **Happy birthday, Amina**: live countdown to 7 December
2. **Our story**: moments appear one click at a time
3. **Photos**: each click drops a new polaroid onto a growing pile
4. **Things I think about**: big lines, one per click
5. **Why I love you**: tap each heart to flip it and read a reason
6. **A letter**: tap the envelope to open it
7. **Your gift**: tap to open, with a heart shower

The pointer leaves a trail of hearts, bursts hearts on every click or tap, and a soft glow follows the mouse. The "For Amina" badge sits top-left, and there's a full-screen button for presenting.

## Run locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Make it yours

Everything lives in **`js/config.js`**: her name, your name, the birthday, story, photos, big lines, reasons, letter and gift message.

| Want to change…   | Do this                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| Text & dates      | Edit `js/config.js`                                                    |
| Photos            | Add images to `assets/images/` and update `photos` in the config       |
| Music             | Add `assets/audio/song.mp3` (the music button hides itself if missing) |
| Colours & fonts   | Edit the variables at the top of `css/styles.css`                      |
| Add/remove slides | Each slide is one block in `js/main.js`, in the order they appear      |

## Publish on GitHub Pages

Push to `main`, then in the repo go to **Settings → Pages → Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes it at `https://<your-username>.github.io/AminaAndEren/`.

The page includes `<meta name="robots" content="noindex">` so search engines don't list it. Anyone with the link can still open it.

## Notes
- Fonts (Fraunces, Nunito Sans) load from Google Fonts, with system fallbacks if offline.
- Respects `prefers-reduced-motion` (particles and glow are switched off).
- Keyboard: → / Space / Enter next, ← back, Home / End jump.
