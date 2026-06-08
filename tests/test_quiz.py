#!/usr/bin/env python3
"""
End-to-end Playwright check for the Legendary Club Owner landing page.

It opens the page, drives the "What kind of manager are you?" quiz the way a
real visitor would, and verifies the whole interactive flow works:

  • the page loads
  • the quiz starts, and all 5 questions render (text, 5 options, progress bar)
  • the progress bar advances 20% → 100%
  • a result appears with a title, manager portrait (image actually loads),
    tagline, description and tip
  • answers map to the right manager (deterministic scoring)
  • the "Previous" and "Retake quiz" controls work
  • the launch-list email form validates input

By default it serves the project locally and tests that. Point it at a
deployed URL with the BASE_URL env var.

Run:
    python3 tests/test_quiz.py
    BASE_URL=https://your-site.netlify.app python3 tests/test_quiz.py
"""

import functools
import http.server
import os
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent  # project root (contains index.html)
TIMEOUT = 8000  # ms


# --------------------------------------------------------------------------- #
# Tiny static file server (only used when BASE_URL is not provided)
# --------------------------------------------------------------------------- #
class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):  # keep test output clean
        pass


def start_static_server():
    handler = functools.partial(_QuietHandler, directory=str(ROOT))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)  # port 0 -> free port
    httpd.daemon_threads = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, f"http://127.0.0.1:{httpd.server_address[1]}"


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def open_page(page, base_url):
    page.goto(base_url, wait_until="domcontentloaded")


def start_quiz(page):
    page.get_by_test_id("quiz-start").click()


def answer_with(page, key):
    """Click the answer option mapped to a given manager key (G/W/F/M/D)."""
    page.locator(f'[data-testid="quiz-option"][data-key="{key}"]').first.click()


# --------------------------------------------------------------------------- #
# Tests
# --------------------------------------------------------------------------- #
def test_page_loads(page, base_url):
    open_page(page, base_url)
    expect(page).to_have_title("Legendary Club Owner — Run the club. Beat real managers. Get paid.")
    expect(page.get_by_test_id("quiz")).to_be_visible()
    expect(page.get_by_test_id("quiz-start")).to_be_visible()


def test_full_walkthrough(page, base_url):
    """Click through all 5 questions and confirm a complete result appears."""
    open_page(page, base_url)
    start_quiz(page)

    for q in range(1, 6):
        expect(page.get_by_test_id("quiz-question")).to_be_visible()
        expect(page.get_by_test_id("quiz-count")).to_have_text(f"Question {q} of 5")
        expect(page.get_by_test_id("quiz-question-text")).not_to_be_empty()
        # every question offers exactly 5 options (one per manager)
        expect(page.get_by_test_id("quiz-option")).to_have_count(5)
        page.get_by_test_id("quiz-option").first.click()

    # result screen
    result = page.get_by_test_id("quiz-result")
    expect(result).to_be_visible()
    expect(page.get_by_test_id("result-title")).not_to_be_empty()
    expect(page.get_by_test_id("result-tagline")).not_to_be_empty()
    expect(page.get_by_test_id("result-desc")).not_to_be_empty()
    expect(page.get_by_test_id("result-tip")).not_to_be_empty()
    expect(page.get_by_test_id("result-cta")).to_be_visible()

    # the manager portrait must actually load (not a broken image)
    page.wait_for_function(
        """() => {
            const img = document.querySelector('[data-testid="result-photo"]');
            return img && img.complete && img.naturalWidth > 0;
        }""",
        timeout=TIMEOUT,
    )


def test_progress_bar_advances(page, base_url):
    open_page(page, base_url)
    start_quiz(page)
    bar = page.get_by_test_id("quiz-progress-bar")
    for q in range(1, 6):
        width = bar.evaluate("el => el.style.width")
        assert width == f"{q * 20}%", f"expected {q*20}% on question {q}, got {width!r}"
        page.get_by_test_id("quiz-option").first.click()


def test_deterministic_results(page, base_url):
    """Answering all-one-style yields the matching real manager."""
    expected = {"G": "Pep Guardiola", "W": "Arsène Wenger", "F": "Sir Alex Ferguson",
                "M": "José Mourinho", "D": "Thomas Frank"}
    for key, name in expected.items():
        open_page(page, base_url)
        start_quiz(page)
        for _ in range(5):
            answer_with(page, key)
        expect(page.get_by_test_id("result-title")).to_have_text(name)


def test_previous_button(page, base_url):
    open_page(page, base_url)
    start_quiz(page)
    expect(page.get_by_test_id("quiz-count")).to_have_text("Question 1 of 5")
    page.get_by_test_id("quiz-option").first.click()          # -> Q2
    expect(page.get_by_test_id("quiz-count")).to_have_text("Question 2 of 5")
    page.locator('[data-action="back"]').click()              # <- back to Q1
    expect(page.get_by_test_id("quiz-count")).to_have_text("Question 1 of 5")


def test_retake_resets(page, base_url):
    open_page(page, base_url)
    start_quiz(page)
    for _ in range(5):
        answer_with(page, "G")
    expect(page.get_by_test_id("quiz-result")).to_be_visible()
    page.get_by_test_id("quiz-restart").click()
    expect(page.get_by_test_id("quiz-intro")).to_be_visible()


def test_email_form(page, base_url):
    open_page(page, base_url)
    form = page.get_by_test_id("cta-form")
    note = page.get_by_test_id("cta-note")

    form.locator('input[type="email"]').fill("not-an-email")
    form.locator('button[type="submit"]').click()
    expect(note).to_have_class("cta__note cta__note--err")

    form.locator('input[type="email"]').fill("alex@example.com")
    form.locator('button[type="submit"]').click()
    expect(note).to_have_class("cta__note cta__note--ok")


TESTS = [
    test_page_loads,
    test_full_walkthrough,
    test_progress_bar_advances,
    test_deterministic_results,
    test_previous_button,
    test_retake_resets,
    test_email_form,
]


# --------------------------------------------------------------------------- #
# Runner
# --------------------------------------------------------------------------- #
def main():
    base_url = os.environ.get("BASE_URL")
    httpd = None
    if base_url:
        print(f"→ Testing live URL: {base_url}\n")
    else:
        httpd, base_url = start_static_server()
        print(f"→ Serving {ROOT.name}/ locally at {base_url}\n")

    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 390, "height": 844})
        context.set_default_timeout(TIMEOUT)
        for test in TESTS:
            page = context.new_page()
            try:
                test(page, base_url)
                print(f"  ✓ {test.__name__}")
            except Exception as exc:  # noqa: BLE001 - report and continue
                first_line = str(exc).strip().splitlines()[0] if str(exc).strip() else exc.__class__.__name__
                print(f"  ✗ {test.__name__}\n      {first_line}")
                failures.append(test.__name__)
            finally:
                page.close()
        browser.close()

    if httpd:
        httpd.shutdown()

    total = len(TESTS)
    print(f"\n{total - len(failures)}/{total} checks passed.")
    if failures:
        print("FAILED: " + ", ".join(failures))
        sys.exit(1)
    print("All quiz interactions verified ✅")


if __name__ == "__main__":
    main()
