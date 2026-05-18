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
