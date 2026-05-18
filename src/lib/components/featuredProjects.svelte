<script lang="ts">
  import Visibility from "$lib/components/visibility.svelte";
  let isVisible = false;
  let hasChanged = false;
  let hasObserverSupport = true;

  type StackItem = {
    label: string;
    slug?: string;
    iconUrl?: string;
    iconSvg?: string;
    bg: string;
  };

  type FeaturedProject = {
    title: string;
    description: string;
    image: string;
    demoLink: string | null;
    repoLink: string | null;
    tags: string[];
    stack: StackItem[];
    highlights: string[];
    achievements: string[];
    stats?: { label: string; value: string }[];
    companion?: { label: string; href: string };
    companions?: { label: string; href: string }[];
  };

  const indexedDbIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="7" ry="3"></ellipse>
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"></path>
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path>
    </svg>
  `;

  const projects: FeaturedProject[] = [
    {
      title: "FratDoor",
      description:
        "FratDoor is the check-in operating system I built and deployed as Director of Technology for IFC on the Hill at CU Boulder. What started as a smarter replacement for printed door lists grew into a full event-ops platform: 42 chapters running ID/QR scanning, blacklist enforcement, ticketing, capacity gates, and live attendance analytics. Most of the hard engineering went into reliability — keeping scanners working through venue WiFi blackouts (which became its own open-source library), deduplicating swipes when two doors race, and squeezing Firestore reads down 70–80% via aggressive client-side caching. It's processed 150,000+ swipes across 300+ events and become the de facto door system on the Hill.",
      image: "/fratdoor.png",
      demoLink: "https://fratdoor.com",
      repoLink: null,
      tags: ["Web", "Internet", "IFC", "Website"],
      stack: [
        { label: "Svelte", slug: "svelte", bg: "#ff3e00" },
        { label: "Node.js", slug: "nodedotjs", bg: "#3c873a" },
        { label: "Express", slug: "express", bg: "#1f2937" },
        { label: "Firestore", slug: "firebase", bg: "#ffca28" },
        {
          label: "Heroku",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-plain.svg",
          bg: "#430098",
        },
        {
          label: "Memcached",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/memcached/memcached-plain.svg",
          bg: "#0f766e",
        },
        {
          label: "AWS S3",
          iconUrl:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
          bg: "#f59e0b",
        },
        { label: "Stripe", slug: "stripe", bg: "#635bff" },
        { label: "Vonage", slug: "vonage", bg: "#e10098" },
        { label: "IndexedDB", iconSvg: indexedDbIcon, bg: "#1d4ed8" },
      ],
      highlights: [
        "Card scanning + ID validation for high-volume check-ins",
        "Real-time attendance, capacity tracking, and guest list controls",
        "Offline-first sync for network-interrupted environments — powered by offline-sync-engine, a library I open-sourced after realizing nothing off-the-shelf handled exactly-once delivery on flaky venue WiFi",
        "Silent alarm with SMS notifications to administrators",
      ],
      achievements: [
        "Reduced Firestore reads by 70–80% via caching",
        "Optimistic UI updates with conflict resolution",
        "Published offline-sync-engine to NPM — IndexedDB mutation queue + idempotent server primitives in ~900 lines, zero runtime deps",
        "Analytics dashboard for attendance and guest list trends",
      ],
      stats: [
        { label: "Fraternities", value: "42+" },
        { label: "Swipes", value: "150,000+" },
        { label: "Events", value: "300+" },
        { label: "Tickets", value: "3,000" },
      ],
      companion: {
        label: "Companion product: CU EventHub (party registration + oversight)",
        href: "https://cueventhub.netlify.app/",
      },
      companions: [
        {
          label: "Companion library: offline-sync-engine on NPM (try the live demo)",
          href: "https://grahamzemel.github.io/offline-sync-engine/",
        },
      ],
    },
    {
      title: "TextCloaker",
      description:
        "TextCloaker is the AI text protection tool I started after watching students and writers get falsely flagged by brittle AI detectors. It rewrites AI-generated text just enough to clear common detection without changing meaning or breaking the prose — running locally as a Chrome extension that hooks straight into Google Docs, or via the web app for one-off cloaks. Under the hood: a paraphrase + synonym pipeline tuned to keep readability high, an AI Check mode that flags risky passages before submission, and a free tier so creators on a budget can still protect legitimate work. 7,000+ users across 40+ countries have cloaked over 3.3 million characters with it to date.",
      image: "/textcloakerss.png",
      demoLink: "https://text-cloaker.com",
      repoLink: null,
      tags: ["AI", "Web", "Internet", "Website"],
      stack: [
        { label: "Svelte", slug: "svelte", bg: "#ff3e00" },
        { label: "Firebase", slug: "firebase", bg: "#ffca28" },
        { label: "Chrome Extension", slug: "googlechrome", bg: "#4285f4" },
        { label: "TypeScript", slug: "typescript", bg: "#3178c6" },
        { label: "Vite", slug: "vite", bg: "#646cff" },
      ],
      highlights: [
        "Cloak, Un‑Cloak, and AI Check workflows",
        "Paraphrase + Synonym tools for quick rewrites",
        "Keeps output readable with minimal visible changes",
        "Chrome extension workflow for Google Docs",
      ],
      achievements: [
        "Chrome extension integrated with Google Docs",
        "Explored in The Gray Area (May 2023)",
        "Featured in AI tool directories and reviews",
        "Active development with expanded obfuscation planned",
      ],
      stats: [
        { label: "Users", value: "7,000+" },
        { label: "Cloaks", value: "750+" },
        { label: "Characters", value: "3,334,000+" },
        { label: "Countries", value: "40+" },
      ],
    },
  ];

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\\./, "");
    } catch {
      return url;
    }
  };

  const getClassesForTag = (tag: string) => {
    switch (tag) {
      case "Quantum":
        return "bg-red-50 text-red-600";
      case "AI":
        return "bg-orange-50 text-orange-600";
      case "Web":
        return "bg-lime-50 text-lime-600";
      case "Game":
        return "bg-pink-50 text-pink-600";
      case "Extension":
        return "bg-cyan-50 text-cyan-600";
      case "Internet":
        return "bg-teal-50 text-teal-600";
      case "Python":
        return "bg-green-50 text-green-600";
      case "Telegram":
        return "bg-blue-50 text-blue-600";
      case "Shell":
        return "bg-purple-50 text-purple-600";
      case "Bash":
        return "bg-red-50 text-red-600";
      case "Library":
        return "bg-indigo-50 text-indigo-600";
      case "Automation":
        return "bg-yellow-50 text-yellow-600";
      case "Hackathon":
        return "bg-pink-50 text-pink-600";
      case "Crypto":
        return "bg-blue-50 text-blue-600";
      case "IFC":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-blue-50 text-blue-600";
    }
  };
</script>

<div class="sm:mt-[16vh] mt-10" aria-hidden="true">
  <Visibility
    bind:hasObserverSupport
    visibilityUpdate={(state) => {
      // Only update one time (once visible)
      if (!hasChanged && state !== false) {
        hasChanged = true;
        isVisible = state;
      }
    }}
  />
</div>

<section
  class="section-band custom-transition {!hasObserverSupport || isVisible
    ? 'opacity-100'
    : 'opacity-0'}"
>
  <h1 class="font-serif font-bold sm:text-6xl text-4xl">
    Featured Projects
  </h1>

  <div class="featured-grid mt-10">
    {#each projects as project}
      <article class="featured-card">
        <div class="featured-media">
          <img
            src={project.image}
            alt={project.title}
            class="aspect-video object-cover w-full rounded-t-xl"
            loading="lazy"
          />
        </div>
        <div class="featured-body">
          <div class="featured-head">
            <div>
              <h3 class="text-2xl font-semibold">{project.title}</h3>
              <p class="mt-2 text-gray-300">{project.description}</p>
            </div>
            <div class="tag-row mt-4">
              {#each project.tags as tag}
                <span class="tag {getClassesForTag(tag)}">{tag}</span>
              {/each}
            </div>
            <div class="mt-4 flex justify-center">
              {#if project.demoLink && !project.repoLink}
                <a
                  class="cta-button"
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  <span class="cta-label">Try it</span>
                  <span class="cta-divider" aria-hidden="true" />
                  <span class="cta-url">{getDomain(project.demoLink)}</span>
                  <span class="cta-arrow" aria-hidden="true">↗</span>
                </a>
              {:else}
                <div class="cta-row">
                  {#if project.demoLink}
                    <a
                      class="cta-inline"
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      Try it → {getDomain(project.demoLink)}
                    </a>
                  {/if}
                  {#if project.repoLink}
                    <a
                      class="cta-inline"
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferer"
                    >
                      View repo
                    </a>
                  {/if}
                </div>
              {/if}
            </div>
          </div>

          {#if project.stats}
            <div class="stats-row mt-6">
              {#each project.stats as stat}
                <div class="stat-card">
                  <div class="stat-num">{stat.value}</div>
                  <div class="stat-label">{stat.label}</div>
                </div>
              {/each}
            </div>
          {/if}

          <div class="section-block mt-6">
            <h4 class="section-title">Tech Stack</h4>
            <div class="stack-grid">
              {#each project.stack as item}
                <div class="stack-item" aria-label={item.label}>
                  {#if item.iconSvg}
                    <div class="stack-icon stack-icon--svg" style={`background:${item.bg}`}>
                      {@html item.iconSvg}
                    </div>
                  {:else}
                    <div class="stack-icon" style={`background:${item.bg}`}>
                      <img
                        src={item.iconUrl ??
                          `https://cdn.simpleicons.org/${item.slug}/ffffff?viewbox=auto&size=48`}
                        alt={`${item.label} logo`}
                        loading="lazy"
                      />
                    </div>
                  {/if}
                  <span class="stack-label">{item.label}</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="section-block mt-6">
            <h4 class="section-title">Core Features</h4>
            <ul class="feature-list">
              {#each project.highlights as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>

          <div class="section-block mt-6">
            <h4 class="section-title">Technical Achievements</h4>
            <ul class="feature-list">
              {#each project.achievements as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>

          {#if project.companion}
            <p class="mt-6 text-gray-300">
              <a
                class="link-highlight"
                href={project.companion.href}
                target="_blank"
                rel="noopener noreferer"
              >
                {project.companion.label}
              </a>
            </p>
          {/if}

          {#if project.companions}
            {#each project.companions as companion}
              <p class="mt-2 text-gray-300">
                <a
                  class="link-highlight"
                  href={companion.href}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  {companion.label}
                </a>
              </p>
            {/each}
          {/if}
        </div>
      </article>
    {/each}
  </div>
</section>

<style lang="postcss">
  .custom-transition {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1500ms;
  }

  .featured-grid {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch;
  }

  .featured-card {
    @apply rounded-xl bg-[#070a0d] bg-opacity-60 shadow flex flex-col overflow-hidden;
    border: 1px solid oklch(0.30 0.012 250);
    transition: border-color 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .featured-card:hover {
    border-color: oklch(0.42 0.012 250);
  }

  .featured-body {
    @apply p-6 flex flex-col;
  }

  .tag-row {
    @apply flex flex-wrap gap-2;
  }

  .tag {
    @apply inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold;
  }

  .section-block {
    @apply border-t border-slate-800 pt-4;
  }

  .section-title {
    @apply text-sm uppercase tracking-widest text-gray-400;
  }

  .stack-grid {
    @apply mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4;
  }

  .stack-item {
    @apply flex flex-col items-center gap-2;
  }

  .stack-icon {
    @apply h-12 w-12 rounded-2xl flex items-center justify-center bg-[#0b0f14] border border-slate-800 shadow;
  }

  .stack-icon img {
    @apply h-7 w-7 object-contain;
    filter: brightness(0) invert(1);
  }

  .stack-label {
    @apply text-xs text-gray-400;
  }

  .stack-icon--svg :global(svg) {
    @apply h-7 w-7;
    color: #ffffff;
  }

  .feature-list {
    @apply mt-3 list-disc ml-5 space-y-1 text-gray-300;
  }

  .stats-row {
    @apply grid grid-cols-2 gap-4;
  }

  .stat-card {
    @apply rounded-lg border border-slate-800 bg-[#0b0f14] px-4 py-3;
  }

  .stat-num {
    @apply text-2xl font-bold text-accent-300;
  }

  .stat-label {
    @apply text-xs uppercase tracking-widest text-gray-400;
  }

  .link-highlight {
    @apply text-accent-300 underline decoration-accent-300/60 underline-offset-4;
  }

  .link-highlight:hover {
    @apply text-accent-200 decoration-accent-200/70 transition-colors;
  }

  .cta-button {
    @apply w-full max-w-sm mx-auto rounded-full border py-3 px-5 transition-all duration-200 ease-out inline-flex items-center justify-center gap-3;
    background: oklch(0.20 0.06 245);
    border-color: oklch(0.42 0.10 245);
    box-shadow: 0 10px 30px oklch(0 0 0 / 0.35);
  }

  .cta-button:hover {
    background: oklch(0.26 0.08 245);
    border-color: oklch(0.55 0.13 245);
    box-shadow: 0 14px 40px oklch(0 0 0 / 0.45);
  }

  .cta-label {
    @apply text-base font-semibold text-[#cfe5ff];
  }

  .cta-divider {
    @apply h-4 w-px bg-blue-300/40;
  }

  .cta-url {
    @apply text-sm text-blue-200/80;
  }

  .cta-arrow {
    @apply text-sm text-blue-200/80;
  }

  .cta-row {
    @apply flex flex-wrap items-center gap-4;
  }

  .cta-inline {
    @apply text-accent-300 hover:text-accent-200 transition-colors;
  }
</style>
