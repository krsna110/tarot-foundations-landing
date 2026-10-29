/**
 * Tarot Foundations Journey — Pure Vanilla JavaScript
 * Zero dependencies, ultra-lightweight, 60fps animations.
 * ponytail: Native Canvas 2D + CSS Transforms replace 90+ npm packages (~50MB+ bundle savings).
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Ambient Twinkling Starfield with Meteors & Interactive Stardust Trail
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

/* ================= 1. Ambient Starfield, Meteors & Stardust ================= */
function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let meteors = [];
  let stardust = [];
  let nextMeteorTime = performance.now() + 1500;
  let lastSparkleTime = 0;
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
      alpha: 0.25 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.3,
      gold: Math.random() < 0.65,
    }));
  }

  function spawnMeteor(now) {
    const startX = Math.random() * (w * 0.85);
    const startY = Math.random() * (h * 0.35);
    const length = 90 + Math.random() * 90;
    const speed = 7 + Math.random() * 5;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // ~45 deg diagonal

    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length,
      alpha: 1,
      decay: 0.016,
    });

    nextMeteorTime = now + 3200 + Math.random() * 4500;
  }

  function addStardust(x, y) {
    if (stardust.length > 35) return; // ponytail: cap stardust to 35 for 60fps efficiency
    const count = Math.random() < 0.6 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      stardust.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -0.6 - Math.random() * 1.2,
        r: 0.8 + Math.random() * 1.4,
        alpha: 0.85,
        decay: 0.025 + Math.random() * 0.02,
        gold: Math.random() < 0.75,
      });
    }
  }

  window.addEventListener("pointermove", (e) => {
    if (reducedMotion) return;
    const now = performance.now();
    if (now - lastSparkleTime > 40) {
      addStardust(e.clientX, e.clientY);
      lastSparkleTime = now;
    }
  }, { passive: true });

  function drawFrame(now, timeSec) {
    ctx.clearRect(0, 0, w, h);

    // 1. Twinkling Stars
    for (const s of stars) {
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(timeSec * s.speed + s.phase));
      ctx.globalAlpha = s.alpha * tw;
      ctx.fillStyle = s.gold ? "#e3c47c" : "#cbb6e4";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (reducedMotion) return;

    // 2. Shooting Stars (Meteors)
    if (now > nextMeteorTime) {
      spawnMeteor(now);
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.alpha -= m.decay;

      if (m.alpha <= 0 || m.x > w + 100 || m.y > h + 100) {
        meteors.splice(i, 1);
        continue;
      }

      const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
      const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 248, 220, ${m.alpha})`);
      grad.addColorStop(0.3, `rgba(227, 196, 124, ${m.alpha * 0.8})`);
      grad.addColorStop(1, `rgba(138, 77, 230, 0)`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      // Glowing head
      ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Interactive Stardust Sparkles
    for (let i = stardust.length - 1; i >= 0; i--) {
      const p = stardust[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        stardust.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.gold ? "#f6e3ae" : "#e0cfff";
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.gold ? "#e3c47c" : "#9c7330";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.globalAlpha = 1;
  }

  resize();
  if (reducedMotion) {
    drawFrame(0, 0);
  } else {
    const startTime = performance.now();
    function loop(now) {
      drawFrame(now, (now - startTime) / 1000);
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    resize();
    if (reducedMotion) drawFrame(0, 0);
  }, { passive: true });
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
    tiltEl.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    tiltEl.style.setProperty("--rx", `${(py - 0.5) * -14}deg`);
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
  const cardWrappers = document.querySelectorAll(".sample-persp");
  if (!shuffleBtn || !cardFlips.length) return;

  let isRevealed = false;

  // Global reveal/shuffle button
  shuffleBtn.addEventListener("click", () => {
    isRevealed = !isRevealed;
    cardFlips.forEach((card, idx) => {
      setTimeout(() => {
        if (isRevealed) {
          card.classList.add("is-revealed");
        } else {
          card.classList.remove("is-revealed");
        }
      }, idx * 120);
    });
    shuffleBtn.textContent = isRevealed ? "Dobara shuffle karo" : "Cards reveal karo ✦";
  });

  // Individual tap-to-flip for tactile fun
  cardWrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", () => {
      const flip = wrapper.querySelector(".sample-flip");
      if (flip) {
        flip.classList.toggle("is-revealed");
      }
    });
  });
}

/* ================= 5. Scroll Reveal Observer ================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("reveal-visible", "active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible", "active");
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
    if (window.scrollY > 480) {
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
  // ponytail: Native details 'name' attribute handles single-open in modern browsers; native event listener handles older browsers.
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
