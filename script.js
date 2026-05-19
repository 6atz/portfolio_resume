const typeTargets = document.querySelectorAll("[data-typewriter]");

typeTargets.forEach((target) => {
  const phrases = target.dataset.typewriter.split("|").filter(Boolean);
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrase = phrases[phraseIndex];
    target.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) {
      charIndex += 1;
      window.setTimeout(tick, 42);
      return;
    }

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      window.setTimeout(tick, 1400);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(tick, 24);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(tick, 240);
  };

  tick();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sectionsById = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${entry.target.id}`;
      link.classList.toggle("is-active", active);
      link.toggleAttribute("aria-current", active);
    });
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

sectionsById.forEach((section) => navObserver.observe(section));

document.querySelectorAll(".interactive-surface").forEach((surface) => {
  surface.addEventListener("pointermove", (event) => {
    const rect = surface.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    surface.style.setProperty("--card-x", `${x.toFixed(2)}%`);
    surface.style.setProperty("--card-y", `${y.toFixed(2)}%`);
  });
});

let pointerFrame = 0;
window.addEventListener("pointermove", (event) => {
  window.cancelAnimationFrame(pointerFrame);
  pointerFrame = window.requestAnimationFrame(() => {
    const x = `${((event.clientX / window.innerWidth) * 100).toFixed(2)}%`;
    const y = `${((event.clientY / window.innerHeight) * 100).toFixed(2)}%`;
    document.documentElement.style.setProperty("--pointer-x", x);
    document.documentElement.style.setProperty("--pointer-y", y);
  });
}, { passive: true });

const luxuryCanvas = document.querySelector(".luxury-canvas");
const motionOkay = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (luxuryCanvas && motionOkay) {
  const context = luxuryCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = 0;

  const resizeCanvas = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    luxuryCanvas.width = Math.floor(width * pixelRatio);
    luxuryCanvas.height = Math.floor(height * pixelRatio);
    luxuryCanvas.style.width = `${width}px`;
    luxuryCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const drawLuxuryLines = () => {
    frame += 0.006;
    context.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.45;
    const radius = Math.max(width, height) * 0.42;

    context.save();
    context.translate(centerX, centerY);
    context.rotate(frame * 0.12);

    for (let i = 0; i < 9; i += 1) {
      const arcRadius = radius * (0.28 + i * 0.075);
      const start = frame * (0.9 + i * 0.06) + i * 0.52;
      const end = start + Math.PI * (0.55 + i * 0.045);
      const alpha = 0.028 + i * 0.006;

      context.beginPath();
      context.arc(0, 0, arcRadius, start, end);
      context.strokeStyle = `rgba(255, 229, 157, ${alpha})`;
      context.lineWidth = 0.8;
      context.stroke();
    }

    context.restore();

    window.requestAnimationFrame(drawLuxuryLines);
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  drawLuxuryLines();
} else if (luxuryCanvas) {
  luxuryCanvas.remove();
}

const moodButtons = document.querySelectorAll("[data-mood-choice]");
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.mood = button.dataset.moodChoice;
    moodButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

const personaMessages = {
  systems: "I start by defining the core loop, then build the states, controls, and feedback around it.",
  interface: "I design screens so the player knows what to do next without needing extra explanation.",
  presentation: "I care about the final look: clean spacing, strong contrast, and visuals that make the work feel complete."
};

const personaOutput = document.querySelector("[data-persona-output]");
document.querySelectorAll("[data-persona]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-persona]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (personaOutput) {
      personaOutput.textContent = personaMessages[button.dataset.persona];
    }
  });
});

const galleryMain = document.querySelector("[data-gallery-main]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
document.querySelectorAll("[data-gallery-src]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-gallery-src]").forEach((item) => item.classList.toggle("is-active", item === button));

    if (galleryMain) {
      galleryMain.src = button.dataset.gallerySrc;
    }

    if (galleryCaption) {
      galleryCaption.textContent = button.dataset.galleryCaption;
    }
  });
});
