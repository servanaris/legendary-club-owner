# Submission — Legendary Club Owner landing page

> Copy the relevant parts of this into your submission email.

**Live URL:** _add your deployed URL_
**GitHub repo:** _add your repo URL_

---

## 2-sentence hook (for the email body)

> You've spent years shouting at the manager — now you *are* the manager: build your club and
> out-think real opponents every week. Skill decides everything, the prize money is real, and
> the biggest wallet wins nothing.

*Alternative:*

> Most football games reward your wallet — this one rewards your brain. Build a club, outsmart
> real managers every week, and earn real cash for climbing the table: no luck, no pay-to-win,
> just you.

---

## Process note (for the email body)

I used **Claude (Claude Code)** as my main tool — to shape the messaging for the persona, hand-code
a dependency-free HTML/CSS/JS landing page, and generate the on-page visuals (the club crest and
the night-stadium hero) as editable SVG; the page deploys as a static site to Netlify with zero
config. AI was strongest at speed and breadth — drafting persona-led copy, building a polished
responsive layout, and turning the quiz scoring into clean code — but it needed steering on taste
and positioning: I leaned it away from generic "play now" hype toward the game's real edge
(*skill, not luck; real cash; no pay-to-win*), since that's what actually differentiates it for
someone like Alex. I chose the **"What kind of manager are you?" quiz** because it's the most
scroll-stopping and shareable option for a casual fan, and I mapped its results to five real,
recognisable managers — **Guardiola, Wenger, Ferguson, Mourinho and the data-driven Thomas Frank**
(all Premier League names, for a London audience) — using their documented real-world philosophies
(researched across sources cited in the README) so each outcome feels credible and worth sharing,
while doubling as a 60-second tour of the game's core loop (the Frank result also nods to the
game's real-match-data engine). To make the page feel like the real product, I studied the live
game's store listing and matched its look — a green-dominant dark palette, gold buttons, a metallic
wordmark, the studio's rival-managers key art, and an original FUT-style player card — alongside
working App Store and Google Play links. I also did the bonus: a **Playwright
script** (`tests/test_quiz.py`) that drives the quiz end-to-end in a headless browser (all 5
questions, progress bar, result + portrait load, answer→manager mapping, Previous/Retake, email
form) and passes 7/7. With more time I'd add real in-game screenshots, A/B-test the hook, and wire
the quiz result + email capture to an analytics/waitlist backend to measure which manager type
converts best.
