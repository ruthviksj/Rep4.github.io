/* =========================================================
   PRD-001 · Document interactions
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Live timestamp ----- */
  function fmtDate(d) {
    var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear();
  }
  document.querySelectorAll("[data-today]").forEach(function (el) { el.textContent = fmtDate(new Date()); });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ----- I-beam custom cursor (text-doc feel) ----- */
  if (window.matchMedia("(hover: hover)").matches && !reduce) {
    var beam = document.createElement("div");
    beam.className = "ibeam";
    document.body.appendChild(beam);
    document.addEventListener("mousemove", function (e) {
      beam.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
    });
    var interactive = "a, button, input, textarea, .btn, .pill, .spec, .comment, .tabs__list a";
    document.querySelectorAll(interactive).forEach(function (el) {
      el.addEventListener("mouseenter", function () { beam.style.opacity = "0"; el.style.cursor = "pointer"; });
      el.addEventListener("mouseleave", function () { beam.style.opacity = "1"; });
    });
  }

  /* ----- Scroll reveal + comment thread-in ----- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal], .comment").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll("[data-reveal], .comment").forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- TOC active-section highlight ----- */
  var tocLinks = document.querySelectorAll(".rail__toc a");
  var sections = Array.prototype.map.call(tocLinks, function (a) {
    var id = a.getAttribute("href"); if (!id || id[0] !== "#") return null;
    return { link: a, el: document.querySelector(id) };
  }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("active"); });
          var match = sections.find(function (s) { return s.el === e.target; });
          if (match) match.link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { sio.observe(s.el); });
  }

  /* ----- Tabs mobile toggle ----- */
  var burger = document.querySelector(".tabs__burger");
  var tabList = document.querySelector(".tabs__list");
  if (burger && tabList) {
    burger.addEventListener("click", function () {
      var open = tabList.classList.toggle("open");
      burger.textContent = open ? "Close ×" : "Sections ☰";
    });
  }

  /* ----- Contact compose -> mailto ----- */
  var form = document.querySelector("#compose-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var subject = encodeURIComponent("Re: PRD-001 — " + (f.get("subject") || "from " + (f.get("name") || "the site")));
      var body = encodeURIComponent(
        "From: " + (f.get("name") || "") + " <" + (f.get("email") || "") + ">\n\n" +
        (f.get("message") || "")
      );
      var status = form.querySelector(".compose__hint");
      window.location.href = "mailto:sjruthvik99@gmail.com?subject=" + subject + "&body=" + body;
      if (status) status.textContent = "Opening your mail client… if nothing happens, write to sjruthvik99@gmail.com";
    });
  }
})();
