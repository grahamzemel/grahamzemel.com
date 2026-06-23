<script lang="ts">
  import { onMount } from "svelte";
  import Visibility from "$lib/components/visibility.svelte";

  let isVisible = false;
  let hasChanged = false;
  let hasObserverSupport = true;

  const resumeHref = "/graham-zemel-resume.pdf";

  // LinkedIn's profile.js (loaded in app.html) only scans the DOM on
  // window.load. In dev with HMR — and on cold loads when SvelteKit hydrates
  // after window.load — the badge can stay as the fallback link. Re-inject
  // the loader on mount so its IIFE re-runs against the freshly mounted
  // badge with a brand-new captured `badges` array.
  onMount(() => {
    const badge = document.querySelector(".LI-profile-badge");
    if (badge?.querySelector("iframe")) return; // already rendered

    badge?.removeAttribute("data-rendered");
    badge?.removeAttribute("data-uid");

    document
      .querySelectorAll('script[data-li-rerun]')
      .forEach((s) => s.remove());
    const s = document.createElement("script");
    s.src = "https://platform.linkedin.com/badges/js/profile.js";
    s.async = true;
    s.defer = true;
    s.dataset.liRerun = String(Date.now());
    document.body.appendChild(s);
  });
</script>

<div class="sm:mt-[12vh] mt-10" aria-hidden="true">
  <Visibility
    bind:hasObserverSupport
    visibilityUpdate={(state) => {
      if (!hasChanged && state !== false) {
        hasChanged = true;
        isVisible = state;
      }
    }}
  />
</div>

<section
  id="resume"
  class="section-band custom-transition {!hasObserverSupport || isVisible
    ? 'opacity-100'
    : 'opacity-0'}"
>
  <h1 class="font-serif font-bold sm:text-6xl text-4xl">Resume</h1>
  <div class="resume-layout mt-8">
    <div class="resume-summary">
      <p class="resume-kicker">Builder at heart</p>
      <h2 class="resume-lead">
        Full-stack engineer building SaaS, AI tools, and security software.
      </h2>

      <p class="resume-copy">
        CS student at CU Boulder and Director of Technology for IFC on the
        Hill. My work spans event platforms, AI products, security research,
        and data-heavy web apps — usually whichever problem is worth solving
        next.
      </p>

      <div class="resume-stat-grid">
        <div class="resume-stat">
          <span class="resume-stat-value">42</span>
          <span class="resume-stat-label">Fraternities using FratDoor</span>
        </div>
        <div class="resume-stat">
          <span class="resume-stat-value">300,000+</span>
          <span class="resume-stat-label">Check-ins processed</span>
        </div>
        <div class="resume-stat">
          <span class="resume-stat-value">7,000+</span>
          <span class="resume-stat-label">TextCloaker users</span>
        </div>
        <div class="resume-stat">
          <span class="resume-stat-value">3.7</span>
          <span class="resume-stat-label">CU Boulder GPA</span>
        </div>
      </div>

      <div class="resume-bottom">
        <div class="resume-bottom-text">
          <ul class="resume-points">
            <li>I move fast, but I care about getting the details right.</li>
            <li>I like owning the process from rough concept to finished product.</li>
            <li>I’m usually building the next tool, system, or experiment.</li>
          </ul>

          <div class="resume-links">
            <a href={resumeHref} target="_blank" rel="noopener noreferrer">
              View full resume
            </a>
            <a href={resumeHref} download="Graham-Zemel-Resume.pdf">
              Download PDF
            </a>
          </div>
        </div>

        <div class="linkedin-card">
          <div
            class="badge-base LI-profile-badge"
            data-locale="en_US"
            data-size="medium"
            data-theme="dark"
            data-type="VERTICAL"
            data-vanity="grahamzemel"
            data-version="v1"
          >
            <a
              class="badge-base__link LI-simple-link"
              href="https://www.linkedin.com/in/grahamzemel?trk=profile-badge"
            >
              Graham Zemel
            </a>
          </div>
        </div>
      </div>
    </div>

    <figure class="resume-document">
      <a class="resume-page" href={resumeHref} target="_blank" rel="noopener noreferrer" aria-label="Open full resume PDF">
        <img
          src="/resume-preview.png"
          alt="Graham Zemel resume — first page preview"
          loading="lazy"
          decoding="async"
        />
        <span class="resume-page-overlay" aria-hidden="true">
          <span class="resume-page-cta">
            Open full PDF
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </span>
      </a>

      <figcaption class="resume-document-meta">
        <span class="resume-doc-kicker">Resume</span>
        <a class="resume-doc-download" href={resumeHref} download="Graham-Zemel-Resume.pdf">
          Download PDF
        </a>
      </figcaption>
    </figure>
  </div>
</section>

