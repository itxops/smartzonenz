/* ==========================================================================
   SmartZone — Site Engine & Interactive Features (Vanilla JS)
   ========================================================================== */
(function () {
  "use strict";

  var OPEN_HOUR = 9;   // 9am
  var CLOSE_HOUR = 17.5; // 5:30pm
  var TIMEZONE = "Pacific/Auckland";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn") || document.getElementById("mobileNavToggle");
  var menu = document.getElementById("mobile-menu") || document.getElementById("navLinks");

  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    menu.classList.toggle("mobile-open", open);
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var isOpen = menu.classList.contains("is-open") || menu.classList.contains("mobile-open");
      setMenu(!isOpen);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenu(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Header state, scroll progress, call bar, back-to-top ---------- */
  var header = document.querySelector(".site-header");
  var callBar = document.querySelector(".call-bar") || document.querySelector(".sticky-mobile-dock");
  var toTop = document.querySelector(".to-top");
  var progress = document.querySelector(".scroll-progress span");
  var hero = document.querySelector(".hero") || document.querySelector(".hero-section");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (progress) progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);

    var pastHero = hero ? y > hero.offsetHeight * 0.5 : y > 500;
    var nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 140;
    if (callBar) callBar.classList.toggle("is-visible", pastHero && !nearBottom);
    if (toTop) toTop.classList.toggle("is-visible", pastHero);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Subtle parallax ---------- */
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var parallaxTicking = false;

  function updateParallax() {
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
      var offset = (r.top + r.height / 2 - vh / 2) * speed;
      el.style.translate = "0 " + Math.max(-60, Math.min(60, offset)).toFixed(1) + "px";
    });
    parallaxTicking = false;
  }
  if (parallaxEls.length) {
    window.addEventListener("scroll", function () {
      if (!parallaxTicking) { parallaxTicking = true; requestAnimationFrame(updateParallax); }
    }, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
  }

  /* ---------- Hero phone: cracked → diagnosed → scanning → ready → fixed ---------- */
  var screen = document.querySelector(".device-screen");
  if (screen) {
    var STAGES = [1600, 1400, 2600, 1100, 3500]; // ms spent in stages 0–4
    var stage = 0;

    var setStage = function (n) {
      stage = n;
      for (var i = 1; i <= 4; i++) screen.classList.toggle("is-s" + i, n >= i);
      screen.classList.toggle("is-stage-2", n === 2);
    };

    if (reduceMotion) {
      setStage(4);
    } else {
      var tick = function () {
        setTimeout(function () {
          setStage((stage + 1) % STAGES.length);
          tick();
        }, STAGES[stage]);
      };
      setStage(0);
      tick();
    }

    var timeEl = screen.querySelector("[data-nz-time]");
    var updateTime = function () {
      try {
        timeEl.textContent = new Intl.DateTimeFormat("en-NZ", {
          timeZone: TIMEZONE, hour: "numeric", minute: "2-digit", hour12: false
        }).format(new Date());
      } catch (e) { /* keep default */ }
    };
    if (timeEl) { updateTime(); setInterval(updateTime, 30 * 1000); }
  }

  /* ---------- Cursor spotlight on cards ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-spotlight]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll(".nav a[href^='#']");
  if ("IntersectionObserver" in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -50% 0px" });

    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.hasAttribute("data-reveal");
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty("--d", Math.min(index, 6) * 90 + "ms");
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("is-visible");
          revealObserver.unobserve(el);
          var delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
          setTimeout(function () {
            el.removeAttribute("data-reveal");
            el.classList.remove("is-visible");
            el.style.removeProperty("--d");
          }, 950 + delay);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-NZ");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Live open / closed status (NZ time) ---------- */
  function updateOpenStatus() {
    try {
      var now = new Date();
      var nzDate = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
      var day = nzDate.getDay();
      var h = nzDate.getHours() + nzDate.getMinutes() / 60;

      var isOpen = false;
      if (day >= 1 && day <= 5) {
        isOpen = h >= 9.0 && h < 17.5;
      } else if (day === 6) {
        isOpen = h >= 9.5 && h < 16.5;
      } else {
        isOpen = h >= 10.0 && h < 15.0;
      }

      var badgeText = document.querySelector("[data-open-status]");
      var pill = document.querySelector(".status-pill");

      if (badgeText) {
        badgeText.textContent = isOpen
          ? "Open Today · Same-Day Service"
          : "Closed Now · Opens Daily 9am";
      }

      if (pill) {
        var textSpan = pill.querySelector("span:not(.pulse-dot)");
        var dot = pill.querySelector(".pulse-dot");
        if (textSpan) textSpan.textContent = isOpen ? "Open Today" : "Closed Now";
        if (dot) dot.style.background = isOpen ? "#10b981" : "#f59e0b";
      }
    } catch (e) {}
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);

  /* ---------- FAQ Accordion: allow one open at a time ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.removeAttribute("open");
        });
      }
    });
  });

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
