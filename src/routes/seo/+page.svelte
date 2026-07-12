<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut, cubicIn } from 'svelte/easing';
  import '$lib/seo.css';

  let lostCount = 47;
  let sceneIdx = 0;
  let activePage = 4; // start on page 4 — visitor sees the problem first
  let cardEl; // bound to .mh-card DOM node
  let scrollHandler; // scroll-based bidirectional page switch
  let geoCity = ''; // detected city from IP lookup
  let geoState = ''; // detected state/region abbreviation

  function localizeQuery(query) {
    if (!geoCity) return query;
    const idx = query.indexOf(' in ');
    if (idx === -1) return query;
    const location = geoState ? `${geoCity}, ${geoState}` : geoCity;
    return query.slice(0, idx + 4) + location;
  }

  // Generic filler entries for pages 2, 3, 5 — realistic-looking but not scenario-specific
  const genericPages = {
    2: [
      { i: 'H', c: '#6b7280', url: 'homeservicepros.com › local › service', name: 'Home Service Pros — Local Professionals', desc: 'Verified local service providers. Compare quotes and book online instantly.' },
      { i: 'A', c: '#6b7280', url: 'allstar-local.com › your-city › reviews', name: 'All Star Local Services — 4.2 ★', desc: 'Affordable pricing, reliable service. Same-week availability. Family owned.' },
      { i: 'F', c: '#6b7280', url: 'firstchoice-services.com › area', name: 'First Choice Local — Your Area', desc: 'Trusted local service since 1998. Free quotes. Fully licensed & insured.' },
    ],
    3: [
      { i: 'T', c: '#6b7280', url: 'toprated-local.com › browse › service', name: 'Top Rated Local® — Find Providers', desc: 'Browse 40,000+ verified local businesses. Read reviews & request quotes.' },
      { i: 'E', c: '#6b7280', url: 'expertservices.net › near-you', name: 'Expert Services Near You — Local', desc: 'Licensed professionals. Background checked. 100% satisfaction guarantee.' },
      { i: 'C', c: '#6b7280', url: 'cityservicenetwork.com › local', name: 'City Service Network — Local Pros', desc: 'Connecting homeowners with trusted local businesses since 2011.' },
    ],
    5: [
      { i: 'N', c: '#6b7280', url: 'neighborhoodservices.com › find', name: 'Neighborhood Services — Near You', desc: 'Local, licensed, insured. Your neighbors have trusted us for years.' },
      { i: 'P', c: '#6b7280', url: 'premierlocal.net › services › area', name: 'Premier Local — Quality Guaranteed', desc: 'Premium local service at everyday prices. Book in under 2 minutes.' },
      { i: 'R', c: '#6b7280', url: 'reliablelocal.com › your-area', name: 'Reliable Local Services — 4.8 ★', desc: 'Consistently top-rated. Same-day service often available. Call or book online.' },
    ],
  };
  let displayQuery = 'plumbers in boulder, co'; // mirrors scenarios[0].query
  let alive = true; // set false in onDestroy to stop the animation loop

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typewriterLoop() {
    await sleep(2800); // initial pause before first cycle
    while (alive) {
      // --- delete current query char by char ---
      while (displayQuery.length > 0 && alive) {
        displayQuery = displayQuery.slice(0, -1);
        await sleep(28);
      }
      if (!alive) break;

      // --- advance scene (triggers results fade) ---
      sceneIdx = (sceneIdx + 1) % scenarios.length;
      await sleep(180);

      // --- type new query char by char (localized city if detected) ---
      const target = localizeQuery(scenarios[sceneIdx].query);
      for (let i = 1; i <= target.length && alive; i++) {
        displayQuery = target.slice(0, i);
        await sleep(48);
      }

      await sleep(10000); // pause while fully typed before next cycle
    }
  }

  const scenarios = [
    {
      query: 'plumbers in boulder, co',
      comps: [
        { i: 'C', c: '#6366f1', url: 'citywide-plumbing.com › boulder › emergency', name: 'Citywide Plumbing — Boulder\'s Emergency Plumber', desc: 'Licensed & insured. 24/7 emergency service in Boulder, CO. Fast response guaranteed.' },
        { i: 'Q', c: '#0ea5e9', url: 'quickdrain.net › boulder-co › plumbing', name: 'QuickDrain Rooter — Boulder, CO', desc: 'Same-day service. Free estimates. Drain cleaning, leak repair & full plumbing.' },
      ],
      p4: [
        { i: 'K', c: '#6b7280', url: 'kellersplumbing.com › boulder › service', name: 'Keller\'s Plumbing — Boulder, CO', desc: 'Residential plumbing repairs. Licensed & insured. Scheduling available online.' },
        { i: 'M', c: '#6b7280', url: 'milehighpipe.com › colorado › drain', name: 'Mile High Drain & Pipe — CO', desc: 'Serving Boulder County since 2007. Drain cleaning, water heaters & more.' },
      ],
      yourName: 'Your Plumbing Business — Boulder, CO',
      afterName: 'Your Business — Boulder\'s Best Plumber',
      afterDesc: 'Licensed & insured. Boulder\'s highest-rated plumber. Same-day service. Call now.',
    },
    {
      query: 'hair salons in chicago',
      comps: [
        { i: 'E', c: '#ec4899', url: 'chicago-elite-salon.com › lincoln-park › hair', name: 'Chicago Elite Hair Studio — Lincoln Park', desc: 'Color, cuts & balayage specialists. Walk-ins welcome Mon–Sat. Book online now.' },
        { i: 'M', c: '#8b5cf6', url: 'meraki-salon.com › chicago › services', name: 'Meraki Salon & Color — Chicago, IL', desc: 'Voted Chicago\'s best 2023. 500+ five-star reviews. Same-week appointments.' },
      ],
      p4: [
        { i: 'W', c: '#6b7280', url: 'windycitycuts.com › chicago › salon', name: 'Windy City Cuts — Chicago, IL', desc: 'Full-service hair salon. Cuts, color & extensions. Walk-ins welcome.' },
        { i: 'L', c: '#6b7280', url: 'lakeshorebeauty.com › chicago › hair', name: 'Lake Shore Beauty Salon — Chicago', desc: 'Affordable styling & color. Convenient North Side location. Book today.' },
      ],
      yourName: 'Your Hair Salon — Chicago, IL',
      afterName: 'Your Salon — Chicago\'s Top Hair Studio',
      afterDesc: 'Chicago\'s highest-rated. Color, cuts & styling by expert stylists. Book today.',
    },
    {
      query: 'hvac repair in phoenix, az',
      comps: [
        { i: 'D', c: '#f97316', url: 'desert-cool-hvac.com › phoenix › repair', name: 'Desert Cool HVAC — Phoenix, AZ', desc: 'Same-day AC repair. Licensed & insured. Free estimates. 24/7 emergency service.' },
        { i: 'P', c: '#0ea5e9', url: 'phoenix-air.com › hvac › repair', name: 'Phoenix Air Solutions — AZ', desc: 'Residential & commercial HVAC. Fast, reliable. Financing available.' },
      ],
      p4: [
        { i: 'S', c: '#6b7280', url: 'southwest-ac.com › phoenix › cooling', name: 'Southwest AC Solutions — Phoenix', desc: 'AC installation, repair & maintenance. Licensed AZ contractor. Free quotes.' },
        { i: 'A', c: '#6b7280', url: 'azclimate.com › hvac › phoenix', name: 'Arizona Climate Control — AZ', desc: 'Heating & cooling specialists. Serving Phoenix metro since 2004.' },
      ],
      yourName: 'Your HVAC Business — Phoenix, AZ',
      afterName: 'Your Business — Phoenix\'s #1 HVAC Company',
      afterDesc: 'Fast, reliable AC & heating repair. Phoenix\'s most-trusted HVAC since 2010.',
    },
    {
      query: 'dog grooming in portland',
      comps: [
        { i: 'R', c: '#10b981', url: 'rosecity-groomers.com › portland › grooming', name: 'Rose City Groomers — Portland, OR', desc: 'Full-service grooming for all breeds. Gentle, stress-free. Online booking open.' },
        { i: 'P', c: '#f59e0b', url: 'portlandpaws.com › grooming › services', name: 'Portland Paws Salon — OR', desc: 'Mobile & in-shop grooming. Same-week appointments. 4.9 stars · 340 reviews.' },
      ],
      p4: [
        { i: 'W', c: '#6b7280', url: 'willamettevalleypets.com › grooming', name: 'Willamette Valley Pet Salon — OR', desc: 'Dog & cat grooming. All breeds welcome. Gentle, experienced groomers.' },
        { i: 'P', c: '#6b7280', url: 'pacificpaws.com › portland › groom', name: 'Pacific Paws Grooming — Portland', desc: 'Affordable grooming packages. Drop-off & pick-up available. Call to book.' },
      ],
      yourName: 'Your Grooming Business — Portland, OR',
      afterName: 'Your Salon — Portland\'s Top Dog Groomer',
      afterDesc: 'Portland\'s most-loved groomer. Gentle care for all breeds. Book your spot today.',
    },
    {
      query: 'electricians in seattle, wa',
      comps: [
        { i: 'P', c: '#6366f1', url: 'pacificnw-electric.com › seattle › residential', name: 'Pacific NW Electric — Seattle, WA', desc: 'Licensed electricians. Residential & commercial. Free quotes. Fast response.' },
        { i: 'S', c: '#0ea5e9', url: 'seattlespark.com › electrical › seattle', name: 'Seattle Spark Electrical — WA', desc: 'Trusted since 2008. Same-day service. 800+ five-star reviews. Call now.' },
      ],
      p4: [
        { i: 'C', c: '#6b7280', url: 'cascadeelectric.com › seattle › service', name: 'Cascade Electric — Seattle, WA', desc: 'Residential wiring, panel upgrades & repairs. Licensed & bonded. Free estimates.' },
        { i: 'R', c: '#6b7280', url: 'rainierpower.com › wa › electric', name: 'Rainier Power Solutions — WA', desc: 'Full-service electrical contractor. Serving King County. Call for availability.' },
      ],
      yourName: 'Your Electrical Business — Seattle, WA',
      afterName: 'Your Business — Seattle\'s Best Electrician',
      afterDesc: 'Licensed & bonded. Seattle\'s top-rated electrician. Free estimates. Fast service.',
    },
    {
      query: 'med spas in scottsdale, az',
      comps: [
        { i: 'L', c: '#ec4899', url: 'luxe-medspa.com › scottsdale › treatments', name: 'Luxe Med Spa — Scottsdale, AZ', desc: 'Botox, fillers & laser treatments. Board-certified providers. Book online.' },
        { i: 'A', c: '#8b5cf6', url: 'azglow-spa.com › scottsdale › services', name: 'AZ Glow Aesthetics — Scottsdale', desc: 'Top-rated med spa. 600+ reviews. Exclusive member pricing available.' },
      ],
      p4: [
        { i: 'D', c: '#6b7280', url: 'desertbloom.com › scottsdale › aesthetics', name: 'Desert Bloom Aesthetics — Scottsdale', desc: 'Facial rejuvenation & injectables. Certified aesthetic nurses. Book a consult.' },
        { i: 'S', c: '#6b7280', url: 'sonoranskin.com › scottsdale › wellness', name: 'Sonoran Skin & Wellness — AZ', desc: 'Laser treatments, Botox & skincare. Scottsdale\'s trusted aesthetic clinic.' },
      ],
      yourName: 'Your Med Spa — Scottsdale, AZ',
      afterName: 'Your Spa — Scottsdale\'s Top Med Spa',
      afterDesc: 'Scottsdale\'s highest-rated. Botox, fillers & laser by certified providers.',
    },
  ];

  onMount(async () => {
    lostCount = Math.floor(Math.random() * 71) + 30;

    // Best-effort IP geolocation — silently falls back to hardcoded cities on failure
    try {
      const geo = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
      if (geo.ok) {
        const data = await geo.json();
        if (data.city) geoCity = data.city.toLowerCase();
        if (data.region_code) geoState = data.region_code.toLowerCase();
        // Backfill the static initial display value with detected location
        displayQuery = localizeQuery(scenarios[0].query);
      }
    } catch { /* ignore — no key needed, just best-effort */ }

    typewriterLoop();

    // Bidirectional scroll switch: page 4 ↔ page 1 as user scrolls through the card.
    // Small hysteresis band (60% down, 68% up) prevents jitter at the threshold.
    scrollHandler = () => {
      if (!cardEl) return;
      const rect = cardEl.getBoundingClientRect();
      const mid = rect.top + rect.height * 0.5;
      const vh = window.innerHeight;
      if (activePage !== 1 && mid < vh * 0.6) {
        activePage = 1;
      } else if (activePage === 1 && mid > vh * 0.68) {
        activePage = 4;
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });

    // SEO scene runs client-side only (DOM + scroll APIs)
    const gsap = (await import('gsap')).default;
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const Lenis = (await import('lenis')).default;
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    window.Lenis = Lenis;
    gsap.registerPlugin(ScrollTrigger);
    await import('$lib/climb.js');
    await import('$lib/engine.js');
  });

  onDestroy(() => {
    alive = false;
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler, true);
    if (typeof window === 'undefined') return;
    try { window.SEO?.lenis?.destroy?.(); } catch (e) {}
    try { window.ScrollTrigger?.getAll?.().forEach((t) => t.kill()); } catch (e) {}
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
  });

  // Local businesses that typically under-invest in SEO (home/trade services +
  // beauty/wellness), paired with US cities — the searches your customers run.
  const searches = [
    'plumbers in boulder', 'waxing studios in chicago', 'hvac repair in phoenix',
    'roofers in dallas', 'med spas in scottsdale', 'garage door repair in denver',
    'mobile detailing in miami', 'dog grooming in portland', 'lash bars in austin',
    'chiropractors in nashville', 'pest control in houston', 'electricians in seattle',
    'nail salons in san diego', 'landscapers in atlanta', 'barbershops in brooklyn',
    'locksmiths in las vegas',
  ];
