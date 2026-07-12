<script>
  import { onMount } from "svelte";

  const SCRAMBLE_CHARS = "!<>-_/[]{}=+*^#ABCDabcd0123456789";

  function scrambleText(el, text, duration = 1050) {
    const chars = text.split("");
    const totalFrames = Math.round(duration / 33);
    let frame = 0;
    el.style.animation = "none";
    el.style.transform = "none";
    // Pre-fill with scrambled chars BEFORE revealing — zero flash of real text
    el.textContent = chars.map(ch =>
      !/[a-zA-Z0-9]/.test(ch) ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    ).join("");
    el.style.opacity = "1";
    const id = setInterval(() => {
      const progress = ++frame / totalFrames;
      el.textContent = chars
        .map((ch, i) => {
          // preserve spaces and punctuation — only scramble letters and digits
          if (!/[a-zA-Z0-9]/.test(ch)) return ch;
          if (progress >= (i + 1) / chars.length) return ch;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");
      if (frame >= totalFrames) {
        clearInterval(id);
        el.textContent = text;
      }
    }, 33);
  }

  function cancelFadeIn(el) {
    if (!el) return;
    // Cancel the CSS fade-in animation so the element snaps to opacity:1 (default).
    // Children control their own visibility via CSS opacity:0 — don't touch it here.
    el.style.animation = "none";
    el.style.transform = "none";
  }

  onMount(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const h1         = document.querySelector(".hero-title");
    const eyebrowWrap = document.querySelector(".hero-eyebrow");
    const eyebrowText = document.querySelector(".hero-eyebrow-text");
    const metaWrap   = document.querySelector(".hero-meta");
    const roles      = Array.from(document.querySelectorAll(".hero-meta .role"));

    function runScramble() {
      // 1. Name — immediate
      if (h1) scrambleText(h1, "Graham Zemel", 1050);

      // 2. Eyebrow badge — slight lag, short decode
      cancelFadeIn(eyebrowWrap);
      if (eyebrowText) {
        setTimeout(() => scrambleText(eyebrowText, eyebrowText.textContent.trim(), 720), 120);
      }

      // 3. Role tags — cascade left-to-right across the meta row
      cancelFadeIn(metaWrap);
      roles.forEach((role, i) => {
        setTimeout(() => scrambleText(role, role.textContent.trim(), 620), 300 + i * 130);
      });
    }

    if (!document.body.dataset.loading) {
      runScramble();
    } else {
      window.addEventListener("gz:loaded", runScramble, { once: true });
      return () => window.removeEventListener("gz:loaded", runScramble);
    }

    // Fade out scroll cue the moment the user actually scrolls
    const scrollCue = /** @type {HTMLElement|null} */ (document.querySelector(".hero-scroll"));
    if (scrollCue) {
      window.addEventListener("scroll", () => {
        scrollCue.style.transition = "opacity 500ms var(--ease)";
        scrollCue.style.opacity = "0";
        scrollCue.style.pointerEvents = "none";
      }, { passive: true, once: true });
    }
  });
</script>

<section class="hero">
  <div class="hero-eyebrow custom-fade-in anim-delay-200" aria-hidden="true">
    <span class="hero-eyebrow-dot" />
    <span class="hero-eyebrow-text">Just shipped: TextCloaker</span>
  </div>

  <h1
    class="hero-title custom-fade-in anim-delay-400"
    data-admin-mobile-trigger="name"
  >
    Graham Zemel
  </h1>

  <p class="hero-meta custom-fade-in anim-delay-600">
    <span class="role role--lead">FULL-STACK ENGINEER</span>
    <span class="role-group">
      <span class="role">AI &amp; SECURITY</span>
      <span class="role">CS @ CU BOULDER</span>
    </span>
  </p>

  <p class="hero-blurb custom-fade-in anim-delay-700">
    Right now I'm shipping <em>FratDoor</em> (event ops used by 42 fraternities),
    <em>TextCloaker</em> (AI text cloaking, 7,000+ users), and writing daily for
    <em>The Gray Area</em>.
  </p>

  <!-- Mobile-only shortcuts: jump straight to the good stuff instead of
       scrolling the whole page. Desktop has the navbar for this. -->
  <nav class="hero-quicklinks custom-fade-in anim-delay-800" aria-label="Jump to a section">
    <a class="ql-chip" href="#about">About</a>
    <a class="ql-chip" href="#resume">Resume</a>
    <a class="ql-chip" href="#projects">Projects</a>
    <a class="ql-chip" href="#get-in-touch">Contact</a>
  </nav>

  <!-- Mobile-only: core social links as a single row right below the quicklinks.
       Resume + contact-card live in the nav bar already, so they're omitted here.
       Desktop renders these in the fixed rotated sidebar (socials.svelte). -->
  <div class="hero-socials custom-fade-in anim-delay-900" aria-label="Social links">
    <a class="hero-social" href="https://www.linkedin.com/in/grahamzemel/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
      <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
    </a>
    <a class="hero-social" href="https://www.instagram.com/grahamzemel/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
      <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
    </a>
    <a class="hero-social" href="https://github.com/grahamzemel" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
      <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
    </a>
  </div>

  <a class="hero-scroll custom-fade-in anim-delay-900" href="#about" aria-label="Scroll to About">
    <span class="hero-scroll-text">Scroll</span>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="6 12 12 19 18 12" />
    </svg>
  </a>
</section>

<style lang="postcss">
  .hero {
    /* The hero owns the first viewport. About Me lives below the fold. */
    position: relative;
    min-height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    /* Asymmetric padding pushes the centered text block down slightly,
       leaving room for the absolute-positioned scroll indicator at bottom */
    padding-top: 6rem;
    padding-bottom: 5rem;
    max-width: 100%;
  }
  @media (min-width: 768px) {
    .hero {
      min-height: calc(100vh - 4.5rem);
      padding-top: 9rem;
      padding-bottom: 6rem;
    }
  }


  /* ---------- Eyebrow status ---------- */
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
    flex: 0 0 auto;
    align-self: flex-start;
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: oklch(0.78 0.008 250);
    padding: 0.4rem 0.85rem 0.4rem 0.7rem;
    border-radius: 9999px;
    border: 1px solid oklch(0.32 0.012 250);
    background: oklch(0.10 0.012 250 / 0.78);
    backdrop-filter: blur(10px) saturate(1.2);
    -webkit-backdrop-filter: blur(10px) saturate(1.2);
  }

  .hero-eyebrow-dot {
    display: inline-block;
    height: 0.4375rem;
    width: 0.4375rem;
    border-radius: 9999px;
    background: oklch(0.78 0.18 145);
    box-shadow: 0 0 0 3px oklch(0.78 0.18 145 / 0.18);
    animation: pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* ---------- Big name (fluid, never overflows, never wraps) ---------- */
  .hero-title {
    font-family: "Source Serif Pro", serif;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.035em;
    margin: 1.25rem 0 0;
    color: oklch(0.985 0.004 250);

    /* Single-line, fluid sized to fit the content column.
       Conservative max prevents overflow at any viewport. */
    white-space: nowrap;
    font-size: clamp(2.5rem, 9vw, 6.5rem);

    /* Strong depth shading so the title sits cleanly over the fractal */
    text-shadow:
      0 1px 0 oklch(1 0 0 / 0.04),
      0 4px 32px oklch(0 0 0 / 0.7),
      0 2px 8px oklch(0 0 0 / 0.85),
      0 0 1px oklch(0 0 0 / 0.7);

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  /* ---------- Meta row (titles, uppercase mono) ---------- */
  .hero-meta {
    margin: 1.05rem 0 0;
    /* Two tiers on mobile: the headline role on its own line, specializations
       dimmer beneath it. Avoids a wrapped middot dangling at a line edge and
       gives a clearer read of the primary role. */
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    color: oklch(0.82 0.008 250);
    line-height: 1.4;
  }
  .role { white-space: nowrap; }
  .role--lead { color: oklch(0.92 0.008 250); }
  .role-group {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.2rem 0.5rem;
    color: oklch(0.7 0.008 250);
  }
  /* Separator rides with the preceding role so it never orphans on a wrap. */
  .role-group .role:not(:last-child)::after {
    content: "·";
    margin-left: 0.5rem;
    color: oklch(0.5 0.01 250);
  }
  @media (min-width: 768px) {
    /* Desktop has room for a single inline line: lead · AI & Security · CS. */
    .hero-meta {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0 0.5rem;
      font-size: 0.8125rem;
      letter-spacing: 0.16em;
    }
    .role--lead::after {
      content: "·";
      margin-left: 0.5rem;
      color: oklch(0.5 0.01 250);
    }
  }

  /* ---------- Bio blurb ---------- */
  .hero-blurb {
    margin: 1.5rem 0 0;
    max-width: 38ch;
    font-family: "Source Serif Pro", serif;
    font-weight: 400;
    font-size: 1.0625rem;
    line-height: 1.5;
    color: oklch(0.86 0.008 250);
  }
  @media (min-width: 768px) {
    .hero-blurb {
      font-size: 1.25rem;
      max-width: 36ch;
      line-height: 1.45;
      margin-top: 1.75rem;
    }
  }
  .hero-blurb em {
    font-style: italic;
    color: oklch(0.96 0.005 250);
    font-weight: 500;
  }

  /* ---------- Animations ---------- */
  .custom-fade-in {
    animation: fade-in-animation 1000ms var(--ease);
    animation-fill-mode: both;
  }
  .anim-delay-200 { animation-delay: 200ms; }
  .anim-delay-400 { animation-delay: 400ms; }
  .anim-delay-600 { animation-delay: 600ms; }
  .anim-delay-700 { animation-delay: 750ms; }
  .anim-delay-800 { animation-delay: 850ms; }
  .anim-delay-900 { animation-delay: 950ms; }

  /* ---------- Mobile quick-links (hidden on desktop — navbar covers it) ---------- */
  .hero-quicklinks {
    display: none;
  }
  @media (max-width: 767px) {
    .hero-quicklinks {
      /* One cohesive segmented control: a single rounded bar with hairline
         dividers between four equal segments, instead of separate pills. */
      display: flex;
      margin-top: 1.75rem;
      width: 100%;
      max-width: 20rem;
      border-radius: 9999px;
      border: 1px solid oklch(0.34 0.012 250);
      background: oklch(0.12 0.012 250 / 0.72);
      backdrop-filter: blur(10px) saturate(1.2);
      -webkit-backdrop-filter: blur(10px) saturate(1.2);
      overflow: hidden;
    }
  }
  .ql-chip {
    flex: 1 1 0;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    white-space: nowrap;
    color: oklch(0.86 0.008 250);
    padding: 0.7rem 0.35rem;
    text-decoration: none;
    transition: color 200ms var(--ease),
      background 200ms var(--ease);
  }
  /* Hairline divider between segments (1px structural rule, not an accent). */
  .ql-chip + .ql-chip {
    border-left: 1px solid oklch(0.30 0.012 250);
  }
  .ql-chip:hover,
  .ql-chip:active {
    color: oklch(0.985 0.004 250);
    background: oklch(0.18 0.03 160 / 0.6);
  }

  /* ---------- Mobile social grid (3×2, below quicklinks) ---------- */
  .hero-socials {
    display: none;
  }
  @media (max-width: 767px) {
    .hero-socials {
      /* Single ghost-glyph row (not a second grid of bordered circles) so the
         segmented nav bar above stays the clear primary action. A tight
         left-aligned cluster; the negative margin pulls the first glyph back
         in line with the text column (the 44px hit area insets it otherwise). */
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 1.2rem;
      margin-left: -0.7rem;
    }
  }
  .hero-social {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Generous 44px hit area for touch, but no container chrome at rest. */
    height: 2.75rem;
    width: 2.75rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    /* Soft shadow keeps the bare glyph legible over the busy fractal. */
    color: oklch(0.82 0.01 250);
    filter: drop-shadow(0 1px 4px oklch(0 0 0 / 0.55));
    transition: color 200ms var(--ease),
      border-color 200ms var(--ease),
      background 200ms var(--ease);
  }
  .hero-social:hover,
  .hero-social:active {
    /* Tinted circle surfaces only on interaction. */
    color: oklch(0.985 0.004 250);
    border-color: oklch(0.78 0.18 145 / 0.45);
    background: oklch(0.16 0.03 160 / 0.7);
  }
  .hero-social svg {
    height: 1.3rem;
    width: 1.3rem;
  }

  /* ---------- Scroll indicator (absolute, viewport-centered bottom) ---------- */
  .hero-scroll {
    position: absolute;
    /* Center via auto margins, NOT transform: translateX(-50%). The
       `.custom-fade-in` animation ends on `transform: translateY(0)` with
       fill-mode:both, which would clobber a centering transform and shove the
       indicator off-center by half its width. Auto margins are immune. */
    left: 0;
    right: 0;
    margin-inline: auto;
    width: fit-content;
    bottom: 1.75rem;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: oklch(0.62 0.012 250);
    text-decoration: none;
    transition: color 220ms var(--ease);
  }
  @media (min-width: 768px) {
    .hero-scroll { bottom: 2.5rem; }
  }
  .hero-scroll:hover { color: oklch(0.92 0.005 250); }
  .hero-scroll-text {
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .hero-scroll svg {
    height: 1rem;
    width: 1rem;
    animation: bounce-y 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes bounce-y {
    0%, 100% { transform: translateY(0); opacity: 0.55; }
    50%      { transform: translateY(4px); opacity: 1; }
  }

  @keyframes fade-in-animation {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px oklch(0.78 0.18 145 / 0.20); }
    50%      { box-shadow: 0 0 0 6px oklch(0.78 0.18 145 / 0); }
  }

  /* Hide scramble targets from first paint — scrambleText reveals each one */
  .hero-title,
  .hero-eyebrow-text,
  .hero-meta .role {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .custom-fade-in,
    .hero-eyebrow-dot {
      animation: none !important;
    }
    .custom-fade-in {
      opacity: 1;
      transform: none;
    }
    /* Reveal scramble targets immediately for reduced-motion users */
    .hero-title,
    .hero-eyebrow-text,
    .hero-meta .role {
      opacity: 1 !important;
    }
  }
</style>
