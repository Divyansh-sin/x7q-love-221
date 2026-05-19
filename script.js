/* ═══════════════════════════════════════════
   QUIZ DATA
═══════════════════════════════════════════ */
const QUESTIONS = [
  {
    text: "1. How many siblings do I have?",
    options: ["1", "100", "1000", "None"],
    correct: 0,
    image: null
  },
  {
    text: "2. What's my surname?",
    options: ["Skywalker", "Kenobi", "Singh", "Agarwal"],
    correct: 2,
    image: null
  },
  {
    text: "3. When is my birthday?",
    options: ["23 Jan", "24 Jan", "23 Dec", "30 Feb"],
    correct: 0,
    image: null
  },
  {
    text: "4. Solve this 😈",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: -1, // any answer is correct
    image: "images/math.jpg"
  }
];

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
let currentQ = 0;
let locked   = false;

/* ═══════════════════════════════════════════
   SCREEN MANAGEMENT
═══════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    if (s.id === id) {
      s.classList.remove('exit');
      s.classList.add('active');
    } else if (s.classList.contains('active')) {
      s.classList.add('exit');
      setTimeout(() => s.classList.remove('active', 'exit'), 450);
    }
  });
}

/* ═══════════════════════════════════════════
   BACKGROUND DECORATION
═══════════════════════════════════════════ */
function initDecorations() {
  // Petals
  const petalBg = document.getElementById('petalBg');
  const sizes   = [18, 24, 30, 20, 16, 26, 22, 28];
  const colors  = ['#f4a7c0', '#f9c6d8', '#fce4f0', '#e87da8'];
  for (let i = 0; i < 14; i++) {
    const p  = document.createElement('div');
    const sz = sizes[i % sizes.length];
    p.className = 'petal';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${sz}px;
      height: ${sz * 0.8}px;
      background: radial-gradient(circle at 40% 40%, ${colors[i % colors.length]}, ${colors[(i+1) % colors.length]});
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${-Math.random() * 12}s;
    `;
    petalBg.appendChild(p);
  }

  // Hearts
  const hc     = document.getElementById('heartsContainer');
  const hearts = ['🤸🏻'];
  for (let i = 0; i < 10; i++) {
    const h = document.createElement('div');
    h.className = 'heart-float';
    h.textContent = hearts[i % hearts.length];
    h.style.cssText = `
      left: ${5 + Math.random() * 90}%;
      font-size: ${10 + Math.random() * 10}px;
      animation-duration: ${10 + Math.random() * 14}s;
      animation-delay: ${-Math.random() * 14}s;
    `;
    hc.appendChild(h);
  }
}

/* ═══════════════════════════════════════════
   START
═══════════════════════════════════════════ */
function startQuiz() {
  currentQ = 0;
  locked   = false;
  showScreen('quizScreen');
  renderQuestion();
}

/* ═══════════════════════════════════════════
   RENDER QUESTION
═══════════════════════════════════════════ */
function renderQuestion() {
  const q      = QUESTIONS[currentQ];
  const card   = document.getElementById('questionCard');
  const img    = document.getElementById('questionImg');
  const grid   = document.getElementById('optionsGrid');
  const pBar   = document.getElementById('progressBar');
  const pLabel = document.getElementById('progressLabel');
  locked = false;

  // Animate card in
  card.style.animation = 'none';
  void card.offsetWidth; // reflow
  card.style.animation = '';

  document.getElementById('questionText').textContent = q.text;

  // Progress
  pBar.style.width = `${((currentQ) / QUESTIONS.length) * 100}%`;
  pLabel.textContent = `${currentQ + 1} / ${QUESTIONS.length}`;

  // Image
  if (q.image) {
    img.src = q.image;
    img.classList.add('visible');
  } else {
    img.classList.remove('visible');
    img.src = '';
  }

  // Options
  grid.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', (e) => handleAnswer(e, i, btn));
    grid.appendChild(btn);
  });
}

/* ═══════════════════════════════════════════
   HANDLE ANSWER
═══════════════════════════════════════════ */
function handleAnswer(event, index, btn) {
  if (locked) return;
  locked = true;

  const q = QUESTIONS[currentQ];
  const isCorrect = q.correct === -1 || index === q.correct;

  if (isCorrect) {
    btn.classList.add('correct');
    triggerConfetti(event, btn);
    showCookiePopup();

    setTimeout(() => {
      hideCookiePopup();
      if (currentQ + 1 < QUESTIONS.length) {
        currentQ++;
        renderQuestion();
      } else {
        // All done — go to countdown
        showScreen('countdownScreen');
        startCountdown();
      }
    }, 2200);
  } else {
    btn.classList.add('wrong');
    showWrongPopup();

    setTimeout(() => {
      hideWrongPopup();
      // Reset quiz to start
      setTimeout(() => {
        showScreen('startScreen');
      }, 350);
    }, 1600);
  }
}

/* ═══════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════ */
function triggerConfetti(event, btn) {
  const rect = btn.getBoundingClientRect();
  const x    = (rect.left + rect.width / 2) / window.innerWidth;
  const y    = (rect.top  + rect.height / 2) / window.innerHeight;

  // First burst
  confetti({
    particleCount: 70,
    spread: 80,
    origin: { x, y },
    colors: ['#f4a7c0', '#e87da8', '#d4568a', '#fce4f0', '#c0446c', '#ffd6e7', '#fff'],
    startVelocity: 40,
    gravity: 0.9,
    scalar: 0.9,
    ticks: 160
  });

  // Second burst — more spread
  setTimeout(() => {
    confetti({
      particleCount: 45,
      spread: 120,
      origin: { x, y: y + 0.05 },
      colors: ['#f9c6d8', '#fde8ef', '#e87da8', '#c0446c'],
      startVelocity: 28,
      gravity: 1.1,
      scalar: 0.75,
      ticks: 130
    });
  }, 120);

  // Stars side burst
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#fff', '#fde8ef', '#f4a7c0'],
      startVelocity: 55,
      gravity: 0.7,
      shapes: ['star'],
      scalar: 1.1,
      ticks: 180
    });
  }, 200);
}

/* ═══════════════════════════════════════════
   WRONG POPUP
═══════════════════════════════════════════ */
function showWrongPopup() {
  const p = document.getElementById('wrongPopup');
  p.classList.add('show');
}
function hideWrongPopup() {
  document.getElementById('wrongPopup').classList.remove('show');
}

/* ═══════════════════════════════════════════
   COOKIE POPUP
═══════════════════════════════════════════ */
function showCookiePopup() {
  document.getElementById('cookiePopup').classList.add('show');
}
function hideCookiePopup() {
  document.getElementById('cookiePopup').classList.remove('show');
}

/* ═══════════════════════════════════════════
   COUNTDOWN 3…2…1
═══════════════════════════════════════════ */
function startCountdown() {
  const el = document.getElementById('countdownNumber');
  let count = 3;

  function tick() {
    el.textContent = count;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'countPulse 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both';

    if (count > 1) {
      count--;
      setTimeout(tick, 950);
    } else {
      setTimeout(() => {
        showScreen('obiwanScreen');
      }, 900);
    }
  }

  setTimeout(tick, 200);
}

/* ═══════════════════════════════════════════
   OBI-WAN → TROLL
═══════════════════════════════════════════ */
function goToTroll() {
  showScreen('trollScreen');
  startTrollTimer();
}

/* ═══════════════════════════════════════════
   TROLL TIMER 10…0
═══════════════════════════════════════════ */
function startTrollTimer() {
  const el  = document.getElementById('timerCount');
  let count = 5;

  function tick() {
    el.style.transform = 'scale(0.6)';
    el.style.opacity   = '0';

    setTimeout(() => {
      el.textContent     = count;
      el.style.transform = 'scale(1)';
      el.style.opacity   = '1';
    }, 180);

    if (count > 0) {
      count--;
      setTimeout(tick, 1000);
    } else {
      setTimeout(() => {
        showFinalScreen();
      }, 600);
    }
  }

  tick();
}

/* ═══════════════════════════════════════════
   FINAL SCREEN
═══════════════════════════════════════════ */
function showFinalScreen() {
  showScreen('finalScreen');

  // Fade in background image
  setTimeout(() => {
    const bgImg = document.querySelector('.final-bg-img');
    if (bgImg) bgImg.classList.add('visible');
  }, 300);

   // Show hearts immediately
  setTimeout(() => {

    document
      .querySelector('.final-hearts')
      .classList.add('visible');

    finalCelebration();

  }, 600);
}

/* ═══════════════════════════════════════════
   FINAL CELEBRATION CONFETTI
═══════════════════════════════════════════ */
function finalCelebration() {
  const colors = ['#f4a7c0', '#e87da8', '#d4568a', '#fce4f0', '#c0446c', '#ffd6e7', '#fff', '#fde8ef'];

  // Left cannon
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.65 },
    colors,
    startVelocity: 45,
    gravity: 0.85,
    ticks: 220
  });

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      startVelocity: 45,
      gravity: 0.85,
      ticks: 220
    });
  }, 200);

  // Center shower
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.5, y: 0.3 },
      colors,
      startVelocity: 30,
      gravity: 1,
      scalar: 0.85,
      ticks: 200
    });
  }, 500);
}

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initDecorations();

  // Prevent rubber-band scrolling on iOS
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) e.preventDefault();
  }, { passive: false });
});