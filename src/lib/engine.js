/* ============================================================
   Graham Zemel — /seo · core engine (lean)
   Lenis smooth scroll · GSAP · depth parallax · IO reveals · tilt
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const root = document.documentElement;

  const SEO = (window.SEO = {
    intensity: 0.85,
    smooth: !reduce,
    lenis: null,
    setIntensity(v) { this.intensity = v; root.style.setProperty("--pfx", v); },
    setAccent(hex) {
      const { r, g, b } = hexRgb(hex);
      root.style.setProperty("--accent", hex);
      root.style.setProperty("--accent-deep", shade(hex, -0.18));
      root.style.setProperty("--accent-soft", `rgba(${r},${g},${b},0.10)`);
      root.style.setProperty("--accent-glow", `rgba(${r},${g},${b},0.20)`);
    },
    setSmooth(on) { this.smooth = on; if (this.lenis) on ? this.lenis.start() : this.lenis.stop(); },
  });

  function hexRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
  function shade(hex, amt) {
    let { r, g, b } = hexRgb(hex);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + 255 * amt)));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  /* ---------------- Lenis ---------------- */
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  let lenis = null;
  function initLenis() {
    // Skip Lenis on mobile/touch: Lenis + ScrollTrigger pin is unreliable on
    // touch (the pinned scene won't scrub). Native scrolling drives ScrollTrigger
    // directly on mobile, which is the well-supported path.
    if (reduce || isTouch || isMobile || typeof Lenis === "undefined") return;
    lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      syncTouch: false,
      touchMultiplier: 1.5,
    });
    SEO.lenis = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -10, duration: 1.2 });
      });
    });
  }

  /* ---------------- nav ---------------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------------- depth glyphs ---------------- */
  const GLYPHS = [
    "keywords", "serp", "rank #1", "organic", "backlinks", "schema", "near me",
    "page speed", "indexed", "intent", "crawl", "meta", "local pack", "sitemap",
    "long-tail", "ctr", "h1", "canonical", "reviews", "maps",
  ];
  (function buildGlyphs() {
    const host = document.getElementById("glyphs");
    if (!host) return;
    const n = isTouch ? 9 : 16;
    let html = "";
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 100;
      const y = (i / n) * 300 + Math.random() * 12;
      const depth = 0.08 + Math.random() * 0.5;
      const size = 0.7 + Math.random() * 0.6;
      html += `<span class="glyph" data-depth="${depth.toFixed(2)}" style="left:${x}%;top:${y}vh;font-size:${size}rem">${GLYPHS[i % GLYPHS.length]}</span>`;
    }
    host.innerHTML = html;
  })();

  /* ---------------- fixed depth parallax + cursor ---------------- */
  const depthEls = Array.from(document.querySelectorAll(".depth [data-depth]"));
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  if (!isTouch) {
    window.addEventListener("mousemove", (e) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    });
  }
  let rafId = null;
  function parallaxLoop() {
    const sc = window.scrollY, p = SEO.intensity;
    mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
    for (const el of depthEls) {
      const d = parseFloat(el.dataset.depth) || 0.1;
      const cx = -mx * d * 110 * p, cy = -my * d * 75 * p, ty = -sc * d * p;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${(ty + cy).toFixed(1)}px, 0)`;
    }
    rafId = requestAnimationFrame(parallaxLoop);
  }
  function startParallax() { if (!rafId) rafId = requestAnimationFrame(parallaxLoop); }
  function stopParallax()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
  document.addEventListener('visibilitychange', () => document.hidden ? stopParallax() : startParallax());
  startParallax();

  /* ---------------- background: growth-chart draw + climb (GSAP) ---------------- */
  function initGsap() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    // Don't refresh/jump pins when the mobile URL bar shows/hides.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // the growth curve draws itself + climbs as you scroll the whole page
    const line = document.querySelector(".depth__chart-line");
    const fill = document.querySelector(".depth__chart-fill");
    const chart = document.querySelector(".depth__chart");
    if (line && line.getTotalLength) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      gsap.to(line, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
      if (fill) gsap.fromTo(fill, { opacity: 0 }, { opacity: 1, ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "30% top", scrub: 0.5 } });
    }
    if (chart) {
      // climb upward + drift right across the full scroll
      gsap.to(chart, {
        yPercent: -22 * SEO.intensity, xPercent: 4 * SEO.intensity, ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
    }

    gsap.to(".scrollcue", { opacity: 0, scrollTrigger: { trigger: "#climb", start: "top top", end: "+=160", scrub: true } });
    if (window.initClimb) window.initClimb();   // build the pinned scene
    ScrollTrigger.refresh();
  }

  /* ---------------- IO reveals ---------------- */
  function initReveals() {
    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------------- 3D tilt cards ---------------- */
  function initTilt() {
    if (isTouch) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let raf = null;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg)`;
        });
      });
      card.addEventListener("mouseleave", () => { card.style.transform = "rotateX(0) rotateY(0)"; });
    });
  }

  /* ---------------- lead form ---------------- */
  // preselect package when a pricing CTA is clicked
  document.querySelectorAll("[data-pkg]").forEach((a) => {
    a.addEventListener("click", () => {
      const sel = document.getElementById("f-pkg");
      if (sel) sel.value = a.getAttribute("data-pkg");
    });
  });
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const note = document.getElementById("formNote");
      if (form.website2.value) return;   // honeypot — silently ignore bots
      const name = form.name.value.trim(), email = form.email.value.trim();
      if (!name || !/.+@.+\..+/.test(email)) {
        note.textContent = "Please add your name and a valid email."; note.style.color = "var(--accent-deep)"; return;
      }
      const words = form.message.value.trim().split(/\s+/).filter(Boolean).length;
      if (words < 20) {
        note.textContent = "Please share at least 20 words (" + words + " so far) about what you want to grow.";
        note.style.color = "var(--accent-deep)"; return;
      }
      const btn = form.querySelector("button[type=submit]");
      const pkg = (form.package && form.package.value.trim()) || "";
      const phone = (form.phone && form.phone.value.trim()) || "";
      const original = btn.innerHTML;
      btn.innerHTML = "Sending…"; btn.style.pointerEvents = "none";
      try {
        // Forward to the site's shared contact endpoint (Web3Forms → me@grahamzemel.com)
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, email,
            projectType: "SEO" + (pkg ? " — " + pkg : ""),
            message: (phone ? "Phone: " + phone + "\n\n" : "") + form.message.value.trim(),
            honey: form.website2.value,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "send failed");
        btn.innerHTML = "Sent — talk soon ✓";
        note.textContent = "Thanks " + name.split(" ")[0] + " — I'll reply within a day."; note.style.color = "var(--accent-deep)";
      } catch (err) {
        btn.innerHTML = original; btn.style.pointerEvents = "";
        note.textContent = "Couldn't send — email me directly at me@grahamzemel.com."; note.style.color = "var(--accent-deep)";
      }
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    SEO.setIntensity(SEO.intensity);
    initReveals();
    initTilt();
    initLenis();
    initGsap();
    const resync = () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); if (lenis && lenis.resize) lenis.resize(); };
    setTimeout(resync, 300); setTimeout(resync, 1200);
    window.addEventListener("resize", () => { clearTimeout(window.__rs); window.__rs = setTimeout(resync, 200); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resync);
  }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
