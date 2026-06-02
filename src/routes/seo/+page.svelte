<script>
  import { onMount, onDestroy } from 'svelte';
  import '$lib/seo.css';

  onMount(async () => {
    // SEO scene runs client-side only (DOM + scroll APIs)
    const gsap = (await import('gsap')).default;
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const Lenis = (await import('lenis')).default;
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    window.Lenis = Lenis;
    gsap.registerPlugin(ScrollTrigger);
    await import('$lib/climb.js');   // defines window.initClimb
    await import('$lib/engine.js');  // boots Lenis + parallax + reveals + the climb
  });

  onDestroy(() => {
    // SvelteKit client-side navigation away from /seo: tear down the global
    // side effects engine.js / Lenis create so smooth-scroll + ScrollTrigger
    // pins don't leak onto the rest of the (dark) site.
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
  <a href="#top" class="brand"><span class="mark"><b>GZ</b></span><span>Graham Zemel</span></a>
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

        <div class="tilt reveal"><div class="plan featured" data-tilt>
          <span class="plan__tag">Most popular</span>
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
          <div class="field"><label for="f-pkg">Package <span class="opt">optional</span></label>
            <select id="f-pkg" name="package">
              <option value="">Which package fits?</option>
              <option>Starter — $300/mo</option>
              <option>Growth — $750/mo</option>
              <option>Pro — $900/mo</option>
              <option>Other / not sure yet</option>
            </select>
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
