// Interactions for the single-page home layout:
//  - Matrix-style email reveal on hover/focus
//  - Section reveal on scroll + active nav link tracking
//  - Section title sweep when navigating via anchors
//  - Open-state styling for abstract/bibtex toggle buttons
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------- */
  /* Email reveal                                                            */
  /* ---------------------------------------------------------------------- */

  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._-<>/\\|=+*#%&$";

  function randomGlyph() {
    return GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
  }

  function setupEmail(el) {
    var user = el.getAttribute("data-user");
    var domain = el.getAttribute("data-domain");
    if (!user || !domain) return;

    var real = user + "@" + domain;
    // What gets shown after the reveal: the human-readable, scraper-unfriendly form.
    var display = user + " at " + domain.replace(/\./g, " dot ");
    var masked = el.textContent.trim();
    var revealed = false;
    var raf = null;

    el.setAttribute("data-mask", masked);

    function render(target, progress) {
      // progress in [0, 1]: characters settle from left to right; the rest scramble.
      var out = "";
      var settled = Math.floor(progress * (target.length + 2));
      for (var i = 0; i < target.length; i++) {
        var ch = target.charAt(i);
        if (i < settled || ch === " ") {
          out += '<span class="c">' + escapeHtml(ch) + "</span>";
        } else {
          out += '<span class="c scr">' + escapeHtml(randomGlyph()) + "</span>";
        }
      }
      el.innerHTML = out;
    }

    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    var safety = null;

    function finish(target) {
      if (raf) cancelAnimationFrame(raf);
      if (safety) clearTimeout(safety);
      raf = null;
      safety = null;
      el.textContent = target;
    }

    function animateTo(target, duration) {
      if (raf) cancelAnimationFrame(raf);
      if (safety) clearTimeout(safety);
      if (reduceMotion) {
        finish(target);
        return;
      }
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        render(target, p);
        if (p < 1) {
          raf = requestAnimationFrame(step);
        } else {
          finish(target);
        }
      }
      raf = requestAnimationFrame(step);
      // Frames can be throttled (background tab, battery saver); always settle on the final text.
      safety = setTimeout(function () {
        finish(target);
      }, duration + 250);
    }

    function reveal() {
      if (revealed) return;
      revealed = true;
      el.classList.add("is-revealed");
      el.setAttribute("href", "mailto:" + real);
      animateTo(display, 900);
    }

    function conceal() {
      if (!revealed) return;
      revealed = false;
      el.classList.remove("is-revealed");
      el.setAttribute("href", "#");
      animateTo(masked, 600);
    }

    el.addEventListener("mouseenter", reveal);
    el.addEventListener("focus", reveal);
    el.addEventListener("mouseleave", conceal);
    el.addEventListener("blur", conceal);
    el.addEventListener("click", function (e) {
      // On touch devices there is no hover: first tap reveals, second tap opens the mail client.
      if (!revealed) {
        e.preventDefault();
        reveal();
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Section reveal + active nav                                             */
  /* ---------------------------------------------------------------------- */

  function setupReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (t) {
        t.classList.add("in-view");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach(function (t) {
      io.observe(t);
    });
  }

  function setupActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".site-links a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var sections = links
      .map(function (a) {
        return document.getElementById(a.getAttribute("href").slice(1));
      })
      .filter(Boolean);

    var current = null;
    function setActive(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
    }

    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting;
        });
        // The first visible section in document order wins.
        for (var i = 0; i < sections.length; i++) {
          if (visible[sections[i].id]) {
            setActive(sections[i].id);
            return;
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Title sweep on anchor navigation                                        */
  /* ---------------------------------------------------------------------- */

  function sweepTitle(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var title = target.matches(".section-title, .section-subtitle")
      ? target
      : target.querySelector(".section-title, .section-subtitle");
    if (!title) return;
    title.classList.remove("sweep");
    // Force reflow so the animation restarts when the same anchor is clicked twice.
    void title.offsetWidth;
    title.classList.add("sweep");
    setTimeout(function () {
      title.classList.remove("sweep");
    }, 1400);
  }

  function setupAnchorSweep() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href^='#']");
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (!id || !document.getElementById(id)) return;
      // Let the browser scroll (smooth via CSS), then sweep once it has started.
      setTimeout(function () {
        sweepTitle(id);
      }, 150);
    });
    window.addEventListener("hashchange", function () {
      sweepTitle(decodeURIComponent(location.hash.slice(1)));
    });
    if (location.hash) {
      setTimeout(function () {
        sweepTitle(decodeURIComponent(location.hash.slice(1)));
      }, 300);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Abstract / bibtex toggle button state                                   */
  /* ---------------------------------------------------------------------- */

  function setupToggleButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("a.abstract, a.bibtex");
      if (!btn) return;
      // common.js toggles the hidden panel synchronously; read its state after that handler ran.
      setTimeout(function () {
        var entry = btn.parentElement && btn.parentElement.parentElement;
        if (!entry) return;
        var cls = btn.classList.contains("abstract") ? ".abstract.hidden" : ".bibtex.hidden";
        var panel = entry.querySelector(cls);
        btn.classList.toggle("is-open", !!(panel && panel.classList.contains("open")));
        // Only one panel is open at a time, so clear the sibling button.
        entry.querySelectorAll("a.abstract, a.bibtex").forEach(function (other) {
          if (other !== btn) other.classList.remove("is-open");
        });
      }, 0);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Generic collapsibles (news "show more", per-paper talk lists)           */
  /* ---------------------------------------------------------------------- */

  function setupCollapsibles() {
    document.querySelectorAll("[data-toggle]").forEach(function (btn) {
      var target = document.querySelector(btn.getAttribute("data-toggle"));
      if (!target) return;
      var label = btn.querySelector(".toggle-label");
      var closedText = label ? label.textContent : null;
      var openText = btn.getAttribute("data-label-open");

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var open = !target.classList.contains("open");
        target.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (label && openText) {
          label.textContent = open ? openText : closedText;
        }
      });
    });
  }

  /* ---------------------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".email-reveal").forEach(setupEmail);
    setupCollapsibles();
    setupReveal();
    setupActiveNav();
    setupAnchorSweep();
    setupToggleButtons();
  });
})();
