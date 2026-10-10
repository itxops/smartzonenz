/* SmartZone — site interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var OPEN_HOUR = 9;   // 9am
  var CLOSE_HOUR = 17; // 5pm
  var TIMEZONE = "Pacific/Auckland";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Header shadow + mobile call bar ---------- */
  var header = document.querySelector(".site-header");
  var callBar = document.querySelector(".call-bar");
  var hero = document.querySelector(".hero");

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    if (callBar && hero) {
      var pastHero = y > hero.offsetHeight * 0.6;
      var nearBottom = window.innerHeight + y >= document.body.scrollHeight - 120;
      callBar.classList.toggle("is-visible", pastHero && !nearBottom);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ---------- Reveal on scroll (staggered within each group) ---------- */
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
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
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
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Live open / closed status (NZ time) ---------- */
  function nzHour() {
    try {
      var parts = new Intl.DateTimeFormat("en-NZ", {
        timeZone: TIMEZONE, hour: "numeric", minute: "numeric", hourCycle: "h23"
      }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) {
        if (p.type === "hour") h = parseInt(p.value, 10);
        if (p.type === "minute") m = parseInt(p.value, 10);
      });
      return h + m / 60;
    } catch (e) {
      return null;
    }
  }

  function updateOpenStatus() {
    var h = nzHour();
    if (h === null) return;
    var isOpen = h >= OPEN_HOUR && h < CLOSE_HOUR;
    var opensToday = h < OPEN_HOUR;

    var badge = document.querySelector(".status-badge");
    var badgeText = document.querySelector("[data-open-status]");
    var shortText = document.querySelector("[data-open-short]");
    var pill = document.querySelector("[data-open-pill]");

    if (badge && badgeText) {
      badge.classList.toggle("is-closed", !isOpen);
      badgeText.textContent = isOpen
        ? "Open Now · Same-Day Repairs"
        : (opensToday ? "Opens Today at 9am" : "Closed · Opens Tomorrow 9am");
    }
    if (shortText) {
      shortText.textContent = isOpen ? "Open Today Until 5pm" : "Open Daily 9am – 5pm";
    }
    if (pill) {
      pill.hidden = false;
      pill.textContent = isOpen ? "Open now" : "Closed now";
      pill.className = "open-pill " + (isOpen ? "is-open" : "is-closed");
    }
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
