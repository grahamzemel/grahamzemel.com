/* ============================================================
   Graham Zemel — /seo · "The Climb"
   Pinned scene. LEFT headline sells the story; RIGHT is a real
   Google results page where YOUR card LEAPFROGS competitors
   position-by-position (animated swaps) to #1 — then confetti.
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const QUERY = "plumber in boulder";

  // Example searches the bar cycles through before the climb starts. These are
  // local businesses that typically under-invest in SEO (home/trade services +
  // beauty/wellness), paired with US cities. It locks to QUERY on scroll so the
  // plumber result cards below stay consistent.
  const SEARCHES = [
    "plumbers in boulder", "waxing studios in chicago", "hvac repair in phoenix",
    "roofers in dallas", "med spas in scottsdale", "garage door repair in denver",
    "mobile detailing in miami", "dog grooming in portland", "lash bars in austin",
    "pest control in houston", "electricians in seattle", "nail salons in san diego",
  ];

  const COMPETITORS = [
    { name: "Citywide Plumbing", url: "citywide-plumbing.com › boulder", fav: "C", c: "#7c8896",
      title: "Boulder's Trusted Plumbers — Citywide Plumbing",
      snip: "24/7 emergency plumbing in Boulder, CO. Drain cleaning, water heaters & repairs. Licensed and insured." },
    { name: "QuickDrain Rooter", url: "quickdrain.net › service-areas › boulder", fav: "Q", c: "#4f8bbf",
      title: "Plumber in Boulder, CO | QuickDrain Rooter",
      snip: "Same-day service. Licensed plumbers serving Boulder County for over 15 years." },
    { name: "Metro Rooter", url: "metro-rooter.com › boulder-plumbing", fav: "M", c: "#9a7bb0",
      title: "Boulder Plumbing & Drain Experts — Metro Rooter",
      snip: "Upfront pricing, free estimates. Trusted by 1,200+ Boulder homeowners." },
    { name: "AAA Pipeworks", url: "aaa-pipeworks.com › co › boulder", fav: "A", c: "#c08a4a",
      title: "AAA Pipeworks — Plumbers Near Boulder",
      snip: "Repairs, installs & remodels. A+ BBB rating. Call for a free quote today." },
    { name: "Boulder Drain Pros", url: "boulderdrainpros.com › drain-cleaning", fav: "B", c: "#5f9e84",
      title: "Drain Cleaning & Sewer Repair — Boulder Drain Pros",
      snip: "Fast drain and sewer service across Boulder. Upfront quotes, no overtime fees." },
    { name: "Flatiron Plumbing", url: "flatironplumbing.com › boulder-co", fav: "F", c: "#c06a6a",
      title: "Flatiron Plumbing — Boulder, CO Plumbers",
      snip: "Family-owned plumbing serving Boulder since 2008. Water heaters, leaks, remodels." },
    { name: "Front Range Rooter", url: "frontrangerooter.com › service-areas", fav: "R", c: "#6a78c0",
      title: "Front Range Rooter — Plumbing & Drain Service",
      snip: "Trenchless sewer repair and 24/7 emergency plumbing throughout Boulder County." },
  ];
  const YOU = { name: "Your Business", url: "your-business.com › boulder-plumbing", fav: "Y",
    title: "Boulder's #1 Plumber — Fast, Fair & Local",
    snip: "Top-rated plumbing in Boulder, CO. Same-day service, upfront pricing and 5-star reviews from your neighbors." };

  // LEFT headline — this is the pitch. Sells the journey + outcome.
  const HEADLINES = [
    'Your next customer is searching <span class="accent">right now.</span>',
    'But you’re invisible — stuck on <span class="accent">page five.</span>',
    'So I fix what’s quietly <span class="accent">holding you back.</span>',
    'And you climb — past <span class="accent">every competitor.</span>',
    'Now you’re <span class="accent">#1.</span> And the calls don’t stop.',
  ];
  function headlineState(climb) {
    if (climb < 0.20) return 0;
    if (climb < 0.45) return 1;
    if (climb < 0.70) return 2;
    if (climb < 0.97) return 3;
    return 4;
  }

  const STEP = 86;
  const N = COMPETITORS.length + 1;        // 5 cards
  const TOP_AT = 0.80;                      // reach #1 at 80% — short dwell on the green #1 state

  let cards = [];                            // {el, comp(bool)} in fixed DOM order; YOU is last
  let youSlot = -1;
  let rankN, meterFill, phaseK, phaseT, urlQ, confettiHost, serpwin, tip, hud;
  let hlEls = [], hlState = -1, confettiFired = false;
  const easeOut = (x) => 1 - Math.pow(1 - x, 2.2);

  /* ---- search bar: typewriter-cycle example searches until the climb starts ---- */
  let typer = null, typingOn = false;
  function cycleStart() {
    if (typingOn || reduce || !urlQ) return;
    typingOn = true;
    urlQ.classList.add("typing");
    let i = 0, idx = 0, phase = "type";
    (function step() {
      const target = SEARCHES[i];
      if (phase === "type") {
        urlQ.textContent = target.slice(0, ++idx);
        if (idx >= target.length) { phase = "del"; typer = setTimeout(step, 1500); }
        else typer = setTimeout(step, 55 + Math.random() * 45);
      } else {
        urlQ.textContent = target.slice(0, --idx);
        if (idx <= 0) { phase = "type"; i = (i + 1) % SEARCHES.length; typer = setTimeout(step, 320); }
        else typer = setTimeout(step, 26);
      }
    })();
  }
  function cycleStop() {
    if (!typingOn) { if (urlQ && urlQ.textContent !== QUERY) urlQ.textContent = QUERY; return; }
    typingOn = false;
    if (typer) { clearTimeout(typer); typer = null; }
    urlQ.classList.remove("typing");
    urlQ.textContent = QUERY;
  }

  function resultHTML(d, you) {
    return (
      `<div class="gres__head">` +
        `<span class="gfav"${you ? "" : ` style="background:${d.c}"`}>${d.fav}</span>` +
        `<div class="gres__meta"><span class="gres__name">${d.name}</span><span class="gres__url">${d.url}</span></div>` +
        (you ? `<span class="gres__badge">Your site</span>` : "") +
      `</div>` +
      `<a class="gres__title">${d.title}</a>` +
      `<p class="gres__snip">${d.snip}</p>`
    );
  }

  function build() {
    const rowsHost = document.getElementById("serprows");
    if (!rowsHost) return false;
    rankN = document.getElementById("rankN");
    meterFill = document.getElementById("meterFill");
    phaseK = document.getElementById("phaseK");
    phaseT = document.getElementById("phaseT");
    urlQ = document.getElementById("urlQ");
    confettiHost = document.getElementById("confetti");
    serpwin = document.getElementById("serpwin");
    tip = document.getElementById("climbTip");
    hud = document.getElementById("hud");

    const hl = document.getElementById("climbHeadline");
    if (hl) {
      hl.innerHTML = "";
      HEADLINES.forEach((h) => { const s = document.createElement("span"); s.className = "hl"; s.innerHTML = h; hl.appendChild(s); });
      hlEls = Array.from(hl.children);
    }
    if (urlQ) urlQ.textContent = QUERY;   // pre-filled on load

    rowsHost.style.height = N * STEP + "px";
    rowsHost.innerHTML = "";
    cards = [];
    COMPETITORS.forEach((d) => {
      const el = document.createElement("div");
      el.className = "srow gres";
      el.innerHTML = resultHTML(d, false);
      rowsHost.appendChild(el);
      cards.push({ el, comp: true });
    });
    const you = document.createElement("div");
    you.className = "srow gres gres--you";
    you.innerHTML = resultHTML(YOU, true);
    rowsHost.appendChild(you);
    cards.push({ el: you, comp: false, you: true });
    return true;
  }

  // Position every card by current youSlot: YOU sits at youSlot, competitors
  // fill the remaining slots in their original order. Distinct slots, no overlap.
  function layout(slot) {
    youSlot = slot;
    let ci = 0;
    const youCard = cards[cards.length - 1];
    for (let s = 0; s < N; s++) {
      let card;
      if (s === slot) { card = youCard; }
      else { card = cards[ci++]; }
      const y = s * STEP;
      card.el.style.transform = card.you
        ? `translateY(${y}px) scale(1.02)`
        : `translateY(${y}px)`;
      card.el.style.zIndex = card.you ? 30 : 1;
    }
  }

  function render(p) {
    const climb = Math.min(1, p / TOP_AT);     // 0..1 — done at TOP_AT, then dwells
    const e = easeOut(climb);

    if (tip) tip.classList.toggle("hide", p > 0.03);
    if (hud) hud.classList.toggle("show", p > 0.03);
    if (p > 0.03) cycleStop(); else cycleStart();   // bar cycles at top, locks to QUERY on climb

    // discrete leapfrog: map climb -> integer slot for YOU (N-1 .. 0)
    const slot = Math.max(0, Math.round((N - 1) * (1 - climb)));
    if (slot !== youSlot) layout(slot);

    // headline synced to position, advancing one line every TWO rank jumps
    const st = slot === 0 ? 4 : Math.min(3, Math.floor(((N - 1) - slot) / 2));
    if (st !== hlState && hlEls.length) { hlState = st; hlEls.forEach((el, i) => el.classList.toggle("on", i === st)); }

    const atTop = slot === 0 && climb > 0.98;
    cards[cards.length - 1].el.classList.toggle("at-top", atTop);

    if (rankN) rankN.textContent = Math.max(1, Math.round(48 - 47 * e));
    if (meterFill) meterFill.style.width = (climb * 100).toFixed(1) + "%";

    let k, t;
    if (climb < 0.34) { k = "01 · FIND"; t = "Auditing — you're buried on page 5."; }
    else if (climb < 0.66) { k = "02 · FIX"; t = "Optimizing — fixing what holds you back."; }
    else if (climb < 0.98) { k = "03 · RANK"; t = "Climbing — overtaking competitors now."; }
    else { k = "✓ · LIVE"; t = "Live — you're ranked #1 in Your City."; }
    if (phaseK && phaseK.textContent !== k) { phaseK.textContent = k; phaseK.classList.toggle("done", climb >= 0.98); }
    if (phaseT) phaseT.textContent = t;

    // confetti when you land #1 (fire once; re-arm if scrubbed back)
    if (atTop && !confettiFired) { confettiFired = true; fireConfetti(); }
    if (climb < 0.9) confettiFired = false;
  }

  /* ---------------- confetti off "Your Business" ---------------- */
  const CONFETTI_COLORS = ["#0fae63", "#0a8b4e", "#4285F4", "#EA4335", "#FBBC05", "#34A853"];
  function fireConfetti() {
    if (!confettiHost || reduce) return;
    const youCard = cards[cards.length - 1].el;
    const wrap = confettiHost.getBoundingClientRect();
    const cr = youCard.getBoundingClientRect();
    const ox = cr.left - wrap.left + cr.width * 0.5;
    const oy = cr.top - wrap.top + cr.height * 0.5;

    const particles = [];
    const COUNT = 64;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("i");
      el.className = "confp";
      const col = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      el.style.background = col;
      if (i % 3 === 0) el.style.borderRadius = "50%";
      confettiHost.appendChild(el);
      const ang = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 1.15;
      const spd = 6 + Math.random() * 9;
      particles.push({
        el, x: ox, y: oy,
        vx: Math.cos(ang) * spd + (Math.random() - 0.5) * 3,
        vy: Math.sin(ang) * spd - Math.random() * 4,
        rot: Math.random() * 360, vr: (Math.random() - 0.5) * 26,
        life: 0, ttl: 70 + Math.random() * 40,
      });
    }
    let raf;
    function tick() {
      let alive = false;
      for (const p of particles) {
        if (p.life > p.ttl) { if (p.el.parentNode) p.el.remove(); continue; }
        alive = true;
        p.life++;
        p.vy += 0.42;            // gravity
        p.vx *= 0.99;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        const fade = Math.max(0, 1 - p.life / p.ttl);
        p.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.rot.toFixed(0)}deg)`;
        p.el.style.opacity = fade.toFixed(2);
      }
      if (alive) raf = requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function tiltWindow() {
    if (isTouch || !serpwin) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (ev) => {
      const r = serpwin.getBoundingClientRect();
      tx = (ev.clientX - (r.left + r.width / 2)) / r.width;
      ty = (ev.clientY - (r.top + r.height / 2)) / r.height;
    });
    (function loop() {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      serpwin.style.transform = `perspective(1300px) rotateY(${(cx * 5).toFixed(2)}deg) rotateX(${(-cy * 4).toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  window.initClimb = function () {
    if (!build()) return;
    layout(N - 1);
    render(0);
    tiltWindow();
    if (reduce || typeof ScrollTrigger === "undefined") { render(1); return; }
    // Shorter scrub on mobile so the whole climb completes in a comfortable swipe.
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    ScrollTrigger.create({
      trigger: "#climb", start: "top top", end: mobile ? "+=1100" : "+=1800",
      pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress),
    });
  };
})();
