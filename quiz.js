/* =========================================================
   "What kind of manager are you?" — quiz interactive element
   Vanilla JS, no dependencies. Stable data-testid hooks for
   automated testing (Playwright bonus).
   ========================================================= */
(function () {
  "use strict";

  // --- Results: four legendary managers, mapped to the game's pillars.
  // Profiles grounded in each manager's documented philosophy (see README). ---
  var TYPES = {
    G: {
      emoji: "🧠",
      img: "assets/managers/guardiola.jpg",
      title: "Pep Guardiola",
      tagline: "The Perfectionist — control the ball, and the ball controls the game.",
      desc: "Possession isn't a tactic for you, it's control. You build patiently from the back, occupy every zone to create overloads, and suffocate opponents with the ball — then win it back within seconds of losing it.",
      tip: "In Legendary Club Owner, live in the tactics screen: perfect your formation and in-match tweaks. Dominate the midfield and the result takes care of itself.",
      rarity: "Guardiola",
    },
    W: {
      emoji: "🎓",
      img: "assets/managers/wenger.jpg",
      title: "Arsène Wenger",
      tagline: "Le Professeur — you see the player nobody else sees, then build him.",
      desc: "A visionary recruiter and developer. You'd rather unearth an unknown teenager from anywhere on earth and turn him into a star than overpay for a finished name — and your technical, attacking football is the stage that lets young talent shine.",
      tip: "Build your scouting network early and collect undervalued player cards. Develop them, and your squad value — and your results — climb together.",
      rarity: "Wenger",
    },
    F: {
      emoji: "👑",
      img: "assets/managers/ferguson.jpg",
      title: "Sir Alex Ferguson",
      tagline: "The Empire-Builder — you don't win a season, you build a dynasty.",
      desc: "The ultimate long-term builder. You win with culture, mentality and a never-say-die spirit: promoting academy kids, managing egos with praise and the hairdryer alike, and quietly rebuilding your squad year after year so the trophies never stop.",
      tip: "Invest in infrastructure, youth and squad depth. Build a club that compounds — small edges every season turn into a decade of silverware.",
      rarity: "Ferguson",
    },
    M: {
      emoji: "🛡️",
      img: "assets/managers/mourinho.jpg",
      title: "José Mourinho",
      tagline: "The Special One — win first, entertain second.",
      desc: "The arch-pragmatist. Rock-solid organisation, ruthless game management and lightning counter-attacks — you neutralise the opposition's strengths, punish their weaknesses, and get under their skin before kickoff. Style is optional; silverware is not.",
      tip: "Set up to grind out results and attack the leaderboard. Every rank pays real rewards — and you're built to win the games that decide a season.",
      rarity: "Mourinho",
    },
    D: {
      emoji: "📊",
      img: "assets/managers/frank.jpg",
      title: "Thomas Frank",
      tagline: "The Moneyball Mind — you beat the giants with smarter numbers.",
      desc: "Football's great overachiever. You sift thousands of players for the undervalued gems the models love, act on live in-game data, and squeeze every drop from your budget — out-thinking richer, more glamorous clubs with sharper analytics and ruthless set-pieces.",
      tip: "Lean into Legendary Club Owner's real-data engine: read the match stats, sign undervalued players with elite underlying numbers, and let the data pick your tactics and lineup.",
      rarity: "Frank",
    },
  };

  // --- Questions: each option reflects one manager's real approach ---
  var QUESTIONS = [
    {
      q: "It's matchday. What's the first thing you do?",
      a: [
        { t: "Study the opposition's danger men and plan how to shut them down", k: "M" },
        { t: "Make sure we're set up to dominate the ball and dictate the tempo", k: "G" },
        { t: "Dig into the numbers to find where we can exploit them", k: "D" },
        { t: "Check which young players are ready to step up and express themselves", k: "W" },
        { t: "Get the squad's mentality right — this is a battle, and spirit wins battles", k: "F" },
      ],
    },
    {
      q: "One signing left in the window. You go for…",
      a: [
        { t: "A flawless technical midfielder who keeps the ball ticking", k: "G" },
        { t: "An undervalued player whose numbers beat his reputation", k: "D" },
        { t: "An unknown teenager from abroad with sky-high potential", k: "W" },
        { t: "A strong character who'll buy into the culture for years", k: "F" },
        { t: "A proven, ready-made winner who delivers from day one", k: "M" },
      ],
    },
    {
      q: "You're 1–0 down with twenty minutes to go. You…",
      a: [
        { t: "Stay compact and disciplined, then kill them on the counter", k: "M" },
        { t: "Throw on the academy kids and chase it to the last whistle", k: "F" },
        { t: "Make a calculated change based on how the game's actually going", k: "D" },
        { t: "Keep the ball, shift them side to side until the gap opens", k: "G" },
        { t: "Back my brave, attacking football to turn it around", k: "W" },
      ],
    },
    {
      q: "Your idea of the perfect season?",
      a: [
        { t: "Blooding young talent — and selling a player for ten times his price", k: "W" },
        { t: "Building a dynasty that keeps winning for a decade", k: "F" },
        { t: "Winning while playing the most beautiful, controlled football around", k: "G" },
        { t: "Overachieving — finishing far higher than the budget says you should", k: "D" },
        { t: "Trophies in the cabinet — however they have to be won", k: "M" },
      ],
    },
    {
      q: "Pick your management mantra:",
      a: [
        { t: "Build the culture, and the winning follows.", k: "F" },
        { t: "Win first, entertain second.", k: "M" },
        { t: "Trust the numbers over the noise.", k: "D" },
        { t: "Find the talent others miss — then make it world-class.", k: "W" },
        { t: "Control the ball, control the game.", k: "G" },
      ],
    },
  ];

  var PRIORITY = ["G", "W", "F", "M", "D"]; // tie-break order

  // --- State ---
  var current = 0;
  var answers = []; // archetype key per question

  // --- Elements ---
  var root = document.querySelector('[data-testid="quiz"]');
  if (!root) return;

  var screens = {
    intro: root.querySelector('[data-screen="intro"]'),
    question: root.querySelector('[data-screen="question"]'),
    result: root.querySelector('[data-screen="result"]'),
  };
  var bar = root.querySelector('[data-testid="quiz-progress-bar"]');
  var countEl = root.querySelector('[data-testid="quiz-count"]');
  var questionEl = root.querySelector('[data-testid="quiz-question-text"]');
  var optionsEl = root.querySelector('[data-testid="quiz-options"]');
  var backBtn = root.querySelector('[data-action="back"]');

  function show(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].hidden = key !== name;
    });
  }

  function renderQuestion() {
    var item = QUESTIONS[current];
    var total = QUESTIONS.length;
    bar.style.width = ((current + 1) / total) * 100 + "%";
    countEl.textContent = "Question " + (current + 1) + " of " + total;
    questionEl.textContent = item.q;
    backBtn.hidden = current === 0;

    optionsEl.innerHTML = "";
    item.a.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz__option";
      btn.setAttribute("data-testid", "quiz-option");
      btn.setAttribute("data-key", opt.k);
      if (answers[current] === opt.k) btn.setAttribute("aria-pressed", "true");

      var key = document.createElement("span");
      key.className = "quiz__option-key";
      key.setAttribute("aria-hidden", "true");
      key.textContent = String.fromCharCode(65 + i); // A, B, C, D

      var label = document.createElement("span");
      label.textContent = opt.t;

      btn.appendChild(key);
      btn.appendChild(label);
      btn.addEventListener("click", function () {
        answers[current] = opt.k;
        next();
      });
      optionsEl.appendChild(btn);
    });

    // focus first option for keyboard users
    var first = optionsEl.querySelector(".quiz__option");
    if (first) first.focus();
  }

  function next() {
    if (current < QUESTIONS.length - 1) {
      current++;
      renderQuestion();
    } else {
      renderResult();
    }
  }

  function back() {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  }

  function tally() {
    var counts = { G: 0, W: 0, F: 0, M: 0, D: 0 };
    answers.forEach(function (k) {
      if (counts[k] != null) counts[k]++;
    });
    var winner = PRIORITY[0];
    PRIORITY.forEach(function (k) {
      if (counts[k] > counts[winner]) winner = k;
    });
    return winner;
  }

  function renderResult() {
    var type = TYPES[tally()];
    var photo = root.querySelector('[data-testid="result-photo"]');
    photo.src = type.img;
    photo.alt = type.title;
    root.querySelector('[data-testid="result-title"]').textContent = type.title;
    root.querySelector('[data-testid="result-tagline"]').textContent = type.tagline;
    root.querySelector('[data-testid="result-desc"]').textContent = type.desc;
    root.querySelector('[data-testid="result-tip"]').textContent = type.tip;
    root.querySelector('[data-testid="result-rarity"]').textContent = type.rarity;
    show("result");
    // keep the section in view on small screens
    screens.result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function start() {
    current = 0;
    answers = [];
    show("question");
    renderQuestion();
  }

  function restart() {
    current = 0;
    answers = [];
    show("intro");
  }

  // --- Wire up controls ---
  root.querySelector('[data-action="start"]').addEventListener("click", start);
  root.querySelector('[data-action="restart"]').addEventListener("click", restart);
  backBtn.addEventListener("click", back);

  // ---------------------------------------------------------
  // Launch-list form: lightweight client-side validation only
  // ---------------------------------------------------------
  var form = document.querySelector('[data-testid="cta-form"]');
  if (form) {
    var note = document.querySelector('[data-testid="cta-note"]');
    var input = form.querySelector('input[type="email"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      note.classList.remove("cta__note--ok", "cta__note--err");
      if (ok) {
        note.textContent = "You're on the list, boss. We'll ping you at launch. ⚽";
        note.classList.add("cta__note--ok");
        form.reset();
      } else {
        note.textContent = "Hmm, that email doesn't look right — give it another go.";
        note.classList.add("cta__note--err");
        input.focus();
      }
    });
  }
})();