<style lang="postcss">
  .custom-transition {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1500ms;
  }

  .resume-layout {
    @apply grid gap-8;
    align-items: stretch;
  }

  .resume-summary {
    @apply rounded-2xl border border-slate-800 p-6 md:p-8;
    background: rgba(11, 15, 20, 0.72);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .resume-kicker {
    @apply uppercase tracking-[0.22em] text-xs text-gray-500 font-semibold;
  }

  .resume-lead {
    @apply mt-4 font-serif text-3xl leading-tight text-white;
  }

  .resume-copy {
    @apply mt-5 text-lg leading-relaxed text-gray-300;
  }

  .resume-stat-grid {
    @apply mt-8 grid grid-cols-2 gap-3;
  }

  .resume-stat {
    @apply rounded-xl border border-slate-800 px-4 py-4;
    background: rgba(15, 23, 42, 0.36);
  }

  .resume-stat-value {
    @apply block text-2xl font-semibold text-white;
  }

  .resume-stat-label {
    @apply mt-1 block text-sm leading-snug text-gray-400;
  }

  .resume-points {
    @apply mt-8 space-y-3 text-gray-300;
  }

  .resume-points li {
    @apply list-none pl-5 relative;
  }

  .resume-points li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.7rem;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 9999px;
    background: rgba(103, 232, 249, 0.7);
  }

  .resume-links {
    @apply mt-8 flex flex-wrap gap-5 text-sm text-gray-400;
  }

  .resume-links a {
    @apply transition-colors;
  }

  /* ---------- Right column: extended resume document image ---------- */
  .resume-document {
    margin: 0;
    min-width: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .resume-page {
    position: relative;
    display: block;
    border-radius: 0.625rem;
    overflow: hidden;
    border: 1px solid oklch(0.32 0.014 250);
    background: oklch(0.18 0.014 250);
    box-shadow:
      0 1px 0 oklch(1 0 0 / 0.04) inset,
      0 24px 60px oklch(0 0 0 / 0.45);
    transition:
      transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 320ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .resume-page img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1236 / 1600;
    object-fit: cover;
  }

  .resume-page:hover {
    transform: translateY(-2px);
    border-color: oklch(0.45 0.06 165);
    box-shadow:
      0 1px 0 oklch(1 0 0 / 0.06) inset,
      0 28px 70px oklch(0 0 0 / 0.55);
  }

  .resume-page-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    pointer-events: none;
    opacity: 0;
    background: oklch(0 0 0 / 0.55);
    transition: opacity 240ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .resume-page:hover .resume-page-overlay {
    opacity: 1;
  }

  .resume-page-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: oklch(0.99 0.02 165);
    background: oklch(0.18 0.02 250 / 0.85);
    border: 1px solid oklch(0.55 0.18 165 / 0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  .resume-page-cta svg {
    height: 0.875rem;
    width: 0.875rem;
  }

  .resume-document-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 0.125rem;
  }

  .resume-doc-kicker {
    font-family: "JetBrains Mono", "SF Mono", ui-monospace, Menlo, monospace;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: oklch(0.55 0.012 250);
  }

  .resume-doc-download {
    font-size: 0.875rem;
    font-weight: 500;
    color: oklch(0.86 0.13 165);
    text-decoration: none;
    transition: color 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .resume-doc-download:hover {
    color: oklch(0.95 0.06 165);
  }

  /* ---------- Bottom row: bullets/links, then the LinkedIn embed ----------
     This used to be a 2-column grid (links | badge). LinkedIn's badge is a
     flaky third-party embed that often fails to render, which left the right
     column empty and made the whole block look shoved to the left. Stack it
     instead: the bullets/links span the full width and read as centered, and
     the badge (when it loads) sits centered below — graceful either way. */
  .resume-bottom {
    margin-top: auto;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .resume-bottom-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .resume-bottom-text .resume-points {
    @apply mt-0;
  }
  .resume-bottom-text .resume-links {
    @apply mt-0;
  }

  /* ---------- LinkedIn embed wrapper ---------- */
  .linkedin-card {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* When the badge fails to render it collapses to nothing — no empty gap. */
  .linkedin-card:empty {
    display: none;
  }
  /* Hide the fallback "Graham Zemel" anchor that LinkedIn leaves in the
     badge container alongside the rendered iframe. */
  .linkedin-card :global(.LI-simple-link) {
    display: none;
  }
  .linkedin-card :global(.LI-profile-badge) {
    max-width: 100%;
  }
  .linkedin-card :global(iframe) {
    display: block;
    border-radius: 0.625rem;
    overflow: hidden;
  }

  .resume-links a:hover {
    @apply text-accent-300;
  }

  @media (min-width: 1024px) {
    .resume-layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 3rem;
    }
  }
  @media (min-width: 1280px) {
    .resume-layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 3.5rem;
    }
  }

  @media (max-width: 640px) {
    /* Keep the stats as a compact 2×2 on phones — a single stacked column made
       four giant full-width blocks that ate the screen. */
    .resume-stat-grid {
      @apply mt-6 grid-cols-2 gap-2.5;
    }
    .resume-stat {
      @apply px-3 py-3;
    }
    .resume-stat-value {
      @apply text-xl;
    }
    .resume-stat-label {
      @apply mt-0.5 text-xs;
    }

    .resume-lead {
      @apply text-2xl;
    }

    .resume-document {
      max-width: 100%;
    }
  }
</style>
