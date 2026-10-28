/**
 * Tarot Foundations Journey — Pure Vanilla JavaScript
 * Zero dependencies, ultra-lightweight, 60fps animations.
 * ponytail: Native DOM & Canvas APIs replace 90+ npm packages (~50MB+ bundle savings).
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Ambient Starfield Canvas
  initStarfield();

  // 3. Hero Tarot Card 3D Tilt & Flip
  initHeroTarotCard();

  // 4. Tarot Fan System
  initTarotFan();

  // 5. Sample Reading Card Reveal
  initSampleReading();

  // 6. Scroll Reveal Observer
  initScrollReveal();

  // 7. Mobile Sticky CTA Bar
  initStickyCta();

  // 8. Single-Open FAQ Details Fallback
  initFaqAccordion();
});

/* ================= 1. Ambient Twinkling Starfield ================= */
function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let rafId = 0;
  let w = 0;
  let h = 0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(220, Math.round((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.3,
      alpha: 0.25 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
      gold: Math.random() < 0.65,
    }));
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
      ctx.globalAlpha = s.alpha * tw;
      ctx.fillStyle = s.gold ? "#e3c47c" : "#cbb6e4";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  resize();
  if (reducedMotion) {
    drawStars(0);
  } else {
    const startTime = performance.now();
    function loop(t) {
      drawStars((t - startTime) / 1000);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    resize();
    if (reducedMotion) drawStars(0);
  });
}

/* ================= 2. Hero Tarot Card 3D Tilt & Flip ================= */
function initHeroTarotCard() {
  const card = document.getElementById("heroTarotCard");
  if (!card) return;

  const tiltEl = card.querySelector(".hero-tilt");
  const canHover = window.matchMedia("(hover: hover)");

  card.addEventListener("pointermove", (e) => {
    if (!canHover.matches || !tiltEl) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    tiltEl.style.setProperty("--ry", `${(px - 0.5) * 16}deg`);
    tiltEl.style.setProperty("--rx", `${(py - 0.5) * -12}deg`);
    tiltEl.style.setProperty("--mx", `${px * 100}%`);
    tiltEl.style.setProperty("--my", `${py * 100}%`);
  });

  card.addEventListener("pointerleave", () => {
    if (!tiltEl) return;
    tiltEl.style.setProperty("--ry", "0deg");
    tiltEl.style.setProperty("--rx", "0deg");
  });

  function toggleFlip() {
    card.classList.toggle("is-flipped");
  }

  card.addEventListener("click", toggleFlip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  });
}

/* ================= 3. Tarot Fan System ================= */
function initTarotFan() {
  const fanButtons = document.querySelectorAll(".fan-card");
  fanButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isAlreadyActive = btn.classList.contains("is-active");
      fanButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      if (!isAlreadyActive) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      }
    });
  });
}

/* ================= 4. Sample Reading Reveal ================= */
function initSampleReading() {
  const shuffleBtn = document.getElementById("shuffleBtn");
  const cardFlips = document.querySelectorAll(".sample-flip");
  if (!shuffleBtn || !cardFlips.length) return;

  let isRevealed = false;

  shuffleBtn.addEventListener("click", () => {
    isRevealed = !isRevealed;
    cardFlips.forEach((card) => {
      if (isRevealed) {
        card.classList.add("is-revealed");
      } else {
        card.classList.remove("is-revealed");
      }
    });
    shuffleBtn.textContent = isRevealed ? "Dobara shuffle karo" : "Cards reveal karo";
  });
}

/* ================= 5. Scroll Reveal Observer ================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ================= 6. Mobile Sticky CTA Bar ================= */
function initStickyCta() {
  const stickyBar = document.getElementById("stickyCta");
  if (!stickyBar) return;

  function checkScroll() {
    if (window.scrollY > 500) {
      stickyBar.classList.add("is-visible");
    } else {
      stickyBar.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll();
}

/* ================= 7. FAQ Single-Open Fallback ================= */
function initFaqAccordion() {
  const faqs = document.querySelectorAll("details[name='faq']");
  // ponytail: Modern browsers support name='faq' on details. For older engines, native JS ensures only one stays open.
  faqs.forEach((faq) => {
    faq.addEventListener("toggle", () => {
      if (faq.open) {
        faqs.forEach((other) => {
          if (other !== faq && other.open) {
            other.removeAttribute("open");
          }
        });
      }
    });
  });
}
