# Legendary Club Owner — Launch Landing Page

Case-study submission for the **No Surrender Studio** Management Associate role.

A landing page that introduces **Legendary Club Owner** (*Efsane Başkan*) — a skill-based mobile
football-management game — to an English-speaking audience ahead of its international launch.

🔗 **Live page:** <https://servanaris.github.io/legendary-club-owner/>
👤 **Built by:** Servan Arıs

**Who it's written for:** *Alex, 24, London. Football fan, plays mobile games casually, has never
heard of the game.* Every decision on the page is aimed at stopping Alex mid-scroll and making him
curious enough to play.

---

## Deliverables (mapped to the brief)

| # | Brief asked for | Where it is |
| --- | --- | --- |
| 1 | Live, mobile-responsive landing page (English) | [Live page](https://servanaris.github.io/legendary-club-owner/) · this repo |
| 2 | A 2-sentence hook | Submission email |
| 3 | At least one AI-generated visual (+ tool & prompt) | [AI-generated visuals](#ai-generated-visuals) below |
| 4 | One interactive element | The ["What kind of manager are you?" quiz](#the-interactive-element--the-quiz) |
| 5 | Process note | Submission email |
| ★ | **Bonus:** Playwright test of the interactive element | [`tests/`](tests/) — see [Bonus](#bonus--playwright-end-to-end-test) |

---

## What's on the page

| Section | Purpose |
| --- | --- |
| **Hero** | The 5-second hook + the core promise: skill, real rewards, no pay-to-win |
| **Why it's different** | The four USPs — skill not luck · free, no pay-to-win · real cash rewards · real match data |
| **How it works** | The core loop: build → collect → set tactics → compete & earn |
| **Quiz** *(interactive element)* | "What kind of manager are you?" — 5 questions → one of five real managers |
| **The reward layer** | Reinforces that every rank on the table earns something |
| **Final CTA** | Launch-list email capture, plus App Store / Google Play badges that link to the live game |

The page is a single static site — no framework, no build step — so it loads instantly and is easy
to host anywhere.

---

## The interactive element — the quiz

A 5-question quiz that reveals which **real manager** you manage like. Each result maps to a pillar
of the actual game, and every answer option reflects that manager's **documented** real-world
philosophy, so the outcome feels credible rather than random.

| Result | Game pillar | Real-world identity (sourced) |
| --- | --- | --- |
| **Pep Guardiola** | Tactics & control | Positional play, possession-as-control, build-from-the-back |
| **Arsène Wenger** | Scouting & player cards | Global scouting, youth development, buy-low / sell-high |
| **Sir Alex Ferguson** | Infrastructure & long-term building | Dynasty-building, Class of '92, culture & mentality |
| **José Mourinho** | Competing & leaderboard | Pragmatism, defensive solidity, big-game mentality |
| **Thomas Frank** | Real-data engine / analytics | "Moneyball" data-driven recruitment, value-finding, overachieving |

**Why this element:** a short, descriptive personality quiz is the most shareable thing for a
casual fan, and because it's quick the payoff lands fast. Tying the five results to recognisable
Premier League managers also doubles as a 60-second tour of how you'd actually play the game.

It runs entirely client-side (no backend), tracks progress, supports a *Previous* step, breaks
ties deterministically, and ends on a shareable result — the matched manager's portrait, a tailored
next-step tip, and a CTA. Every interactive element carries a stable `data-testid`, which is what
the bonus test hooks into.

**Sources for the manager profiles:**
[Coaches' Voice — positional play / Guardiola](https://learning.coachesvoice.com/cv/positional-play-football-tactics-explained-guardiola-cruyff-manchester-city/) ·
[Sofascore — Mourinho's philosophy](https://www.sofascore.com/news/famous-football-managers-and-their-philosophies-jose-mourinho) ·
[Arsène Wenger — Wikipedia](https://en.wikipedia.org/wiki/Ars%C3%A8ne_Wenger) ·
[Fergie's Fledglings (Class of '92) — Wikipedia](https://en.wikipedia.org/wiki/Fergie%27s_Fledglings) ·
[CNN — Brentford's "Moneyball"](https://www.cnn.com/2023/03/10/football/brentford-moneyball-success-premier-league-spt-intl) ·
[Total Football Analysis — Thomas Frank's data-driven Tottenham](https://totalfootballanalysis.com/data-analysis/thomas-frank-tactics-tottenham-hotspur-2025-2026-data-analysis)

---

## AI-generated visuals

The page uses AI-generated imagery in two places:

**1. Hero stadium backdrop** — `assets/hero-stadium.svg`
- **Tool:** Claude (generated as hand-editable SVG code)
- **Prompt:** *"Design a stylised night-stadium hero illustration as clean SVG. Dark palette with
  emerald-green and gold accents. Floodlights casting light cones onto a pitch shown in
  perspective, subtle crowd speckle and stadium tiers. No text; flat-vector, no gradients heavier
  than needed."*

**2. The five manager portraits** — `assets/managers/`
- **Tool:** ChatGPT (image generation)
- Each manager was prompted as a stylised, dark-suited illustrated portrait, deliberately matching
  the game's painted character art style.
- *Honesty note:* these are AI-generated likenesses of real public figures, used here purely for a
  case study. A real launch would need proper image rights / clearance (or fictional managers).

The nav / footer / browser-tab logo is the game's **official app icon** (`assets/app-icon.jpg`),
taken from its store listing.

---

## Branding & aesthetic

To make the page feel like the real product rather than a generic template, the look was matched to
the **live game's store listing**: a green-dominant dark palette, gold primary buttons, and the
official app icon. The App Store and Google Play badges link to the game's real listings.

---

## Tech stack

- Plain **HTML + CSS + JavaScript** — no framework, no build step, no dependencies.
- Google Fonts (*Anton*, *Inter*) with system-font fallbacks.
- **Mobile-first** and fully responsive (verified at 375 / 390 / 768 / 1280 px).
- Accessibility: skip link, focus-visible styles, semantic landmarks, `prefers-reduced-motion`,
  and a keyboard-operable quiz.

```
legendary-club-owner/
├── index.html          # page markup
├── styles.css          # all styling (mobile-first)
├── quiz.js             # quiz logic + launch-list form handler
├── assets/
│   ├── app-icon.jpg      # official game app icon (logo, from the store listing)
│   ├── hero-stadium.svg  # AI-generated stadium hero backdrop (Claude)
│   └── managers/         # five manager portraits shown on the quiz results (ChatGPT)
├── tests/                # bonus: Playwright end-to-end test
└── README.md
```

## Run it locally

It's a static site, so any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Bonus — Playwright end-to-end test

A [Playwright](https://playwright.dev/python/) script ([`tests/test_quiz.py`](tests/test_quiz.py))
opens the page in a headless browser and verifies the quiz works end to end: it clicks through all
five questions, checks each step loads, confirms the progress bar advances, asserts the final
result appears (with the manager portrait actually loading), and checks the answer-to-manager
mapping plus the *Previous* / *Retake* controls and the email form.

```bash
pip install -r tests/requirements.txt
python -m playwright install chromium
python tests/test_quiz.py        # serves the site locally, runs 7 checks, exits 0/1
```

To run it against the deployed site instead:

```bash
BASE_URL=https://servanaris.github.io/legendary-club-owner/ python tests/test_quiz.py
```

Full details in [`tests/README.md`](tests/README.md). All 7 checks pass.