</script>

<svelte:head>
  <title>SEO — Graham Zemel</title>
  <meta name="description" content="Get more customers by getting on the front page of Google. Straightforward SEO for small businesses, by Graham Zemel." />
</svelte:head>

<div class="seo-page">
<div class="depth" aria-hidden="true">
  <div class="depth__orb orb-a" data-depth="0.10"></div>
  <div class="depth__orb orb-b" data-depth="0.16"></div>
  <div class="depth__orb orb-c" data-depth="0.12"></div>
  <div class="depth__grid" data-depth="0.05"></div>
  <svg class="depth__chart" viewBox="0 0 1200 600" preserveAspectRatio="none">
    <defs>
      <linearGradient id="gcg" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="var(--accent)" stop-opacity="0"/>
        <stop offset="1" stop-color="var(--accent)" stop-opacity="0.16"/>
      </linearGradient>
    </defs>
    <path class="depth__chart-fill" d="M0 560 L150 525 L300 540 L450 470 L600 485 L750 395 L900 330 L1050 215 L1200 120 L1200 600 L0 600 Z" fill="url(#gcg)"/>
    <path class="depth__chart-line" d="M0 560 L150 525 L300 540 L450 470 L600 485 L750 395 L900 330 L1050 215 L1200 120" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <div class="depth__vig"></div>
