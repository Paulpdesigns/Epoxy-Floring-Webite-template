/* ==========================================================================
   SLABWORKS — main.js
   Vanilla JS: scroll reveal, header state, mobile nav, counters,
   instant estimator, gallery filter, testimonial carousel, accordion.
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------- Footer year -------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- Sticky header state -------------------- */
  const header = document.getElementById("siteHeader");
  const toTopBtn = document.getElementById("toTop");
  function onScroll() {
    const scrolled = window.scrollY > 12;
    header && header.classList.toggle("is-scrolled", scrolled);
    toTopBtn && toTopBtn.classList.toggle("is-visible", window.scrollY > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTopBtn && toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* -------------------- Mobile nav toggle -------------------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.classList.toggle("is-active", isOpen);
    });
    mainNav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* -------------------- Scroll reveal -------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* -------------------- Animated counters -------------------- */
  const counters = document.querySelectorAll(".num[data-count]");
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    if (reduceMotion) {
      el.textContent = target.toLocaleString() + suffix;
    } else {
      requestAnimationFrame(tick);
    }
  }
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* -------------------- Instant estimator -------------------- */
  const estimatorForm = document.getElementById("estimatorForm");
  if (estimatorForm) {
    const pillGroups = estimatorForm.querySelectorAll(".pill-group");
    const sqmRange = document.getElementById("sqmRange");
    const sqmValue = document.getElementById("sqmValue");
    const sqmEcho = document.getElementById("estSqmEcho");
    const estLow = document.getElementById("estLow");
    const estHigh = document.getElementById("estHigh");
    const estFormMsg = document.getElementById("estFormMsg");

    const state = { rate: 38, systemMult: 1, conditionMult: 1, sqm: 2000 };

    pillGroups.forEach((group) => {
      const pills = group.querySelectorAll(".pill");
      pills.forEach((pill) => {
        pill.addEventListener("click", () => {
          pills.forEach((p) => p.classList.remove("is-active"));
          pill.classList.add("is-active");

          const groupName = group.getAttribute("data-group");
          if (groupName === "floorType") state.rate = parseFloat(pill.getAttribute("data-rate"));
          if (groupName === "system") state.systemMult = parseFloat(pill.getAttribute("data-mult"));
          if (groupName === "condition") state.conditionMult = parseFloat(pill.getAttribute("data-mult"));

          updateEstimate();
        });
      });
    });

    sqmRange.addEventListener("input", () => {
      state.sqm = parseInt(sqmRange.value, 10);
      sqmValue.textContent = state.sqm.toLocaleString();
      sqmEcho.textContent = state.sqm.toLocaleString();
      updateEstimate();
    });

    function formatMoney(n) {
      return "$" + Math.round(n).toLocaleString();
    }

    function updateEstimate() {
      const base = state.rate * state.systemMult * state.conditionMult * state.sqm;
      const low = base * 0.9;
      const high = base * 1.18;
      estLow.textContent = formatMoney(low);
      estHigh.textContent = formatMoney(high);
    }

    // init
    sqmValue.textContent = state.sqm.toLocaleString();
    sqmEcho.textContent = state.sqm.toLocaleString();
    updateEstimate();

    estimatorForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = estimatorForm.querySelectorAll(".est-contact input");
      let valid = true;
      inputs.forEach((input) => {
        if (!input.value.trim()) valid = false;
      });
      if (!valid) {
        estFormMsg.textContent = "Please fill in your name, email and phone so we can send the estimate.";
        estFormMsg.classList.remove("is-success");
        return;
      }
      estFormMsg.textContent = "Estimate sent! We'll follow up within one business day to confirm a firm quote.";
      estFormMsg.classList.add("is-success");
      estimatorForm.querySelector(".btn").textContent = "Sent ✓";
      inputs.forEach((input) => (input.disabled = true));
    });
  }

  /* -------------------- Gallery filter -------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");
      galleryItems.forEach((item) => {
        const match = filter === "all" || item.getAttribute("data-cat") === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* -------------------- Testimonial carousel -------------------- */
  const track = document.getElementById("testiTrack");
  const dotsWrap = document.getElementById("testiDots");
  if (track && dotsWrap) {
    const slides = track.children.length;
    let index = 0;
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("is-active");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    function goTo(i) {
      index = (i + slides) % slides;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      [...dotsWrap.children].forEach((d, di) => d.classList.toggle("is-active", di === index));
    }
    let autoplay = setInterval(() => goTo(index + 1), 6000);
    dotsWrap.addEventListener("mouseenter", () => clearInterval(autoplay));
    dotsWrap.addEventListener("mouseleave", () => (autoplay = setInterval(() => goTo(index + 1), 6000)));
  }

  /* -------------------- FAQ accordion -------------------- */
  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      accordionItems.forEach((i) => i.classList.remove("is-open"));
      if (!isOpen) item.classList.add("is-open");
    });
  });

  /* -------------------- Contact form (demo submit) -------------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector(".btn");
      btn.textContent = "Request Sent ✓";
      btn.style.background = "#1F8A44";
      contactForm.querySelectorAll("input, textarea").forEach((f) => (f.disabled = true));
    });
  }
})();
