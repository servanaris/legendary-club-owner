# Legendary Club Owner — Launch Landing Page

A concept landing page that introduces **Legendary Club Owner** (*Efsane Başkan*) — a
skill-based mobile football-management game — to an English-speaking audience ahead of its
international launch. Built for the **No Surrender Studio** Management Associate case study.

**Target persona:** *Alex, 24, London. Football fan, plays mobile games casually, has never
heard of the game.* Every decision on the page is made to stop Alex scrolling and make him
curious enough to play.

🔗 **Live demo:** _add your deployed URL here_

---

## What's on the page

| Section | Purpose |
| --- | --- |
| **Hero** | 5-second hook + the core promise (skill, real rewards, no pay-to-win) |
| **Why it's different** | The four USPs: skill not luck · free, no pay-to-win · real cash rewards · real match data |
| **How it works** | The core loop: build → collect → tactics → compete |
| **Quiz** *(interactive element)* | "What kind of manager are you?" — 5 questions → one of four archetypes |
| **Reward layer** | A mock season leaderboard showing that every rank earns something |
| **Final CTA** | Launch-list email capture with inline validation |

## The interactive element — "What kind of manager are you?"

A 5-question quiz that reveals which **real manager** you manage like. Each result is mapped to a
pillar of the actual game, and every answer option reflects that manager's **documented**
real-world philosophy — so the outcome is credible, not random:

| Result | Game pillar | Real-world identity (sourced) |
| --- | --- | --- |
| **Pep Guardiola** | Tactics & control | Positional play, possession-as-control, build-from-the-back, counter-press |
| **Arsène Wenger** | Scouting & player cards | Global scouting, youth development, buy-low / sell-high, attacking football |
| **Sir Alex Ferguson** | Infrastructure & long-term building | Dynasty-building, Class of '92, culture & mentality, never-say-die comebacks |
| **José Mourinho** | Competing & leaderboard | Pragmatism ("win first, entertain second"), defensive solidity, counters, mind games |
| **Thomas Frank** | Real-data engine / analytics | "Moneyball" data-driven recruitment & live in-game stats (Brentford → Tottenham), xG, undervalued gems |

It runs entirely client-side (no backend), tracks progress, supports a *Previous* step, breaks
ties deterministically, and ends on a shareable result — the matched manager's **portrait**
(`assets/managers/`), a tailored next-step tip and a CTA.

**Sources for the manager profiles:**
[Coaches' Voice — Positional play / Guardiola](https://learning.coachesvoice.com/cv/positional-play-football-tactics-explained-guardiola-cruyff-manchester-city/) ·
[Sofascore — Mourinho's philosophy](https://www.sofascore.com/news/famous-football-managers-and-their-philosophies-jose-mourinho) ·
[Arsène Wenger — Wikipedia](https://en.wikipedia.org/wiki/Ars%C3%A8ne_Wenger) ·
[Fergie's Fledglings (Class of '92) — Wikipedia](https://en.wikipedia.org/wiki/Fergie%27s_Fledglings) ·
[CNN — Brentford's "Moneyball": 85,000 players sifted with data](https://www.cnn.com/2023/03/10/football/brentford-moneyball-success-premier-league-spt-intl) ·
[Total Football Analysis — Thomas Frank's data-driven Tottenham](https://totalfootballanalysis.com/data-analysis/thomas-frank-tactics-tottenham-hotspur-2025-2026-data-analysis)

## AI-generated visuals

The AI-generated illustration lives in [`assets/`](assets/):

- **`assets/hero-stadium.svg`** — the night-stadium hero backdrop (floodlights, perspective
  pitch, glowing ball).

**Tool:** Claude (Anthropic) — generated as hand-tunable SVG code.
**Prompt used:** *"Design a stylised night-stadium hero illustration as clean SVG. Dark palette
with emerald-green and gold accents. Floodlights casting light cones onto a pitch shown in
perspective, a glowing match ball at the centre spot, subtle crowd speckle. No text; flat-vector,
no gradients heavier than needed."*

The nav / footer / favicon logo is the game's **official app icon** (`assets/app-icon.jpg`, from
its store listing).

> Want a photoreal raster hero instead? Generate one with a free tool (ChatGPT / Adobe Firefly /
> Microsoft Designer) using the prompt above, save it as `assets/hero.jpg`, and set
> `.hero__art { background-image: url("assets/hero.jpg"); }` in `styles.css`.

## Aesthetic alignment with the live game

The palette and branding were matched to the **live game** (its App Store / Google Play listing):
a **green-dominant dark** base, **gold** primary buttons, a **metallic/chrome wordmark**, and the
game's **official app icon** as the logo (nav / footer / favicon).

## Tech stack

- Plain **HTML + CSS + JavaScript** — no framework, no build step, no dependencies.
- Google Fonts (*Anton*, *Inter*) with system-font fallbacks.
- Fully **mobile-responsive** (mobile-first CSS, tested at 375px / 768px / 1280px).
- Accessibility: skip link, focus-visible styles, semantic landmarks, `prefers-reduced-motion`,
  keyboard-operable quiz.

```
nosurrender/
├── index.html        # page markup
├── styles.css        # all styling (mobile-first)
├── quiz.js           # quiz logic + launch-list form handler
├── assets/
│   ├── app-icon.jpg     # official game app icon (logo, from store listing)
│   ├── hero-stadium.svg # AI-generated stadium hero backdrop
│   └── managers/        # manager portraits shown on the quiz results
└── README.md
```

## Run it locally

It's a static site — any static server works:

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

**Netlify (drag-and-drop, no account config needed):**
Go to <https://app.netlify.com/drop> and drop the project folder in.

**Vercel:**
```bash
npm i -g vercel && vercel    # run from the project root, accept the defaults
```

**GitHub Pages:**
Push to a repo, then *Settings → Pages → Deploy from branch → main / root*.

---

## Bonus — Playwright end-to-end test

A [Playwright](https://playwright.dev/python/) script ([`tests/test_quiz.py`](tests/test_quiz.py))
opens the page in a headless browser and verifies the quiz works end-to-end — it clicks through
all 5 questions, checks every step loads, confirms the progress bar advances, asserts the final
result appears (with the manager portrait actually loading), and checks the answer-to-manager
mapping, the *Previous* / *Retake* controls and the email form.

```bash
pip install -r tests/requirements.txt
python -m playwright install chromium
python tests/test_quiz.py        # serves the site locally, runs 7 checks, exits 0/1
```

Point it at the deployed site with `BASE_URL=https://your-site... python tests/test_quiz.py`.
Full details in [`tests/README.md`](tests/README.md). Every interactive element carries a stable
`data-testid`, so the script doesn't break when copy or styling changes.