</div>

<!-- NAV -->
<header class="nav" id="nav">
  <a href="https://grahamzemel.com" class="brand"><span class="mark"><b>GZ</b></span><span class="brand__name">Graham&nbsp;Zemel<span class="brand__suffix">: Search Engine Optimization</span></span></a>
  <nav class="nav__links">
    <a href="#top">How it works</a>
    <a href="#pricing">Pricing</a>
    <a href="#contact">Contact</a>
  </nav>
  <div class="nav__right">
    <a href="tel:+12035859184" class="nav__call"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6.5 3h3l1.6 4-2 1.4a12 12 0 0 0 5 5l1.4-2 4 1.6v3a2 2 0 0 1-2.1 2A16 16 0 0 1 4.5 5.1 2 2 0 0 1 6.5 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="nav__call__label"><span class="nc-number">203-585-9184</span><span class="nc-default">Call now</span></span></a>
    <a href="#contact" class="btn btn-accent nav__cta">Get a free audit <span class="arrow">→</span></a>
  </div>
</header>

<main id="top">

  <!-- ============ MOBILE HERO (≤900px, replaces .climb on small screens) ============ -->
  <section class="m-hero" aria-label="Mobile hero">

    <!-- Stat eyebrow — pill chip -->
    <div class="mh-eyebrow">
      <span class="mh-ey-dot"></span>
      <span><strong>{lostCount} people</strong> in your city searched for a business like yours last month</span>
    </div>

    <!-- Headline — 2 lines at every mobile viewport -->
    <h1 class="mh-hed">Customers are calling<br><span class="mh-acc">your competitors.</span></h1>

    <p class="mh-sub">Every month you're not ranking, those customers go elsewhere. I get you to the top of Google in 60–90 days at a fraction of agency cost — or you pay <strong>nothing</strong>.</p>

    <!-- Google SERP card — label lives inside the card, results all uniform -->
    <div class="mh-card" bind:this={cardEl}>
      <div class="mh-gbar">
        <span class="mh-glogo"><b style="color:#4285F4">G</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#4285F4">g</b><b style="color:#34A853">l</b><b style="color:#EA4335">e</b></span>
        <div class="mh-gsearch">
          <span class="mh-gquery">{displayQuery}<span class="mh-cursor">|</span></span>
          <div class="mh-gsicons">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" stroke="#9aa1ac" stroke-width="1.6"/><path d="M5 12a7 7 0 0 0 14 0M12 19v3" stroke="#9aa1ac" stroke-width="1.6" stroke-linecap="round"/></svg>
            <div class="mh-gsdiv"></div>
            <svg width="13" height="13" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="9" r="7" stroke="#4285F4" stroke-width="2"/><path d="M14 14l6 6" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
        </div>
      </div>
      <div class="mh-gcount">About 1,840,000 results (0.38 seconds)</div>

      <!-- Context band — page position + result label -->
      {#if activePage === 1}
        <div class="mh-pg-band mh-pg-band--green" in:fade={{ duration: 400 }}>
          Page 1 of results
          <span class="mh-pg-band-sub">Prime real estate for new customers.</span>
        </div>
        <div class="mh-after-band" in:fade={{ duration: 400 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          After Graham's help
        </div>
      {:else}
        <div class="mh-pg-band" in:fade={{ duration: 400 }}>
          Page {activePage} of results
          <span class="mh-pg-band-sub">Most customers never search this far.</span>
        </div>
      {/if}

      <!-- Results — re-render on scene or page change -->
      {#key `${sceneIdx}-${activePage}`}
        <div in:fly={{ y: 10, duration: 500, easing: cubicOut }}>
          {#if activePage === 1}
            <div class="mh-result mh-result--you">
              <div class="mh-rtop">
                <div class="mh-rfav mh-rfav--you">Y</div>
                <span class="mh-rurl mh-rurl--you">yourbusiness.com › your-city</span>
                <span class="mh-rank1-pill">#1</span>
              </div>
              <div class="mh-rtitle mh-rtitle--you">{scenarios[sceneIdx].afterName}</div>
              <div class="mh-rdesc">{scenarios[sceneIdx].afterDesc}</div>
            </div>
            {#each scenarios[sceneIdx].comps as comp, ci}
              <div class="mh-result">
                <div class="mh-rtop">
                  <div class="mh-rfav" style="background:{ci === 0 ? '#6b6b28' : '#7b5b2e'}">{comp.i}</div>
                  <span class="mh-rurl">{comp.url}</span>
                </div>
                <div class="mh-rtitle">{comp.name}</div>
                <div class="mh-rdesc">{comp.desc}</div>
              </div>
            {/each}
          {:else if activePage === 4}
            <div class="mh-result mh-result--generic">
              <div class="mh-rtop">
                <div class="mh-rfav" style="background:#6b6b28">{scenarios[sceneIdx].p4[0].i}</div>
                <span class="mh-rurl">{scenarios[sceneIdx].p4[0].url}</span>
              </div>
              <div class="mh-rtitle">{scenarios[sceneIdx].p4[0].name}</div>
              <div class="mh-rdesc">{scenarios[sceneIdx].p4[0].desc}</div>
            </div>
            <div class="mh-result mh-result--generic">
              <div class="mh-rtop">
                <div class="mh-rfav" style="background:#7b5b2e">{scenarios[sceneIdx].p4[1].i}</div>
                <span class="mh-rurl">{scenarios[sceneIdx].p4[1].url}</span>
              </div>
              <div class="mh-rtitle">{scenarios[sceneIdx].p4[1].name}</div>
              <div class="mh-rdesc">{scenarios[sceneIdx].p4[1].desc}</div>
            </div>
            <div class="mh-rank-band">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              This is where you rank right now
            </div>
            <div class="mh-result mh-result--p4you" style="border-bottom:none">
              <div class="mh-rtop">
                <div class="mh-rfav mh-rfav--p4">Y</div>
                <span class="mh-rurl mh-rurl--p4">yourbusiness.com › your-city</span>
                <span class="mh-you-pill">#31</span>
              </div>
              <div class="mh-rtitle mh-rtitle--p4">{scenarios[sceneIdx].yourName}</div>
              <div class="mh-rdesc mh-rdesc--p4">Local service in your area. Contact us for more information.</div>
            </div>
          {:else}
            <!-- Pages 2, 3, 5 — generic filler results -->
            {#each genericPages[activePage] as entry, i}
              <div class="mh-result mh-result--generic" style={i === 2 ? 'border-bottom:none' : ''}>
                <div class="mh-rtop">
                  <div class="mh-rfav" style="background:{i === 1 ? '#7b5b2e' : '#6b6b28'}">{entry.i}</div>
                  <span class="mh-rurl">{entry.url}</span>
                </div>
                <div class="mh-rtitle">{entry.name}</div>
                <div class="mh-rdesc">{entry.desc}</div>
              </div>
            {/each}
          {/if}
        </div>
      {/key}

      <!-- Google pagination — pages 1–5, centered, hint below "4" -->
      <div class="mh-pagination">
        <div class="mh-goo-word">
          <b style="color:#4285F4">G</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#4285F4">o</b><b style="color:#34A853">o</b><b style="color:#EA4335">o</b><b style="color:#4285F4">o</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#34A853">o</b><b style="color:#4285F4">g</b><b style="color:#EA4335">l</b><b style="color:#34A853">e</b>
        </div>
        <!-- 5-column grid so hint row aligns perfectly under "4" -->
        <div class="mh-pag-grid">
          <div class="mh-page-nums">
            {#each [1,2,3,4,5] as n}
              <button
                class="mh-pn"
                class:mh-pn--active={activePage === n}
                class:mh-pn--4={n === 4}
                on:click={() => activePage = n}
              >{n}</button>
            {/each}
          </div>
          <!-- Hint row: green under "1" when on p4, red under "4" otherwise -->
          {#key activePage}
            <div class="mh-hint-row" in:fade={{ duration: 350 }}>
              {#if activePage === 4}
                <!-- Green hint under page 1 -->
                <div class="mh-hint-col mh-hint-col--green">
                  <span class="mh-hint-arr mh-hint-arr--green">↑</span>
                  <span class="mh-hint-pill mh-hint-pill--green">Where you could be</span>
                </div>
                <div></div><div></div><div></div><div></div>
              {:else}
                <!-- Red hint under page 4 -->
                <div></div><div></div><div></div>
                <div class="mh-hint-col">
                  <span class="mh-hint-arr">↑</span>
                  <span class="mh-hint-pill">Your Business</span>
                </div>
                <div></div>
              {/if}
            </div>
          {/key}
        </div>
      </div>
    </div>

    <p class="mh-gets-label">What you get</p>
    <ul class="mh-gets">
      <li class="mh-get">
        <span class="mh-get-ic">📞</span>
        <div><strong>More customers calling you</strong><span>When someone Googles your service, your name shows up first. They click. They call.</span></div>
      </li>
      <li class="mh-get">
        <span class="mh-get-ic">📈</span>
        <div><strong>Results within 60–90 days</strong><span>No ad budget to burn. Just Google sending you customers organically.</span></div>
      </li>
      <li class="mh-get">
        <span class="mh-get-ic">✅</span>
        <div><strong>You can see it happening</strong><span>Google shows exactly how many more people find you now than before, and we'll send you reports to your email each month with clear metrics.</span></div>
      </li>
      <li class="mh-get">
        <span class="mh-get-ic">🤝</span>
        <div><strong>Direct line to Graham</strong><span>You talk to the person doing the work — not a call center or account manager.</span></div>
      </li>
    </ul>

    <!-- Pricing comparison — two cards only -->
    <div class="mh-price-row">
      <div class="mh-pv mh-pv--dim">
        <div class="mh-pv-label">Ad Agency</div>
        <div class="mh-pv-price-stack">
          <div class="mh-pv-price-line"><span class="mh-pv-amt">$5,000</span><span class="mh-pv-unit">upfront</span></div>
          <div class="mh-pv-price-line"><span class="mh-pv-amt mh-pv-amt--sm">$1,000</span><span class="mh-pv-unit">/mo after</span></div>
        </div>
        <div class="mh-pv-note">long contracts · junior staff</div>
      </div>
      <div class="mh-pv mh-pv--you">
        <div class="mh-pv-tag">Most popular</div>
        <div class="mh-pv-label">Graham · Growth</div>
        <div class="mh-pv-price">$300<span>/mo</span></div>
        <div class="mh-pv-guarantee">or you pay <strong>nothing</strong> if you're not on page 1 in 90 days</div>
      </div>
    </div>

    <a href="#contact" class="mh-btn">Get a free ranking audit →</a>
    <p class="mh-fine">Graham personally reviews every business within 48 hours. No pitch, no pressure.</p>
    <div class="mh-trust">
      <span>✓ No contracts</span>
      <span>✓ Month-to-month</span>
      <span>✓ You own the work</span>
    </div>

  </section>

  <!-- ============ THE CLIMB (pinned interactive scene) ============ -->
  <section class="climb" id="climb" data-screen-label="The Climb">
    <div class="climb__inner">
      <div class="climb__rail">
        <span class="eyebrow"><span class="dot"></span> Search Engine Optimization for Small Businesses</span>
        <h1 class="climb__headline" id="climbHeadline">Your next customer is searching <span class="accent">right now.</span></h1>
        <div class="climb__slot">
          <div class="climb__tip" id="climbTip">
            <span class="climb__tip-text">Scroll down to watch <b>your business</b> climb to Google’s #1 spot — live, the way it would with SEO by Graham&nbsp;Zemel.</span>
            <span class="climb__tip-arrow" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </div>
          <div class="climb__hud" id="hud">
            <div class="hud__head">
              <span class="hud__brand"><span class="gdot"></span> Rank tracker</span>
              <span class="phase__k" id="phaseK">01 · FIND</span>
            </div>
            <div class="phase__t" id="phaseT">Auditing — you're buried on page 5.</div>
            <div class="hud__metric">
              <div class="rankrow"><span class="rank__hash">#</span><span class="rank__n" id="rankN">48</span><span class="rank__lbl">your position</span></div>
              <div class="meter"><i id="meterFill"></i></div>
            </div>
          </div>
        </div>
        <ul class="climb__trust">
          <li>No contracts</li>
          <li>Cancel anytime</li>
          <li>You own the work</li>
        </ul>
        <div class="climb__cta">
          <a class="btn btn-accent" href="#contact">Get a free audit <span class="arrow">→</span></a>
          <a class="btn" href="#pricing">See packages</a>
        </div>
      </div>

      <div class="climb__right">
        <div class="serpwin-wrap">
          <div class="serpwin" id="serpwin">
            <div class="gbar">
              <span class="gwordmark"><b style="color:#4285F4">G</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#4285F4">g</b><b style="color:#34A853">l</b><b style="color:#EA4335">e</b></span>
              <span class="gsearch">
                <span id="urlQ"></span>
                <span class="gsearch__ic">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="#4285F4"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke="#4285F4" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.4" fill="none" stroke="#4285F4" stroke-width="1.6"/><circle cx="12" cy="4.6" r="1.5" fill="#EA4335"/><circle cx="19" cy="12" r="1.5" fill="#FBBC05"/><circle cx="12" cy="19.4" r="1.5" fill="#34A853"/><circle cx="5" cy="12" r="1.5" fill="#4285F4"/></svg>
                  <span class="gsearch__sep"></span>
                  <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="#4285F4" stroke-width="2"/><path d="M14 14l6 6" stroke="#4285F4" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
              </span>
              <span class="gavatar">G</span>
            </div>
            <div class="gtabs">
              <span class="on"><svg width="13" height="13" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2"/><path d="M14 14l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> All</span>
              <span>Images</span><span>Maps</span><span>News</span><span>Shopping</span><span>More</span>
            </div>
            <div class="gcount">About 2,140,000 results (0.48 seconds)</div>
            <div class="serpwin__body">
              <div class="serprows" id="serprows"></div>
            </div>
          </div>
          <div class="confetti" id="confetti" aria-hidden="true"></div>
        </div>
      </div>
    </div>
    <div class="scrollcue"><span>SCROLL TO CLIMB</span><span class="line"></span></div>
  </section>

  <!-- ============ SEARCHES MARQUEE ============ -->
  <section class="searches" aria-label="Searches your customers are running">
    <p class="searches__label mono reveal">Your customers are searching for businesses like these</p>
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        <div class="marquee__group">
          {#each searches as q}
            <span class="qpill"><svg class="qpill__ic" width="14" height="14" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2"/><path d="M14 14l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>{q}</span>
          {/each}
        </div>
        <div class="marquee__group">
          {#each searches as q}
            <span class="qpill"><svg class="qpill__ic" width="14" height="14" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2"/><path d="M14 14l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>{q}</span>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ============ PRICING ============ -->
  <section class="section" id="pricing">
    <div class="wrap">
      <div class="price-head">
        <p class="mono reveal">Packages</p>
        <h2 class="h-sect reveal">Pick your climb.</h2>
        <p class="lead reveal">Three ways to reach the <b>top of Google</b>. Month-to-month, cancel anytime, and you own everything I build.</p>
      </div>

      <div class="price-grid">
        <div class="tilt reveal"><div class="plan" data-tilt>
          <div class="plan__top">
            <span class="plan__name">Starter</span>
            <p class="plan__tagline">Get found in your town.</p>
          </div>
          <div class="plan__price">$300<span class="per">/mo</span></div>
          <p class="plan__outcome">You show up in your city’s map pack &amp; local search.</p>
          <ul class="plan__feat">
            <li class="feat feat--lead"><span class="feat__ic">★</span><span><b>Full technical SEO audit &amp; fixes</b><em>The foundation everything else ranks on.</em></span></li>
            <li class="feat"><span class="feat__ic">✓</span>Google Business Profile optimization</li>
            <li class="feat"><span class="feat__ic">✓</span>Conversion tracking — calls &amp; forms</li>
            <li class="feat"><span class="feat__ic">✓</span>Monthly ranking report + strategy call</li>
            <li class="feat"><span class="feat__ic">✓</span>Email support</li>
          </ul>
          <a href="#contact" class="btn" data-pkg="Starter — $300/mo">Choose Starter</a>
        </div></div>

        <div class="tilt reveal"><span class="plan__tag">Most popular</span><div class="plan featured" data-tilt>
          <div class="plan__top">
            <span class="plan__name">Growth</span>
            <p class="plan__tagline">Outrank your competitors.</p>
          </div>
          <div class="plan__price">$750<span class="per">/mo</span></div>
          <p class="plan__outcome">Page-one rankings that turn into calls &amp; bookings.</p>
          <ul class="plan__feat">
            <li class="feat feat--inherit"><span class="feat__ic feat__ic--dir"></span>Everything in Starter, plus —</li>
            <li class="feat feat--lead"><span class="feat__ic">★</span><span><b>Full analytics suite</b><em>See exactly where your customers come from.</em></span></li>
            <li class="feat"><span class="feat__ic">✓</span>Review generation &amp; management</li>
            <li class="feat"><span class="feat__ic">✓</span>Local citations &amp; directory cleanup</li>
            <li class="feat"><span class="feat__ic">✓</span>Competitor monitoring</li>
            <li class="feat"><span class="feat__ic">✓</span>Bi-weekly reporting</li>
            <li class="feat"><span class="feat__ic">✓</span>Priority email &amp; chat support</li>
          </ul>
          <a href="#contact" class="btn btn-accent" data-pkg="Growth — $750/mo">Choose Growth <span class="arrow">→</span></a>
        </div></div>

        <div class="tilt reveal"><div class="plan" data-tilt>
          <div class="plan__top">
            <span class="plan__name">Pro</span>
            <p class="plan__tagline">Dominate your market.</p>
          </div>
          <div class="plan__price">$900<span class="per">/mo</span></div>
          <p class="plan__outcome">You own every service &amp; neighborhood you serve.</p>
          <ul class="plan__feat">
            <li class="feat feat--inherit"><span class="feat__ic feat__ic--dir"></span>Everything in Growth, plus —</li>
            <li class="feat feat--lead"><span class="feat__ic">★</span><span><b>Multi-location / service-area SEO</b><em>Win every neighborhood you serve.</em></span></li>
            <li class="feat"><span class="feat__ic">✓</span>Site speed &amp; Core Web Vitals tuning</li>
            <li class="feat"><span class="feat__ic">✓</span>Schema / structured-data markup</li>
            <li class="feat"><span class="feat__ic">✓</span>Bi-weekly reporting + monthly strategy session</li>
            <li class="feat"><span class="feat__ic">✓</span>Same-day priority support</li>
          </ul>
          <a href="#contact" class="btn" data-pkg="Pro — $900/mo">Go Pro</a>
        </div></div>
      </div>
      <div class="price-guarantee reveal">
        <span class="pg__badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 12l2.3 2.3 4.7-4.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> Zero risk to new clients</span>
        <p class="pg__text">On page one within <b>90 days</b> — or the <b>entire thing is free.</b></p>
        <span class="pg__meta">No contracts · cancel anytime · replies within a day</span>
      </div>
    </div>
  </section>

  <!-- ============ CONTACT ============ -->
  <section class="section cta" id="contact" data-screen-label="Contact">
    <div class="wrap">
      <span class="eyebrow reveal"><span class="dot"></span> Usually replies within a day</span>
      <h2 class="h-sect reveal">Ready to own <span class="accent">page one?</span></h2>
      <p class="lead reveal" style="max-width:42ch; margin:0 auto;">Tell me about your business. I'll come back with an honest take and the package that fits.</p>
      <form class="contact-form reveal" id="leadForm" novalidate>
        <div class="field row2">
          <div class="field"><label for="f-name">Name <span class="req" aria-hidden="true">*</span></label><input id="f-name" name="name" type="text" required placeholder="Your name" /></div>
          <div class="field"><label for="f-email">Email <span class="req" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" required placeholder="you@business.com" /></div>
        </div>
        <div class="field row2">
          <div class="field"><label for="f-phone">Phone <span class="opt">optional</span></label><input id="f-phone" name="phone" type="tel" placeholder="(303) 555-0123" /></div>
          <div class="field field--budget"><label for="f-budget">What's your budget? <span class="opt">optional</span></label>
            <div class="budget-input-wrap">
              <span class="budget-prefix">$</span>
              <input id="f-budget" name="budget" type="number" min="0" step="50" placeholder="e.g. 300" />
              <span class="budget-suffix">USD / mo</span>
            </div>
          </div>
        </div>
        <div class="field"><label for="f-msg">What do you want to grow? <span class="req" aria-hidden="true">*</span> <span class="opt">at least 20 words</span></label><textarea id="f-msg" name="message" rows="4" required placeholder="Tell me about your business, the services you offer, and the customers you’d like more of — the more detail you share, the sharper the plan I can put together for you."></textarea></div>
        <input class="hp" tabindex="-1" autocomplete="off" name="website2" aria-hidden="true" />
        <p class="form-micro">Takes 20 seconds · only name &amp; email required — I’ll reply within a day.</p>
        <button type="submit" class="btn btn-accent">Send message <span class="arrow">→</span></button>
        <p class="form-note" id="formNote">Or email me directly · me@grahamzemel.com</p>
      </form>
    </div>
  </section>

  <footer class="foot">
    <div class="wrap foot__in">
      <a href="#top" class="brand"><span class="mark"><b>GZ</b></span><span>Graham Zemel</span></a>
      <span class="mono">SEO · grahamzemel.com/seo</span>
      <span class="mono">© Graham Zemel 2026</span>
    </div>
  </footer>

</main>
</div>
