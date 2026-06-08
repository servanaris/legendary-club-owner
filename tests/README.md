# Bonus — Playwright end-to-end test

A [Playwright](https://playwright.dev/python/) script that opens the landing page in a real
(headless) Chromium browser and automatically verifies the interactive element — the
**"What kind of manager are you?" quiz** — works from start to finish.

It's written with **Playwright for Python** (this repo has no Node toolchain; Python keeps it
dependency-light and runs anywhere Python does).

## What it checks (`test_quiz.py`)

| Check | What it proves |
| --- | --- |
| `test_page_loads` | The page loads and the quiz is present |
| `test_full_walkthrough` | Clicks through **all 5 questions**, then confirms a result appears — title, **portrait image actually loads**, tagline, description, tip and CTA |
| `test_progress_bar_advances` | The progress bar grows **20% → 40% → 60% → 80% → 100%** |
| `test_deterministic_results` | Answering all-one-style returns the right manager (e.g. all "control" answers → **Pep Guardiola**; all data answers → **Thomas Frank**) |
| `test_previous_button` | The **← Previous** control steps back a question |
| `test_retake_resets` | **Retake quiz** returns to the intro screen |
| `test_email_form` | The launch-list email field rejects a bad address and accepts a valid one |

The script finds elements via stable `data-testid` hooks baked into the page, so it doesn't break
when copy or styling changes.

## Run it

From the project root:

```bash
# 1. install Playwright + the Chromium browser (one-time)
pip install -r tests/requirements.txt
python -m playwright install chromium

# 2. run the checks
python tests/test_quiz.py
```

By default the script spins up a local static server, serves the site, runs the checks, and shuts
the server down — so the one command above is all you need.

### Test the live (deployed) site instead

```bash
BASE_URL=https://your-site.netlify.app python tests/test_quiz.py
```

## Expected output

```
  ✓ test_page_loads
  ✓ test_full_walkthrough
  ✓ test_progress_bar_advances
  ✓ test_deterministic_results
  ✓ test_previous_button
  ✓ test_retake_resets
  ✓ test_email_form

7/7 checks passed.
All quiz interactions verified ✅
```

The script exits `0` on success and `1` if any check fails, so it drops straight into CI.
