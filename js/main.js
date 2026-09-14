/* ============================================================
   PasaDaya Showcase Site — main.js
   Pure vanilla JavaScript. No libraries.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme toggle (light/dark, persisted) ---------- */
  var root = document.documentElement;
  var storedTheme = null;
  try { storedTheme = localStorage.getItem("pasadaya-theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("pasadaya-theme", theme); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        setTheme(current);
      });
    }

    /* ---------- Mobile nav toggle ---------- */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navToggle.classList.toggle("open");
        navLinks.classList.toggle("open");
        var expanded = navToggle.classList.contains("open");
        navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
      navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          navToggle.classList.remove("open");
          navLinks.classList.remove("open");
        });
      });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- Back to top ---------- */
    var backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      window.addEventListener("scroll", function () {
        backToTop.classList.toggle("show", window.scrollY > 480);
      });
      backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---------- Animated stat counters ---------- */
    var counters = document.querySelectorAll(".stat-card .num[data-count]");
    if (counters.length) {
      var animateCounter = function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      };
      if ("IntersectionObserver" in window) {
        var counterIO = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterIO.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 }
        );
        counters.forEach(function (el) { counterIO.observe(el); });
      } else {
        counters.forEach(animateCounter);
      }
    }

    /* ---------- FAQ Accordion ---------- */
    document.querySelectorAll(".acc-item").forEach(function (item) {
      var trigger = item.querySelector(".acc-trigger");
      var panel = item.querySelector(".acc-panel");
      if (!trigger || !panel) return;
      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".acc-item.open").forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".acc-panel").style.maxHeight = null;
          }
        });
        if (isOpen) {
          item.classList.remove("open");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });

    /* ---------- Contact form validation (client-side only) ---------- */
    var form = document.querySelector("#contact-form");
    if (form) {
      var successBox = document.querySelector(".form-success");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll("[required]").forEach(function (input) {
          var field = input.closest(".field");
          var isEmail = input.type === "email";
          var value = input.value.trim();
          var ok = value.length > 0 && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
          field.classList.toggle("invalid", !ok);
          if (!ok) valid = false;
        });
        if (valid) {
          successBox.classList.add("show");
          form.reset();
          successBox.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(function () { successBox.classList.remove("show"); }, 6000);
        }
      });
      form.querySelectorAll("[required]").forEach(function (input) {
        input.addEventListener("input", function () {
          input.closest(".field").classList.remove("invalid");
        });
      });
    }
  });
})();
