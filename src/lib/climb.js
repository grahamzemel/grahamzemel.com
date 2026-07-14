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

  // Each scenario drives both the search bar text AND the result cards below.
  const SCENARIOS = [
    {
      query: "plumbers in boulder, co",
      comps: [
        { fav: "C", c: "#7c8896", name: "Citywide Plumbing", url: "citywide-plumbing.com › boulder",
          title: "Boulder's Trusted Plumbers — Citywide Plumbing",
          snip: "24/7 emergency plumbing in Boulder, CO. Drain cleaning, water heaters & repairs. Licensed and insured." },
        { fav: "Q", c: "#4f8bbf", name: "QuickDrain Rooter", url: "quickdrain.net › boulder",
          title: "Plumber in Boulder, CO | QuickDrain Rooter",
          snip: "Same-day service. Licensed plumbers serving Boulder County for over 15 years." },
        { fav: "M", c: "#9a7bb0", name: "Metro Rooter", url: "metro-rooter.com › boulder",
          title: "Boulder Plumbing & Drain Experts — Metro Rooter",
          snip: "Upfront pricing, free estimates. Trusted by 1,200+ Boulder homeowners." },
      ],
      you: { fav: "Y", name: "Your Business", url: "your-plumbing.com › boulder",
        title: "Boulder's #1 Plumber — Fast, Fair & Local",
        snip: "Top-rated plumbing in Boulder, CO. Same-day service, upfront pricing and 5-star reviews from your neighbors." },
    },
    {
      query: "hair salons in chicago",
      comps: [
        { fav: "E", c: "#c06a6a", name: "Chicago Elite Hair Studio", url: "chicago-elite-salon.com › lincoln-park",
          title: "Chicago Elite Hair Studio — Lincoln Park",
          snip: "Color, cuts & balayage specialists. Walk-ins welcome Mon–Sat. Book online now." },
        { fav: "M", c: "#9a7bb0", name: "Meraki Salon & Color", url: "meraki-salon.com › chicago",
          title: "Meraki Salon & Color — Chicago, IL",
          snip: "Voted Chicago's best 2023. 500+ five-star reviews. Same-week appointments." },
        { fav: "L", c: "#5f9e84", name: "Lakeside Style Studio", url: "lakesidestyle.com › chicago",
          title: "Lakeside Style Studio — Chicago Hair Salon",
          snip: "Expert color & cuts near Lake Shore Drive. Book your appointment online today." },
      ],
      you: { fav: "Y", name: "Your Business", url: "your-salon.com › chicago",
        title: "Chicago's #1 Hair Salon — Award-Winning Style",
        snip: "Top-rated salon in Chicago, IL. Expert color, cuts & styling by award-winning stylists. Book today." },
    },
    {
      query: "hvac repair in phoenix, az",
      comps: [
        { fav: "D", c: "#c08a4a", name: "Desert Cool HVAC", url: "desert-cool-hvac.com › phoenix",
          title: "Desert Cool HVAC — Phoenix, AZ",
          snip: "Same-day AC repair. Licensed & insured. Free estimates. 24/7 emergency service." },
        { fav: "P", c: "#4f8bbf", name: "Phoenix Air Solutions", url: "phoenix-air.com › hvac",
          title: "Phoenix Air Solutions — Fast HVAC Repair",
          snip: "Residential & commercial HVAC. Fast, reliable. Financing available." },
        { fav: "S", c: "#6a78c0", name: "Sun State Cooling", url: "sunstatecooling.com › phoenix",
          title: "Sun State Cooling & Heating — Phoenix",
          snip: "Serving Phoenix metro since 2004. AC install, repair & tune-ups. A+ BBB rating." },
      ],
      you: { fav: "Y", name: "Your Business", url: "your-hvac.com › phoenix",
        title: "Phoenix's #1 HVAC Company — Fast & Reliable",
        snip: "Top-rated AC repair in Phoenix, AZ. Same-day service, upfront pricing. Licensed & insured." },
    },
    {
      query: "dog groomers in portland",
      comps: [
        { fav: "R", c: "#5f9e84", name: "Rose City Groomers", url: "rosecity-groomers.com › portland",
          title: "Rose City Groomers — Portland, OR",
          snip: "Full-service grooming for all breeds. Gentle, stress-free. Online booking open." },
        { fav: "P", c: "#c08a4a", name: "Portland Paws Salon", url: "portlandpaws.com › grooming",
          title: "Portland Paws Salon — 4.9 ★ · 340 Reviews",
          snip: "Mobile & in-shop grooming. Same-week appointments. Every breed welcome." },
        { fav: "W", c: "#7c8896", name: "Willamette Pet Salon", url: "willamettevalleypets.com › grooming",
          title: "Willamette Pet Salon — Portland Groomers",
          snip: "Dog & cat grooming. All breeds welcome. Gentle, experienced groomers." },
      ],
      you: { fav: "Y", name: "Your Business", url: "your-grooming.com › portland",
        title: "Portland's #1 Dog Groomer — Gentle & Trusted",
        snip: "Portland's most-loved groomer. Gentle care for all breeds. Online booking available." },
    },
    {
      query: "electricians in seattle, wa",
      comps: [
        { fav: "P", c: "#6366f1", name: "Pacific NW Electric", url: "pacificnw-electric.com › seattle",
          title: "Pacific NW Electric — Seattle, WA",
          snip: "Licensed electricians. Residential & commercial. Free quotes. Fast response." },
        { fav: "S", c: "#4f8bbf", name: "Seattle Spark Electrical", url: "seattlespark.com › electrical",
          title: "Seattle Spark Electrical — 800+ Five-Star Reviews",
          snip: "Trusted since 2008. Same-day service. 800+ five-star reviews. Call now." },
        { fav: "C", c: "#7c8896", name: "Cascade Electric", url: "cascadeelectric.com › seattle",
          title: "Cascade Electric — Seattle Residential Wiring",
          snip: "Panel upgrades, wiring & repairs. Licensed & bonded. Serving King County." },
      ],
      you: { fav: "Y", name: "Your Business", url: "your-electric.com › seattle",
        title: "Seattle's #1 Electrician — Licensed & Bonded",
        snip: "Top-rated electrician in Seattle, WA. Free estimates, same-day service. Licensed & insured." },
    },
    {
      query: "med spas in scottsdale, az",
      comps: [
        { fav: "L", c: "#ec4899", name: "Luxe Med Spa", url: "luxe-medspa.com › scottsdale",
          title: "Luxe Med Spa — Scottsdale, AZ",
          snip: "Botox, fillers & laser treatments. Board-certified providers. Book online." },
        { fav: "A", c: "#9a7bb0", name: "AZ Glow Aesthetics", url: "azglow-spa.com › scottsdale",
          title: "AZ Glow Aesthetics — Scottsdale Top Med Spa",
          snip: "Top-rated med spa. 600+ reviews. Exclusive member pricing available." },
        { fav: "D", c: "#5f9e84", name: "Desert Bloom Aesthetics", url: "desertbloom.com › scottsdale",
          title: "Desert Bloom Aesthetics — Scottsdale",
          snip: "Facial rejuvenation & injectables. Certified aesthetic nurses. Book a consult." },
      ],
      you: { fav: "Y", name: "Your Business", url: "your-medspa.com › scottsdale",
        title: "Scottsdale's #1 Med Spa — Board-Certified Experts",
        snip: "Top-rated med spa in Scottsdale, AZ. Botox, fillers & laser by certified providers." },
    },
  ];

  // LEFT headline — this is the pitch. Sells the journey + outcome.
  const HEADLINES = [
    `Your next customer is searching <span class="accent">right now.</span>`,
    `But you're invisible — stuck on <span class="accent">page five.</span>`,
    `So I fix what's quietly <span class="accent">holding you back.</span>`,
    `And you climb — past <span class="accent">every competitor.</span>`,
    `Now you're <span class="accent">#1.</span> And the calls don't stop.`,
  ];
  function headlineState(climb) {
    if (climb < 0.20) return 0;
    if (climb < 0.45) return 1;
    if (climb < 0.70) return 2;
    if (climb < 0.97) return 3;
    return 4;
  }

  const STEP = 86;
  const N = SCENARIOS[0].comps.length + 1;  // constant across all scenarios
  const TOP_AT = 0.80;

  let cards = [];
  let youSlot = -1;
  let rankN, meterFill, phaseK, phaseT, urlQ, confettiHost, serpwin, tip, hud;
  let hlEls = [], hlState = -1, confettiFired = false;
  const easeOut = (x) => 1 - Math.pow(1 - x, 2.2);

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

  // Update card content in-place without touching layout transforms.
  function applyScenario(sc) {
    sc.comps.forEach((d, i) => { if (cards[i]) cards[i].el.innerHTML = resultHTML(d, false); });
    const youCard = cards[cards.length - 1];
    if (youCard) youCard.el.innerHTML = resultHTML(sc.you, true);
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
    if (urlQ) urlQ.textContent = SCENARIOS[0].query;

    rowsHost.style.height = N * STEP + "px";
    rowsHost.innerHTML = "";
    cards = [];
    SCENARIOS[0].comps.forEach((d) => {
      const el = document.createElement("div");
      el.className = "srow gres";
      el.innerHTML = resultHTML(d, false);
      rowsHost.appendChild(el);
      cards.push({ el, comp: true });
    });
    const you = document.createElement("div");
    you.className = "srow gres gres--you";
    you.innerHTML = resultHTML(SCENARIOS[0].you, true);
    rowsHost.appendChild(you);
    cards.push({ el: you, comp: false, you: true });
    return true;
  }

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

  /* ---- search bar + card sync: cycle scenarios until the climb starts ---- */
  let typer = null, typingOn = false, sceneI = 0;

  function cycleStart() {
    if (typingOn || reduce || !urlQ) return;
    typingOn = true;
    urlQ.classList.add("typing");
    let idx = 0, phase = "type";
    (function step() {
      const target = SCENARIOS[sceneI].query;
      if (phase === "type") {
        urlQ.textContent = target.slice(0, ++idx);
        if (idx >= target.length) { phase = "del"; typer = setTimeout(step, 1500); }
        else typer = setTimeout(step, 55 + Math.random() * 45);
      } else {
        urlQ.textContent = target.slice(0, --idx);
        if (idx <= 0) {
          // Switch scenario when the bar is empty — cards and text flip together
          sceneI = (sceneI + 1) % SCENARIOS.length;
          applyScenario(SCENARIOS[sceneI]);
          phase = "type";
          typer = setTimeout(step, 320);
        } else {
          typer = setTimeout(step, 26);
        }
      }
    })();
  }

  function cycleStop() {
    if (!typingOn) return;
    typingOn = false;
    if (typer) { clearTimeout(typer); typer = null; }
    urlQ.classList.remove("typing");
    // Lock to first scenario so the climb animation always starts from plumbers
    sceneI = 0;
    if (urlQ) urlQ.textContent = SCENARIOS[0].query;
    applyScenario(SCENARIOS[0]);
  }

  function render(p) {
    const climb = Math.min(1, p / TOP_AT);
    const e = easeOut(climb);

    if (tip) tip.classList.toggle("hide", p > 0.03);
    if (hud) hud.classList.toggle("show", p > 0.03);
    if (p > 0.03) cycleStop(); else cycleStart();

    const slot = Math.max(0, Math.round((N - 1) * (1 - climb)));
    if (slot !== youSlot) layout(slot);

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
        p.vy += 0.42;
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
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    ScrollTrigger.create({
      trigger: "#climb", start: "top top", end: mobile ? "+=1100" : "+=1800",
      pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress),
    });
  };
})();
